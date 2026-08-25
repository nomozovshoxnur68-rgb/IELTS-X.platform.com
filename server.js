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
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

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

async function api(req,res,url,db){
  cleanExpired(db);
  const me=auth(req);
  if(req.method==='POST' && url.pathname==='/api/auth/register'){
    const b=await json(req);const email=String(b.email||'').trim().toLowerCase();const password=String(b.password||'');const name=String(b.name||'').trim();
    if(!email||!password||password.length<8||!name)return send(res,400,{error:'Name, valid email and password of at least 8 characters are required.'});
    if(db.users.some(u=>u.email===email))return send(res,409,{error:'An account with this email already exists.'});
    const hp=hashPassword(password);const u={id:id(),name,email,role:'user',plan:'Free',premiumActive:false,premiumExpiresAt:null,passwordHash:hp.hash,passwordSalt:hp.salt,createdAt:new Date().toISOString()};db.users.push(u);saveDb(db);
    const token=tokenFor(u.id,u.role);return send(res,201,{user:publicUser(u)},{'Set-Cookie':`ieltsx_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL/1000}`});
  }
  if(req.method==='POST' && url.pathname==='/api/auth/login'){
    const b=await json(req);const email=String(b.email||'').trim().toLowerCase();const password=String(b.password||'');const u=db.users.find(x=>x.email===email);
    if(!u||!u.passwordHash||!verifyPassword(password,u.passwordSalt,u.passwordHash))return send(res,401,{error:'Invalid email or password.'});
    const token=tokenFor(u.id,u.role);return send(res,200,{user:publicUser(u)},{'Set-Cookie':`ieltsx_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL/1000}`});
  }
  if(req.method==='POST' && url.pathname==='/api/auth/admin-login'){
    const b=await json(req);const u=db.users.find(x=>x.role==='admin'&&x.email===String(b.username||''));
    if(!u||!verifyPassword(String(b.password||''),u.passwordSalt,u.passwordHash))return send(res,401,{error:'Invalid admin credentials.'});
    const token=tokenFor(u.id,'admin');return send(res,200,{user:publicUser(u)},{'Set-Cookie':`ieltsx_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL/1000}`});
  }
  if(req.method==='POST' && url.pathname==='/api/auth/logout')return send(res,200,{ok:true},{'Set-Cookie':'ieltsx_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'});
  if(req.method==='GET' && url.pathname==='/api/auth/me')return send(res,200,{user:me?publicUser(db.users.find(u=>u.id===me.sub)):null});
  if(req.method==='GET' && url.pathname==='/api/premium/status'){
    const u=me?db.users.find(x=>x.id===me.sub):null;return send(res,200,{authenticated:!!u,premium:isPremium(u),expiresAt:u?.premiumExpiresAt||null,plan:u?.plan||'Free'});
  }
  if(url.pathname.startsWith('/api/admin/')){
    if(!me||me.role!=='admin')return send(res,403,{error:'Admin access required.'});
    if(req.method==='GET'&&url.pathname==='/api/admin/users')return send(res,200,{users:db.users.filter(u=>u.role!=='admin').map(publicUser)});
    const m=url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/premium$/);
    if(m&&req.method==='POST'){
      const u=db.users.find(x=>x.id===m[1]);if(!u)return send(res,404,{error:'User not found.'});const b=await json(req);const plan=String(b.plan||'Premium');const days=Number(b.days||0);u.premiumActive=true;u.plan=plan;u.premiumExpiresAt=days>0?new Date(Date.now()+days*86400000).toISOString():null;saveDb(db);return send(res,200,{user:publicUser(u)});
    }
    if(m&&req.method==='DELETE'){
      const u=db.users.find(x=>x.id===m[1]);if(!u)return send(res,404,{error:'User not found.'});u.premiumActive=false;u.plan='Free';u.premiumExpiresAt=null;saveDb(db);return send(res,200,{user:publicUser(u)});
    }
    if(req.method==='GET'&&url.pathname==='/api/admin/stats'){
      const users=db.users.filter(u=>u.role!=='admin');const prem=users.filter(isPremium);return send(res,200,{users:users.length,premium:prem.length,free:users.length-prem.length});
    }
  }
  return send(res,404,{error:'API endpoint not found.'});
}

ensureDb();
const server=http.createServer(async(req,res)=>{
  try{const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);const db=loadDb();if(url.pathname.startsWith('/api/'))return await api(req,res,url,db);staticFile(req,res,url.pathname,auth(req)?db.users.find(u=>u.id===auth(req).sub):null);}catch(e){console.error(e);send(res,500,{error:'Server error'});}
});
server.listen(PORT,()=>console.log(`IELTSX server running at http://localhost:${PORT}`));
