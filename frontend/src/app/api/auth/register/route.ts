import { type NextRequest, NextResponse } from "next/server"

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://backend:3000/api"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "username, email e password são obrigatórios." }, { status: 400 })
    }

    // Fazer requisição para a API externa de registro
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Erro no registro" }, { status: response.status })
    }

    // Criar resposta com cookie seguro
    const nextResponse = NextResponse.json({
      user: data.user,
      message: "Registro realizado com sucesso",
    })

    // Definir cookie com o token
    nextResponse.cookies.set("auth-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    })

    return nextResponse
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
