# IELTSX file uploads

The admin Reading and Listening pages now include real file-upload forms.

## Server integration

Install:
`npm install express multer`

In `server.js`, after creating the Express `app`, mount:
`const uploadRoutes = require('./upload-routes');`
`app.use('/api/admin/uploads', uploadRoutes);`
`app.use('/uploads', express.static(path.join(__dirname, 'uploads')));`

Reading accepts HTML/HTM/TXT/PDF.
Listening accepts MP3/WAV/M4A/OGG.

For production, protect `/api/admin/uploads` with the same server-side admin authentication middleware used by the admin panel. Do not expose this route without authentication.
