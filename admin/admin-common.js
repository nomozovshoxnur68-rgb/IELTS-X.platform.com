(function(){
 const OWNER='nomozovshoxnur@gmail.com';
 const email=(localStorage.getItem('ieltsx_logged_in_email')||localStorage.getItem('ieltsx_user_email')||localStorage.getItem('userEmail')||'').toLowerCase();
 if(email!==OWNER.toLowerCase()||!localStorage.getItem('ieltsx_admin_session')){
   if(!location.pathname.endsWith('admin-login.html')) location.href='../login.html?admin=denied';
 }
 window.A={
   ownerEmail:OWNER,
   users(){return JSON.parse(localStorage.getItem('ieltsx_users')||'[]')},
   saveUsers(x){localStorage.setItem('ieltsx_users',JSON.stringify(x))},
   items(k){return JSON.parse(localStorage.getItem('ieltsx_'+k)||'[]')},
   save(k,x){localStorage.setItem('ieltsx_'+k,JSON.stringify(x))}
 };
})();