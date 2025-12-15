/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query;


  // Permitir apenas GET e POST e DELETE
  if (!["GET", "POST", "PUT", "DELETE"].includes(req.method!)) {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const connection = await pool.getConnection();

    // GET → Listar todos os usuários
    if (req.method === "GET" && action === "getAll") {
      const [rows]: any = await connection.query(`
        SELECT * FROM usuario;
      `);

      connection.release();
      return res.status(200).json({ users: rows });
    }

    // GET → Verificar e-mail existente
    if (req.method === "GET" && action === "checkEmail") {
      const { email = "" } = req.query;

      const [rows]: any = await connection.query(
        `SELECT ID FROM usuario WHERE Email = ?`,
        [email]
      );

      connection.release();
      return res.status(200).json({ exists: rows.length > 0 });
    }

    // POST → Criar usuário
    if (req.method === "POST" && action === "create") {
      const { nome, email, telefone, endereco, senha, tipo } = req.body;

      // Verificar email duplicado
      const [exists]: any = await connection.query(
        `SELECT ID FROM usuario WHERE Email = ?`,
        [email]
      );

      if (exists.length > 0) {
        connection.release();
        return res
          .status(409)
          .json({ message: "E-mail já cadastrado!" });
      }

      await connection.query(
        `
        INSERT INTO usuario (Nome, Email, Telefone, Endereco, Senha, Tipo)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [nome, email, telefone, endereco, senha, tipo ?? "cliente"]
      );

      connection.release();
      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso!" });
    }

    // PUT atualizar usuário
    if (req.method === "PUT" && action === "update") {
      const { id, nome, telefone, endereco } = req.body;

      await connection.query(
        `
        UPDATE usuario
        SET Nome = ?, Telefone = ?, Endereco = ?
        WHERE ID = ?
        `,
        [nome, telefone, endereco, id]
      );

      connection.release();
      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso!" });
    }

    // DELETE → Excluir usuário
    if (req.method === "DELETE" && action === "delete") {
      const { id } = req.body;

      await connection.query(`DELETE FROM usuario WHERE ID = ?`, [id]);

      connection.release();
      return res
        .status(200)
        .json({ message: "Usuário excluído com sucesso!" });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });
  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
