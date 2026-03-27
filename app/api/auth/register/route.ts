import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"

const MIN_PASSWORD = 8

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
      name?: string
    }

    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const name = typeof body.name === "string" ? body.name.trim() : undefined

    if (!email || !password) {
      return NextResponse.json({ error: "Укажите email и пароль." }, { status: 400 })
    }
    if (password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Пароль не короче ${MIN_PASSWORD} символов.` },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Этот email уже зарегистрирован." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashed,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Не удалось создать аккаунт." }, { status: 500 })
  }
}
