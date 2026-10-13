# Google bilan kirish (Continue with Google)

Kod tayyor (`assets/js/login.js`, `server.js` -> `/api/auth/google`). Faqat Client ID kerak:

1. https://console.cloud.google.com -> APIs & Services -> Credentials -> **Create credentials -> OAuth client ID** -> *Web application*.
2. **Authorized JavaScript origins** ga saytingiz manzilini qo'shing:
   `http://localhost:3000` (test uchun) va `https://ieltsx.uz` (yoki Vercel domeningiz).
   Redirect URI kerak emas.
3. Chiqqan Client ID ni serverga bering:
   - lokal: `.env.example` ni `.env` ga nusxalab `GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com` yozing (yoki `GOOGLE_CLIENT_ID=... npm start`)
   - Vercel: Project -> Settings -> Environment Variables -> `GOOGLE_CLIENT_ID`, keyin Redeploy.
4. `/login.html` da "Continue with Google" tugmasi ishlaydi. Yangi foydalanuvchi avtomatik yaratiladi, email tasdiqlangan hisoblanadi.
