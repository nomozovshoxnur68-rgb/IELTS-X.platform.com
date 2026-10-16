// Vercel entry point: every /api/* request (and /sitemap.xml, /robots.txt) is rewritten here (see vercel.json)
// and handled by the same request handler that "npm start" uses locally.
module.exports = require('../server.js');
