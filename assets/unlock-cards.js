
(function(){
'use strict';

const OWNER='nomozovshoxnur@gmail.com';

function email(){
  return String(localStorage.getItem('ieltsx_logged_in_email') ||
                localStorage.getItem('userEmail') || '').trim().toLowerCase();
}
function users(){
  try{return JSON.parse(localStorage.getItem('ieltsx_users')||'[]')}catch(e){return []}
}
function isPremium(){
  const e=email();
  const u=users().find(x=>String(x.email||'').toLowerCase()===e);
  if(!u || !u.premium) return false;
  if(!u.premiumUntil || String(u.premiumUntil).toLowerCase()==='lifetime') return true;
  return new Date(u.premiumUntil+'T23:59:59').getTime() >= Date.now();
}

window.IELTSXUnlock={
  isPremium:isPremium,
  requirePremium:function(target){
    if(isPremium()){ location.href=target; return true; }
    const card=document.querySelector('.ieltsx-unlock-card');
    if(card) show(card,target);
    else location.href='Price.html';
    return false;
  }
};

function show(card,target){
  if(card.querySelector('.ieltsx-unlock-overlay')) return;
  const overlay=document.createElement('div');
  overlay.className='ieltsx-unlock-overlay';
  overlay.innerHTML=
    '<div class="ieltsx-unlock-dialog">'+
    '<button class="unlock-close" aria-label="Close">×</button>'+
    '<h3>Premium Access Required</h3>'+
    '<p>This test is locked. Upgrade to Premium to unlock this content.</p>'+
    '<a class="unlock-action" href="Price.html">Unlock Premium</a>'+
    '</div>';
  card.appendChild(overlay);
  overlay.querySelector('.unlock-close').onclick=function(){overlay.remove()};
}

function init(){
  document.querySelectorAll('[data-premium-card],.premium-card,.unlock-card').forEach(function(card){
    card.classList.add('ieltsx-unlock-card');
    const locked=!isPremium();
    card.classList.toggle('is-locked',locked);
    card.classList.toggle('is-unlocked',!locked);

    if(locked){
      const action=card.querySelector('[data-premium-link],a[href],button');
      if(action && !action.dataset.unlockBound){
        action.dataset.unlockBound='1';
        action.addEventListener('click',function(e){
          e.preventDefault();
          const href=action.getAttribute('href')||'Price.html';
          show(card,href);
        });
      }
    }
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();
})();
