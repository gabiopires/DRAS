import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório" });
  }

  // Permitir GET e PUT
  if (!["GET", "PUT"].includes(req.method!)) {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const connection = await pool.getConnection();

    //  GET Buscar dados do usuário
    if (req.method === "GET") {
      const [rows]: any = await connection.query(
        `SELECT ID, Nome, Email, Telefone, Endereco, Senha 
         FROM usuario 
         WHERE ID = ? LIMIT 1`,
        [id]
      );

      connection.release();

      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json({ user: rows[0] });
    }

    //  PUT Atualizar dados do usuário
    if (req.method === "PUT") {
      const { nome, telefone, endereco, email, senha } = req.body;

      // validação básica
      if (!nome || !email || !senha) {
        connection.release();
        return res.status(400).json({
          message: "Nome, e-mail e senha são obrigatórios",
        });
      }

      await connection.query(
        `
        UPDATE usuario
        SET Nome = ?, Telefone = ?, Endereco = ?, Email = ?, Senha = ?
        WHERE ID = ?
        `,
        [nome, telefone, endereco, email, senha, id]
      );

      connection.release();
      return res.status(200).json({ message: "Perfil atualizado com sucesso!" });
    }

    connection.release();
    return res.status(400).json({ message: "Ação inválida" });

  } catch (error) {
    console.error("Erro na API de perfil:", error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}
