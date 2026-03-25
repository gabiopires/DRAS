/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  //Login DEVE ser POST. Rejeita qualquer outra coisa.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido. Utilize POST para login." });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    //Extrai os dados do body, invisível na URL
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    // Busca o usuário no banco
    const [rows]: any = await connection.query(
      `SELECT * FROM usuario WHERE Email = ? AND Senha = ? LIMIT 1`,
      [email, senha]
    );

    // Se o array de retorno for vazio, usuário ou senha estão errados
    if (rows.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    const user = rows[0];

    //Geração do Token JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta_muito_longa_e_segura';
    
    //Guardamos o ID e o Tipo dentro do token (não guarde a senha aqui!)
    const token = jwt.sign(
      { userId: user.ID, tipo: user.Tipo }, 
      JWT_SECRET, 
      { expiresIn: '30m' } 
    );

    const cookie = serialize('auth_token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 30, // 60 segundos * 30 minutos = 1800 segundos
      path: '/', 
    });

    //Envia o cookie para o navegador e retorna os dados não-sensíveis
    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      message: "Login realizado com sucesso!"
    });

  } catch (error) {
    console.error("Erro na API de login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  } finally {
    //Prevenção de Vazamento: O 'finally' GARANTE que a conexão será fechada, 
    // mesmo que um erro aconteça no meio do bloco 'try'
    if (connection) {
      connection.release();
    }
  }
}