# IELTSX Admin access

Only this account is allowed to see/use the Admin Panel:

`nomozovshoxnur@gmail.com`

The frontend guard checks the logged-in email and admin session.
The server should also enforce `ADMIN_OWNER_EMAIL` on every admin API route.

Important: do not rely on the frontend guard alone for production security. The backend must verify the authenticated user's email before allowing admin actions such as Premium changes or file uploads.
