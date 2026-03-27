/**
 * Prisma CLI reads env("DATABASE_URL") from schema. Supabase direct host db.*:5432
 * often fails from local networks (P1001). Prefer URI from Dashboard → Database →
 * Connection pooling (Session or Transaction) as DATABASE_POOLER_URL, or set DATABASE_URL to that URI.
 */
const { spawnSync } = require("node:child_process")
const path = require("node:path")

const direct = process.env.DATABASE_URL
const pooler = process.env.DATABASE_POOLER_URL
const isDirectSupabase =
  direct && /db\.[^.]+\.supabase\.co:5432/.test(direct)

if (!pooler && !direct) {
  console.error(
    "Set DATABASE_URL or DATABASE_POOLER_URL in .env.local (see README / .env.example)."
  )
  process.exit(1)
}

if (
  isDirectSupabase &&
  !pooler &&
  process.env.PRISMA_USE_DIRECT_SUPABASE !== "1"
) {
  console.error(`
[prisma] P1001 fix: direct host db.*.supabase.co:5432 is often unreachable from a PC (firewall / ISP).

1. Supabase Dashboard → Project Settings → Database → Connection string
2. Open tab "Connection pooling"
3. Copy "Session pooler" URI (host *.pooler.supabase.com, port 6543)
4. Add to .env.local:

   DATABASE_POOLER_URL="postgresql://...pooler...:6543/postgres?sslmode=require"

5. Run: npm run db:push

Or replace DATABASE_URL entirely with that pooler URI.

To retry with direct URL anyway (Unix): PRISMA_USE_DIRECT_SUPABASE=1 npm run db:push
PowerShell: $env:PRISMA_USE_DIRECT_SUPABASE="1"; npm run db:push
`)
  process.exit(1)
}

const prismaUrl = pooler || direct

if (!prismaUrl) {
  console.error(
    "Set DATABASE_URL or DATABASE_POOLER_URL in .env.local (see README / .env.example)."
  )
  process.exit(1)
}

if (isDirectSupabase && pooler) {
  // Pooler for CLI; optional direct DATABASE_URL kept — OK
}

const args = process.argv.slice(2)
const result = spawnSync("npx", ["prisma", ...args], {
  stdio: "inherit",
  shell: true,
  cwd: path.join(__dirname, ".."),
  env: { ...process.env, DATABASE_URL: prismaUrl },
})

process.exit(result.status ?? 1)
