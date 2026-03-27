# Looky

## Environment

1. Copy [`.env.example`](.env.example) to `.env.local`.
2. In [Supabase](https://supabase.com/dashboard) → **Project Settings → API**, set:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` / public key (not the service role secret)

3. **Database URL for Prisma** (same Supabase project, Postgres only — not Supabase Authentication):

   - Supabase → **Project Settings → Database** → copy the **URI** connection string (or build `postgresql://postgres.[ref]:[password]@...`).
   - Set `DATABASE_URL` in `.env.local`. The app uses **NextAuth (Auth.js)** with email/password stored in your Postgres via Prisma; **do not** enable or rely on Supabase Auth for login.

4. **NextAuth**: set `AUTH_SECRET` to a long random string (e.g. `openssl rand -base64 32`). In production, set `AUTH_URL` to your public site URL if needed.

5. Apply Prisma schema to the database (creates NextAuth-related tables and `User`):

   ```bash
   npx prisma migrate dev
   ```

   For a quick local sync without migration history, you can use `npx prisma db push` instead.

6. In Supabase **SQL Editor**, run [`../looky-backend/database/schema.sql`](../looky-backend/database/schema.sql) to create the `items` table and RLS policy (unchanged from before).

7. Check DB from the app: [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db) (should return `{ ok: true, itemsCount: ... }`).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
