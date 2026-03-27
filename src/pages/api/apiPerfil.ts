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

  // Permitir apenas GET e PUT
  if (!["GET", "PUT"].includes(req.method!)) {
    return res.status(405).json({ message: "Método não permitido" });
  }

  //AUTENTICAÇÃO
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

    //Busca dados do usuário
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

    //Atualiza dados do usuário
    if (req.method === "PUT") {
      // Recebe a senha do body
      const { nome, telefone, endereco, email, senha } = req.body;

      // Se a pessoa digitou uma senha nova, cria o hash e atualiza
      const saltRounds = 10;
      const senhaHasheada = await bcrypt.hash(senha, saltRounds);

      await connection.query(
        `UPDATE usuario SET Nome = ?, Telefone = ?, Endereco = ?, Email = ?, Senha = ? WHERE ID = ?`,
        [nome, telefone, endereco, email, senhaHasheada, idParaBuscar]
      );

      connection.release();
      return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
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