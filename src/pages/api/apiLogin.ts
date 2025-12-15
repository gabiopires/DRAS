/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query;

  // Permitir apenas GET
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const connection = await pool.getConnection();

    // GET LOGIN DO USUÁRIO
    if (req.method === "GET" && action === "login") {
      const { email, senha } = req.query;

      if (!email || !senha) {
        connection.release();
        return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
      }

      const [rows]: any = await connection.query(
        `SELECT * FROM usuario WHERE Email = ? AND Senha = ? LIMIT 1`,
        [email, senha]
      );

      // Usuário não encontrado
      if (rows.length === 0) {
        connection.release();
        return res.status(401).json({ message: "E-mail ou senha incorretos." });
      }

      const user = rows[0];

      // Senha incorreta
      if (user.Senha !== senha) {
        connection.release();
        return res.status(401).json({ message: "E-mail ou senha incorretos." });
      }

      // Login OK
      connection.release();
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        usuario: {
          id: user.ID,
          nome: user.Nome,
          email: user.Email,
          tipo: user.Tipo,
        },
      });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });

  } catch (error) {
    console.error("Erro na API de login:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
