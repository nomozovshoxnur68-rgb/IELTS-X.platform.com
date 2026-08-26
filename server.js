const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT = __dirname;
const DB_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const PORT = Number(process.env.PORT || 3000);
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'IELTSX@Admin2026!';
const SESSION_SECRET = process.env.SESSION_SECRET || 'CHANGE_THIS_SESSION_SECRET_BEFORE_PRODUCTION';
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const premiumPages = new Set([
  '/Mock%20tests.html', '/Mock%20tests.html'.toLowerCase(),
  '/premium-tests.html'
]);

function ensureDb(){
  if(!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR,{recursive:true});
  if(!fs.existsSync(DB_FILE)) saveDb({users:[],sessions:[]});
}
function loadDb(){ ensureDb(); try{return JSON.parse(fs.readFileSync(DB_FILE,'utf8'));}catch(e){return {users:[],sessions:[]};} }
function saveDb(db){ fs.writeFileSync(DB_FILE, JSON.stringify(db,null,2)); }
function id(){return crypto.randomUUID();}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){
  const hash=crypto.scryptSync(String(password),salt,64).toString('hex');
  return {salt,hash};
}
function verifyPassword(password,salt,hash){
  const h=crypto.scryptSync(String(password),salt,64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(h,'hex'),Buffer.from(hash,'hex'));
}
function tokenFor(userId,role){
  const payload=Buffer.from(JSON.stringify({sub:userId,role,exp:Date.now()+SESSION_TTL})).toString('base64url');
  const sig=crypto.createHmac('sha256',SESSION_SECRET).update(payload).digest('base64url');
  return payload+'.'+sig;
}
function parseToken(token){
  if(!token) return null;
  const [p,s]=token.split('.'); if(!p||!s)return null;
  const good=crypto.createHmac('sha256',SESSION_SECRET).update(p).digest('base64url');
  if(!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(good)))return null;
  try{const x=JSON.parse(Buffer.from(p,'base64url').toString()); if(x.exp<Date.now())return null; return x;}catch(e){return null;}
}
function cookieToken(req){
  const cookies=(req.headers.cookie||'').split(';').map(x=>x.trim());
  const c=cookies.find(x=>x.startsWith('ieltsx_session='));
  return c ? decodeURIComponent(c.slice('ieltsx_session='.length)) : null;
}
function auth(req){return parseToken(cookieToken(req));}
function send(res,status,data,headers={}){
  const body=typeof data==='string'?data:JSON.stringify(data);
  res.writeHead(status,{'Content-Type':typeof data==='string'?'text/plain; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(body);
}
function json(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>{b+=c;if(b.length>1e6)req.destroy();});req.on('end',()=>{try{resolve(b?JSON.parse(b):{});}catch(e){reject(e);}});req.on('error',reject);});}
function publicUser(u){return {id:u.id,name:u.name,email:u.email,role:u.role,plan:u.plan,premiumActive:!!u.premiumActive,premiumExpiresAt:u.premiumExpiresAt||null,createdAt:u.createdAt};}
function ensureAdmin(db){
  let a=db.users.find(u=>u.role==='admin' && u.email===ADMIN_USER);
  if(!a){const hp=hashPassword(ADMIN_PASS);a={id:id(),name:'Administrator',email:ADMIN_USER,role:'admin',plan:'Admin',premiumActive:true,premiumExpiresAt:null,passwordHash:hp.hash,passwordSalt:hp.salt,createdAt:new Date().toISOString()};db.users.push(a);saveDb(db);}
}

