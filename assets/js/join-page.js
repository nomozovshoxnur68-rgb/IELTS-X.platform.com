/* IELTSX — the /join page (join.html): a signed-in student joins a teacher's class with the class code or link
   (/join?code=ABC123), accepts or declines an invitation, sees their teacher and can leave. Everything is checked on
   the server (/api/class, teachers.js). */
(function () {
  'use strict';
  var box = document.getElementById('box'), err = document.getElementById('error');
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); };
  var params = new URLSearchParams(location.search);
  var code = String(params.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  var state = null;

  function call(method, url, body) {
    return fetch(url, { method: method, credentials: 'same-origin', cache: 'no-store', headers: body ? { 'content-type': 'application/json', accept: 'application/json' } : { accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          if (r.status === 401) { location.replace('/login?next=' + encodeURIComponent(location.pathname + location.search)); throw new Error('Please sign in.'); }
          if (!r.ok) throw new Error(d.error || 'Something went wrong. Please try again.');
          return d;
        });
      });
  }
  var avatar = function (n) { return '<span class="jn-avatar">' + esc(String(n || '?').charAt(0).toUpperCase()) + '</span>'; };
  function teacherCard(t, extra) { return '<div class="jn-teacher">' + avatar(t.name) + '<div><b>' + esc(t.name) + '</b><span>' + esc(t.title || 'IELTS teacher') + (extra ? ' · ' + esc(extra) : '') + '</span></div></div>'; }
  function render() {
    err.textContent = '';
    var html = '';
    if (state.teacher) {
      html += '<p class="eyebrow">Your teacher</p>' + teacherCard(state.teacher, state.teacher.group);
    }
    (state.invites || []).forEach(function (t) {
      html += '<p class="eyebrow">Invitation</p>' + teacherCard(t) + '<div class="jn-actions"><button class="btn-primary" type="button" data-accept="' + esc(t.id) + '">Join this class</button><button class="btn-ghost" type="button" data-decline="' + esc(t.id) + '">No, thanks</button></div>';
    });
    html += '<form id="code-form" novalidate style="margin-top:' + (html ? '18px' : '0') + '"><div class="field"><label for="code">' + (state.teacher ? 'Move to another class — class code' : 'Class code from your teacher') + '</label>'
      + '<input id="code" class="jn-code" name="code" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC123" value="' + esc(code) + '"></div>'
      + '<button class="btn-primary" type="submit">' + (state.teacher ? 'Move to this class' : 'Join the class') + '</button></form>';
    html += '<div class="jn-links"><a class="btn-ghost" href="/books">Open the e-books</a>' + (state.teacher ? '<button class="link" type="button" data-leave>Leave my class</button>' : '') + '</div>';
    box.innerHTML = html;
    document.getElementById('subtitle').textContent = state.teacher ? 'You are in a class. Your teacher follows your tests and your e-book progress.' : 'Join your teacher\'s class: they see your tests and your progress in the e-books, and help you prepare.';
  }
  function act(p) { err.textContent = ''; return p.then(function (d) { state = d; code = ''; render(); }).catch(function (e) { err.textContent = e.message; }); }
  box.addEventListener('submit', function (e) {
    if (e.target.id !== 'code-form') return;
    e.preventDefault();
    var v = String(e.target.code.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.length !== 6) { err.textContent = 'The class code has 6 letters and numbers.'; return; }
    if (state.teacher && !confirm('Leave your class and move to the new one?')) return;
    act(call('POST', '/api/class/join', { code: v })).then(function () { if (history.replaceState) history.replaceState(null, '', location.pathname); });
  });
  box.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-accept],[data-decline],[data-leave]'); if (!t) return;
    if (t.hasAttribute('data-accept')) { if (state.teacher && !confirm('Leave your class and join this one?')) return; act(call('POST', '/api/class/join', { teacher: t.getAttribute('data-accept') })); }
    else if (t.hasAttribute('data-decline')) act(call('POST', '/api/class/decline', { teacher: t.getAttribute('data-decline') }));
    else if (confirm('Leave your class? Your teacher will not see your progress any more.')) act(call('POST', '/api/class/leave'));
  });
  call('GET', '/api/class').then(function (d) { state = d; render(); }).catch(function (e) { box.innerHTML = ''; err.textContent = e.message; });
})();
