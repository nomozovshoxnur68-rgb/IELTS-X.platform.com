# IELTSX — Vercel deployment

Import this repository into Vercel with the root directory set to the project root. No build command is required.

## Production login and premium storage
Create a Supabase project and run `supabase-schema.sql` in the SQL editor. Add these Vercel Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`
- `ADMIN_USER`
- `ADMIN_PASS`

Then redeploy. The Supabase service-role key is server-only and must never be placed in frontend JavaScript.

Without Supabase variables, the project falls back to the local JSON database for local development. Vercel's runtime filesystem is not a durable production database, so Supabase is required for persistent accounts, premium status, and admin changes.

The API is exposed through `api/[...route].js`, while the original HTML/CSS/JS UI remains intact.
