/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";
import bcrypt from 'bcrypt';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    //Validação do Método
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Método não permitido. Utilize POST para login." });
    }

    let connection;

    try {
        connection = await pool.getConnection();

        const { email, senha } = req.body;

        //Validação dos dados recebidos
        if (!email || !senha) {
            connection.release();
            return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
        }

        //Busca o usuário pelo e-mail para confirmar que ele existe
        const [rows]: any = await connection.query(
            `SELECT * FROM usuario WHERE Email = ? LIMIT 1`,
            [email]
        );

        // Se não encontrou o e-mail, retorna com erro
        if (rows.length === 0) {
            connection.release();
            return res.status(400).json({ message: "E-mail ou senha incorretos." }); 
        }

        //Criptografa a nova senha
        const saltRounds = 10;
        const senhaHasheada = await bcrypt.hash(senha, saltRounds);

        //Atualiza a senha no banco de dados
        await connection.query(
            `UPDATE usuario SET Senha = ? WHERE Email = ?`,
            [senhaHasheada, email]
        );

        connection.release();
        // Retorna sucesso!
        return res.status(200).json({ message: "Senha redefinida com sucesso!" });

    } catch (error) {
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}