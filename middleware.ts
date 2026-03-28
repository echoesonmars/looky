import { type NextRequest } from "next/server"

import { updateSession } from "@/utils/supabase/middleware"

/** Без `auth()` из `@/auth` — иначе в Edge тянутся Prisma/bcrypt и бандл > 1 MB. JWT-сессия NextAuth обрабатывается в RSC/API. */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
