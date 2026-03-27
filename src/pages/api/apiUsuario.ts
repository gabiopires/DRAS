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
  const { action } = req.query;

  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method!)) {
    return res.status(405).json({ message: "Método não permitido" });
  }

  //Verificar se o usuário está logado antes de permitir qualquer ação
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Acesso negado. Você precisa estar logado." });
  }

  let usuarioLogado: any;

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("Variável de autentificação não configurada.");

    // Valida o token e extrai as informações do usuário logado
    usuarioLogado = jwt.verify(token, JWT_SECRET);
    
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado. Faça login novamente." });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    //Listar todos os usuários
    if (req.method === "GET" && action === "getAll") {
      const [rows]: any = await connection.query(`SELECT * FROM usuario;`);
      connection.release();
      return res.status(200).json({ users: rows });
    }

    //Verifica e-mail existente
    if (req.method === "GET" && action === "checkEmail") {
      const { email = "" } = req.query;
      const [rows]: any = await connection.query(
        `SELECT ID FROM usuario WHERE Email = ?`,
        [email]
      );
      connection.release();
      return res.status(200).json({ exists: rows.length > 0 });
    }

    //Cria usuário
    if (req.method === "POST" && action === "create") {
      //Apenas admins podem criar usuários novos
      if (usuarioLogado.tipo !== 'Administrador') {
        connection.release();
        return res.status(403).json({ message: "Acesso negado. Apenas administradores podem cadastrar usuários." });
      }

      const { nome, email, telefone, endereco, senha, tipo } = req.body;
      
      const [exists]: any = await connection.query(
        `SELECT ID FROM usuario WHERE Email = ?`,
        [email]
      );
      if (exists.length > 0) {
        connection.release();
        return res.status(409).json({ message: "E-mail já cadastrado!" });
      }

      const saltRounds = 10; 
      const senhaHasheada = await bcrypt.hash(senha, saltRounds);

      await connection.query(
        `INSERT INTO usuario (Nome, Email, Telefone, Endereco, Senha, Tipo) VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, email, telefone, endereco, senhaHasheada, tipo ?? "Atendente"]
      );
      connection.release();
      return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    }

    //Atualizar usuário
    if (req.method === "PUT" && action === "update") {
      const { id, nome, telefone, endereco } = req.body;
      
      await connection.query(
        `UPDATE usuario SET Nome = ?, Telefone = ?, Endereco = ? WHERE ID = ?`,
        [nome, telefone, endereco, id]
      );
      connection.release();
      return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    }

    //Excluir usuário
    if (req.method === "DELETE" && action === "delete") {
      //Apenas usuário admin pode excluir outros usuários
      if (usuarioLogado.tipo !== 'Administrador') {
        connection.release();
        return res.status(403).json({ message: "Apenas administradores podem excluir usuários." });
      }

      const { id } = req.body;
      await connection.query(`DELETE FROM usuario WHERE ID = ?`, [id]);
      connection.release();
      return res.status(200).json({ message: "Usuário excluído com sucesso!" });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });

  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}