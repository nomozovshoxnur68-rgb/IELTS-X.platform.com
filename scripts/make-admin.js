'use strict';
/*
 * Make an existing account an admin (local JSON database).
 *   node scripts/make-admin.js you@example.com          promote
 *   node scripts/make-admin.js you@example.com --remove demote
 * First register that account on the website (or sign in with Google), then run this.
 */
const fs = require('fs');
const path = require('path');

const email = String(process.argv[2] || '').trim().toLowerCase();
const remove = process.argv.includes('--remove');
if (!email.includes('@')) {
  console.error('Usage: node scripts/make-admin.js <email> [--remove]');
  process.exit(1);
}
if (process.env.SUPABASE_URL) {
  console.log('This project uses Supabase. Run this in the Supabase SQL editor instead:\n');
  console.log(remove
    ? `update public.ieltsx_users set role='user', plan='Free', "premiumActive"=false where email='${email}';`
    : `update public.ieltsx_users set role='admin', plan='Admin', "premiumActive"=true, "premiumExpiresAt"=null where email='${email}';`);
  process.exit(0);
}
const file = path.join(process.env.DATA_DIR || path.join(__dirname, '..', 'data'), 'db.json');
const db = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { users: [] };
const user = (db.users || []).find((u) => u.email === email);
if (!user) {
  console.error(`No account with email "${email}". Register it on the website first, then run this again.`);
  process.exit(1);
}
Object.assign(user, remove
  ? { role: 'user', plan: 'Free', premiumActive: false, premiumExpiresAt: null }
  : { role: 'admin', plan: 'Admin', premiumActive: true, premiumExpiresAt: null });
fs.writeFileSync(file, JSON.stringify(db, null, 2));
console.log(`${email} is now ${remove ? 'a regular user' : 'an admin'}.`);
