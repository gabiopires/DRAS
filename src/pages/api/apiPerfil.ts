/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Permitir apenas GET, PUT e POST
  if (!["GET", "PUT", 'POST'].includes(req.method!)) {
    return res.status(405).json({ message: "Método não permitido" });
  }

  // AUTENTICAÇÃO
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Faça login." });
  }

  let usuarioLogado: any;
  try {
    const JWT_SECRET = String(process.env.JWT_SECRET);
    usuarioLogado = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }

  const idParaBuscar = usuarioLogado.userId;

  // O usuário só pode ver/editar o próprio ID, exceto se for admin
  if (usuarioLogado.tipo !== 'Administrador' && String(usuarioLogado.userId) !== String(idParaBuscar)) {
    return res.status(403).json({ message: "Você não tem permissão para modificar este perfil." });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    // Busca dados do usuário
    if (req.method === "GET") {
      const [rows]: any = await connection.query(
        `SELECT ID, Nome, Email, Telefone, Endereco, Tipo, Senha
         FROM usuario 
         WHERE ID = ? LIMIT 1`,
        [idParaBuscar]
      );

      if (rows.length === 0) {
        connection.release();
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      connection.release();
      return res.status(200).json({ user: rows[0] });
    }

    // Atualiza dados do usuário
    if (req.method === "PUT") {
      // Recebe os dados do body (agora com senhaAnterior e novaSenha)
      const { nome, telefone, endereco, email, senhaAnterior, novaSenha } = req.body;

      // Monta a query inicial e os parâmetros padrão (sem a senha)
      let queryUpdate = `UPDATE usuario SET Nome = ?, Telefone = ?, Endereco = ?, Email = ?`;
      let paramsUpdate: any[] = [nome, telefone, endereco, email];

      // Verifica se a novaSenha foi enviada e não está vazia
      if (novaSenha && novaSenha.trim() !== "") {
        
        // 1. Busca a senha atual que está salva no banco (o hash)
        const [usuarioAtual]: any = await connection.query(
          `SELECT Senha FROM usuario WHERE ID = ? LIMIT 1`,
          [idParaBuscar]
        );

        if (usuarioAtual.length === 0) {
          connection.release();
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const hashNoBanco = usuarioAtual[0].Senha;

        // 2. Compara a 'senhaAnterior' digitada com o hash salvo no banco
        const senhaAnteriorEstaCorreta = await bcrypt.compare(senhaAnterior, hashNoBanco);

        // Se a senha anterior estiver incorreta, bloqueia a atualização
        if (!senhaAnteriorEstaCorreta) {
          connection.release();
          return res.status(400).json({ message: "A senha atual informada está incorreta." });
        }

        // 3. Se passou na validação, faz o hash da NOVA senha e adiciona na query
        const saltRounds = 10;
        const senhaHasheada = await bcrypt.hash(novaSenha, saltRounds);
        
        queryUpdate += `, Senha = ?`;
        paramsUpdate.push(senhaHasheada);
      }

      // Finaliza a montagem da query com a condição WHERE
      queryUpdate += ` WHERE ID = ?`;
      paramsUpdate.push(idParaBuscar);

      // Executa a query (com ou sem a coluna de senha inclusa)
      await connection.query(queryUpdate, paramsUpdate);

      connection.release();
      return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
    }

    // Cadastro de novo usuário
    if (req.method === "POST") {
      const { nome, telefone, endereco, email } = req.body;

      //VERIFICAÇÃO DE E-MAIL DUPLICADO
      const [emailExistente]: any = await connection.query(
        `SELECT ID FROM usuario WHERE Email = ? LIMIT 1`,
        [email]
      );

      //Se o array tiver tamanho maior que 0, o e-mail já existe no banco
      if (emailExistente.length > 0) {
        connection.release();
        return res.status(400).json({ message: "Este e-mail já está cadastrado no sistema." });
      }

      const senha = 'novoUsuario'; // Senha padrão para novos perfis
      
      const saltRounds = 10;
      const senhaHasheada = await bcrypt.hash(senha, saltRounds); // É bom hashear a padrão também!

      await connection.query(
        `INSERT INTO usuario (Nome, Telefone, Endereco, Email, Senha) VALUES (?, ?, ?, ?, ?)`,
        [nome, telefone, endereco, email, senhaHasheada] // Salvando em hash
      );

      connection.release();
      return res.status(201).json({ message: "Perfil cadastrado com sucesso!" });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });

  } catch (error) {
    console.error("Erro na API de perfil:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}