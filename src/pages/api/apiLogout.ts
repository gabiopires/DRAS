import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from 'cookie';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const limpaCookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Faz o navegador deletar o cookie
    path: '/',
  });

  res.setHeader('Set-Cookie', limpaCookie);
  return res.status(200).json({ message: "Logout realizado com sucesso" });
}