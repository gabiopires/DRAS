import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const tokenNormal = req.cookies.get('auth_token')?.value;
  const tokenPrimeiroAcesso = req.cookies.get('primeiro_acesso_token')?.value;
  const url = req.nextUrl.clone();

  //Lógica para a página de PRIMEIRO ACESSO
  if (req.nextUrl.pathname.startsWith('/primeiroAcesso')) {
    
    // Se o usuário já tem o token normal, significa que a senha já foi redefinida.
    // Redireciona ele para fora da página de primeiro acesso (ex: para a home/dashboard).
    if (tokenNormal) {
      url.pathname = '/cadastros'; // Mude para a rota principal do seu sistema após login
      return NextResponse.redirect(url);
    }

    // Se ele não tem o token temporário, ele não passou pelo login do novo usuário. Vai pro login.
    if (!tokenPrimeiroAcesso) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Se chegou aqui, ele NÃO tem o token normal e TEM o token temporário. Pode passar!
    return NextResponse.next();
  }

  // 2. Lógica para as DEMAIS ROTAS PROTEGIDAS
  if (!tokenNormal) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cadastros/:path*',
    '/relatorios/:path*',
    '/perfil/:path*',
    '/cadastrar/:path*',
    '/exportar/:path*',
    '/usuario/:path*',
    '/primeiroAcesso/:path*',
  ],
};