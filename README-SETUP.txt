# IELTSX — Admin + Premium Production Setup

## Run
1. Install Node.js 18+
2. Open this folder in Terminal/PowerShell
3. Run: `npm start`
4. Open: `http://localhost:3000`

## Admin
Default username: `admin`
Default password: `IELTSX@Admin2026!`

For production, set `ADMIN_USER`, `ADMIN_PASS`, and `SESSION_SECRET` environment variables.

## Premium
Admin Panel -> Users -> Give Premium.
Premium is stored server-side in `data/db.json` and checked by the server. `Mock tests.html` is protected as a premium page in this package. Add more protected paths in `server.js` when you add premium test files.

## Important
This uses a JSON database to keep the project dependency-free. For multi-server/production scale, migrate the same API to PostgreSQL/Supabase/MySQL.
