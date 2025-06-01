import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

const protectedRoutes = ["/admin"]

const authRoutes = ["/auth/login", "/auth/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Verificar se o usuário está autenticado
  let isAuthenticated = false
  let user = null

  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET)
      isAuthenticated = true
    } catch (error) {
      // Token inválido, remover cookie
      const response = NextResponse.next()
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })
      return response
    }
  }

  // Redirecionar usuários não autenticados de rotas protegidas
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirecionar usuários autenticados de rotas de auth
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/admin"
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
