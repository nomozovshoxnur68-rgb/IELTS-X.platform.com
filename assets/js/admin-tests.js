/* IELTSX — shows the tests added in the admin panel on the Reading / Listening / Writing practice pages. */
(function () {
    'use strict';
    var m = /\/part\/practice\/(reading|listening|writing|speaking)/i.exec(location.pathname);
    if (!m) return;
    var type = m[1].toLowerCase();
    var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    function mount() {
        var h1 = document.querySelector('h1.text-2xl');
        if (!h1) return null;
        var anchor = h1.closest('.flex.items-center') || h1.parentElement;
        var box = document.createElement('section');
        box.id = 'ix-admin-tests'; box.hidden = true;
        anchor.parentNode.insertBefore(box, anchor.nextSibling);
        return box;
    }
    function run() {
        var box = mount(); if (!box) return;
        fetch('/api/materials?type=' + type, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : { items: [] }; }).then(function (d) {
            var items = d.items || []; if (!items.length) return;
            var meta = function (i) {
                if (type === 'speaking') return (i.parts || 0) + ' part' + (i.parts === 1 ? '' : 's');
                if (type === 'writing') return (i.tasks || 0) + ' task' + (i.tasks === 1 ? '' : 's');
                return i.questionCount + ' questions' + (i.durationMin ? ' · ' + i.durationMin + ' min' : '');
            };
            box.innerHTML = '<div class="bg-card border rounded-lg p-4"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px"><h2 class="text-lg font-semibold">New ' + type + ' tests</h2><span class="text-xs text-muted-foreground">' + items.length + ' added</span></div>' +
                '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px">' + items.map(function (i) {
                    return '<a href="/test?id=' + encodeURIComponent(i.id) + '" class="bg-card border rounded-lg p-4" style="display:block;text-decoration:none;color:inherit;transition:box-shadow .15s" onmouseover="this.style.boxShadow=\'0 4px 14px rgba(0,0,0,.12)\'" onmouseout="this.style.boxShadow=\'\'">' +
                        (i.pack ? '<div class="text-xs text-muted-foreground">' + esc(i.pack) + '</div>' : '') +
                        '<div class="font-medium" style="margin:2px 0 6px">' + esc(i.title) + '</div>' +
                        (i.description ? '<div class="text-sm text-muted-foreground" style="margin-bottom:6px">' + esc(i.description) + '</div>' : '') +
                        '<div class="text-xs text-muted-foreground">' + meta(i) + (i.premium ? ' · <b style="color:#b54708">★ Premium' + (i.locked ? ' (locked)' : '') + '</b>' : ' · Free') + '</div></a>';
                }).join('') + '</div></div>';
            box.hidden = false;
        }).catch(function () { /* the page works without it */ });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
