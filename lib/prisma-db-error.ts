import { Prisma } from "@prisma/client"

/** Сеть / Supabase недоступен, неверный URL, пулер и т.п. */
export function isPrismaConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return (
      error.code === "P1001" ||
      error.code === "P1017" ||
      error.code === "P1000"
    )
  }
  return false
}
