import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

/** Hosted Postgres often expects TLS; append sslmode if the URI omits it. */
function withHostedPostgresSsl(url: string): string {
  if (!url.includes("supabase.co")) return url
  if (/[?&]sslmode=/i.test(url)) return url
  return url.includes("?") ? `${url}&sslmode=require` : `${url}?sslmode=require`
}

/** Prefer pooler URI when direct db.*:5432 is unreachable (P1001). */
const rawUrl = process.env.DATABASE_POOLER_URL || process.env.DATABASE_URL
const databaseUrl = rawUrl !== undefined ? withHostedPostgresSsl(rawUrl) : undefined

const prismaOptions = databaseUrl
  ? { datasources: { db: { url: databaseUrl } } as const }
  : undefined

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
