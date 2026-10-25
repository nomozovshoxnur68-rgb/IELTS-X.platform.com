/* IELTSX — PDF Library: PDFs added in the admin panel (PDF materials) become cards at the START of the grid (newest first).
   The file link is never in the list: Download asks the server, which checks Free / Premium / plan first. */
(function () {
    'use strict';
    var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var THEME = {
        reading: ['from-emerald-600 via-teal-600 to-green-700', 'IELTS Reading'],
        listening: ['from-sky-600 via-blue-600 to-indigo-700', 'IELTS Listening'],
        writing: ['from-orange-600 via-amber-600 to-yellow-700', 'IELTS Writing'],
        speaking: ['from-rose-600 via-pink-600 to-purple-700', 'IELTS Speaking'],
        magazine: ['from-purple-600 via-indigo-600 to-fuchsia-700', 'IELTSX Magazine'],
        other: ['from-slate-600 via-gray-600 to-zinc-700', 'PDF']
    };
    var ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>';
    var LOCK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 mr-1"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

    function cardHtml(m) {
        var t = THEME[m.category] || THEME.other;
        var media = m.coverUrl
            ? '<img loading="lazy" decoding="async" src="' + esc(m.coverUrl) + '" alt="' + esc(m.title) + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />'
            : '<div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ' + t[0] + '"><span class="text-white/90 font-semibold text-sm px-4 text-center">' + esc(t[1]) + '</span></div>';
        var chips = (m.tags || []).slice(0, 4).map(function (x) { return '<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold bg-secondary text-secondary-foreground text-xs">' + esc(x) + '</div>'; }).join('');
        var corner = m.corner || (m.pages ? m.pages + ' pages' : '');
        var btnCls = 'pdf-download-link bg-gradient-to-r ' + (m.locked ? 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700' : 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700') + ' text-white';
        return '<div class="h-full" data-ix-pdf="' + esc(m.id) + '"><div class="rounded-xl bg-card text-card-foreground shadow group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border h-full flex flex-col">' +
            '<div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">' + media +
            '<div class="absolute top-3 left-3 z-10"><span class="inline-flex items-center justify-center rounded-md font-medium border px-2.5 py-0.5 text-xs bg-white/90 text-gray-800 border-gray-200">' + esc(m.badge || 'PDF') + '</span></div>' +
            (corner ? '<div class="absolute top-3 right-3 z-10"><div class="inline-flex items-center rounded-md border px-2.5 py-0.5 bg-black/60 backdrop-blur-sm text-white border-white/20 text-xs font-medium">' + esc(corner) + '</div></div>' : '') + '</div>' +
            '<div class="p-4 flex flex-col flex-1 gap-3"><div><h3 class="font-semibold text-base leading-6 text-foreground group-hover:text-primary transition-colors">' + esc(m.title) + '</h3>' +
            (m.description ? '<p class="text-xs text-muted-foreground mt-1">' + esc(m.description) + '</p>' : '') + '</div>' +
            (chips ? '<div class="flex flex-wrap gap-1">' + chips + '</div>' : '') +
            '<div class="flex gap-2 pt-1"><a href="#" data-ix-dl="' + esc(m.id) + '" data-locked="' + (m.locked ? '1' : '') + '" data-plan="' + esc(m.plan || 'standard') + '" class="' + btnCls + '">' + (m.locked ? LOCK + 'Get Access' : ICON + 'Download PDF') + '</a></div></div></div></div>';
    }

    function download(a) {
        var id = a.getAttribute('data-ix-dl');
        if (a.getAttribute('data-locked')) { location.href = '/Price?premium=required&plan=' + encodeURIComponent(a.getAttribute('data-plan') || 'standard') + '&next=' + encodeURIComponent(location.pathname); return; }
        fetch('/api/materials/' + encodeURIComponent(id), { credentials: 'same-origin' }).then(function (r) {
            if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname); return null; }
            if (r.status === 403) { location.href = '/Price?premium=required&plan=' + encodeURIComponent(a.getAttribute('data-plan') || 'standard') + '&next=' + encodeURIComponent(location.pathname); return null; }
            return r.ok ? r.json() : null;
        }).then(function (d) {
            var url = d && d.item && d.item.data && d.item.data.fileUrl;
            if (d === null) return;
            if (!url) { alert('This PDF is not available right now.'); return; }
            var l = document.createElement('a'); l.href = url; l.target = '_blank'; l.rel = 'noopener'; l.download = ''; document.body.appendChild(l); l.click(); l.remove();
        }).catch(function () { alert('Could not start the download. Please try again.'); });
    }

    function run() {
        var grid = document.querySelector('main .grid.items-stretch'); if (!grid || !window.fetch) return;
        fetch('/api/materials?type=pdf', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : { items: [] }; }).then(function (d) {
            var items = (d.items || []).slice().sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });   // newest first
            if (!items.length) return;
            grid.insertAdjacentHTML('afterbegin', items.map(cardHtml).join(''));
        }).catch(function () { /* the built-in cards still show */ });
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('[data-ix-dl]'); if (!a) return;
            e.preventDefault(); download(a);
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
