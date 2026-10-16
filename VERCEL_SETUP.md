# Vercelga joylash (login ishlashi uchun)

Vercelda disk faqat o'qish uchun, shuning uchun foydalanuvchilar Supabase'da saqlanadi.

1. https://supabase.com da loyiha oching. SQL Editor'da `supabase-schema.sql` ni bir marta to'liq ishga tushiring.
2. Vercel -> Project -> Settings -> Environment Variables:
   - `SUPABASE_URL` (https://xxxx.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase -> Settings -> API -> **service_role**, anon emas)
   - `SESSION_SECRET` (uzun tasodifiy matn: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
   - `ADMIN_EMAILS`, `PUBLIC_URL`, `GOOGLE_CLIENT_ID` (ixtiyoriy: `RESEND_API_KEY`, `MAIL_FROM`)
3. Redeploy qiling.
4. `https://SAYTINGIZ/api/health` ni oching: `problems` bo'sh bo'lishi kerak.
5. Google: Cloud Console -> Credentials -> Authorized JavaScript origins ga `https://SAYTINGIZ` (oxirida `/` siz) qo'shing.
