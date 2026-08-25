(function(){
  const ADMIN_OWNER_EMAIL='nomozovshoxnur@gmail.com';
  const currentEmail=localStorage.getItem('ieltsx_logged_in_email') ||
                     localStorage.getItem('ieltsx_user_email') ||
                     localStorage.getItem('userEmail') || '';
  const adminSession=localStorage.getItem('ieltsx_admin_session');
  const allowed=currentEmail.toLowerCase()===ADMIN_OWNER_EMAIL.toLowerCase();
  if(!allowed || !adminSession){
    if(location.pathname.indexOf('/admin/')!==-1 || /admin(-login)?\.html$/i.test(location.pathname)){
      location.href='/login.html?admin=denied';
    }
  }
  window.IELTSX_ADMIN_OWNER=ADMIN_OWNER_EMAIL;
})();
