/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido. Utilize POST para login." });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    const { email, senha } = req.body;

    if (!email || !senha) {
      connection.release();
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    //Busca o usuário pelo e-mail
    const [rows]: any = await connection.query(
      `SELECT * FROM usuario WHERE Email = ? LIMIT 1`,
      [email]
    );

    // Se não encontrou o e-mail, retorna com erro
    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ message: "E-mail ou senha incorretos." }); 
    }

    const user = rows[0];

    //Compara a senha digitada em texto limpo com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, user.Senha);

    if (!senhaValida) {
      connection.release();
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    //Validando e salvando token de acesso
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("A variável de ambiente não está configurada.");
    }

    const token = jwt.sign(
      { userId: user.ID, tipo: user.Tipo }, 
      JWT_SECRET, 
      { expiresIn: '30m' } 
    );

    const cookie = serialize('auth_token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 30, 
      path: '/', 
    });

    res.setHeader('Set-Cookie', cookie);
    connection.release();
    return res.status(200).json({
      message: "Login realizado com sucesso!"
    });

  } catch (error) {
    console.error("Erro na API de login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}