# Looky

## Environment

1. Copy [`.env.example`](.env.example) to `.env.local`.
2. In [Supabase](https://supabase.com/dashboard) → **Project Settings → API**, set:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` / public key (not the service role secret)

3. In Supabase **SQL Editor**, run [`../looky-backend/database/schema.sql`](../looky-backend/database/schema.sql) to create the `items` table and RLS policy.

4. Check DB from the app: [http://localhost:3000/api/health/db](http://localhost:3000/api/health/db) (should return `{ ok: true, itemsCount: ... }`).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
