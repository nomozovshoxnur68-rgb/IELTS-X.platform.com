export async function login(email,password){const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Login failed');return d.user}
export async function register(name,email,password){const r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name,email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Registration failed');return d.user}
export async function logout(){await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'})}
export async function getCurrentUser(){const r=await fetch('/api/auth/me',{credentials:'same-origin',cache:'no-store'});return (await r.json()).user}
export function getKnownAccounts(){return []}
export function removeKnownAccount(){}
