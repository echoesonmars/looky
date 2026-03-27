# Looky

## Environment

1. Copy [`.env.example`](.env.example) to `.env.local`.
2. In [Supabase](https://supabase.com/dashboard) → **Project Settings → API**, set:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` / public key (not the service role secret). You can alternatively set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` if the dashboard shows that name.

   **Supabase clients:** `@/utils/supabase/server` and `@/utils/supabase/client` (`createClient`) use `@supabase/ssr` for cookie-backed sessions. **`@/lib/supabase`** (`getSupabase`) stays a simple anon client for API routes like `/api/health/db` without cookies. Login remains **NextAuth** (not Supabase Auth).

3. **Database URL for Prisma** (same Supabase project, Postgres only — not Supabase Authentication):

   - Supabase → **Project Settings → Database** → **Connection string** → copy the **URI** (direct host is `db.<project-ref>.supabase.co`, port **5432**).
   - Set `DATABASE_URL` in `.env.local`. The app uses **NextAuth (Auth.js)** with email/password stored in your Postgres via Prisma; **do not** enable or rely on Supabase Auth for login.
   - Ensure the project is **not paused** (Supabase dashboard resumes the database if it slept).

   **If Prisma returns `P1001` / “Can't reach database server” on port 5432:** many networks cannot reach the **direct** host `db.<ref>.supabase.co:5432`. Open **Connection string** → tab **Connection pooling** → copy **Session pooler** URI (host `*.pooler.supabase.com`, port **6543**). Add it as **`DATABASE_POOLER_URL`** in `.env.local`, or **replace** `DATABASE_URL` with that URI only. The app and `npm run db:*` scripts prefer `DATABASE_POOLER_URL` when set. Add `?sslmode=require` if missing. For **Transaction** mode with Prisma, follow [Prisma + Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase) (`pgbouncer=true`, etc.). `npm run db:push` will **stop early** with instructions if you still use only direct `db.*:5432` without a pooler URL; override with `PRISMA_USE_DIRECT_SUPABASE=1` only if your network can reach port 5432.

   **Note:** Prisma CLI reads `.env` by default, not `.env.local`. This repo uses **`dotenv-cli`** and `scripts/run-prisma.cjs` — use the npm scripts below instead of raw `npx prisma …`.

4. **NextAuth**: set `AUTH_SECRET` to a long random string (e.g. `openssl rand -base64 32`). In production, set `AUTH_URL` to your public site URL if needed.

5. Apply Prisma schema to the database (creates NextAuth-related tables and `User`):

   ```bash
   npm run db:migrate
   ```

   For a quick local sync without migration history:

   ```bash
   npm run db:push
   ```

   Regenerate the client after schema changes: `npm run db:generate`.

   **Windows — `EPERM` / rename `query_engine-windows.dll.node`:** another process is locking the Prisma engine (usually **`npm run dev`**, another Node terminal, or antivirus). Stop the dev server (`Ctrl+C`), close extra terminals, then delete `node_modules\.prisma` (Explorer or `Remove-Item -Recurse -Force node_modules\.prisma` in PowerShell) and run `npm run db:generate` again. If it still fails, temporarily pause real-time antivirus for the project folder or run the command from a **new** PowerShell outside Cursor.

6. In Supabase **SQL Editor**, run [`../looky-backend/database/schema.sql`](../looky-backend/database/schema.sql) to create the `items` table and RLS policy (unchanged from before).

7. Check DB from the app: [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db) (should return `{ ok: true, itemsCount: ... }`).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
