
/*
 IELTSX upload routes helper.
 Requires express and multer:
   npm i express multer
 Mount from server.js:
   const uploadRoutes = require('./upload-routes');
   app.use('/api/admin/uploads', uploadRoutes);
*/
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const ADMIN_OWNER_EMAIL = process.env.ADMIN_OWNER_EMAIL || 'nomozovshoxnur@gmail.com';
function requireAdminOwner(req,res,next) {
  const email = req.user && req.user.email;
  if (!email || email.toLowerCase() !== ADMIN_OWNER_EMAIL.toLowerCase()) return res.status(403).json({ok:false,error:'Admin owner only'});
  next();
}
router.use(requireAdminOwner);
const ROOT = path.join(__dirname, 'uploads');
for (const type of ['reading','listening']) fs.mkdirSync(path.join(ROOT,type), {recursive:true});

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const type = req.body.type === 'listening' ? 'listening' : 'reading';
    cb(null, path.join(ROOT,type));
  },
  filename: (req,file,cb) => {
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g,'_');
    cb(null, Date.now() + '-' + safe);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: 50 * 1024 * 1024}
});

router.post('/', upload.single('file'), (req,res) => {
  if (!req.file) return res.status(400).json({ok:false,error:'No file uploaded'});
  const type = req.body.type === 'listening' ? 'listening' : 'reading';
  res.json({
    ok:true,
    type,
    filename:req.file.filename,
    originalName:req.file.originalname,
    url:'/uploads/' + type + '/' + encodeURIComponent(req.file.filename)
  });
});

module.exports = router;
