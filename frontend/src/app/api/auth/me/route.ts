import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = "uma_chave_super_secreta"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 })
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    return NextResponse.json({
      user: {
        id: decoded.id,
        username: decoded.username,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