let adminReadyPromise=null;
async function ensureAdminStore(){
  if(adminReadyPromise) return adminReadyPromise;
  adminReadyPromise=(async()=>{
    const email=String(ADMIN_USER||'admin').trim().toLowerCase();
    const existing=await findUserByEmail(email);
    if(existing) return existing;
    const hp=hashPassword(ADMIN_PASS);
    return await insertUser({id:id(),name:'Administrator',email,role:'admin',plan:'Admin',premiumActive:true,premiumExpiresAt:null,passwordHash:hp.hash,passwordSalt:hp.salt,createdAt:new Date().toISOString()});
  })().catch(e=>{adminReadyPromise=null; throw e;});
  return adminReadyPromise;
}
async function sb(pathname, options={}){
  if(!USE_SUPABASE) throw new Error('Supabase is not configured');
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`,{...options,headers:{apikey:SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,Prefer:'return=representation',...(options.headers||{})}});
  const text=await r.text(); let data=null; try{data=text?JSON.parse(text):null;}catch{}
  if(!r.ok) throw new Error(data?.message||data?.hint||`Supabase error ${r.status}`); return data;
}
async function listUsers(){ if(USE_SUPABASE) return (await sb('ieltsx_users?select=*'))||[]; return loadDb().users; }
async function findUserByEmail(email){ if(USE_SUPABASE){ const rows=await sb(`ieltsx_users?email=eq.${encodeURIComponent(email)}&limit=1`); return rows?.[0]||null; } return loadDb().users.find(u=>u.email===email)||null; }
async function findUserById(uid){ if(USE_SUPABASE){ const rows=await sb(`ieltsx_users?id=eq.${encodeURIComponent(uid)}&limit=1`); return rows?.[0]||null; } return loadDb().users.find(u=>u.id===uid)||null; }
async function insertUser(u){ if(USE_SUPABASE){ const rows=await sb('ieltsx_users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(u)}); return rows?.[0]||u; } const db=loadDb(); db.users.push(u); saveDb(db); return u; }
async function updateUser(uid,patch){ if(USE_SUPABASE){ const rows=await sb(`ieltsx_users?id=eq.${encodeURIComponent(uid)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)}); return rows?.[0]||await findUserById(uid); } const db=loadDb(); const u=db.users.find(x=>x.id===uid); if(!u)return null; Object.assign(u,patch); saveDb(db); return u; }
function cleanExpired(db){let changed=false;for(const u of db.users){if(u.premiumExpiresAt && new Date(u.premiumExpiresAt)<new Date() && u.premiumActive){u.premiumActive=false;u.plan='Free';changed=true;}}if(changed)saveDb(db);}
function isPremium(u){return !!(u && u.premiumActive && (!u.premiumExpiresAt || new Date(u.premiumExpiresAt)>new Date()));}

function staticFile(req,res,pathname,user){
  let decoded;try{decoded=decodeURIComponent(pathname);}catch(e){return send(res,400,'Bad URL');}
  const normalized=path.normalize(decoded).replace(/^([.][.][\\/])+/, '');
  const target=path.join(ROOT, normalized.replace(/^[/\\]+/,''));
  if(!target.startsWith(ROOT))return send(res,403,'Forbidden');
  const premiumProtected = decoded.toLowerCase()==='/mock tests.html' || decoded.toLowerCase()==='/premium-tests.html';
  if(premiumProtected && !isPremium(user)) return send(res,403,'Premium access required.');
  let file=target;
  const routeAliases={
    '/home':'index.html','/features':'index.html','/teachers':'index.html','/vocabulary':'index.html','/login':'login.html','/privacy-policy':'index.html','/terms-of-service':'index.html','/feedback':'index.html','/practice/mock':'Mock tests.html','/study/Tools/articles.html':'study/Tools/Articles.html','/study/tools/Articles.html':'study/Tools/Articles.html','/study/tools/Performance.html':'study/Tools/Performance.html','/study/tools/Pdf materials.html':'study/Tools/Pdf materials.html','/listening.html':'part/practice/listening.html','/reading.html':'part/practice/reading.html','/writing.html':'part/practice/writing.html','/speaking.html':'part/practice/speaking.html','/full-tests/listening.html':'part/practice/listening.html','/full-tests/reading.html':'part/practice/reading.html','/full-tests/writing.html':'part/practice/writing.html','/full-tests/speaking.html':'part/practice/speaking.html','/Performance.html':'study/Tools/Performance.html','/Pdf materials.html':'study/Tools/Pdf materials.html','/materials.html':'study/Tools/Pdf materials.html','/full listening.html':'part/practice/listening.html','/full reading.html':'part/practice/reading.html','/full writing.html':'part/practice/writing.html','/full speaking.html':'part/practice/speaking.html'
  };
  if(routeAliases[decoded]) file=path.join(ROOT,routeAliases[decoded]);
  if(decoded==='/'||decoded==='/') file=path.join(ROOT,'index.html');
  if(!fs.existsSync(file)){
    const requestedName=path.basename(normalized).toLowerCase().replace(/["']/g,'');
    if(requestedName==='index-bdfok--9.js'){
      res.writeHead(204,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});
      return res.end();
    }
    const legacyAssets={
      'auth-bridge.js':'auth-bridge.js',
      'site-access.js':'site-access.js',
      'premium-access.js':'premium-access.js',
      'ieltsx-data.js':'ieltsx-data.js',
      'performance-dashboard.js':'performance-dashboard.js',
      'filters.js':'assets/filters.js',
      'unlock-cards.js':'assets/unlock-cards.js',
      'unlock-cards.css':'assets/unlock-cards.css'
    };
    const fallback=legacyAssets[requestedName];
    if(fallback) file=path.join(ROOT,fallback);
  }
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())return send(res,404,'Not found');
  const ext=path.extname(file).toLowerCase();
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.mp3':'audio/mpeg','.wav':'audio/wav','.pdf':'application/pdf'};
  res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);
}

