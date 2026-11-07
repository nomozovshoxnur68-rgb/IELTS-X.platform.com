# Vercelga joylash (login ishlashi uchun)

Vercelda disk faqat o'qish uchun, shuning uchun foydalanuvchilar Supabase'da saqlanadi.

1. https://supabase.com da loyiha oching. SQL Editor'da `supabase-schema.sql` ni bir marta to'liq ishga tushiring.
   Baza oldin yaratilgan bo'lsa, faqat oxirgi **v9** qismini ishga tushiring (AI feedback arxivi jadvali `ieltsx_ai_reports` va jadvallar huquqlarini yopish). Qayta ishga tushirish xavfsiz.
2. Vercel -> Project -> Settings -> Environment Variables:
   - `SUPABASE_URL` (https://xxxx.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase -> Settings -> API -> **service_role**, anon emas)
   - `SESSION_SECRET` (uzun tasodifiy matn: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
   - `ADMIN_EMAILS`, `PUBLIC_URL`, `GOOGLE_CLIENT_ID` (ixtiyoriy: `RESEND_API_KEY`, `MAIL_FROM`)
   - `OPENAI_API_KEY` (AI tekshiruvi uchun: https://platform.openai.com/api-keys). Hisobga kredit ham kerak: https://platform.openai.com/settings/organization/billing (ChatGPT obunasi API'ni o'z ichiga olmaydi). `AI_PROVIDER` qo'yilgan bo'lsa, qiymati `openai` bo'lsin.
3. Redeploy qiling.
4. `https://SAYTINGIZ/api/health` ni oching: `problems` bo'sh bo'lishi kerak. `https://SAYTINGIZ/api/ai/status` da `"configured":true` chiqsa, AI ulangan.
5. Google: Cloud Console -> Credentials -> Authorized JavaScript origins ga `https://SAYTINGIZ` (oxirida `/` siz) qo'shing.
