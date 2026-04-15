import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Essa função roda toda vez que o usuário tenta acessar uma rota protegida
export function proxy(req: NextRequest) {
  // Pega o cookie direto da requisição
  const token = req.cookies.get('auth_token')?.value;
  // Se o token não existir, redireciona para o login ("/")
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  // Se o token existir, deixa ele seguir em frente
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protege todas as rotas
     * Adicione aqui as páginas que só usuários logados podem ver!
     */
    '/cadastros/:path*',
    '/relatorios/:path*',
    '/perfil/:path*',
    '/cadastrar/:path*',
    '/exportar/:path*',
    '/usuario/:path*',
    '/primeiroAcesso/:path*',
  ],
};