async function api(req,res,url){
  const me=auth(req);
  try{
    if(req.method==='POST' && url.pathname==='/api/auth/register'){
      const b=await json(req); const email=String(b.email||'').trim().toLowerCase(); const password=String(b.password||''); const name=String(b.name||'').trim();
      if(!email||!/^\S+@\S+\.\S+$/.test(email)||!password||password.length<8||!name) return send(res,400,{error:'Name, valid email and password of at least 8 characters are required.'});
      if(await findUserByEmail(email)) return send(res,409,{error:'An account with this email already exists.'});
      const hp=hashPassword(password); const u={id:id(),name,email,role:'user',plan:'Free',premiumActive:false,premiumExpiresAt:null,passwordHash:hp.hash,passwordSalt:hp.salt,createdAt:new Date().toISOString()};
      await insertUser(u); const token=tokenFor(u.id,u.role); return send(res,201,{user:publicUser(u)},{'Set-Cookie':`ieltsx_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL/1000}`});
    }
    if(req.method==='POST' && url.pathname==='/api/auth/login'){
      const b=await json(req); const email=String(b.email||'').trim().toLowerCase(); const password=String(b.password||''); const u=await findUserByEmail(email);
      if(!u||!u.passwordHash||!verifyPassword(password,u.passwordSalt,u.passwordHash)) return send(res,401,{error:'Invalid email or password.'});
      const token=tokenFor(u.id,u.role); return send(res,200,{user:publicUser(u)},{'Set-Cookie':`ieltsx_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL/1000}`});
    }
    if(req.method==='POST' && url.pathname==='/api/auth/admin-login'){
      const b=await json(req); const username=String(b.username||'').trim().toLowerCase(); const u=await findUserByEmail(username);
      if(!u||u.role!=='admin'||!verifyPassword(String(b.password||''),u.passwordSalt,u.passwordHash)) return send(res,401,{error:'Invalid admin credentials.'});
      const token=tokenFor(u.id,'admin'); return send(res,200,{user:publicUser(u)},{'Set-Cookie':`ieltsx_session=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL/1000}`});
    }
    if(req.method==='POST' && url.pathname==='/api/auth/logout') return send(res,200,{ok:true},{'Set-Cookie':'ieltsx_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'});
    if(req.method==='GET' && url.pathname==='/api/auth/me'){
      const u=me?await findUserById(me.sub):null; return send(res,200,{user:u?publicUser(u):null});
    }
    if(req.method==='GET' && url.pathname==='/api/premium/status'){
      const u=me?await findUserById(me.sub):null; return send(res,200,{authenticated:!!u,premium:isPremium(u),expiresAt:u?.premiumExpiresAt||null,plan:u?.plan||'Free'});
    }
    if(url.pathname.startsWith('/api/admin/')){
      const admin=me?await findUserById(me.sub):null; if(!admin||admin.role!=='admin') return send(res,403,{error:'Admin access required.'});
      if(req.method==='GET'&&url.pathname==='/api/admin/users') return send(res,200,{users:(await listUsers()).filter(u=>u.role!=='admin').map(publicUser)});
      const m=url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/premium$/);
      if(m&&req.method==='POST'){
        const u=await findUserById(m[1]); if(!u)return send(res,404,{error:'User not found.'}); const b=await json(req); const plan=String(b.plan||'Premium'); const days=Number(b.days||0); const patch={premiumActive:true,plan,premiumExpiresAt:days>0?new Date(Date.now()+days*86400000).toISOString():null}; const updated=await updateUser(u.id,patch); return send(res,200,{user:publicUser(updated)});
      }
      if(m&&req.method==='DELETE'){
        const u=await findUserById(m[1]); if(!u)return send(res,404,{error:'User not found.'}); const updated=await updateUser(u.id,{premiumActive:false,plan:'Free',premiumExpiresAt:null}); return send(res,200,{user:publicUser(updated)});
      }
      if(req.method==='GET'&&url.pathname==='/api/admin/stats'){ const users=(await listUsers()).filter(u=>u.role!=='admin'); const prem=users.filter(isPremium); return send(res,200,{users:users.length,premium:prem.length,free:users.length-prem.length}); }
    }
    return send(res,404,{error:'API endpoint not found.'});
  }catch(e){ console.error(e); return send(res,500,{error:e.message||'Server error'}); }
}

ensureDb();
if(!USE_SUPABASE) ensureAdmin(loadDb());
const requestHandler=async(req,res)=>{
  try{
    const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
    await ensureAdminStore();
    if(url.pathname.startsWith('/api/')) return await api(req,res,url);
    const token=auth(req); const user=token?await findUserById(token.sub):null;
    staticFile(req,res,url.pathname,user);
  }catch(e){ console.error(e); send(res,500,{error:'Server error'}); }
};

if(require.main===module){
  const server=http.createServer(requestHandler);
  server.listen(PORT,()=>console.log(`IELTSX server running at http://localhost:${PORT}`));
}
module.exports=requestHandler;
