/* ============================================================
   reading-passage.js — single-passage variant of reading.js.
   Identical engine; only the parts that assumed a 3-passage, 40-question,
   60-minute paper are driven by READING_TEST.PONLY / QTOTAL / MINUTES.
   reading.js itself is untouched and keeps serving the Full Reading Tests.
   Needs window.READING_TEST (STORAGE_KEY, SECTIONS, PASSAGES,
   VOCABULARY_DATA, READING_EXPLANATIONS, optional SYNONYMS) to be
   defined BEFORE this file is loaded.
   ============================================================ */

/* ── Options / Messages: the official full-screen pages ──────────────────
   The real player has no dropdown. The hamburger opens a white Options page
   whose only rows are "Go to submission page" (red), Contrast and Text size;
   the last two push sub-pages with a back arrow. These are globals because the
   markup calls them inline, and they delegate to ExamApp for the real work. */
function exOpenSheet(which){
  var ids={options:'ex-options',messages:'ex-messages'};
  exCloseSheet();
  var el=document.getElementById(ids[which]);
  if(!el) return;
  if(which==='options') exOptionsPage('root');
  el.classList.add('is-open');
}
function exCloseSheet(){
  exCloseSettings();
  var l=document.querySelectorAll('#stage-reading .ex-sheet.is-open');
  for(var i=0;i<l.length;i++) l[i].classList.remove('is-open');
}
var EX_PAGE_TITLES={root:'Options',contrast:'Contrast',text:'Text size'};
function exOptionsPage(page){
  var sheet=document.getElementById('ex-options');
  if(!sheet) return;
  sheet.classList.toggle('is-sub', page!=='root');
  sheet.querySelectorAll('.ex-opt-page').forEach(function(pg){
    pg.classList.toggle('is-on', pg.getAttribute('data-page')===page);
  });
  // on a sub-page the heading becomes that page's name; the back button keeps
  // reading "Options", exactly as the official player does
  var h=sheet.querySelector('.ex-sheet-title');
  if(h) h.textContent = EX_PAGE_TITLES[page] || 'Options';
}
function exGoSubmission(){
  exCloseSheet();
  // the same action the ✓ deliver button performs
  try{ ExamApp.confirmSubmit(document.getElementById('sub-btn')); }catch(e){}
}
/* Contrast maps onto the three themes the file already ships. */
var EX_CONTRAST_THEME={bw:'light',wb:'dark',yb:'sepia'};
function setContrast(v){
  try{ ExamApp.setTheme(EX_CONTRAST_THEME[v]||'light'); }catch(e){}
  exMarkOption('.ex-contrast-opt', v);
}
function setTextSize(v){
  try{ ExamApp.zoomText(v); }catch(e){}
  exMarkOption('.ex-text-opt', v);
}
function exMarkOption(sel, v){
  document.querySelectorAll('#stage-reading '+sel).forEach(function(b){
    b.classList.toggle('is-on', b.getAttribute('data-val')===v);
  });
}
/* the hamburger button */
function toggleMenu(){
  var st=document.getElementById('ex-settings');
  if(st && st.classList.contains('is-open')) exCloseSettings(); else exOpenSettings();
}

/* ── Exam Settings panel ─────────────────────────────────────────────────
   Replaces the full-screen Options page: Theme (Light / Dark / System),
   Text Size (Default / Large / Extra Large), Report Issue, Leave Test.
   The markup is built on first open, so every test page gets it without any
   HTML change. The old #ex-options markup is left in place, unused.
   EDIT THESE TWO LINES per site:                                          */
var REPORT_ISSUE_URL = '';  /* where "Report Issue" opens ('' = does nothing yet) */
var FINISH_URL = '#';       /* where "Finish" on the results screen goes — put the real link here */
var LEAVE_TEST_URL   = '';  /* '' = back to the page that opened the test; or e.g. '/tests' */

var EX_THEME_KEY = 'cdi_reading_theme_pref';   /* 'light' | 'dark' | 'system' */
var EX_SIZE_KEY  = 'cdi_reading_text_size';    /* 'regular' | 'large' | 'xlarge' */
var _exApi = null;                              /* setTheme / zoomText handed over by init() */
var _exLeaveTimer = null;

function _exSvg(inner,size){
  return '<svg aria-hidden="true" focusable="false" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>';
}
var EX_ICON={
  gear:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  type:'<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  back:'<path d="m12 19-7-7 7-7M19 12H5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>'
};

function _exBuildSettings(){
  var el=document.createElement('div');
  el.id='ex-settings'; el.className='xs-overlay';
  el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-labelledby','xs-title');
  el.innerHTML=
    '<div class="xs-card">'+
      '<button type="button" class="xs-close" aria-label="Close" onclick="exCloseSettings()">'+_exSvg(EX_ICON.x,18)+'</button>'+
      '<h2 class="xs-title" id="xs-title">'+_exSvg(EX_ICON.gear,22)+'<span>Exam Settings</span></h2>'+
      '<div class="xs-sec"><div class="xs-sec-h">'+_exSvg(EX_ICON.sun,16)+'<span>Theme</span></div>'+
        '<button type="button" class="xs-opt xs-theme" data-val="light" onclick="exSetThemePref(\'light\')">'+_exSvg(EX_ICON.sun,16)+'<span>Light</span></button>'+
        '<button type="button" class="xs-opt xs-theme" data-val="dark" onclick="exSetThemePref(\'dark\')">'+_exSvg(EX_ICON.moon,16)+'<span>Dark</span></button>'+
        '<button type="button" class="xs-opt xs-theme" data-val="system" onclick="exSetThemePref(\'system\')">'+_exSvg(EX_ICON.monitor,16)+'<span>System</span></button>'+
      '</div>'+
      '<div class="xs-sec"><div class="xs-sec-h">'+_exSvg(EX_ICON.type,16)+'<span>Text Size</span></div>'+
        '<button type="button" class="xs-opt xs-size xs-s1" data-val="regular" onclick="exSetTextSize(\'regular\')"><span>Default</span></button>'+
        '<button type="button" class="xs-opt xs-size xs-s2" data-val="large" onclick="exSetTextSize(\'large\')"><span>Large</span></button>'+
        '<button type="button" class="xs-opt xs-size xs-s3" data-val="xlarge" onclick="exSetTextSize(\'xlarge\')"><span>Extra Large</span></button>'+
      '</div>'+
      '<button type="button" class="xs-report" onclick="exReportIssue()">'+
        '<span class="xs-row-h">'+_exSvg(EX_ICON.alert,16)+'<b>Report Issue</b></span>'+
        '<span class="xs-row-s">Tell us if something is missing, broken, or incorrect.</span></button>'+
      '<button type="button" class="xs-leave" id="xs-leave" onclick="exLeaveTest()">'+
        '<span class="xs-row-h">'+_exSvg(EX_ICON.back,16)+'<b id="xs-leave-t">Leave Test Without Saving</b></span>'+
        '<span class="xs-row-s" id="xs-leave-s">Return to the tests page.</span></button>'+
    '</div>';
  el.addEventListener('mousedown',function(e){ if(e.target===el) exCloseSettings(); });
  document.body.appendChild(el);
  return el;
}
function _exSystemTheme(){
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}
function _exThemePref(){
  var p=null; try{ p=localStorage.getItem(EX_THEME_KEY); }catch(e){}
  if(p==='light'||p==='dark'||p==='system') return p;
  /* no explicit choice yet: mirror whatever theme is currently applied */
  return document.body.classList.contains('dark-mode') ? 'dark' : (document.body.classList.contains('theme-sepia') ? '' : 'light');
}
function _exTextSize(){
  var v=null; try{ v=localStorage.getItem(EX_SIZE_KEY); }catch(e){}
  return (v==='large'||v==='xlarge') ? v : 'regular';
}
function _exSyncSettings(){
  var el=document.getElementById('ex-settings'); if(!el) return;
  var tp=_exThemePref(), ts=_exTextSize();
  el.querySelectorAll('.xs-theme').forEach(function(b){ b.classList.toggle('is-on', b.getAttribute('data-val')===tp); });
  el.querySelectorAll('.xs-size').forEach(function(b){ b.classList.toggle('is-on', b.getAttribute('data-val')===ts); });
}
function exOpenSettings(){
  exCloseSheet();
  var el=document.getElementById('ex-settings')||_exBuildSettings();
  _exResetLeave(); _exSyncSettings();
  el.classList.add('is-open');
  var c=el.querySelector('.xs-close'); if(c) try{ c.focus({preventScroll:true}); }catch(e){}
}
function exCloseSettings(){
  var el=document.getElementById('ex-settings');
  if(el) el.classList.remove('is-open');
  _exResetLeave();
}
function exSetThemePref(p){
  try{ localStorage.setItem(EX_THEME_KEY,p); }catch(e){}
  var api=_exApi||ExamApp;
  try{ api.setTheme(p==='system' ? _exSystemTheme() : p); }catch(e){}
  _exSyncSettings();
}
function exSetTextSize(v){
  try{ localStorage.setItem(EX_SIZE_KEY,v); }catch(e){}
  var api=_exApi||ExamApp;
  try{ api.zoomText(v); }catch(e){}
  exMarkOption('.ex-text-opt', v==='regular'?'regular':v);   /* keep the old page's ticks in step */
  _exSyncSettings();
}
function exReportIssue(){
  if(REPORT_ISSUE_URL) window.open(REPORT_ISSUE_URL,'_blank','noopener');
}
function _exResetLeave(){
  clearTimeout(_exLeaveTimer); _exLeaveTimer=null;
  var b=document.getElementById('xs-leave'); if(!b) return;
  b.classList.remove('is-confirm');
  var t=document.getElementById('xs-leave-t'), s=document.getElementById('xs-leave-s');
  if(t) t.textContent='Leave Test Without Saving';
  if(s) s.textContent='Return to the tests page.';
}
/* two taps: the first asks, the second leaves and discards this sitting's saved progress */
function exLeaveTest(){
  var b=document.getElementById('xs-leave'); if(!b) return;
  if(!b.classList.contains('is-confirm')){
    b.classList.add('is-confirm');
    document.getElementById('xs-leave-t').textContent='Tap again to leave';
    document.getElementById('xs-leave-s').textContent='Your answers for this attempt will not be saved.';
    clearTimeout(_exLeaveTimer);
    _exLeaveTimer=setTimeout(_exResetLeave,5000);
    return;
  }
  try{ localStorage.removeItem(window.READING_TEST.STORAGE_KEY); }catch(e){}
  window.__cdiIntentionalReload=true;          /* silences the browser's "leave site?" prompt */
  if(LEAVE_TEST_URL) location.href=LEAVE_TEST_URL;
  else if(document.referrer) location.href=document.referrer;
  else if(history.length>1) history.back();
  else location.href='./';
}
/* "Finish" on the results screen: drops this sitting's saved progress and goes to FINISH_URL. */
function exFinish(){
  try{ localStorage.removeItem(window.READING_TEST.STORAGE_KEY); }catch(e){}
  window.__cdiIntentionalReload=true;
  location.href=FINISH_URL;
}
/* ── Highlight popup: new icons + labels ───────────────────────────────────
   Resting popup  : [Note] [Highlight]
   On a highlight : [Remove] [Add Note]
   Same three buttons, same handlers (addNote / applyHighlight / clearHighlight);
   only their inner markup is rebuilt, so it works with every test's HTML.     */
function exUpgradeHlPopup(){
  var pop=document.getElementById('hl-popup');
  if(!pop || pop.getAttribute('data-upgraded')) return;
  function ic(cls,inner){ return '<svg class="hp-ic '+cls+'" aria-hidden="true" focusable="false" viewBox="0 0 24 24">'+inner+'</svg>'; }
  var note=pop.querySelector('.tool-btn.note'), hi=pop.querySelector('.tool-btn.hilite'), er=pop.querySelector('.tool-btn.erase');
  if(note) note.innerHTML=
    ic('hp-bubble','<path d="M5 3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-8l-5 4v-4H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" fill="currentColor"/><circle class="hp-dot" cx="8" cy="10" r="1.3"/><circle class="hp-dot" cx="12" cy="10" r="1.3"/><circle class="hp-dot" cx="16" cy="10" r="1.3"/>')+
    ic('hp-book','<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="13" height="18" rx="2.5"/><path d="M16 7v10M3 7h6M3 10.3h6M3 13.7h6M3 17h6"/></g>')+
    '<span class="hp-t hp-t-n">Note</span><span class="hp-t hp-t-a">Add<br>Note</span>';
  if(hi) hi.innerHTML=
    ic('hp-mark','<g transform="rotate(-45 12 11)"><path d="M3.5 8.5h8v6h-8a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z" fill="currentColor"/><rect x="2" y="8.5" width="19" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11.5 8.5v6" stroke="currentColor" stroke-width="1.8"/></g><path d="M5 22h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')+
    '<span class="hp-t">Highlight</span>';
  if(er) er.innerHTML=
    ic('hp-trash','<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></g>')+
    '<span class="hp-t">Remove</span>';
  pop.setAttribute('data-upgraded','1');
}
/* called once from init(): restore theme preference + text size, follow the OS for "System" */
function exInitSettingsPrefs(api){
  _exApi=api||null;
  try{ exUpgradeHlPopup(); }catch(e){}
  var a=_exApi||ExamApp;
  var p=null; try{ p=localStorage.getItem(EX_THEME_KEY); }catch(e){}
  if(p==='system') a.setTheme(_exSystemTheme());
  var v=null; try{ v=localStorage.getItem(EX_SIZE_KEY); }catch(e){}
  if(v==='large'||v==='xlarge') a.zoomText(v);
  if(window.matchMedia){
    var mq=window.matchMedia('(prefers-color-scheme: dark)');
    var onChange=function(){
      var q=null; try{ q=localStorage.getItem(EX_THEME_KEY); }catch(e){}
      if(q==='system'){ try{ a.setTheme(_exSystemTheme()); }catch(e){} }
    };
    if(mq.addEventListener) mq.addEventListener('change',onChange); else if(mq.addListener) mq.addListener(onChange);
  }
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') exCloseSheet();
});

// ── WiFi status ──
function updateWifiStatus(){
  var on=navigator.onLine;
  var btn=document.getElementById('wifi-btn');
  if(!btn) return;
  btn.classList.toggle('is-offline',!on);
  btn.title=on?'Connected':'No internet connection';
}
window.addEventListener('online',updateWifiStatus);
window.addEventListener('offline',updateWifiStatus);
updateWifiStatus();

// ── Notification popup (superseded by the Messages page; kept as a no-op so
//    any older inline handler cannot throw) ──
function toggleNotifPopup(e){ if(e&&e.stopPropagation) e.stopPropagation(); exOpenSheet('messages'); }

// ── Candidate name in header ──
function updateHeaderName(name){
  var el=document.getElementById('ttid-name');
  if(el&&name) el.textContent=name;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PDFX · one-click vector PDF export for the CDI V3 report sheets
   ───────────────────────────────────────────────────────────────────────────
   ONE implementation, shared verbatim by Writing, Listening and Reading. The
   only thing that differs per test is the config object passed to PDFX.save():
   which element carries the sheets, how to build it, the page box, and what to
   call the file. Nothing in here knows anything about a particular paper.

   Why this and not jsPDF + html2canvas.
     html2canvas screenshots the DOM into a bitmap. The report would stop being
     text: unselectable, unsearchable, fuzzy on a 600dpi printer, and megabytes
     per file. jsPDF alone is ~360KB of library to draw shapes we can draw
     ourselves in a twentieth of that. So PDFX walks the already-typeset report
     DOM and re-emits it as PDF vector operators — real text objects, real
     paths — using the browser's own layout for every position and line break.
     The result is a small PDF whose text is selectable, searchable and
     extractable, produced offline, with no library and no network.

   What is NOT vector: the CDI logo, a 128x128 PNG brand mark, which is a
   picture and is embedded as one (losslessly, Flate-compressed RGB). That is
   the only raster object in the file.

   Type: the report is designed in Bricolage Grotesque and Be Vietnam Pro,
   which are Google-hosted and therefore absent whenever these files are opened
   offline — the sheet already falls back to the system UI face there. Rather
   than embed several hundred KB of webfont into a file that has to run from a
   memory stick, PDFX sets the sheet in Helvetica, one of the 14 fonts every
   PDF reader is required to have built in: zero bytes, universally rendered,
   perfectly extractable. Every line break, every line position and every line
   width is still the browser's own — each line is fitted to the exact box the
   browser laid out for it — so the page geometry is identical either way.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
'use strict';

var PT = 72 / 96;          /* one CSS pixel in PDF points */
var MM = 72 / 25.4;        /* one millimetre in PDF points */
var K  = 0.5522847498;     /* circle-to-bezier constant */

/* ── 1 · WinAnsiEncoding ────────────────────────────────────────────────────
   The single-byte encoding the standard fonts are used with. Latin-1 plus the
   printer's punctuation the report actually uses — the en dash in "1–20", the
   middle dot in the footer, the curly apostrophe in "Teacher's notes".        */
var WIN = (function () {
  var m = {}, i;
  for (i = 32; i < 127; i++) m[String.fromCharCode(i)] = i;
  for (i = 160; i < 256; i++) m[String.fromCharCode(i)] = i;
  var hi = { 0x20AC:0x80, 0x201A:0x82, 0x0192:0x83, 0x201E:0x84, 0x2026:0x85,
             0x2020:0x86, 0x2021:0x87, 0x02C6:0x88, 0x2030:0x89, 0x0160:0x8A,
             0x2039:0x8B, 0x0152:0x8C, 0x017D:0x8E, 0x2018:0x91, 0x2019:0x92,
             0x201C:0x93, 0x201D:0x94, 0x2022:0x95, 0x2013:0x96, 0x2014:0x97,
             0x02DC:0x98, 0x2122:0x99, 0x0161:0x9A, 0x203A:0x9B, 0x0153:0x9C,
             0x017E:0x9E, 0x0178:0x9F };
  for (var k in hi) m[String.fromCharCode(k)] = hi[k];
  m[' '] = 32;        /* nbsp prints as a space */
  m['‑'] = 45;        /* non-breaking hyphen */
  m['​'] = -1;        /* zero-width space: drop */
  return m;
})();

/* The two status marks the Listening answer record uses live in ZapfDingbats,
   which is also built into every reader. '3' is U+2713 and '7' is U+2717; a
   ToUnicode map is written for the font so pdftotext still extracts the real
   characters rather than the digits. */
var DINGBAT = { '✓': 0x33, '✔': 0x34, '✗': 0x37, '✘': 0x38,
                '✕': 0x35, '✖': 0x36 };
var DINGBAT_UNI = { 0x33:0x2713, 0x34:0x2714, 0x35:0x2715, 0x36:0x2716, 0x37:0x2717, 0x38:0x2718 };

var winMisses = 0;
function toWin(s) {
  var out = [], i, ch, c;
  for (i = 0; i < s.length; i++) {
    ch = s[i];
    c = WIN[ch];
    if (c === -1) continue;
    if (c === undefined) {
      /* Strip the accent and try again — "Đặng" sets as "Dang" rather than as
         a row of question marks. Anything still unmappable becomes '?'.      */
      var f = ch.normalize ? ch.normalize('NFD').replace(/[̀-ͯ]/g, '') : ch;
      c = (f.length === 1 && WIN[f] !== undefined) ? WIN[f] : undefined;
      if (c === undefined) { c = 63; winMisses++; }
    }
    out.push(c);
  }
  return out;
}

/* ── 2 · the PDF file ───────────────────────────────────────────────────────
   Objects, one content stream per page, Flate via the browser's own
   CompressionStream (zlib is exactly what /FlateDecode wants). No library.   */
function Doc(wPt, hPt, meta) {
  this.w = wPt; this.h = hPt; this.meta = meta || {};
  this.objs = [];            /* 1-based; each entry is a Uint8Array or string */
  this.pages = [];
  this.fonts = {};           /* psName -> {res:'/Fa', obj:n} */
  this.images = {};          /* key    -> {res:'/Ia', obj:n, w, h} */
  this.buf = null;
}
Doc.prototype.alloc = function () { this.objs.push(null); return this.objs.length; };
Doc.prototype.put = function (n, body) { this.objs[n - 1] = body; return n; };
Doc.prototype.add = function (body) { var n = this.alloc(); return this.put(n, body); };

Doc.prototype.font = function (ps) {
  if (this.fonts[ps]) return this.fonts[ps].res;
  var res = '/F' + (Object.keys(this.fonts).length + 1);
  var n = this.alloc();
  var d = '<< /Type /Font /Subtype /Type1 /BaseFont /' + ps;
  if (ps === 'ZapfDingbats') {
    var tu = this.alloc();
    d += ' /ToUnicode ' + tu + ' 0 R >>';
    var lines = '';
    for (var c in DINGBAT_UNI) lines += '<' + (+c).toString(16).padStart(2, '0') + '> <' + DINGBAT_UNI[c].toString(16).padStart(4, '0') + '>\n';
    var cmap = '/CIDInit /ProcSet findresource begin 12 dict begin begincmap\n' +
      '/CMapName /PDFX-Dingbats def /CMapType 2 def\n' +
      '1 begincodespacerange <00> <FF> endcodespacerange\n' +
      Object.keys(DINGBAT_UNI).length + ' beginbfchar\n' + lines + 'endbfchar\n' +
      'endcmap CMapName currentdict /CMap defineresource pop end end';
    this.put(tu, streamObj('<< /Length ' + cmap.length + ' >>', cmap));
  } else {
    d += ' /Encoding /WinAnsiEncoding >>';
  }
  /* No /Widths: for the 14 standard fonts every reader carries exact metrics,
     and omitting the array keeps the file small and the metrics authoritative. */
  this.put(n, d);
  this.fonts[ps] = { res: res, obj: n };
  return res;
};

function streamObj(dict, data) { return { dict: dict, data: data }; }

/* ── content stream builder ────────────────────────────────────────────── */
function Page(doc) { this.doc = doc; this.ops = []; this.res = {}; }
Page.prototype.o = function (s) { this.ops.push(s); return this; };
function f2(v) { return (Math.round(v * 100) / 100).toString(); }
Page.prototype.X = function (x) { return f2(x); };
Page.prototype.Y = function (y) { return f2(this.doc.h - y); };

Page.prototype.q = function () { return this.o('q'); };
Page.prototype.Q = function () { return this.o('Q'); };
Page.prototype.fill = function (c) { return this.o(f2c(c[0]) + ' ' + f2c(c[1]) + ' ' + f2c(c[2]) + ' rg'); };
Page.prototype.strokeCol = function (c) { return this.o(f2c(c[0]) + ' ' + f2c(c[1]) + ' ' + f2c(c[2]) + ' RG'); };
function f2c(v) { return (Math.round(v / 255 * 1000) / 1000).toString(); }

/* A rounded rectangle, given in points with y measured DOWN from the top of
   the sheet. r is [tl, tr, br, bl]; zero radii degenerate to a plain box.    */
Page.prototype.path = function (x, y, w, h, r) {
  if (w <= 0 || h <= 0) return this;
  r = r || [0, 0, 0, 0];
  var mx = Math.min(w, h) / 2, i;
  var q = [];
  for (i = 0; i < 4; i++) q[i] = Math.max(0, Math.min(r[i] || 0, mx));
  var X = this.X.bind(this), Y = this.Y.bind(this);
  if (!q[0] && !q[1] && !q[2] && !q[3]) {
    return this.o(X(x) + ' ' + Y(y + h) + ' ' + f2(w) + ' ' + f2(h) + ' re');
  }
  var x0 = x, x1 = x + w, y0 = y, y1 = y + h;
  this.o(X(x0 + q[0]) + ' ' + Y(y0) + ' m');
  this.o(X(x1 - q[1]) + ' ' + Y(y0) + ' l');
  this.o(X(x1 - q[1] + q[1] * K) + ' ' + Y(y0) + ' ' + X(x1) + ' ' + Y(y0 + q[1] - q[1] * K) + ' ' + X(x1) + ' ' + Y(y0 + q[1]) + ' c');
  this.o(X(x1) + ' ' + Y(y1 - q[2]) + ' l');
  this.o(X(x1) + ' ' + Y(y1 - q[2] + q[2] * K) + ' ' + X(x1 - q[2] + q[2] * K) + ' ' + Y(y1) + ' ' + X(x1 - q[2]) + ' ' + Y(y1) + ' c');
  this.o(X(x0 + q[3]) + ' ' + Y(y1) + ' l');
  this.o(X(x0 + q[3] - q[3] * K) + ' ' + Y(y1) + ' ' + X(x0) + ' ' + Y(y1 - q[3] + q[3] * K) + ' ' + X(x0) + ' ' + Y(y1 - q[3]) + ' c');
  this.o(X(x0) + ' ' + Y(y0 + q[0]) + ' l');
  this.o(X(x0) + ' ' + Y(y0 + q[0] - q[0] * K) + ' ' + X(x0 + q[0] - q[0] * K) + ' ' + Y(y0) + ' ' + X(x0 + q[0]) + ' ' + Y(y0) + ' c');
  return this.o('h');
};
Page.prototype.poly = function (pts) {
  for (var i = 0; i < pts.length; i++) {
    this.o(this.X(pts[i][0]) + ' ' + this.Y(pts[i][1]) + (i ? ' l' : ' m'));
  }
  return this.o('h');
};
Page.prototype.box = function (x, y, w, h, col, r) {
  if (!col || col[3] === 0 || w <= 0 || h <= 0) return this;
  return this.fill(over(col)).path(x, y, w, h, r).o('f');
};
Page.prototype.clip = function (x, y, w, h, r) { return this.path(x, y, w, h, r).o('W n'); };

/* Everything on this sheet sits on white paper, so a translucent colour can be
   composited once, here, instead of costing the file a transparency group. */
function over(c) {
  var a = c.length > 3 ? c[3] : 1;
  if (a >= 0.999) return c;
  return [c[0] * a + 255 * (1 - a), c[1] * a + 255 * (1 - a), c[2] * a + 255 * (1 - a), 1];
}

function pdfStr(bytes) {
  var s = '';
  for (var i = 0; i < bytes.length; i++) {
    var b = bytes[i];
    if (b === 40 || b === 41 || b === 92) s += '\\' + String.fromCharCode(b);
    else if (b < 32 || b > 126) s += '\\' + b.toString(8).padStart(3, '0');
    else s += String.fromCharCode(b);
  }
  return '(' + s + ')';
}

/* One text-showing operation: a whole laid-out line, placed at its baseline,
   with the inter-character space tuned so the line occupies exactly the width
   the browser gave it. */
Page.prototype.text = function (bytes, x, yBaseline, size, fontRes, col, charSpace, tm, hScale) {
  if (!bytes.length) return this;
  this.fill(over(col));
  this.o('BT');
  this.o(fontRes + ' ' + f2(size) + ' Tf');
  if (charSpace) this.o(f2r(charSpace) + ' Tc');
  if (hScale && Math.abs(hScale - 100) > 0.05) this.o(f2r(hScale) + ' Tz');
  if (tm) this.o(f2r(tm[0]) + ' ' + f2r(tm[1]) + ' ' + f2r(tm[2]) + ' ' + f2r(tm[3]) + ' ' + f2(tm[4]) + ' ' + f2(tm[5]) + ' Tm');
  else this.o('1 0 0 1 ' + this.X(x) + ' ' + this.Y(yBaseline) + ' Tm');
  this.o(pdfStr(bytes) + ' Tj');
  this.o('ET');
  if (charSpace) this.o('0 Tc');
  if (hScale && Math.abs(hScale - 100) > 0.05) this.o('100 Tz');
  return this;
};
function f2r(v) { return (Math.round(v * 10000) / 10000).toString(); }

Page.prototype.image = function (res, x, y, w, h) {
  return this.o('q').o(f2(w) + ' 0 0 ' + f2(h) + ' ' + this.X(x) + ' ' + this.Y(y + h) + ' cm')
             .o(res + ' Do').o('Q');
};

/* ── 3 · assembling the file ────────────────────────────────────────────── */
async function deflate(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    var cs = new CompressionStream('deflate');
    var out = new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer();
    return new Uint8Array(await out);
  } catch (e) { return null; }
}
function latin1(s) {
  var a = new Uint8Array(s.length);
  for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 0xff;
  return a;
}
function pdfDate(d) {
  function p(n) { return String(n).padStart(2, '0'); }
  var off = -d.getTimezoneOffset(), sg = off < 0 ? '-' : '+'; off = Math.abs(off);
  return 'D:' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) +
         p(d.getMinutes()) + p(d.getSeconds()) + sg + p(off / 60 | 0) + "'" + p(off % 60);
}

Doc.prototype.build = async function () {
  var self = this;
  var catalog = this.alloc(), pagesObj = this.alloc();
  var kids = [];
  for (var i = 0; i < this.pages.length; i++) {
    var pg = this.pages[i];
    var content = pg.ops.join('\n');
    var raw = latin1(content);
    var zip = await deflate(raw);
    var body = zip || raw;
    var sObj = this.add(streamObj('<< /Length ' + body.length + (zip ? ' /Filter /FlateDecode' : '') + ' >>', body));
    var resFonts = '', k;
    for (k in this.fonts) resFonts += this.fonts[k].res + ' ' + this.fonts[k].obj + ' 0 R ';
    var resImgs = '';
    for (k in this.images) resImgs += this.images[k].res + ' ' + this.images[k].obj + ' 0 R ';
    var pObj = this.add('<< /Type /Page /Parent ' + pagesObj + ' 0 R /MediaBox [0 0 ' + f2(this.w) + ' ' + f2(this.h) + ']' +
      ' /Resources << /ProcSet [/PDF /Text /ImageC]' +
      (resFonts ? ' /Font << ' + resFonts + '>>' : '') +
      (resImgs ? ' /XObject << ' + resImgs + '>>' : '') + ' >>' +
      ' /Contents ' + sObj + ' 0 R >>');
    kids.push(pObj + ' 0 R');
  }
  this.put(pagesObj, '<< /Type /Pages /Count ' + kids.length + ' /Kids [' + kids.join(' ') + '] >>');
  this.put(catalog, '<< /Type /Catalog /Pages ' + pagesObj + ' 0 R >>');
  var now = new Date();
  var info = this.add('<< /Title ' + pdfStr(toWin(this.meta.title || 'Test Report')) +
    ' /Author ' + pdfStr(toWin(this.meta.author || 'READING CDI')) +
    ' /Subject ' + pdfStr(toWin(this.meta.subject || 'IELTS practice Test Report Form')) +
    ' /Creator ' + pdfStr(toWin('READING CDI')) +
    ' /Producer ' + pdfStr(toWin('PDFX vector exporter')) +
    ' /CreationDate ' + pdfStr(toWin(pdfDate(now))) + ' /ModDate ' + pdfStr(toWin(pdfDate(now))) + ' >>');

  /* serialise */
  var chunks = [], len = 0, offsets = [];
  function push(u8) { chunks.push(u8); len += u8.length; }
  push(latin1('%PDF-1.4\n%âãÏÓ\n'));
  for (var n = 1; n <= this.objs.length; n++) {
    offsets[n] = len;
    var b = this.objs[n - 1];
    push(latin1(n + ' 0 obj\n'));
    if (b && b.dict !== undefined) {
      push(latin1(b.dict + '\nstream\n'));
      push(typeof b.data === 'string' ? latin1(b.data) : b.data);
      push(latin1('\nendstream'));
    } else {
      push(latin1(String(b == null ? 'null' : b)));
    }
    push(latin1('\nendobj\n'));
  }
  var xref = len;
  var x = 'xref\n0 ' + (this.objs.length + 1) + '\n0000000000 65535 f \n';
  for (n = 1; n <= this.objs.length; n++) x += String(offsets[n]).padStart(10, '0') + ' 00000 n \n';
  x += 'trailer\n<< /Size ' + (this.objs.length + 1) + ' /Root ' + catalog + ' 0 R /Info ' + info + ' 0 R >>\n' +
       'startxref\n' + xref + '\n%%EOF\n';
  push(latin1(x));
  var all = new Uint8Array(len), off = 0;
  for (var c = 0; c < chunks.length; c++) { all.set(chunks[c], off); off += chunks[c].length; }
  return all;
};

/* An <img> becomes a lossless Flate-compressed RGB XObject — the one raster
   object in the document, and the only thing here that genuinely is a picture. */
Doc.prototype.addImage = async function (img) {
  var key = img.currentSrc || img.src;
  if (this.images[key]) return this.images[key];
  var nw = img.naturalWidth || img.width, nh = img.naturalHeight || img.height;
  if (!nw || !nh) return null;
  var cap = 512, sc = Math.min(1, cap / Math.max(nw, nh));
  var cw = Math.max(1, Math.round(nw * sc)), ch = Math.max(1, Math.round(nh * sc));
  var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  var cx = cv.getContext('2d', { willReadFrequently: true });
  cx.fillStyle = '#fff'; cx.fillRect(0, 0, cw, ch);   /* the sheet is white */
  cx.drawImage(img, 0, 0, cw, ch);
  var d;
  try { d = cx.getImageData(0, 0, cw, ch).data; } catch (e) { return null; }
  var rgb = new Uint8Array(cw * ch * 3);
  for (var i = 0, j = 0; i < d.length; i += 4) { rgb[j++] = d[i]; rgb[j++] = d[i + 1]; rgb[j++] = d[i + 2]; }
  var zip = await deflate(rgb), body = zip || rgb;
  var res = '/I' + (Object.keys(this.images).length + 1);
  var n = this.add(streamObj('<< /Type /XObject /Subtype /Image /Width ' + cw + ' /Height ' + ch +
    ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length ' + body.length +
    (zip ? ' /Filter /FlateDecode' : '') + ' >>', body));
  var rec = { res: res, obj: n, w: cw, h: ch, bytes: body.length };
  this.images[key] = rec;
  return rec;
};

/* ── 4 · CSS helpers ────────────────────────────────────────────────────── */
function col(s) {
  if (!s || s === 'none' || s === 'transparent') return null;
  var m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  var p = m[1].split(/[,\s/]+/).filter(function (t) { return t !== ''; }).map(parseFloat);
  var a = p.length > 3 ? p[3] : 1;
  if (!(a > 0.004)) return null;
  return [p[0], p[1], p[2], a];
}
function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
function radii(cs) {
  return [num(cs.borderTopLeftRadius), num(cs.borderTopRightRadius),
          num(cs.borderBottomRightRadius), num(cs.borderBottomLeftRadius)];
}

/* Which of the 14 built-in faces stands in for this element's type. */
function psFont(cs) {
  var w = parseInt(cs.fontWeight, 10) || 400;
  var it = /italic|oblique/.test(cs.fontStyle);
  var bold = w >= 600;
  var fam = (cs.fontFamily || '').toLowerCase();
  if (/courier|mono/.test(fam)) return 'Courier' + (bold && it ? '-BoldOblique' : bold ? '-Bold' : it ? '-Oblique' : '');
  if (/times|georgia|serif/.test(fam) && !/sans-serif/.test(fam)) return 'Times' + (bold && it ? '-BoldItalic' : bold ? '-Bold' : it ? '-Italic' : '-Roman');
  return 'Helvetica' + (bold && it ? '-BoldOblique' : bold ? '-Bold' : it ? '-Oblique' : '');
}

/* Measurement is done in the very metrics the reader will use: Helvetica on a
   Mac, Arial on Windows, and the two are metric-compatible by design. */
var mctx = null, mcache = {};
function measure(str, ps, sizePx) {
  if (!mctx) mctx = document.createElement('canvas').getContext('2d');
  var bold = /Bold/.test(ps), it = /Oblique|Italic/.test(ps);
  var stack = /Courier/.test(ps) ? 'Courier, monospace' : /Times/.test(ps) ? '"Times New Roman", Times, serif' : 'Helvetica, Arial, sans-serif';
  var f = (it ? 'italic ' : '') + (bold ? 'bold ' : '') + sizePx + 'px ' + stack;
  if (mctx.font !== f) mctx.font = f;
  return mctx.measureText(str).width;
}
var fmcache = {};
function fontMetrics(cs) {
  var key = cs.fontStyle + '|' + cs.fontWeight + '|' + cs.fontSize + '|' + cs.fontFamily;
  if (fmcache[key]) return fmcache[key];
  if (!mctx) mctx = document.createElement('canvas').getContext('2d');
  mctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
  var m = mctx.measureText('Hxg');
  var r = { asc: m.fontBoundingBoxAscent || num(cs.fontSize) * 0.9,
            desc: m.fontBoundingBoxDescent || num(cs.fontSize) * 0.22 };
  fmcache[key] = r;
  return r;
}

function transformText(s, cs) {
  var t = cs.textTransform;
  if (t === 'uppercase') return s.toUpperCase();
  if (t === 'lowercase') return s.toLowerCase();
  if (t === 'capitalize') return s.replace(/(^|\s)(\S)/g, function (a, b, c) { return b + c.toUpperCase(); });
  return s;
}

/* linear-gradient / repeating-linear-gradient, drawn as vector bands. The
   report uses exactly two: the tricolour rule at the head of page 1 and the
   ruled writing lines in the teacher's-notes box. */
function parseGradient(bg, w, h, pxPerMm) {
  var m = bg.match(/^(repeating-)?linear-gradient\((.*)\)$/);
  if (!m) return null;
  var rep = !!m[1], body = m[2];
  /* split on top-level commas */
  var parts = [], depth = 0, cur = '';
  for (var i = 0; i < body.length; i++) {
    var c = body[i];
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += c;
  }
  parts.push(cur.trim());
  var angle = 180;
  if (/^-?[\d.]+deg$/.test(parts[0]) || /^to /.test(parts[0])) {
    var a0 = parts.shift();
    if (/deg/.test(a0)) angle = parseFloat(a0);
    else angle = /right/.test(a0) ? 90 : /left/.test(a0) ? 270 : /top/.test(a0) ? 0 : 180;
  }
  var horiz = Math.abs(((angle % 360) + 360) % 360 - 90) < 45 || Math.abs(((angle % 360) + 360) % 360 - 270) < 45;
  var span = horiz ? w : h;
  var stops = [];
  for (i = 0; i < parts.length; i++) {
    var p = parts[i];
    var cm = p.match(/^(rgba?\([^)]*\)|#[0-9a-f]+|[a-z]+)\s*(.*)$/i);
    if (!cm) return null;
    var c2 = col(cm[1]);
    var pos = null, ps = cm[2].trim();
    if (ps) {
      if (/%$/.test(ps)) pos = parseFloat(ps) / 100 * span;
      else if (/mm$/.test(ps)) pos = parseFloat(ps) * pxPerMm;
      else if (/px$/.test(ps)) pos = parseFloat(ps);
      else pos = parseFloat(ps);
    }
    stops.push({ c: c2, pos: pos });
  }
  if (stops.length < 2) return null;
  if (stops[0].pos == null) stops[0].pos = 0;
  if (stops[stops.length - 1].pos == null) stops[stops.length - 1].pos = rep ? stops[0].pos + span : span;
  for (i = 1; i < stops.length - 1; i++) {
    if (stops[i].pos != null) continue;
    var a = i - 1; while (stops[a].pos == null) a--;
    var b = i + 1; while (stops[b].pos == null) b++;
    for (var j = a + 1; j < b; j++) stops[j].pos = stops[a].pos + (stops[b].pos - stops[a].pos) * (j - a) / (b - a);
  }
  return { horiz: horiz, rep: rep, stops: stops, period: stops[stops.length - 1].pos - stops[0].pos, reversed: angle > 180 };
}

function paintGradient(pg, g, x, y, w, h) {
  var span = g.horiz ? w : h;
  var period = g.rep ? Math.max(0.2, g.period) : span;
  /* A repeating gradient tiles in BOTH directions from its origin, so the
     repetition that ends just above the top edge is on screen too — that is
     the first ruled line in the teacher's-notes box. */
  var first = 0, last = 0;
  if (g.rep) {
    first = Math.floor((0 - g.stops[g.stops.length - 1].pos) / period) - 1;
    last = Math.ceil((span - g.stops[0].pos) / period) + 1;
  }
  for (var r = first; r <= last; r++) {
    var base = r * period;
    for (var s = 0; s < g.stops.length - 1; s++) {
      var a = g.stops[s], b = g.stops[s + 1];
      if (!a.c && !b.c) continue;
      var p0 = base + a.pos, p1 = base + b.pos;
      if (p0 >= span || p1 <= 0) continue;
      var solid = a.c && b.c && a.c[0] === b.c[0] && a.c[1] === b.c[1] && a.c[2] === b.c[2] && a.c[3] === b.c[3];
      var steps = solid ? 1 : Math.max(1, Math.min(220, Math.round((p1 - p0) * 2)));
      for (var k = 0; k < steps; k++) {
        var q0 = p0 + (p1 - p0) * k / steps, q1 = p0 + (p1 - p0) * (k + 1) / steps;
        var t = steps === 1 ? 0 : (k + 0.5) / steps;
        var c0 = a.c || b.c, c1 = b.c || a.c;
        var c = [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t,
                 (c0[3] === undefined ? 1 : c0[3]) + ((c1[3] === undefined ? 1 : c1[3]) - (c0[3] === undefined ? 1 : c0[3])) * t];
        if (!(c[3] > 0.004)) continue;
        var s0 = Math.max(0, q0), s1 = Math.min(span, q1);
        if (s1 - s0 <= 0.001) continue;
        if (g.horiz) pg.box(x + s0, y, (s1 - s0) + 0.05, h, c);
        else pg.box(x, y + s0, w, (s1 - s0) + 0.05, c);
      }
    }
  }
}

/* ── 5 · walking the sheet ──────────────────────────────────────────────── */
function Painter(doc, pg, origin, scale) {
  this.doc = doc; this.pg = pg;
  this.ox = origin.x; this.oy = origin.y;      /* client px of the sheet's top-left */
  this.px = origin.px; this.py = origin.py;    /* points of the page content origin */
  this.s = scale * PT;                          /* client px -> pt, incl. any fit scale */
  this.pxPerMm = origin.pxPerMm;
  this.imgs = [];
  this.stats = { text: 0, chars: 0, boxes: 0, images: 0 };
}
Painter.prototype.tx = function (clientX) { return this.px + (clientX - this.ox) * this.s; };
Painter.prototype.ty = function (clientY) { return this.py + (clientY - this.oy) * this.s; };
Painter.prototype.d = function (v) { return v * this.s; };

Painter.prototype.decorate = function (el, cs, r) {
  var pg = this.pg;
  var x = this.tx(r.left), y = this.ty(r.top), w = this.d(r.width), h = this.d(r.height);
  if (w <= 0 || h <= 0) return;
  var rad = radii(cs).map(this.d, this);
  var bg = col(cs.backgroundColor);
  var bi = cs.backgroundImage;
  var bw = [num(cs.borderTopWidth), num(cs.borderRightWidth), num(cs.borderBottomWidth), num(cs.borderLeftWidth)];
  var bc = [col(cs.borderTopColor), col(cs.borderRightColor), col(cs.borderBottomColor), col(cs.borderLeftColor)];
  var bs = [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle];
  for (var i = 0; i < 4; i++) if (bs[i] === 'none' || bs[i] === 'hidden') { bw[i] = 0; }

  if (bg) { pg.box(x, y, w, h, bg, rad); this.stats.boxes++; }
  if (bi && bi !== 'none' && bi.indexOf('gradient') > -1) {
    var g = parseGradient(bi, r.width, r.height, this.pxPerMm);
    if (g) {
      var sc = this.s;                       /* client px -> points */
      g.period *= sc;
      for (var gi = 0; gi < g.stops.length; gi++) g.stops[gi].pos *= sc;
      pg.q(); pg.clip(x, y, w, h, rad);
      paintGradient(pg, g, x, y, w, h);   /* gradient stops are in client px */
      pg.Q();
      this.stats.boxes++;
    }
  }
  if (bw[0] || bw[1] || bw[2] || bw[3]) { this.border(x, y, w, h, rad, bw.map(this.d, this), bc); }
};

/* A CSS border is the ring between the padding box and the border box, cut
   into four mitred pieces. Drawing it that way — rather than as four straight
   strips — is what keeps a rounded corner a rounded corner. */
Painter.prototype.border = function (x, y, w, h, rad, t, bc) {
  var pg = this.pg;
  var ix = x + t[3], iy = y + t[0], iw = w - t[3] - t[1], ih = h - t[0] - t[2];
  if (iw < 0) { iw = 0; } if (ih < 0) { ih = 0; }
  var ir = [Math.max(0, rad[0] - Math.max(t[0], t[3])), Math.max(0, rad[1] - Math.max(t[0], t[1])),
            Math.max(0, rad[2] - Math.max(t[2], t[1])), Math.max(0, rad[3] - Math.max(t[2], t[3]))];
  function ring() { pg.path(x, y, w, h, rad); pg.path(ix, iy, iw, ih, ir); }
  function same(a, b) { return !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && (a[3] || 1) === (b[3] || 1); }
  var uniform = t[0] > 0 && t[0] === t[1] && t[1] === t[2] && t[2] === t[3] &&
                same(bc[0], bc[1]) && same(bc[1], bc[2]) && same(bc[2], bc[3]);
  if (uniform) {
    pg.fill(over(bc[0])); ring(); pg.o('f*');
    this.stats.boxes++;
    return;
  }
  var wedge = [
    [[x, y], [x + w, y], [x + w - t[1], y + t[0]], [x + t[3], y + t[0]]],
    [[x + w, y], [x + w, y + h], [x + w - t[1], y + h - t[2]], [x + w - t[1], y + t[0]]],
    [[x, y + h], [x + w, y + h], [x + w - t[1], y + h - t[2]], [x + t[3], y + h - t[2]]],
    [[x, y], [x, y + h], [x + t[3], y + h - t[2]], [x + t[3], y + t[0]]]
  ];
  for (var i = 0; i < 4; i++) {
    if (!t[i] || !bc[i]) continue;
    pg.q();
    ring(); pg.o('W* n');
    pg.poly(wedge[i]); pg.o('W n');
    pg.fill(over(bc[i]));
    pg.path(x, y, w, h, [0, 0, 0, 0]); pg.o('f');
    pg.Q();
    this.stats.boxes++;
  }
};

/* The lines of one text node, taken from the browser's own line boxes. */
function lineRuns(node) {
  var data = node.data, len = data.length, out = [], rg = document.createRange();
  function sameLine(s, e) {
    rg.setStart(node, s); rg.setEnd(node, e);
    var rs = rg.getClientRects();
    if (!rs.length) return true;
    var t = rs[0].top;
    for (var i = 1; i < rs.length; i++) if (Math.abs(rs[i].top - t) > 0.6) return false;
    return true;
  }
  var start = 0, guard = 0;
  while (start < len && guard++ < 4000) {
    var lo = start + 1, hi = len, best = start + 1;
    if (sameLine(start, len)) { best = len; }
    else {
      while (lo <= hi) {
        var mid = (lo + hi) >> 1;
        if (sameLine(start, mid)) { best = mid; lo = mid + 1; } else hi = mid - 1;
      }
    }
    out.push([start, best]);
    start = best;
  }
  return out;
}

Painter.prototype.textNode = function (node, cs) {
  var raw = node.data;
  if (!raw || !/\S/.test(raw)) return;
  var ps = psFont(cs);
  var size = num(cs.fontSize);
  if (size <= 0) return;
  var color = col(cs.color) || [0, 0, 0, 1];
  var fm = fontMetrics(cs);
  var ls = cs.letterSpacing === 'normal' ? 0 : num(cs.letterSpacing);
  var runs = lineRuns(node);
  var rg = document.createRange();
  for (var i = 0; i < runs.length; i++) {
    var s = runs[i][0], e = runs[i][1];
    /* drop the whitespace the line break consumed, at both ends */
    var a = s, b = e;
    while (a < b && /\s/.test(raw[a]) && cs.whiteSpace.indexOf('pre') !== 0) a++;
    while (b > a && /\s/.test(raw[b - 1])) b--;
    if (b <= a) continue;
    rg.setStart(node, a); rg.setEnd(node, b);
    var rect = rg.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;
    var str = transformText(raw.slice(a, b), cs);
    this.drawLine(str, rect, ps, size, color, fm, ls);
  }
};

/* A line has to end up exactly as wide as the box the browser measured for it,
   or the rules, cells and right-aligned columns stop lining up. The CSS
   letter-spacing is reproduced literally, and whatever is left over — the
   difference in width between the design's webfont and Helvetica, about 9% —
   is taken up by a horizontal scale on the glyphs rather than by pouring it
   all into the tracking, which would visibly space the text out. */
Painter.prototype.fitLine = function (str, n, ps, size, target, tracking) {
  var szPt = this.d(size);
  var tc = this.d(tracking || 0);
  var natural = this.d(measure(str, ps, size)) + tc * Math.max(0, n - 1);
  if (n < 2 || target <= 0 || natural <= 0) return { tc: tc, tz: 100 };
  var tz = target / natural * 100;
  var lo = 84, hi = 122;
  if (tz < lo || tz > hi) {
    var clamped = Math.max(lo, Math.min(hi, tz));
    /* residual goes to the tracking, which is where an extreme case belongs */
    var after = natural * clamped / 100;
    tc += (target - after) / (n - 1) / (clamped / 100);
    tz = clamped;
  }
  return { tc: tc, tz: tz };
};

Painter.prototype.drawLine = function (str, rect, ps, size, color, fm, tracking) {
  var pg = this.pg;
  var baseline = rect.bottom - fm.desc;
  var y = this.ty(baseline);
  var x = this.tx(rect.left);
  var target = this.d(rect.width);
  var szPt = this.d(size);
  /* Dingbats are drawn as their own runs so the rest of the line stays in
     Helvetica and the status marks still extract as the real characters. */
  var runs = [], cur = null, i;
  for (i = 0; i < str.length; i++) {
    var isD = DINGBAT[str[i]] !== undefined;
    if (!cur || cur.d !== isD) { cur = { d: isD, s: '' }; runs.push(cur); }
    cur.s += str[i];
  }
  if (runs.length === 1 && !runs[0].d) {
    var bytes = toWin(str);
    var fit = this.fitLine(str, bytes.length, ps, size, target, tracking);
    pg.text(bytes, x, y, szPt, this.doc.font(ps), color, fit.tc, null, fit.tz);
    this.stats.text++; this.stats.chars += bytes.length;
    return;
  }
  /* mixed run: place each piece at its own measured offset */
  var cx = x, natTotal = 0;
  for (i = 0; i < runs.length; i++) natTotal += this.d(runs[i].d ? runs[i].s.length * size * 0.79 : measure(runs[i].s, ps, size));
  var k = (natTotal > 0 && target > 0) ? target / natTotal : 1;
  if (k < 0.7 || k > 1.4) k = 1;
  for (i = 0; i < runs.length; i++) {
    var r = runs[i];
    if (r.d) {
      var db = [];
      for (var j = 0; j < r.s.length; j++) db.push(DINGBAT[r.s[j]]);
      pg.text(db, cx, y, szPt, this.doc.font('ZapfDingbats'), color, 0, null);
      cx += this.d(r.s.length * size * 0.79) * k;
    } else {
      pg.text(toWin(r.s), cx, y, szPt, this.doc.font(ps), color, 0, null);
      cx += this.d(measure(r.s, ps, size)) * k;
    }
    this.stats.text++; this.stats.chars += r.s.length;
  }
};

/* An inline <svg> is re-emitted as vectors too — the Task 1 bar chart is
   rectangles, rules and Arial labels, all of which the PDF can draw natively,
   so the chart in the file is real vector and stays crisp at any zoom. */
Painter.prototype.svg = function (root) {
  var self = this, pg = this.pg;
  var rootRect = root.getBoundingClientRect();
  if (!rootRect.width || !rootRect.height) return;
  var M0 = root.getScreenCTM();
  if (!M0) return;
  function pt(m, x, y) { return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; }
  function walk(el) {
    var i;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    var tag = el.tagName.toLowerCase();
    var m = el.getScreenCTM ? el.getScreenCTM() : null;
    if (m) {
      var fill = col(cs.fill === 'none' ? null : cs.fill);
      var strokeC = col(cs.stroke === 'none' ? null : cs.stroke);
      var sw = num(cs.strokeWidth);
      if (tag === 'rect') {
        var x = num(el.getAttribute('x')), y = num(el.getAttribute('y'));
        var w = num(el.getAttribute('width')), h = num(el.getAttribute('height'));
        var p0 = pt(m, x, y), p1 = pt(m, x + w, y + h);
        if (fill) pg.box(self.tx(Math.min(p0.x, p1.x)), self.ty(Math.min(p0.y, p1.y)),
                          Math.abs(self.d(p1.x - p0.x)), Math.abs(self.d(p1.y - p0.y)), fill);
      } else if (tag === 'line') {
        var q0 = pt(m, num(el.getAttribute('x1')), num(el.getAttribute('y1')));
        var q1 = pt(m, num(el.getAttribute('x2')), num(el.getAttribute('y2')));
        var lw = self.d(sw * Math.hypot(m.a, m.b)) || 0.4;
        if (strokeC) {
          pg.strokeCol(over(strokeC));
          pg.o(f2(lw) + ' w');
          pg.o(pg.X(self.tx(q0.x)) + ' ' + pg.Y(self.ty(q0.y)) + ' m ' +
               pg.X(self.tx(q1.x)) + ' ' + pg.Y(self.ty(q1.y)) + ' l S');
        }
      } else if (tag === 'text') {
        self.svgText(el, cs, m);
        return;   /* its character data is consumed here */
      } else if (tag === 'path' || tag === 'polyline' || tag === 'polygon' || tag === 'circle' || tag === 'ellipse') {
        /* not used by the report's chart; skipped rather than mis-drawn */
      }
    }
    for (i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 1) walk(el.childNodes[i]);
    }
  }
  for (var i = 0; i < root.childNodes.length; i++) if (root.childNodes[i].nodeType === 1) walk(root.childNodes[i]);
};

Painter.prototype.svgText = function (el, cs, m) {
  var str = (el.textContent || '').trim();
  if (!str) return;
  var size = num(cs.fontSize);          /* px in the *user* space of the element */
  if (!size) return;
  var ps = psFont(cs);
  var color = col(cs.fill) || [0, 0, 0, 1];
  var x = num(el.getAttribute('x')), y = num(el.getAttribute('y'));
  var len = 0;
  try { len = el.getComputedTextLength(); } catch (e) { len = measure(str, ps, size); }
  var anchor = cs.textAnchor || 'start';
  var dx = anchor === 'middle' ? -len / 2 : anchor === 'end' ? -len : 0;
  /* Compose: user space -> client px -> page points, with y flipped for PDF. */
  var s = this.s, H = this.pg.doc.h;
  var A =  s * m.a,               B = -s * m.b;
  var C = -s * m.c,               D =  s * m.d;
  var E = this.tx(m.a * (x + dx) + m.c * y + m.e);
  var F = H - this.ty(m.b * (x + dx) + m.d * y + m.f);
  var natural = measure(str, ps, size);
  var bytes = toWin(str);
  var tz = (bytes.length > 1 && len > 0 && natural > 0) ? len / natural * 100 : 100;
  if (tz < 84 || tz > 122) tz = 100;
  this.pg.text(bytes, 0, 0, size, this.doc.font(ps), color, 0, [A, B, C, D, E, F], tz);
  this.stats.text++; this.stats.chars += bytes.length;
};

Painter.prototype.walk = function (el) {
  var cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return;
  if (parseFloat(cs.opacity) === 0) return;
  var tag = el.tagName.toLowerCase();
  if (tag === 'style' || tag === 'script' || tag === 'br') return;
  var r = el.getBoundingClientRect();

  if (tag === 'svg') { this.decorate(el, cs, r); this.svg(el); return; }
  this.decorate(el, cs, r);
  if (tag === 'img') {
    var rec = this.imgLookup(el);
    if (rec) {
      var rad = radii(cs).map(this.d, this);
      this.pg.q();
      this.pg.clip(this.tx(r.left), this.ty(r.top), this.d(r.width), this.d(r.height), rad);
      this.pg.image(rec.res, this.tx(r.left), this.ty(r.top), this.d(r.width), this.d(r.height));
      this.pg.Q();
      this.stats.images++;
    }
    return;
  }
  var clipped = cs.overflow !== 'visible' && cs.overflow !== '';
  if (clipped) { this.pg.q(); this.pg.clip(this.tx(r.left), this.ty(r.top), this.d(r.width), this.d(r.height), radii(cs).map(this.d, this)); }
  for (var i = 0; i < el.childNodes.length; i++) {
    var n = el.childNodes[i];
    if (n.nodeType === 1) this.walk(n);
    else if (n.nodeType === 3) this.textNode(n, cs);
  }
  if (clipped) this.pg.Q();
};
Painter.prototype.imgLookup = function (img) { return this.doc.images[img.currentSrc || img.src] || null; };

/* ── 6 · pseudo-elements ────────────────────────────────────────────────────
   getComputedStyle can read a ::before, but nothing can give you its box. The
   section rules in this report are ::before/::after flex children, so before a
   sheet is walked each one is briefly turned into a real element carrying the
   same computed style, and turned back afterwards. The report DOM is rebuilt
   from scratch on every export, so nothing outlives the call.               */
function materialisePseudo(host) {
  var made = [];
  var els = [].slice.call(host.querySelectorAll('*'));
  els.forEach(function (el) {
    ['::before', '::after'].forEach(function (which) {
      var cs;
      try { cs = getComputedStyle(el, which); } catch (e) { return; }
      if (!cs || !cs.content || cs.content === 'none' || cs.content === 'normal') return;
      var txt = '';
      var m = cs.content.match(/^"([\s\S]*)"$/);
      if (m) txt = m[1].replace(/\\([0-9a-f]{1,6})\s?/gi, function (a, h) { return String.fromCodePoint(parseInt(h, 16)); });
      else if (cs.content !== '""') return;    /* counters, attr(), images: left alone */
      var d = document.createElement('span');
      d.setAttribute('data-pdfx-pseudo', which);
      for (var pi = 0; pi < cs.length; pi++) {
        var prop = cs.item(pi);
        if (prop === 'content') continue;
        try { d.style.setProperty(prop, cs.getPropertyValue(prop)); } catch (e) {}
      }
      d.style.setProperty('content', 'normal');
      if (txt) d.textContent = txt;
      if (which === '::before') el.insertBefore(d, el.firstChild); else el.appendChild(d);
      made.push(d);
    });
  });
  return made;
}

/* ── 7 · the export ─────────────────────────────────────────────────────── */
var DEFAULT_PAGE = { w: 210, h: 297, mt: 14, mr: 15, mb: 12, ml: 15 };

async function render(cfg) {
  var host = document.getElementById(cfg.hostId || 'print-report');
  if (!host) throw new Error('report host not found');
  if (cfg.build) cfg.build();
  if (!host.querySelector('.print-page')) throw new Error('report has no pages');

  var box = Object.assign({}, DEFAULT_PAGE, cfg.page || {});
  var colW = box.w - box.ml - box.mr;              /* mm */
  var colH = box.h - box.mt - box.mb;              /* mm */

  /* stage the sheet off-screen at exactly the printed column width */
  ensureStageCss('#' + (cfg.hostId || 'print-report'), colW, colH);
  host.classList.add('pdfx-stage');
  var pseudo = [];
  var doc = new Doc(box.w * MM, box.h * MM, cfg.meta || {});
  var report = { pages: [], scaled: [], stats: null, winMisses: 0 };
  winMisses = 0;
  try {
    /* force layout, then let one frame settle so webfonts/reflow are done */
    host.getBoundingClientRect();
    await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });
    pseudo = materialisePseudo(host);

    var probe = document.createElement('div');
    probe.style.cssText = 'height:100mm;width:1mm;position:absolute;visibility:hidden';
    host.appendChild(probe);
    var pxPerMm = probe.getBoundingClientRect().height / 100;
    probe.remove();
    if (!pxPerMm) pxPerMm = 96 / 25.4;

    /* pull every <img> into the file once */
    var imgs = [].slice.call(host.querySelectorAll('img'));
    for (var ii = 0; ii < imgs.length; ii++) {
      if (!imgs[ii].complete) { try { await imgs[ii].decode(); } catch (e) {} }
      await doc.addImage(imgs[ii]);
    }

    var sheets = [].slice.call(host.querySelectorAll('.print-page'));
    var totalStats = { text: 0, chars: 0, boxes: 0, images: 0 };
    for (var i = 0; i < sheets.length; i++) {
      var el = sheets[i];
      var r = el.getBoundingClientRect();
      /* Never let a sheet spill off its page: if the browser laid out more
         than the content box holds, the whole sheet is scaled to fit rather
         than cropped. This is a backstop — the report fitter keeps it at 1. */
      var maxH = colH * pxPerMm;
      var scale = r.height > maxH + 0.5 ? maxH / r.height : 1;
      if (scale < 1) report.scaled.push({ page: i + 1, scale: +scale.toFixed(4), height_mm: +(r.height / pxPerMm).toFixed(2) });
      var pg = new Page(doc);
      doc.pages.push(pg);
      var painter = new Painter(doc, pg, {
        x: r.left, y: r.top, px: box.ml * MM, py: box.mt * MM, pxPerMm: pxPerMm
      }, scale);
      painter.walk(el);
      report.pages.push({ page: i + 1, width_mm: +(r.width / pxPerMm).toFixed(2), height_mm: +(r.height / pxPerMm).toFixed(2), scale: +scale.toFixed(4) });
      totalStats.text += painter.stats.text; totalStats.chars += painter.stats.chars;
      totalStats.boxes += painter.stats.boxes; totalStats.images += painter.stats.images;
    }
    report.stats = totalStats;
    report.winMisses = winMisses;
    var bytes = await doc.build();
    report.bytes = bytes.length;
    report.imageBytes = Object.keys(doc.images).reduce(function (a, k) { return a + doc.images[k].bytes; }, 0);
    report.fonts = Object.keys(doc.fonts);
    return { bytes: bytes, report: report };
  } finally {
    pseudo.forEach(function (d) { if (d.parentNode) d.parentNode.removeChild(d); });
    host.classList.remove('pdfx-stage');
  }
}

var stageEl = null;
function ensureStageCss(sel, colW, colH) {
  var css =
    sel + '.pdfx-stage{display:block!important;position:fixed!important;left:-30000px!important;top:0!important;' +
      'width:' + colW + 'mm!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;' +
      'z-index:-2147483647!important;background:#fff!important;transform:none!important;filter:none!important}' +
    /* height is deliberately NOT touched: the sheet must lay out at exactly the
       height its own print stylesheet gives it, or the export stops matching
       what the print route produces. */
    sel + '.pdfx-stage .print-page{break-after:auto!important;page-break-after:auto!important;' +
      'background:#fff!important;box-shadow:none!important;margin:0!important}' +
    sel + '.pdfx-stage *{box-shadow:none!important;text-shadow:none!important;filter:none!important;' +
      'animation:none!important;transition:none!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}' +
    sel + '.pdfx-stage [data-pdfx-pseudo]{content:normal!important}';
  if (!stageEl) { stageEl = document.createElement('style'); stageEl.id = 'pdfx-stage-css'; document.head.appendChild(stageEl); }
  if (stageEl.textContent !== css) stageEl.textContent = css;
}

function saveBlob(bytes, name) {
  var blob = new Blob([bytes], { type: 'application/pdf' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener';
  a.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }, 4000);
}

/* The one entry point. Resolves with a small report about what it produced,
   which the verification harness reads and the app ignores. */
async function save(cfg) {
  cfg = cfg || {};
  var out = await render(cfg);
  var name = (typeof cfg.fileName === 'function' ? cfg.fileName() : cfg.fileName) || 'Test-Report';
  if (!/\.pdf$/i.test(name)) name += '.pdf';
  saveBlob(out.bytes, name);
  out.report.fileName = name;
  global.__PDFX_LAST = out.report;
  return out.report;
}

global.PDFX = { save: save, render: render, version: '1.0' };
})(window);


const ExamApp = (function() {
'use strict';

// ====================================================================
// TEST DATA — comes from the page (window.READING_TEST, defined by the
// inline <script> in each test's HTML). Everything below this block is the
// universal engine and is identical for every Full Reading Test.
// ====================================================================
const __T = window.READING_TEST;
if (!__T) throw new Error('reading.js: window.READING_TEST is missing — put the test data <script> before <script src="reading.js">.');
const STORAGE_KEY = __T.STORAGE_KEY;
const SECTIONS = __T.SECTIONS;
const PASSAGES = __T.PASSAGES;
const VOCABULARY_DATA = __T.VOCABULARY_DATA;
const READING_EXPLANATIONS = __T.READING_EXPLANATIONS;
const SYNONYMS = __T.SYNONYMS || {};   // optional (only some tests have a synonym table)
const PONLY  = parseInt(__T.PONLY, 10)  || 1;     // which passage this page holds
const QTOTAL = parseInt(__T.QTOTAL, 10) || 40;    // how many questions it has
const MINUTES = parseInt(__T.MINUTES, 10) || 20;  // clock for this page
const PARTS = [1,2,3].filter(function(p){ return (SECTIONS[p] || []).length; });

function synSectionHTML() {
  var keys = Object.keys(SYNONYMS).filter(function(k){ return (SYNONYMS[k]||[]).length; });
  if (!keys.length) return '';
  return '<div class="syn-wrap"><h2 class="syn-h">Synonym &amp; paraphrase table</h2>'
    + '<p class="syn-note">Every answer in this paper turns on a paraphrase. The left column is the wording of the '
    + 'question; the right column is the wording the passage uses for the same idea. Learn the pairs, not the answers.</p>'
    + keys.map(function(k){
        var rows = SYNONYMS[k].map(function(r){
          return '<tr><td class="sy-n">' + r.id + '</td><td class="sy-q">' + r.q + '</td>'
               + '<td class="sy-arr">&rarr;</td><td class="sy-p">' + r.p + '</td>'
               + '<td class="sy-uz">' + (r.uz || '') + '</td></tr>';
        }).join('');
        var ttl = (PASSAGES[k] && PASSAGES[k].title) ? PASSAGES[k].title : '';
        return '<div class="syn-card"><div class="syn-ttl">Passage ' + k + (ttl ? ' &middot; ' + ttl : '') + '</div>'
             + '<table class="syn-tbl"><thead><tr><th>Q</th><th>In the question</th><th></th>'
             + '<th>In the passage</th><th>O&#699;zbekcha</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
      }).join('')
    + '</div>';
}

// ── DERIVED INDEXES (auto-built from SECTIONS — do not edit) ──────────
const QMETA = {};                       // qid -> { p, sec }
let NAV_RANGES = {}, NAV_GROUPS = {}, PBAR_DESCS = {};
function sectionOf(qid){ return QMETA[qid] ? QMETA[qid].sec : null; }
function passageOf(qid){ return QMETA[qid] ? QMETA[qid].p : 1; }
function siblingIds(sec){ return (sec && sec.items ? sec.items : []).map(i => i.id); }
function bankOf(qid){ const s = sectionOf(qid); return (s && s.bank) ? s.bank : []; }
function multiGroupOf(qid){ const s = sectionOf(qid); return (s && s.type === 'mcq-multi') ? s : null; }
function rebuildTestIndex(){
  for (const k in QMETA) delete QMETA[k];
  NAV_RANGES = {}; NAV_GROUPS = {}; PBAR_DESCS = {};
  [1,2,3].forEach(p => {
    const ids = [], groups = [];
    (SECTIONS[p] || []).forEach(sec => {
      sec._p = p;
      const sids = siblingIds(sec);
      (sec.items || []).forEach(it => { QMETA[it.id] = { p, sec }; });
      if (sec.type === 'mcq-multi') groups.push(sids.slice());
      else sids.forEach(i => groups.push([i]));
      sids.forEach(i => ids.push(i));
    });
    ids.sort((a,b) => a - b);
    NAV_RANGES[p] = ids.length ? [ids[0], ids[ids.length - 1]] : [0, 0];
    NAV_GROUPS[p] = groups;
    const r = NAV_RANGES[p];
    PBAR_DESCS[p] = 'Read the text and answer questions ' + r[0] + '\u2013' + r[1] + '.';
  });
}
rebuildTestIndex();



// ====================================================================
// STATE
// ====================================================================

const state = {
  student: { name: '' },
  stage: 'registration',
  startedAt: null,
  finishedAt: null,
  readingAnswers: {},
  readingFlags: {},
  timers: { reading: MINUTES*60 },
  passageTimes: { 1: 0, 2: 0, 3: 0 },
  warnings: 0,
  currentPassage: PONLY,
  activeQuestion: null,
  timerHidden: false,
  timeOnPassage: 0,
  timePerQuestion: {},
  activeTimer: { type: 'idle', qid: null, startTime: null },
  vocabBasket: [],
  // V3 —
  annotations: { 1: [], 2: [], 3: [] },   // persisted highlights + notes
  paceShown: {},                          // which pacing markers have fired
  fsGranted: false,                       // did the browser actually grant fullscreen
  answerCauses: {}                        // qid -> 'plural' | 'spelling' | 'real'
};

let timerInterval = null;

/* Progress is deliberately NOT persisted. A sitting lives in memory only:
   reload and the paper restarts, which is what the Cosmos build already
   implied by removing the resume sheet. Preferences (theme, text size,
   notes) are unaffected — those are stored under their own keys.
   STORAGE_KEY stays because its trailing digits set the test number. */
function saveState() { /* no-op — progress is not saved */ }

function loadState() { return false; }   /* nothing is ever restored */

// ====================================================================
// STAGE NAVIGATION
// ====================================================================

const STAGES = ['registration','reading-intro','reading','completion','results'];

function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The CDI mark is pasted once, on the registration card. Every other place
// that needs it (results topbar, certificate header) carries an empty
// .brand-ref <img> and is filled in from that one copy at runtime — the logo
// is ~21KB of base64, so referencing beats re-pasting.
function applyBrandLogo(){
  // registration now uses Listening's .brand-logo; .reg-mark is the pre-port name
  var srcEl = document.querySelector('.brand-logo, .reg-mark');
  var url = srcEl && srcEl.getAttribute('src');
  if (!url) return;
  var refs = document.querySelectorAll('.brand-ref');
  for (var i = 0; i < refs.length; i++){
    if (refs[i].getAttribute('src') !== url) refs[i].setAttribute('src', url);
  }
  // The transplanted certificate carries the mark as a background on a div
  // (.logo-mark), not an <img>, so it needs painting separately — this is what
  // the Listening engine's applyBrandLogo() does.
  var marks = document.querySelectorAll('#stage-results .logo-mark');
  for (var m = 0; m < marks.length; m++){
    var el = marks[m];
    el.textContent = '';
    el.style.backgroundImage = 'url("' + url + '")';
    el.style.backgroundColor = 'transparent';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
  }
}

function goToStage(name, then) {
  const target  = document.getElementById('stage-'+name);
  const current = document.querySelector('.stage.active');

  const settle = () => {
    // A pacing marker must never outlive the test screen it belongs to.
    const pn = document.getElementById('pace-note');
    if (pn && name !== 'reading') pn.classList.remove('show');
    STAGES.forEach(s => {
      const el = document.getElementById('stage-'+s);
      if (el) el.classList.remove('active','stage-leaving');
    });
    if (target) target.classList.add('active');
    state.stage = name;
    saveState();
    window.scrollTo(0,0);
    // Tell the particle layer which stage is live. 'reading' is NOT one of its
    // COSMIC stages, so this is what hides the canvas and drops the scene out
    // of the render path for the exam screen — zero GPU work behind the test.
    // (The layer also polls this every frame; calling it here makes the
    // hand-off cost zero frames instead of one.)
    try { if (window.CDIAtmosphere) window.CDIAtmosphere.sync(); } catch(e) {}
    // Lets callers layer something on top once the target stage has actually
    // settled in — e.g. the results modal, which must not be added to
    // #stage-results before settle() has finished clearing 'active' off it.
    if (typeof then === 'function') then();
  };

  // Cross-fade out of the old stage first, so screens hand over instead of
  // snapping. Skipped when nothing is showing yet, or on reduced-motion.
  if (current && target && current !== target && !reducedMotion() &&
      !document.body.classList.contains('cdi-exit')) {
    current.classList.add('stage-leaving');
    setTimeout(settle, 240);
  } else {
    settle();
  }
}

// ====================================================================
// FULL-SCREEN + ANTI-CHEAT
// ====================================================================

// V3: track whether fullscreen was ever actually granted. Without this, a
// browser that refuses the request makes the exit-handler fire immediately
// and burns all three strikes on a student who did nothing.
function fullscreenActive() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement ||
            document.mozFullScreenElement || document.msFullscreenElement);
}

function enterFullscreen(quiet) {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  const settle = () => {
    state.fsGranted = fullscreenActive();
    if (!state.fsGranted && !quiet) {
      // Say so, rather than quietly arming a trap the student cannot see.
      toast('Full-screen is unavailable in this browser — the test will run windowed.', 'warn');
    }
  };
  if (req) {
    try {
      const p = req.call(el);
      if (p && typeof p.then === 'function') {
        return p.then(() => { state.fsGranted = true; })
                .catch(() => { setTimeout(settle, 60); });
      }
    } catch (e) {}
  }
  setTimeout(settle, 60);
  return Promise.resolve();
}

function exitFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) return;
  const ex = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  if (ex) ex.call(document);
}

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

const EXAM_STAGES = ['reading', 'reading-intro'];
/* Anything worth losing: an unfinished paper, and equally a finished one whose
   certificate is on screen. A reload ends the sitting, so the browser's own
   "leave site?" is the last place the candidate can still change their mind. */
function hasLiveAttempt() {
  if (window.__cdiIntentionalReload) return false;
  return !!(state.stage && state.stage !== 'registration');
}
/* PROCTORING IS OFF.
   With the registration card removed there is no click left to launch the
   paper, and a browser will not grant full-screen without one — so the
   full-screen requirement and the three-strike system have been retired
   together. Returning false here disables both the tab-switch strike and the
   left-full-screen strike at their single source, without touching any of the
   code that used to depend on them. Put proctoring back by restoring the
   original body of this function. */
function isInExamMode() {
  return false;
}

function recordViolation(reason) {
  if (!isInExamMode()) return;
  if (state.finishing) return;          // the student's own submit, not a breach
  if (state.stage === 'completion' || state.stage === 'results') return;
  state.warnings = Math.min(state.warnings + 1, 3);
  saveState();

  const strikes = document.querySelectorAll('#strike-counter .strike');
  strikes.forEach((s, i) => s.classList.toggle('on', i < state.warnings));

  document.getElementById('warning-body').textContent = reason;
  document.getElementById('warning-strikes-text').innerHTML =
    state.warnings >= 3
      ? '<strong style="color:var(--crimson)">Final warning reached.</strong> The exam has been terminated.'
      : 'Warning <strong>'+state.warnings+' of 3</strong> — the exam will be terminated on the third violation.';

  document.getElementById('warning-overlay').classList.add('show');

  if (state.warnings >= 3) {
    setTimeout(() => {
      document.getElementById('warning-overlay').classList.remove('show');
      forceTerminate();
    }, 3500);
  }
}

function dismissWarning() {
  document.getElementById('warning-overlay').classList.remove('show');
  if (state.warnings < 3 && isInExamMode()) {
    enterFullscreen();
  }
}

function forceTerminate() {
  toast('Exam terminated due to integrity violations', 'error');
  pauseTimer();
  goToStage('completion');
  exitFullscreen();
}

function setupAntiCheat() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isInExamMode()) {
      recordViolation('You switched tabs or minimised the window. The exam must remain visible at all times.');
    }
  });

  function fsHandler() {
    // Only an exit FROM a granted fullscreen counts. If the browser never gave
    // us fullscreen, there is nothing for the student to have exited.
    if (!state.fsGranted) return;
    if (!fullscreenActive() && isInExamMode() &&
        state.stage !== 'completion' && state.stage !== 'results') {
      state.fsGranted = false;   // one strike per exit, not one per event
      recordViolation('You exited full-screen mode. The exam must run in full-screen.');
    }
  }
  document.addEventListener('fullscreenchange', fsHandler);
  /* one class, so the full-screen glyph can show enter vs exit */
  const fsClass = () => document.body.classList.toggle('is-fullscreen', !!(document.fullscreenElement || document.webkitFullscreenElement));
  document.addEventListener('fullscreenchange', fsClass); document.addEventListener('webkitfullscreenchange', fsClass); fsClass();
  document.addEventListener('webkitfullscreenchange', fsHandler);
  document.addEventListener('mozfullscreenchange', fsHandler);

  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault(); 
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); }
    // Only block print if not in results
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      if(state.stage !== 'results') e.preventDefault();
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (hasLiveAttempt()) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your exam progress may be lost.';
      return e.returnValue;
    }
  });
}

// ====================================================================
// TIMERS
// ====================================================================

function fmt(seconds) {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

// The official player never shows mm:ss — the clock reads "NN minutes left"
// and is typeset exactly like the Test-taker-ID line. Under a minute it counts
// the last seconds down, because "0 minutes left" is not an honest reading.
function fmtMinutesLeft(seconds) {
  if (seconds < 0) seconds = 0;
  if (seconds < 60) return seconds + (seconds === 1 ? ' second remaining' : ' seconds remaining');
  const m = Math.ceil(seconds / 60);
  return m + (m === 1 ? ' minute remaining' : ' minutes remaining');
}

function startTimer(section, onExpire) {
  pauseTimer();
  const el = document.getElementById('timer-'+section);

  // V3 — wall-clock, not tick-count. setInterval is throttled hard in a
  // background tab, so counting one second per fire made the exam run SLOWER
  // than real time the moment a student switched away — the opposite of what
  // a timed test must do. Every tick now charges the real elapsed delta.
  let last = Date.now();

  function tick() {
    const now = Date.now();
    let delta = Math.round((now - last) / 1000);
    last = now;
    if (delta <= 0) return;              // clock skewed backwards; skip
    if (delta > 60) delta = 60;          // machine slept — don't burn the hour

    state.timers[section] = Math.max(0, state.timers[section] - delta);
    if (section === 'reading' && state.currentPassage) {
        state.passageTimes[state.currentPassage] += delta;
    }
    // V3: timePerQuestion existed in V2's state object but nothing ever wrote to
    // it. Wire it up — "where did my hour actually go" is the question students
    // cannot answer for themselves, and it is the one our pacing research says
    // decides the score.
    if (section === 'reading' && state.activeQuestion) {
      const q = state.activeQuestion;
      state.timePerQuestion[q] = (state.timePerQuestion[q] || 0) + delta;
    }
    updateTimerDisplay(section);
    if (section === 'reading') { checkPace(state.timers[section]); checkPassagePace(); }
    if (state.timers[section] % 5 === 0) saveState();
    if (state.timers[section] <= 0) {
      pauseTimer();
      if (onExpire) onExpire();
    }
  }
  updateTimerDisplay(section);
  timerInterval = setInterval(tick, 1000);
}

// V3 — pacing markers. "I knew the answers but ran out of time" is a pacing
// failure, not a language one, and Passage 3 is where the clock actually runs
// out. One overall countdown never tells a student they are already behind.
const PACE_MARKS = [
  { at: MINUTES*60 - Math.round(MINUTES/2)*60, key: 'half', title: Math.round(MINUTES/2) + ' minutes gone',
    sub: 'Half of your ' + MINUTES + ' minutes has gone — check how many questions are still open.' }
];

function checkPace(remaining) {
  if (document.body.classList.contains('review-mode')) return;
  PACE_MARKS.forEach(m => {
    // `<=` not `===`: the wall-clock delta can jump several seconds at once
    // (throttled tab, slow frame), which would step straight over an exact
    // match and silently never fire the marker. paceShown keeps it once-only.
    if (remaining <= m.at && !state.paceShown[m.key]) {
      state.paceShown[m.key] = true;
      saveState();
      showPace(m.title, m.sub);
    }
  });
}

// V3 — the overall countdown never says WHERE you are behind. passageTimes is
// already accumulating every tick; this just reads it. 15/20/25 is the split
// the pacing research recommends, so each passage gets its own budget.
const PASSAGE_BUDGET = {};   // single passage: the overall clock is the budget

function checkPassagePace() {
  if (document.body.classList.contains('review-mode')) return;
  const p = state.currentPassage;
  if (!p || !PASSAGE_BUDGET[p]) return;
  const key = 'p' + p;
  if (state.paceShown[key]) return;
  if ((state.passageTimes[p] || 0) < PASSAGE_BUDGET[p]) return;
  state.paceShown[key] = true;
  saveState();
  const mins = Math.round(PASSAGE_BUDGET[p] / 60);
  showPace(
    `${mins} minutes on Passage ${p}`,
    p < 3 ? `That is the budget for this one. Move on — you can come back if time allows.`
          : `You are into your reserve. Answer every remaining question, even as a guess.`
  );
}

function showPace(title, sub) {
  const el = document.getElementById('pace-note');
  if (!el) return;
  document.getElementById('pace-title').textContent = title;
  document.getElementById('pace-sub').textContent = sub;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 9000);
}

function updateTimerDisplay(section) {
  section = section || 'reading';
  const el = document.getElementById('timer-'+section);
  const textEl = document.getElementById('timer-text');
  const eyeIcon = document.getElementById('eye-icon');
  if (!el) return;

  const t = state.timers[section];
  const formatted = fmtMinutesLeft(t);

  if (textEl) textEl.textContent = formatted;
  else el.textContent = formatted;

  el.className = 'timer';
  // Full test: warn at 10 min, crit at 5 min
  el.classList.toggle('warn', t <= 600 && t > 300);
  el.classList.toggle('crit', t <= 300);
  // the official header warms to #f2f2eb inside the last ten minutes
  const stage = document.getElementById('stage-reading');
  if (stage) stage.classList.toggle('ex-time-low', t <= 600);

  if (t <= 300) state.timerHidden = false;

  // There is no eye button in the official player; the toggle survives only as
  // an API call, so guard on the element instead of assuming it exists.
  if (textEl) textEl.classList.toggle('hidden', !!state.timerHidden);
  if (eyeIcon) {
    eyeIcon.innerHTML = state.timerHidden
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
  }
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ====================================================================
// TOAST
// ====================================================================

let toastTimeout = null;
const TOAST_ICON = {
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 2.8 20h18.4L12 4.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>',
  warn:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5"/><path d="M12 16h.01"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.8h.01"/></svg>'
};
function toast(msg, type, duration) {
  const el = document.getElementById('toast');
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = '<span class="t-ic" aria-hidden="true">' + (TOAST_ICON[type] || TOAST_ICON.info) + '</span>'
               + '<span class="t-msg">' + escapeHtml(msg) + '</span>';
  el.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), duration || 3500);
}

// ====================================================================
// READING — BUILD PASSAGE + QUESTIONS
// ====================================================================

function renderReading() {
  switchPassage(state.currentPassage || 1);
  setTimeout(() => {
    Object.keys(state.readingAnswers).forEach(qid => {
      setReadingInput(qid, state.readingAnswers[qid]);
    });
    updateReadingNav();
  }, 50);
}

function onMultiSelect(startQ, endQ, checkbox) {
  setActivePill(startQ);
  const container = checkbox.closest('.options');
  const max = endQ - startQ + 1;
  const checkedBoxes = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'));

  if (checkedBoxes.length > max) {
    checkbox.checked = false;
    return;
  }

  container.querySelectorAll('.option').forEach(opt => {
    const cb = opt.querySelector('input');
    opt.classList.toggle('selected', cb.checked);
  });

  const nowChecked = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'));
  const atMax = nowChecked.length >= max;
  container.querySelectorAll('.option').forEach(opt => {
    const cb = opt.querySelector('input');
    if (!cb.checked) opt.classList.toggle('maxed', atMax);
  });

  const selectedValues = nowChecked.map(cb => cb.value).sort();
  for (let i = startQ; i <= endQ; i++) {
    state.readingAnswers[i] = selectedValues[i - startQ] || '';
  }
  updateReadingNav();
  saveState();
}

function onReadingInput(qid) {
  setActivePill(qid);
  const el = document.getElementById('rq-'+qid);
  if (!el) return;
  const val = el.value.trim();
  
  // Word limit warning
  const limit = parseInt(el.getAttribute('data-limit')) || 0;
  if (limit > 0) {
    const wordCount = val ? val.split(/\s+/).length : 0;
    if (wordCount > limit) {
      el.classList.add('limit-warn');
    } else {
      el.classList.remove('limit-warn');
    }
  }

  state.readingAnswers[qid] = val;
  updateReadingNav();
  saveState();
}

function onSelectChange(qid) {
  setActivePill(qid);
  const el = document.getElementById('rq-' + qid);
  if (!el) return;
  state.readingAnswers[qid] = el.value;
  if (el.value) pulseAnswered(qid);
  updateReadingNav();
  decorateQuestionAria();
  saveState();
}

// === NOTES LOGIC ===
let activeNoteSpan = null;

function addNote() {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  
  const range = sel.getRangeAt(0);
  let span = null;
  try {
    span = document.createElement('span');
    span.className = 'hl hl-note';
    span.onclick = function(e) { ExamApp.openNote(this, e); };
    range.surroundContents(span);
  } catch(e) {
    // Selection crosses element boundaries — wrap per node and anchor the note
    // to the first fragment, matching the behaviour of applyHighlight.
    span = (wrapRangeSegments(range, 'hl-note', '') || [])[0] || null;
  }
  sel.removeAllRanges();
  const popup = document.getElementById('hl-popup');
  if (popup) popup.classList.remove('show');
  if (!span) { toast('Could not add a note there', 'error'); return; }

  const rect = span.getBoundingClientRect();
  openNote(span, { pageX: rect.left + window.scrollX + (rect.width/2),
                   pageY: rect.bottom + window.scrollY });
}

function openNote(span, e) {
  activeNoteSpan = span;
  const modal = document.getElementById('note-modal');
  const ta = document.getElementById('note-textarea');
  ta.value = span.getAttribute('data-note') || '';
  
  // Clamp inside the viewport — notes near the right edge or the bottom of a
  // passage were previously positioned off-screen and looked like a dead button.
  modal.classList.add('show');
  const w = modal.offsetWidth  || 290;
  const h = modal.offsetHeight || 190;
  const maxL = window.scrollX + window.innerWidth  - w - 14;
  const maxT = window.scrollY + window.innerHeight - h - 14;
  modal.style.left = Math.max(window.scrollX + 10, Math.min(e.pageX - w/2, maxL)) + 'px';
  modal.style.top  = Math.max(window.scrollY + 10, Math.min(e.pageY + 10,  maxT)) + 'px';
  setTimeout(() => ta.focus(), 60);
}

function saveNote() {
  if (activeNoteSpan) {
    const ta = document.getElementById('note-textarea');
    const val = ta.value.trim();
    activeNoteSpan.setAttribute('data-note', val);
    activeNoteSpan.setAttribute('title', val || 'Empty note — click to edit');
  }
  closeNote();
  syncAnnotations();
  renderNotesDrawer();
}

// V3: a note with nothing in it is just a highlight the student can't remove.
function deleteNote() {
  if (activeNoteSpan) {
    const p = activeNoteSpan.parentNode;
    while (activeNoteSpan.firstChild) p.insertBefore(activeNoteSpan.firstChild, activeNoteSpan);
    p.removeChild(activeNoteSpan);
    p.normalize();
  }
  closeNote();
  syncAnnotations();
}

function closeNote() {
  const m = document.getElementById('note-modal');
  if (m) m.classList.remove('show');
  activeNoteSpan = null;
}

// === DRAG AND DROP / CLICK-TO-PLACE LOGIC ===
let draggedLetter = null;
let activeClickLetter = null;

function onDragStart(e, letter) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') { e.preventDefault(); return; }
  draggedLetter = letter;
  e.dataTransfer.setData('text/plain', letter);
  activeClickLetter = null;
  document.querySelectorAll('.drag-item').forEach(el => el.classList.remove('selected'));
}

function allowDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e, qid) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  setActivePill(qid);
  const letter = e.dataTransfer.getData('text/plain') || draggedLetter;
  if (letter) applyDropAnswer(qid, letter);
}

function onBankClick(letter, el) {
  if (activeClickLetter === letter) {
    activeClickLetter = null;
    el.classList.remove('selected');
  } else {
    activeClickLetter = letter;
    document.querySelectorAll('.drag-item').forEach(item => item.classList.remove('selected'));
    el.classList.add('selected');
  }
}

function onDropZoneClick(qid) {
  if (document.body.classList.contains('review-mode')) return;
  const zone = document.getElementById('rq-' + qid);
  
  if (activeClickLetter) {
    applyDropAnswer(qid, activeClickLetter);
  } else if (zone.textContent) {
    zone.textContent = '';
    zone.classList.remove('has-val');
    state.readingAnswers[qid] = '';
    updateReadingNav();
    saveState();
  }
}

function applyDropAnswer(qid, letter) {
  const zone = document.getElementById('rq-' + qid);
  if (zone) {
    zone.textContent = letter;
    zone.classList.add('has-val');
    state.readingAnswers[qid] = letter;
    updateReadingNav();
    saveState();
  }
}

function setReadingDrop(qid, val) {
  const zone = document.getElementById('rq-' + qid);
  if (zone && zone.classList.contains('drop-zone')) {
    zone.textContent = val || '';
    if (val) zone.classList.add('has-val');
    else zone.classList.remove('has-val');
  }
}

function setReadingInput(qid, ans) {
  if (!ans) return;
  const mgSec = multiGroupOf(qid);
  if (mgSec) {
    const cb = document.querySelector('#opt-multi-' + mgSec.gid + '-' + ans + ' input');
    if (cb) {
      cb.checked = true;
      cb.closest('.option').classList.add('selected');
      const container = cb.closest('.options');
      if (container) {
        const max = siblingIds(mgSec).length;
        const checked = container.querySelectorAll('input:checked').length;
        if (checked >= max) container.querySelectorAll('.option:not(.selected)').forEach(o => o.classList.add('maxed'));
      }
    }
    return;
  }
  const el = document.getElementById('rq-'+qid);
  if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT') { el.value = ans; return; }
      if (el.classList.contains('drop-zone')) { setReadingDrop(qid, ans); return; }
  }
  const radios = document.getElementsByName('rq-'+qid);
  radios.forEach(r => {
    if (r.value === ans) {
      r.checked = true;
      const opt = r.closest('.option');
      if (opt) {
        opt.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      }
    }
  });
}


function injectHeadingSlots(paraMap) {
  const passageText = document.querySelector('#passage-pane .passage-text');
  if (!passageText) return;
  // The official gap-match screen puts a right-aligned keyboard Help button at
  // the top of the stimulus pane. Ours explains the click-to-place route, which
  // is the keyboard-reachable alternative this engine actually implements.
  const stim = document.querySelector('#passage-pane .sectionStimulus');
  if (stim && !stim.querySelector('.keyboardHelpWrapper')) {
    const w = document.createElement('div');
    w.className = 'keyboardHelpAndPrompt__keyboardHelpWrapper keyboardHelpWrapper';
    w.innerHTML = '<button type="button" class="keyboard-help-button">'
      + '<svg viewBox="0 0 1920 1408" aria-hidden="true" focusable="false"><path d="M384 368v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm128 192v-96q0-16-16-16h-224q-16 0-16 16v96q0 16 16 16h224q16 0 16-16zm-128 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm1408 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zM384 944v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm-128 192v-96q0-16-16-16H32q-16 0-16 16v96q0 16 16 16h208q16 0 16-16zm1408-576v-96q0-16-16-16h-224q-16 0-16 16v96q0 16 16 16h224q16 0 16-16zM768 368v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm384 768v-96q0-16-16-16H784q-16 0-16 16v96q0 16 16 16h352q16 0 16-16zM640 560v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm128 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zM512 944v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm640-576v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zM896 560v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm128 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zM768 944v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm640-576v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm-256 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm128 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm-256 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm640-576v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zm-256 192v-96q0-16-16-16h-96q-16 0-16 16v96q0 16 16 16h96q16 0 16-16zM1920 128v1152q0 53-37.5 90.5T1792 1408H128q-53 0-90.5-37.5T0 1280V128q0-53 37.5-90.5T128 0h1664q53 0 90.5 37.5T1920 128z"/></svg>'
      + 'Help</button>';
    w.querySelector('button').addEventListener('click', () =>
      toast('Click a heading in the list, then click the gap you want it in.'));
    stim.insertBefore(w, stim.firstChild);
  }
  const p = PASSAGES[String(state.currentPassage)];
  paraMap.forEach(({ letter, qNum }) => {
    passageText.querySelectorAll('p').forEach(para => {
      const strong = para.querySelector('strong.para-letter');
      if (!strong || strong.textContent.trim() !== letter) return;
      const hid = state.readingAnswers[qNum];
      const heading = p && p.headings ? p.headings.find(h => h.id === hid) : null;
      const slot = document.createElement('div');
      slot.className = 'para-heading-slot' + (heading ? ' filled' : '');
      slot.id = 'hslot-' + qNum;
      slot.setAttribute('ondrop',      `ExamApp.onSlotDrop(event,${qNum})`);
      slot.setAttribute('ondragover',  `ExamApp.onSlotDragOver(event)`);
      slot.setAttribute('ondragleave', `ExamApp.onSlotDragLeave(event)`);
      slot.setAttribute('onclick',     `ExamApp.onSlotClick(${qNum})`);
      if (heading) {
        slot.innerHTML = `<span class="slot-text">${heading.text}</span>`;
      } else {
        slot.innerHTML = `<span class="gapOrderNumber">${qNum}</span>`;
      }
      para.parentNode.insertBefore(slot, para);
    });
  });
}

const HDR_TITLE_PREFIX = '[Demo]';
function switchPassage(n) {
  state.currentPassage = n;
  // V3 — do NOT pre-charge this passage's first question. The old code set
  // activeQuestion to a hardcoded [0,1,14,27][n], so every second spent
  // reading the passage before touching any question was billed to Q1/Q14/Q27.
  // That made the "took over 90s" flag fire on the first question of every
  // passage essentially always, and it was measuring reading time, not
  // question time. Null means "not on a question yet" and tick() skips it.
  state.activeQuestion = null;
  document.querySelectorAll('.passage-tab').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.passage) === n);
  });
  const pbarTitle = document.getElementById('pbar-title');
  const pbarDesc = document.getElementById('pbar-desc');
  if (pbarTitle) pbarTitle.textContent = 'Part ' + n;
  if (pbarDesc) pbarDesc.textContent = (PBAR_DESCS[n] || '');
  const p = PASSAGES[String(n)];
  // header title: "[Demo] Test 8 - P3: <passage title>"  (change HDR_TITLE_PREFIX to rename "[Demo]")
  const hdrTitle = document.getElementById('hdr-title');
  if (hdrTitle) hdrTitle.innerHTML = HDR_TITLE_PREFIX + ' ' + p.title + ' - P' + n;
  // .sectionStimulus carries margin:16px 0 inside a pane padded 0 16px, so the
  // passage column is 688px wide starting at x=16 and its title's top edge
  // lands at y=192 — level with the first question in the right-hand pane.
  document.getElementById('passage-pane').innerHTML = `
    <div class="sectionStimulus reading-passage">
      <h2 class="passage-title">${p.title}</h2>
      <div class="passage-text">${p.content}</div>
    </div>
  `;
  document.getElementById('questions-pane').innerHTML = renderReadingQuestions(n);
  if (p.headingSlots) injectHeadingSlots(p.headingSlots);
  attachReadingHandlers();
  restoreAnnotations(n);   // V3: bring back highlights/notes after any re-render
  decorateQuestionAria();
  renderNotesDrawer();
  
  (SECTIONS[n] || []).forEach(sec => {
    (sec.items || []).forEach(q => { const v = state.readingAnswers[q.id]; if (v != null && v !== '') setReadingInput(q.id, v); });
    if (sec.type === 'matching-headings') refreshHeadingBank();
    if (sec.type === 'wordbank' || sec.type === 'sentence-endings') { siblingIds(sec).forEach(q => refreshWordZone(q)); refreshWordBank(siblingIds(sec)[0]); }
  });
  saveState();
  updateReadingNav();
  attachScrollObserver();

  if (document.body.classList.contains('review-mode')) {
    setupDictionary(n);
    setTimeout(() => {
        applyReviewReveal();
        injectExplanationButtons();
    }, 100);
    return;
  }
}

function readingMcq(id, label, choices) {
  return `<div class="q-card" id="rq-card-${id}">
    <div class="q-row">
      <span class="q-pill" data-qid="${id}">${id}</span>
      <div class="q-text">${label}</div>
      <span class="feedback-pill" id="rfb-${id}"></span>
    </div>
    <div class="options">
      ${/* The real exam shows no A/B/C/D circle — just a native radio and the
            option text. The letter lives only in the input's value.
            (FAM Test ACR P3 Q32-35: <label><input type=radio value=A><p>…</p>) */''}
      ${choices.map(c => `<label class="option">
        <input type="radio" name="rq-${id}" value="${c.charAt(0)}" data-q="${id}">
        <span>${c.substring(3)}</span>
      </label>`).join('')}
    </div>
  </div>`;
}

function renderReadingQuestions(n) {
  return (SECTIONS[n] || []).map((sec, i) => renderSection(sec, n, i)).join('');
}

// ── shared inline builders ───────────────────────────────────────────
// text gap (notes / summary / sentence / table / flow-chart / map-input)
function gapInput(id, limit) {
  return `<span class="prose-gap" id="rq-card-${id}">`
       + `<input type="text" id="rq-${id}" class="gap-input" data-q="${id}" data-limit="${limit || 0}" `
       + `oninput="ExamApp.onReadingInput(${id})" autocomplete="off" spellcheck="false" placeholder="${id}">`
       + `<span class="feedback-pill" id="rfb-${id}"></span>`
       + `</span>`;
}
// draggable word-bank drop slot
function wordDrop(id) {
  return `<span class="word-drop" id="wdrop-${id}" data-qnum="${id}" `
       + `ondrop="ExamApp.onWordDrop(event,${id})" ondragover="ExamApp.onWordDragOver(event)" `
       + `ondragleave="ExamApp.onWordDragLeave(event)" onclick="ExamApp.onWordZoneClick(${id})"></span>`;
}
// replace {{id}} tokens in a string with the output of builder(id)
function fillTokens(str, builder) {
  return String(str).replace(/\{\{\s*(\d+)\s*\}\}/g, (m, id) => builder(parseInt(id, 10)));
}
// The official player prints NO bold type-name line ("True / False / Not
// Given", "Notes completion", ...). The block is h3.scorableItemHeadline —
// the question range, 700 16px, margin 0 0 8px — followed straight away by the
// instruction paragraph at 16px/24px with <strong> on the keywords. sec.title
// is still carried in the data and is used by review mode, so it is rendered
// into the DOM and hidden rather than dropped.
function secHead(sec) {
  // The two grid tasks (which paragraph / match each item) open with a bold "Questions 14–17" line.
  // The range is taken from the question numbers, so it never needs typing in the data.
  let num = sec.num;
  if (!num && (sec.type === 'matching-info' || sec.type === 'matching-features') && sec.items && sec.items.length) {
    const ids = sec.items.map(q => q.id), a = Math.min.apply(null, ids), b = Math.max.apply(null, ids);
    num = a === b ? 'Question ' + a : 'Questions ' + a + '\u2013' + b;
  }
  return `<div class="section-head">`
       + (num ? `<h3 class="num">${num}</h3>` : ``)
       + (sec.title ? `<h2>${sec.title}</h2>` : ``)
       + (sec.instruction ? `<div class="instruction">${sec.instruction}</div>` : ``)
       + `</div>`;
}
// The note-completion title is an h2 at 700 17.6px/21.12px with a 14.608px
// bottom margin, not an h4 at 700 16px.
function noteTitleHTML(sec) {
  return sec.noteTitle ? `<h4 class="note-title">${sec.noteTitle}</h4>` : ``;
}

function renderSection(sec, n, i) {
  const fn = RENDERERS[sec.type];
  const inner = fn ? fn(sec, n) : `<div style="color:var(--crimson)">Unknown section type: ${sec.type}</div>`;
  return `<div class="section-block" id="secblock-${n}-${i}" data-sectype="${sec.type}">`
       + secHead(sec) + inner + `</div>`;
}

const RENDERERS = {
  tfng: (sec) => sec.items.map(q => readingTfng(q.id, q.label, ['TRUE','FALSE','NOT GIVEN'])).join(''),
  ynng: (sec) => sec.items.map(q => readingTfng(q.id, q.label, ['YES','NO','NOT GIVEN'])).join(''),
  mcq:  (sec) => sec.items.map(q => readingMcq(q.id, q.label, q.options)).join(''),

  notes:    (sec) => noteTitleHTML(sec) + readingProseSummary(sec.items, sec.wordLimit || 0, true),
  summary:  (sec) => noteTitleHTML(sec) + readingProseSummary(sec.items, sec.wordLimit || 0),
  sentence: (sec) => noteTitleHTML(sec) + readingProseSummary(sec.items, sec.wordLimit || 0),

  'mcq-multi':         (sec) => renderMcqMulti(sec),
  wordbank:            (sec) => renderWordBank(sec),
  'matching-info':     (sec) => renderMatchingInfo(sec),
  'matching-features': (sec) => renderMatchingFeatures(sec),
  'sentence-endings':  (sec) => renderSentenceEndings(sec),
  'matching-headings': (sec, n) => renderMatchingHeadings(sec, n),
  map:      (sec) => renderMap(sec),
  diagram:  (sec) => renderMap(sec),
  table:    (sec) => renderTable(sec),
  flowchart:(sec) => renderFlowchart(sec)
};

// ── Choose-TWO (and similar multi-select) ─────────────────────────────
function renderMcqMulti(sec) {
  const gid = sec.gid;
  const ids = siblingIds(sec);
  const label = ids.length > 1 ? `${ids[0]}–${ids[ids.length - 1]}` : `${ids[0]}`;
  return `<div class="q-card" id="rq-multi-${gid}">`
    + `<div class="q-row">`
    +   `<span class="q-pill" data-qid="${ids[0]}">${label}</span>`
    +   `<div class="q-text">${sec.prompt || ''}</div>`
    + `</div>`
    + `<div class="options multi-opts">`
    +   sec.options.map(o => `<label class="option" id="opt-multi-${gid}-${o.l}">`
        + `<input type="checkbox" value="${o.l}" onchange="ExamApp.onMultiSelect(${ids[0]},${ids[ids.length - 1]},this)">`
        + `<span>${o.t}</span>`
        + `<span class="feedback-pill" id="rfb-multi-${gid}-${o.l}" style="margin-left:auto;"></span>`
        + `</label>`).join('')
    + `</div></div>`;
}

// ── Word-bank summary (drag A–J into the gaps) ────────────────────────
function bankTiles(sec) {
  const pre = (sec.items && sec.items[0]) ? sec.items[0].id : 'b';
  return (sec.bank || []).map(w => `<div class="word-tile" id="wtile-${pre}-${w.id}" draggable="true"`
      + ` ondragstart="ExamApp.onWordDragStart(event,'${w.id}')"`
      + ` ondragend="ExamApp.onWordDragEnd(event,'${w.id}')"`
      + ` onclick="ExamApp.onWordTileClick('${w.id}',this)">`
      + `<span class="word-tile-id">${w.id}</span>${w.word}</div>`).join('');
}
function renderWordBank(sec) {
  const prose = fillTokens(sec.prose || '', id => wordDrop(id));
  return `<div class="q-card">`
    + `<div class="word-bank-list">${bankTiles(sec)}</div>`
    + noteTitleHTML(sec)
    + `<div class="prose-summary">${prose}</div>`
    + `</div>`;
}

// ── Shared clickable grid (the real exam's tableMatchInteraction) ─────
// Matching-information AND matching-features are the SAME widget in the real
// exam: a grid with the option letters as bare column headers and one row per
// question. Verified in the official British Council familiarisation test
// (FAM Test ACR, Passage 2), where both render as tableMatchInteraction:
//   Q14–17 "Which paragraph contains the following information?
//            Choose the correct paragraph (A – F)."
//   Q18–22 "Choose the correct person (A – F) for each statement."
// Neither is a dropdown; neither is a lettered-circle list.
// The hidden radio per cell keeps name="rq-{id}", so setReadingInput's restore
// path and the grading code keep working untouched.
function matchGrid(sec, cols) {
  const head = `<tr><th class="mg-corner"></th>`
    + cols.map(r => `<th scope="col"${r.name ? ` title="${escapeHtml(r.name)}"` : ''}>${r.l}</th>`).join('')
    + `</tr>`;
  const body = sec.items.map(q => `<tr id="rq-card-${q.id}">`
    + `<th scope="row" class="mg-q">`
    +   `<span class="q-pill" data-qid="${q.id}">${q.id}</span>`
    +   `<span class="mg-label">${q.label || q.stem || ''}</span>`
    +   `<span class="feedback-pill" id="rfb-${q.id}"></span>`
    + `</th>`
    + cols.map(r => `<td class="mg-cell" role="radio" tabindex="0"`
        + ` aria-label="Question ${q.id}, option ${r.l}"`
        + ` onclick="ExamApp.onGridPick(${q.id},'${r.l}')"`
        + ` onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();ExamApp.onGridPick(${q.id},'${r.l}')}">`
        + `<input type="radio" name="rq-${q.id}" value="${r.l}" data-q="${q.id}" tabindex="-1">`
      + `</td>`).join('')
    + `</tr>`).join('');
  return `<div class="mg-wrap"><table class="match-grid">`
       + `<thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

// ── Matching information (which paragraph A–J?) — grid, no legend ─────
// Paragraph letters are self-explanatory, so the real exam shows no legend
// box for this task — just the grid.
function renderMatchingInfo(sec) {
  const cols = (sec.options || ['A','B','C','D','E','F','G']).map(l => ({ l }));
  return matchGrid(sec, cols);
}

// ── Reference box used by matching-features and sentence-endings ──────
// The real exam titles this legend ("List of people" in FAM Test ACR P2).
function refBox(rows, label) {
  return `<div class="option-list-box" style="margin-bottom:10px;">`
    + (label ? `<div class="olb-title">${label}</div>` : '')
    + `<ul>`
    + rows.map(r => `<li><span class="pl-letter">${r.l}</span>${r.name || r.text}</li>`).join('')
    + `</ul></div>`;
}
function letterSelect(id, rows) {
  return `<select id="rq-${id}" class="dropdown" data-q="${id}" onchange="ExamApp.onSelectChange(${id})">`
    + `<option value="">– Select –</option>`
    + rows.map(r => `<option value="${r.l}">${r.l} — ${r.name || r.text}</option>`).join('')
    + `</select>`
    + `<span class="feedback-pill" id="rfb-${id}"></span>`;
}

// ── Matching features / people ────────────────────────────────────────
// Same grid as matching-information, preceded by the titled legend that maps
// each letter to a person (FAM Test ACR P2 calls it "List of people").
function renderMatchingFeatures(sec) {
  const people = sec.people || [];
  return refBox(people, sec.bankLabel || 'List of people') + matchGrid(sec, people);
}

// Clicking anywhere in a grid cell selects that letter for that row.
function onGridPick(qid, letter) {
  setActivePill(qid);
  const radios = document.getElementsByName('rq-' + qid);
  radios.forEach(r => { r.checked = (r.value === letter); });
  state.readingAnswers[qid] = letter;
  pulseAnswered(qid);
  updateReadingNav();
  decorateQuestionAria();
  saveState();
}

// ── Matching sentence endings — endings reference + dropdown per stem ─
function renderSentenceEndings(sec) {
  // Normalise endings into bank format so the existing word-tile / word-drop
  // machinery (placeWord, refreshWordZone, refreshWordBank) works unchanged.
  if (!sec.bank) sec.bank = (sec.endings || []).map(e => ({ id: e.l, word: e.l }));
  const usedIds = new Set(siblingIds(sec).map(q => state.readingAnswers[q]).filter(Boolean));
  const tiles = (sec.endings || []).map(e =>
    `<div class="word-tile${usedIds.has(e.l) ? ' used' : ''}" id="wtile-${sec.items[0].id}-${e.l}" draggable="true"`
    + ` ondragstart="ExamApp.onWordDragStart(event,'${e.l}')"`
    + ` ondragend="ExamApp.onWordDragEnd(event,'${e.l}')"`
    + ` onclick="ExamApp.onWordTileClick('${e.l}',this)">`
    + `<span class="word-tile-id">${e.l}</span>${e.text}</div>`).join('');
  const rows = sec.items.map(q => {
    const placed = state.readingAnswers[q.id] || '';
    return `<div class="q-card" id="rq-card-${q.id}">`
      + `<div class="q-row" style="align-items:center;flex-wrap:wrap;gap:6px;">`
      + `<span class="q-pill" data-qid="${q.id}">${q.id}</span>`
      + `<div class="q-text" style="flex:1 1 auto;">${q.stem || q.label || ''}</div>`
      + `<span class="word-drop${placed ? ' filled' : ''}" id="wdrop-${q.id}" data-qnum="${q.id}"`
      + ` ondrop="ExamApp.onWordDrop(event,${q.id})"`
      + ` ondragover="ExamApp.onWordDragOver(event)"`
      + ` ondragleave="ExamApp.onWordDragLeave(event)"`
      + ` onclick="ExamApp.onWordZoneClick(${q.id})">${placed}</span>`
      + `<span class="feedback-pill" id="rfb-${q.id}"></span>`
      + `</div></div>`;
  }).join('');
  return `<div class="q-card" style="margin-bottom:6px;"><div class="word-bank-list">${tiles}</div></div>` + rows;
}

// ── Matching headings (drag headings onto bars above paragraphs) ──────
// Slots are injected into the passage pane by injectHeadingSlots() using
// PASSAGES[n].headingSlots; here we render only the heading bank.
function renderMatchingHeadings(sec, n) {
  const p = PASSAGES[String(n)];
  if (!p || !p.headings) return '';
  const usedIds = new Set(Object.values(state.readingAnswers).filter(Boolean));
  return `<div class="heading-bank-wrap">`
    + `<div class="heading-bank-label">List of Headings</div>`
    + `<div class="heading-bank-list">`
    +   p.headings.map(h => `<div class="heading-tile${usedIds.has(h.id) ? ' used' : ''}" id="htile-${h.id}" draggable="true"`
        + ` ondragstart="ExamApp.onHeadingDragStart(event,'${h.id}')"`
        + ` ondragend="ExamApp.onHeadingDragEnd(event,'${h.id}')"`
        + ` onclick="ExamApp.onHeadingTileClick('${h.id}',this)">`
        + `${h.text}</div>`).join('')
    + `</div></div>`;
}

// ── Map / plan / diagram labelling ────────────────────────────────────
// sec.image: data-URI or path. sec.mode: 'input' (type a word) or 'select'
// (pick a letter from sec.bank). sec.labels: [{id, x, y}] as % positions.
function renderMap(sec) {
  const mode = sec.mode || 'input';
  const limit = sec.wordLimit || 0;
  const labels = (sec.labels || []).map(L => {
    const inner = (mode === 'drag') ? wordDrop(L.id)
      : (mode === 'select')
        ? letterSelect(L.id, (sec.bank || []).map(b => ({ l: b.l || b.id, name: b.word || b.text || (b.l || b.id) })))
        : gapInput(L.id, limit);
    return `<span class="map-label" style="left:${L.x}%;top:${L.y}%;${L.w ? `width:${L.w}%;` : ''}">`
         + `<span class="map-num">${L.id}</span>${inner}</span>`;
  }).join('');
  const stage = `<div class="map-wrap"><img class="map-img" src="${sec.image}" alt="diagram">${labels}</div>`;
  if (mode === 'drag') {
    // the official layout: image left, the word list in a column to its right
    return `<div class="q-card"><div class="map-layout">${stage}<div class="word-bank-list">${bankTiles(sec)}</div></div></div>`;
  }
  const bankBox = (mode === 'select' && sec.bank)
    ? refBox((sec.bank || []).map(b => ({ l: b.l || b.id, name: b.word || b.text || '' })))
    : '';
  return `<div class="q-card">${bankBox}${stage}</div>`;
}

// ── Table completion ──────────────────────────────────────────────────
// sec.headers?: [..]; sec.rows: [[cell,...],...]; cells may contain {{id}}.
function renderTable(sec) {
  const limit = sec.wordLimit || 0;
  const gap = sec.bank ? (id => wordDrop(id)) : (id => gapInput(id, limit));
  const title = sec.tableTitle ? `<tr><th colspan="${(sec.headers || sec.rows[0] || []).length}" class="tbl-title">${sec.tableTitle}</th></tr>` : '';
  const head = sec.headers ? `<tr>${sec.headers.map(h => `<th>${h}</th>`).join('')}</tr>` : '';
  const ncols = (sec.headers || sec.rows[0] || []).length;
  const body = (sec.rows || []).map(r =>
      (r.length === 1)
        ? `<tr><th colspan="${ncols}" style="text-align:center">${fillTokens(r[0], gap)}</th></tr>`
        : `<tr>${r.map((c, ci) => (ci === 0 && sec.rowHeaders) ? `<th>${fillTokens(c, gap)}</th>` : `<td>${fillTokens(c, gap)}</td>`).join('')}</tr>`).join('');
  const table = `<table class="rt-table">${title}${head}${body}</table>`;
  return `<div class="q-card">${noteTitleHTML(sec)}`
    + (sec.bank ? `<div class="flow-layout"><div style="flex:1 1 auto">${table}</div><div class="word-bank-list">${bankTiles(sec)}</div></div>` : table)
    + `</div>`;
}

// ── Flow-chart completion ─────────────────────────────────────────────
// sec.boxes: ["text {{id}} text", ...]; a vertical stack of boxes joined by arrows.
// With sec.bank the gaps are drop zones and the words sit in a column to the right.
function renderFlowchart(sec) {
  const limit = sec.wordLimit || 0;
  const gap = sec.bank ? (id => wordDrop(id)) : (id => gapInput(id, limit));
  const arrow = '<div class="flow-arrow"><svg viewBox="0 0 22 28" aria-hidden="true"><path d="M8 0h6v15h6L11 28 2 15h6z" fill="#000"/></svg></div>';
  const boxes = (sec.boxes || []).map((b, idx) => (idx ? arrow : '') + `<div class="flow-box">${fillTokens(b, gap)}</div>`).join('');
  const chart = (sec.flowTitle ? `<div class="flow-title">${sec.flowTitle}</div>` : '') + `<div class="flow-chart">${boxes}</div>`;
  return `<div class="q-card">${noteTitleHTML(sec)}`
    + (sec.bank ? `<div class="flow-layout"><div>${chart}</div><div class="word-bank-list">${bankTiles(sec)}</div></div>` : chart)
    + `</div>`;
}
function readingMatch(id, label) {
  return `<div class="q-card" id="rq-card-${id}">
    <div class="q-row">
      <span class="q-pill" data-qid="${id}">${id}</span>
      <div class="q-text">${label}</div>
      <div class="drop-zone" id="rq-${id}"
        ondrop="ExamApp.onDrop(event,${id})"
        ondragover="ExamApp.allowDrop(event)"
        ondragleave="ExamApp.dragLeave(event)"
        onclick="ExamApp.onDropZoneClick(${id})"
        title="Drag or click a paragraph letter here"></div>
      <span class="feedback-pill" id="rfb-${id}"></span>
    </div>
  </div>`;
}

function readingFillRow(id, fullText) {
  let parts = fullText.split(new RegExp(`${id}\\s+_{3,}`, 'g'));
  if (parts.length < 2) parts = fullText.split(` ${id} `); 
  
  return `<div class="gap-line" id="rq-card-${id}">
    <span>• ${parts[0] || ''}</span>
    <span class="gap-field">
      <input type="text" id="rq-${id}" class="gap-input" data-q="${id}" oninput="ExamApp.onReadingInput(${id})" autocomplete="off" placeholder="${id}">
    </span>
    <span>${parts[1] || ''}</span>
    <span class="feedback-pill" id="rfb-${id}"></span>
  </div>`;
}

function readingFillSentence(id, before, after, limit) {
  return `<div class="gap-line" id="rq-card-${id}" style="margin-bottom:3px">
    ${before ? `<span>${before}</span>` : ''}
    <span class="gap-field">
      <input type="text" id="rq-${id}" class="gap-input" data-q="${id}" data-limit="${limit || 0}" oninput="ExamApp.onReadingInput(${id})" autocomplete="off" placeholder="${id}">
    </span>
    ${after ? `<span>${after}</span>` : ''}
    <span class="feedback-pill" id="rfb-${id}"></span>
  </div>`;
}

// Renders summary-completion items as inline prose (gaps sit within flowing text)
// items: array with {id, label, after?} — label may contain "N _____" pattern or be the before-text
// `bulleted` renders each item as its own disc bullet — the real exam's note
// completion is a <ul> per gap (ul: list-style disc outside, padding-left 40px,
// margin 16px 0; li text 16px/24px). Summary completion stays flowing prose.
function readingProseSummary(items, limit, bulleted) {
  const inner = items.map(q => {
    let before, after;
    if (q.after !== undefined) {
      before = q.label || '';
      after  = q.after  || '';
    } else {
      const parts = q.label.split(new RegExp(`${q.id}\\s*_+`));
      before = (parts[0] || '').trim();
      after  = (parts[1] || '').trim();
    }
    return `${before ? `<span>${before} </span>` : ''}` +
           `<span class="prose-gap" id="rq-card-${q.id}">` +
           `<input type="text" id="rq-${q.id}" class="gap-input" data-q="${q.id}" data-limit="${limit||0}" ` +
           `oninput="ExamApp.onReadingInput(${q.id})" autocomplete="off" spellcheck="false" placeholder="${q.id}">` +
           `<span class="feedback-pill" id="rfb-${q.id}"></span>` +
           `</span>` +
           `${after ? `<span> ${after}</span>` : ''}`;
  });
  if (bulleted) {
    return `<div class="q-card"><div class="prose-summary notes-list">`
      + inner.map(li => `<ul><li>${li}</li></ul>`).join('')
      + `</div></div>`;
  }
  return `<div class="q-card"><div class="prose-summary">${inner.join(' ')}</div></div>`;
}

function readingTfng(id, label, choices) {
  return `<div class="q-card" id="rq-card-${id}">
    <div class="q-row">
      <span class="q-pill" data-qid="${id}">${id}</span>
      <div class="q-text">${label}</div>
      <span class="feedback-pill" id="rfb-${id}"></span>
    </div>
    <div class="options tfn-opts">
      ${choices.map(c => `<label class="option">
        <input type="radio" name="rq-${id}" value="${c}" data-q="${id}" data-kind="reading">
        <span>${c}</span>
      </label>`).join('')}
    </div>
  </div>`;
}

function attachReadingHandlers() {
  document.querySelectorAll('input.gap-input[data-q]').forEach(inp => {
    inp.addEventListener('focus', () => setActivePill(inp.dataset.q));
  });
  document.querySelectorAll('input[type="radio"][data-q]').forEach(r => {
    r.addEventListener('change', () => {
      const q = r.dataset.q;
      setActivePill(q);
      const opt = r.closest('.option');
      if (opt) {
        opt.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      }
      state.readingAnswers[q] = r.value;
      updateReadingNav();
      saveState();
    });
  });
}

function toggleFlag(section, qid) {
  state.readingFlags[qid] = !state.readingFlags[qid];
  updateReadingNav();
  saveState();
}


// ── MATCHING HEADINGS ENGINE ──────────────────────────────────────────
let draggedHeadingId = null;
let activeHeadingTileId = null;

function onHeadingDragStart(e, hid) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') { e.preventDefault(); return; }
  draggedHeadingId = hid;
  e.dataTransfer.setData('text/plain', hid);
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => { const t = document.getElementById('htile-'+hid); if(t) t.classList.add('dragging'); }, 0);
}
function onHeadingDragEnd(e, hid) {
  const t = document.getElementById('htile-'+hid); if(t) t.classList.remove('dragging');
  draggedHeadingId = null;
}
function onSlotDragOver(e) {
  e.preventDefault(); e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}
function onSlotDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
function onSlotDrop(e, qNum) {
  e.preventDefault(); e.currentTarget.classList.remove('drag-over');
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  const hid = e.dataTransfer.getData('text/plain') || draggedHeadingId;
  if (hid) placeHeading(qNum, hid);
}
function onSlotClick(qNum) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  state.activeQuestion = qNum;
  if (state.readingAnswers[qNum]) {
    removeHeading(qNum);
  } else if (activeHeadingTileId) {
    placeHeading(qNum, activeHeadingTileId);
  }
}
function onHeadingTileClick(hid, el) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  if (activeHeadingTileId === hid) {
    activeHeadingTileId = null;
    el.classList.remove('selected');
  } else {
    activeHeadingTileId = hid;
    document.querySelectorAll('.heading-tile').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
  }
}
function placeHeading(qNum, hid) {
  state.activeQuestion = qNum;
  setActivePill(qNum);
  // If hid already placed elsewhere, free that slot first
  const p = PASSAGES[String(state.currentPassage)];
  if (p && p.headingSlots) {
    p.headingSlots.forEach(({qNum: q}) => {
      if (state.readingAnswers[q] === hid && q !== qNum) {
        state.readingAnswers[q] = '';
        refreshHeadingSlot(q);
      }
    });
  }
  state.readingAnswers[qNum] = hid;
  activeHeadingTileId = null;
  document.querySelectorAll('.heading-tile').forEach(t => t.classList.remove('selected'));
  refreshHeadingSlot(qNum);
  refreshHeadingBank();
  updateReadingNav(); saveState();
}
function removeHeading(qNum) {
  state.readingAnswers[qNum] = '';
  refreshHeadingSlot(qNum);
  refreshHeadingBank();
  updateReadingNav(); saveState();
}
function refreshHeadingSlot(qNum) {
  const slot = document.getElementById('hslot-'+qNum);
  if (!slot) return;
  const p = PASSAGES[String(state.currentPassage)];
  const hid = state.readingAnswers[qNum];
  const heading = p && p.headings ? p.headings.find(h => h.id === hid) : null;
  if (heading) {
    slot.classList.add('filled');
    slot.innerHTML = `<span class="slot-text">${heading.id}. ${heading.text}</span><span class="slot-plus">✕</span>`;
  } else {
    slot.classList.remove('filled');
    slot.innerHTML = `<span style="color:#444;font-weight:700">${qNum}</span><span class="slot-plus">+</span>`;
  }
}
function refreshHeadingBank() {
  const p = PASSAGES[String(state.currentPassage)];
  if (!p || !p.headings) return;
  const usedIds = new Set(Object.values(state.readingAnswers).filter(Boolean));
  p.headings.forEach(h => {
    const tile = document.getElementById('htile-'+h.id);
    if (tile) tile.classList.toggle('used', usedIds.has(h.id));
  });
}
// ─────────────────────────────────────────────────────────────────────

// ── WORD-BANK SUMMARY ENGINE (Q37-40) ────────────────────────────────
let draggedWordId = null, activeWordId = null;

function onWordDragStart(e, wid) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') { e.preventDefault(); return; }
  draggedWordId = wid;
  e.dataTransfer.setData('text/plain', wid);
  e.dataTransfer.effectAllowed = 'move';
  const tile = e.target && e.target.closest ? e.target.closest('.word-tile') : null;
  setTimeout(() => { if(tile) tile.classList.add('dragging'); }, 0);
}
function onWordDragEnd(e, wid) {
  const t = e.target && e.target.closest ? e.target.closest('.word-tile') : null; if(t) t.classList.remove('dragging');
  draggedWordId = null;
}
function onWordDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect='move'; e.currentTarget.classList.add('drag-over'); }
function onWordDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
function onWordDrop(e, qid) {
  e.preventDefault(); e.currentTarget.classList.remove('drag-over');
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  const wid = e.dataTransfer.getData('text/plain') || draggedWordId;
  if (wid) placeWord(qid, wid);
}
function onWordZoneClick(qid) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  if (state.readingAnswers[qid]) { clearWord(qid); }
  else if (activeWordId) { placeWord(qid, activeWordId); }
}
function onWordTileClick(wid, el) {
  if (document.body.classList.contains('review-mode') || state.stage !== 'reading') return;
  if (activeWordId === wid) { activeWordId = null; el.classList.remove('selected'); }
  else { activeWordId = wid; document.querySelectorAll('.word-tile').forEach(t => t.classList.remove('selected')); el.classList.add('selected'); }
}
function placeWord(qid, wid) {
  setActivePill(qid);
  state.activeQuestion = qid;
  siblingIds(sectionOf(qid)).forEach(q => { if (state.readingAnswers[q] === wid && q !== qid) { state.readingAnswers[q] = ''; refreshWordZone(q); } });
  state.readingAnswers[qid] = wid;
  activeWordId = null;
  document.querySelectorAll('.word-tile').forEach(t => t.classList.remove('selected'));
  refreshWordZone(qid); refreshWordBank(qid); updateReadingNav(); saveState();
}
function clearWord(qid) {
  state.readingAnswers[qid] = '';
  refreshWordZone(qid); refreshWordBank(qid); updateReadingNav(); saveState();
}
function refreshWordZone(qid) {
  const zone = document.getElementById('wdrop-'+qid); if (!zone) return;
  const wid = state.readingAnswers[qid];
  const entry = bankOf(qid).find(w => w.id === wid);
  if (entry) { zone.classList.add('filled'); zone.textContent = entry.word; }
  else { zone.classList.remove('filled'); zone.textContent = ''; }
}
function refreshWordBank(anyQid) {
  const sec = sectionOf(anyQid); if (!sec) return;
  const ids = siblingIds(sec);
  const used = new Set(ids.map(q => state.readingAnswers[q]).filter(Boolean));
  // tile ids carry the section's first question number: three banks can share one passage,
  // and a bare letter id made them hide each other's tiles
  (sec.bank || []).forEach(w => { const t = document.getElementById('wtile-'+ids[0]+'-'+w.id); if(t) t.classList.toggle('used', used.has(w.id)); });
}
// ─────────────────────────────────────────────────────────────────────

function isAnswered(i){ return !!(state.readingAnswers[i] && state.readingAnswers[i].toString().trim() !== ''); }
function groupAnswered(g){ return g.every(isAnswered); }
function partComplete(p){ const [s,e]=NAV_RANGES[p]; for(let i=s;i<=e;i++) if(!isAnswered(i)) return false; return true; }
function firstUnanswered(p){ const [s,e]=NAV_RANGES[p]; for(let i=s;i<=e;i++) if(!isAnswered(i)) return i; return e; }

function navScoreLabel(p) {
  const [s, e] = NAV_RANGES[p];
  let c = 0;
  for (let i = s; i <= e; i++) if (state.readingAnswers[i] && state.readingAnswers[i].toString().trim() !== '') c++;
  return c + ' of ' + (e - s + 1);
}

function updateReadingNav() {
  const nav = document.getElementById('reading-nav');
  if (!nav) return;
  const cur = state.currentPassage || 1;
  const curQ = state.activeQuestion || firstUnanswered(cur);

  // The footer is three flex:1 cells with min-width:auto plus a 76.8px deliver
  // button. Only the SELECTED cell carries the 3px strip, and it is painted as
  // a ::before inside the cell's own top band — one dash per number box, plus a
  // 98.48px dash over "Part N". The boxes themselves touch: no gap, and the
  // pitch is the box's own content-driven width (20.91 / 29.80).
  function partHTML(p) {
    const groups = NAV_GROUPS[p];
    const complete = partComplete(p);
    if (p === cur) {
      let pills = '';
      groups.forEach(g => {
        const label = g.length > 1 ? `${g[0]}–${g[g.length-1]}` : `${g[0]}`;
        let cls = 'qpill';
        if (g.length > 1) cls += ' grp';
        if (g.indexOf(curQ) >= 0) cls += ' current';
        if (g.some(i => state.readingFlags[i])) cls += ' flagged';
        // A paired question counts as attempted only when BOTH answers are in.
        if (groupAnswered(g)) cls += ' on';
        pills += `<button type="button" class="${cls}" onclick="ExamApp.jumpToReading(${g[0]})"`
               + ` aria-label="Question ${label}, ${groupAnswered(g) ? 'Attempted' : 'Not attempted'}${g.indexOf(curQ) >= 0 ? ', Active' : ''}">`
               + `<span aria-hidden="true">${label}</span></button>`;
      });
      return `<div class="bnav-part cur${complete ? ' done' : ''}">`
           +   `<button type="button" class="bnav-plabel" onclick="ExamApp.switchPassage(${p})">`
           +     `<span class="section-prefix">Part </span><span class="bnav-pnum">${p}</span>`
           +   `</button>`
           +   `<div class="bnav-pills">${pills}</div>`
           + `</div>`;
    }
    return `<div class="bnav-part other" onclick="ExamApp.switchPassage(${p})">`
         +   `<button type="button" class="bnav-plabel">`
         +     `<span class="section-prefix">Part </span><span class="bnav-pnum">${p}</span>`
         +     `<span class="bnav-pscore">${navScoreLabel(p)}</span>`
         +   `</button>`
         + `</div>`;
  }

  // #deliver-button: 76.8 x 53, #efefef on #535353, a 19.2px fa-check.
  const TICK = '<svg viewBox="0 0 1792 1792" fill="currentColor" aria-hidden="true" focusable="false">'
    + '<path transform="translate(0,1536) scale(1,-1)" d="M1671 566q0 -40 -28 -68l-724 -724q-28 -28 -68 -28t-68 28l-420 420q-28 28 -28 68t28 68l152 152q28 28 68 28t68 -28l200 -200l504 504q28 28 68 28t68 -28l152 -152q28 -28 28 -68z"/></svg>';
  const submitBtn = !document.body.classList.contains('review-mode')
    ? `<button id="sub-btn" onclick="ExamApp.confirmSubmit(this)" title="Submit & finish" aria-label="Submit">${TICK}</button>`
    : `<button id="sub-btn" onclick="ExamApp.backToResults()" title="Back to results" style="font-size:14px;width:auto;max-width:none;flex:0 0 auto;padding:0 16px;">← Results</button>`;

  nav.innerHTML = PARTS.map(partHTML).join("") + submitBtn;

  updateArrowState();
  markCurrentItem(curQ);
}

// The blue ring on a gap-fill box and the blue outline on a question badge both
// mean "this is the current scorable item" — not "focused". They persist after
// blur until another question becomes current.
function markCurrentItem(qid) {
  document.querySelectorAll('#questions-pane .gap-input.is-current, #passage-pane .gap-input.is-current')
    .forEach(el => el.classList.remove('is-current'));
  document.querySelectorAll('#questions-pane .q-pill.is-current')
    .forEach(el => el.classList.remove('is-current'));
  if (qid == null) return;
  document.querySelectorAll('#questions-pane .word-drop.is-current')
    .forEach(el => el.classList.remove('is-current'));
  const inp = document.getElementById('rq-' + qid);
  if (inp && inp.classList && inp.classList.contains('gap-input')) inp.classList.add('is-current');
  const drop = document.getElementById('wdrop-' + qid);
  if (drop) drop.classList.add('is-current');
  const pill = document.querySelector(`#questions-pane .q-pill[data-qid="${qid}"]`);
  if (pill) pill.classList.add('is-current');
  const slot = document.getElementById('hslot-' + qid);
  document.querySelectorAll('#passage-pane .para-heading-slot.is-current')
    .forEach(el => el.classList.remove('is-current'));
  if (slot) slot.classList.add('is-current');
}

function updateArrowState() {
  const cur = state.currentPassage || 1;
  const prev = document.querySelector('#qnav-arrows .prev');
  const next = document.querySelector('#qnav-arrows .next');
  if (prev) prev.disabled = cur <= PARTS[0];
  if (next) next.disabled = cur >= PARTS[PARTS.length - 1];
}

function nextPart() {
  const cur = state.currentPassage || 1;
  if (cur < PARTS[PARTS.length - 1]) { switchPassage(cur + 1); const qp = document.getElementById('questions-pane'); if (qp) qp.scrollTop = 0; }
}

function prevPart() {
  const cur = state.currentPassage || 1;
  if (cur > PARTS[0]) { switchPassage(cur - 1); const qp = document.getElementById('questions-pane'); if (qp) qp.scrollTop = 0; }
}

function jumpToReading(qid) {
  let p = passageOf(qid);
  state.activeQuestion = qid;
  if (p !== state.currentPassage) {
    switchPassage(p);
    setTimeout(() => doScrollTo(qid), 100);
  } else {
    doScrollTo(qid);
    updateReadingNav();
  }
}

function doScrollTo(qid) {
  const pane = document.getElementById('questions-pane');
  if (!pane) return;

  let el = document.getElementById('rq-card-' + qid);
  const _sec = sectionOf(qid);
  if (!el && _sec && _sec.type === 'mcq-multi') el = document.getElementById('rq-multi-' + _sec.gid);
  if (!el) el = document.getElementById('rq-' + qid);
  if (!el) el = document.getElementById('wdrop-' + qid);

  if (!el) return;

  // For inline elements (prose-gap spans) climb to nearest block ancestor inside the pane
  const target = el.closest('.q-card, .section-block') || el;

  const paneRect   = pane.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const scrollTo   = pane.scrollTop + (targetRect.top - paneRect.top) - 24;

  pane.scrollTo({ top: scrollTo, behavior: 'smooth' });

  target.style.transition = 'box-shadow 0.4s';
  target.style.boxShadow  = '0 0 0 3px rgba(23,52,97,0.35)';
  setTimeout(() => { target.style.boxShadow = ''; }, 1400);
}

function attachScrollObserver() {
  // intentionally empty — active question only updates on pill click, not scroll
}

// V3 — the Notes drawer. The real player keeps every note in a right-hand
// panel; without one, a student who wrote eight notes across three passages
// has no way to read them back. Notes carry their quoted text so the list
// works for passages that are not currently rendered.
function allNotes() {
  const out = [];
  [1, 2, 3].forEach(p => ((state.annotations && state.annotations[p]) || [])
    .forEach((a, i) => { if (a.c === 'hl-note' && (a.n || '').trim()) out.push({ ...a, p, i }); }));
  return out;
}

function renderNotesDrawer() {
  const body = document.getElementById('notes-drawer-body');
  const badge = document.getElementById('notes-count');
  if (!body) return;
  const notes = allNotes();

  if (badge) { badge.hidden = notes.length === 0; badge.textContent = notes.length; }

  if (!notes.length) {
    // wording taken verbatim from the official sidebar's empty state
    body.innerHTML = `<div class="nd-empty">
        <b>Your private notes will show here</b>
        <span>Select text to highlight or create a note.</span>
      </div>`;
    return;
  }
  let html = '', lastP = null;
  notes.forEach(n => {
    if (n.p !== lastP) { html += `<div class="nd-group">Passage ${n.p}</div>`; lastP = n.p; }
    html += `<div class="nd-item" onclick="ExamApp.jumpToNote(${n.p},${n.s})">
        <button class="nd-del" title="Delete note"
                onclick="event.stopPropagation();ExamApp.deleteNoteAt(${n.p},${n.s})">&times;</button>
        <div class="nd-quote">${escapeHtml(n.t || '')}</div>
        <div class="nd-text">${escapeHtml(n.n)}</div>
      </div>`;
  });
  body.innerHTML = html;
}

function toggleNotesDrawer(force) {
  const d = document.getElementById('notes-drawer');
  if (!d) return;
  const open = (force === undefined) ? !d.classList.contains('open') : !!force;
  d.classList.toggle('open', open);
  d.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.body.classList.toggle('notes-open', open);
  if (open) renderNotesDrawer();
}

function jumpToNote(passage, start) {
  const go = () => {
    const root = passageRoot();
    if (!root) return;
    const span = [...root.querySelectorAll('span.hl-note')].find(s => {
      const first = annoTextNodes(s)[0];
      return first && offsetOfPoint(root, first, 0) === start;
    });
    if (!span) return;
    span.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
    span.classList.add('note-flash');
    setTimeout(() => span.classList.remove('note-flash'), 1200);
  };
  if (state.currentPassage !== passage) { switchPassage(passage); setTimeout(go, 260); }
  else go();
}

function deleteNoteAt(passage, start) {
  const list = (state.annotations && state.annotations[passage]) || [];
  state.annotations[passage] = list.filter(a => !(a.c === 'hl-note' && a.s === start));
  saveState();
  if (state.currentPassage === passage) restoreAnnotations(passage);
  renderNotesDrawer();
}

// V3 — announce question state the way the real player does:
// "Question 4, Not attempted" / "Attempted", and mark the active one.
function decorateQuestionAria() {
  document.querySelectorAll('#questions-pane .q-pill[data-qid]').forEach(pill => {
    const id = pill.dataset.qid;
    const answered = !!(state.readingAnswers[id] || '').toString().trim();
    // The official badge is an inert span — no role, no tab stop, no click
    // target. Only the label is announced.
    pill.removeAttribute('role');
    pill.removeAttribute('tabindex');
    pill.setAttribute('aria-label',
      `Question ${id}, ${answered ? 'Attempted' : 'Not attempted'}` +
      (String(state.activeQuestion) === String(id) ? ', Active' : ''));
    if (String(state.activeQuestion) === String(id)) pill.setAttribute('aria-current', 'true');
    else pill.removeAttribute('aria-current');
  });
}

// V3 — a one-shot pulse on the question number when an answer registers.
function pulseAnswered(qid) {
  const pill = document.querySelector(`#questions-pane .q-pill[data-qid="${qid}"]`);
  if (!pill) return;
  pill.classList.remove('just-answered');
  void pill.offsetWidth;              // restart the animation
  pill.classList.add('just-answered');
  setTimeout(() => pill.classList.remove('just-answered'), 600);
}

function setActivePill(qid) {
  const numId = parseInt(qid);
  if (numId) state.activeQuestion = numId;
  document.querySelectorAll('#questions-pane .q-pill').forEach(p => p.classList.remove('active'));
  const pill = document.querySelector(`#questions-pane .q-pill[data-qid="${qid}"]`);
  if (pill) pill.classList.add('active');
  markCurrentItem(numId || qid);
}

// ====================================================================
// HIGHLIGHTING (Reading)
// ====================================================================

// ====================================================================
// V3 — ANNOTATION PERSISTENCE
// V2 kept highlights and notes purely in the DOM, so a reload wiped every
// mark a student had made while every other piece of state survived. We
// address annotations by character offset into the passage's own text,
// deliberately skipping form controls and heading slots so that answering
// a question can never shift a stored offset.
// ====================================================================

const USER_HL_CLASSES = ['hl-y','hl-g','hl-p','hl-note'];

function passageRoot() {
  return document.querySelector('#passage-pane .passage-text');
}

function annoTextNodes(root) {
  if (!root) return [];
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (n.parentElement && n.parentElement.closest(
            '.para-heading-slot, select, input, textarea, button, .word-drop, .gap-input')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let n;
  while ((n = walker.nextNode())) out.push(n);
  return out;
}

function offsetOfPoint(root, node, offset) {
  const nodes = annoTextNodes(root);
  let total = 0;
  for (const n of nodes) {
    if (n === node) return total + offset;
    total += n.nodeValue.length;
  }
  return -1;
}

function rangeFromOffsets(root, start, end) {
  const nodes = annoTextNodes(root);
  const range = document.createRange();
  let total = 0, started = false;
  for (const n of nodes) {
    const len = n.nodeValue.length;
    if (!started && start >= total && start <= total + len) {
      range.setStart(n, start - total);
      started = true;
    }
    if (started && end >= total && end <= total + len) {
      range.setEnd(n, end - total);
      return range;
    }
    total += len;
  }
  return null;
}

// Wrap a range that crosses element boundaries, one text node at a time.
// surroundContents() throws on such ranges, so this is the fallback path.
function wrapRangeSegments(range, className, noteText) {
  const made = [];
  const root = passageRoot();
  if (!root) return made;
  // Snapshot the affected nodes and their slice bounds BEFORE mutating, since
  // splitText() inserts new siblings and would invalidate a live walk.
  const jobs = [];
  annoTextNodes(root).forEach(n => {
    if (!range.intersectsNode(n)) return;
    const s = (n === range.startContainer) ? range.startOffset : 0;
    const e = (n === range.endContainer)   ? range.endOffset   : n.nodeValue.length;
    if (e > s) jobs.push({ node: n, s: s, e: e });
  });
  jobs.forEach(j => {
    let target = j.node;
    if (j.s > 0) target = target.splitText(j.s);
    if (target.nodeValue.length > (j.e - j.s)) target.splitText(j.e - j.s);
    const span = document.createElement('span');
    span.className = 'hl ' + className;
    if (className === 'hl-note') {
      span.setAttribute('data-note', noteText || '');
      span.onclick = function(ev) { ExamApp.openNote(this, ev); };
    }
    target.parentNode.insertBefore(span, target);
    span.appendChild(target);
    made.push(span);
  });
  return made;
}

// Unwrap every user annotation, leaving the passage text untouched. This is what
// makes restore idempotent: without it, a second render wraps already-wrapped
// spans, and each save then doubles the stored list.
function clearUserAnnotations(root) {
  if (!root) return;
  let guard = 0;
  let spans = [...root.querySelectorAll('span.hl')].filter(
    s => USER_HL_CLASSES.some(c => s.classList.contains(c)));
  while (spans.length && guard++ < 500) {
    spans.forEach(span => {
      const p = span.parentNode;
      if (!p) return;
      while (span.firstChild) p.insertBefore(span.firstChild, span);
      p.removeChild(span);
    });
    spans = [...root.querySelectorAll('span.hl')].filter(
      s => USER_HL_CLASSES.some(c => s.classList.contains(c)));
  }
  root.normalize();   // stitch the split text nodes back together
}

// Collapse duplicates, and merge touching/overlapping plain highlights of the
// same colour. Notes are never merged — each one carries its own text.
function tidyAnnotations(list) {
  const seen = new Set();
  const uniq = [];
  list.forEach(a => {
    const k = a.s + ':' + a.e + ':' + a.c + ':' + (a.n || '');
    if (seen.has(k)) return;
    seen.add(k);
    uniq.push(a);
  });
  const notes = uniq.filter(a => a.c === 'hl-note');
  const marks = uniq.filter(a => a.c !== 'hl-note').sort((x, y) => x.s - y.s || x.e - y.e);
  const merged = [];
  marks.forEach(a => {
    const last = merged[merged.length - 1];
    if (last && last.c === a.c && a.s <= last.e) last.e = Math.max(last.e, a.e);
    else merged.push({ s: a.s, e: a.e, c: a.c, n: '' });
  });
  // Longest first so wider marks restore before narrower ones nest inside.
  return merged.concat(notes).sort((a, b) => (b.e - b.s) - (a.e - a.s));
}

// Re-derive the stored annotation list from whatever is currently in the DOM.
function syncAnnotations() {
  const root = passageRoot();
  if (!root || state.stage !== 'reading') return;
  const p = state.currentPassage;
  const list = [];
  root.querySelectorAll('span.hl').forEach(span => {
    const cls = USER_HL_CLASSES.find(c => span.classList.contains(c));
    if (!cls) return;                       // skip review-mode explanation spans
    // Nested marks are kept on purpose: re-highlighting part of an existing
    // highlight in another colour is a real thing students do. Restore paints
    // widest-first, so the inner mark ends up on top exactly as drawn.
    const first = annoTextNodes(span)[0];
    if (!first) return;
    const start = offsetOfPoint(root, first, 0);
    if (start < 0) return;
    list.push({ s: start, e: start + span.textContent.length, c: cls,
                n: span.getAttribute('data-note') || '',
                t: span.textContent.slice(0, 90) });
  });
  state.annotations[p] = tidyAnnotations(list);
  saveState();
}

function restoreAnnotations(passageNum) {
  const root = passageRoot();
  if (!root) return;
  const list = (state.annotations && state.annotations[passageNum]) || [];
  clearUserAnnotations(root);          // idempotent: never wrap twice
  if (!list.length) return;
  tidyAnnotations(list).forEach(a => {
    try {
      const range = rangeFromOffsets(root, a.s, a.e);
      if (!range) return;
      const span = document.createElement('span');
      span.className = 'hl ' + a.c;
      if (a.c === 'hl-note') {
        span.setAttribute('data-note', a.n || '');
        span.setAttribute('title', a.n || 'Empty note — click to edit');
        span.onclick = function(ev) { ExamApp.openNote(this, ev); };
      }
      try {
        range.surroundContents(span);
      } catch (e) {
        wrapRangeSegments(range, a.c, a.n);
      }
    } catch (e) { /* a single unrestorable mark must never break the render */ }
  });
}

function applyHighlight(colorClass) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  try {
    const span = document.createElement('span');
    span.className = 'hl ' + colorClass;
    range.surroundContents(span);
  } catch(e) {
    // Selection spans element boundaries — wrap each text node separately.
    try { wrapRangeSegments(range, colorClass, ''); }
    catch(e2) { toast('Could not highlight that selection', 'error'); }
  }
  sel.removeAllRanges();
  const popup = document.getElementById('hl-popup');
  if (popup) popup.classList.remove('show');
  syncAnnotations();
}

function clearHighlight() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  
  const range = sel.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const parentElement = container.nodeType === 1 ? container : container.parentNode;
  
  const highlights = parentElement.querySelectorAll ? parentElement.querySelectorAll('.hl') : [];
  highlights.forEach(hl => {
    if (sel.containsNode(hl, true)) {
      const p = hl.parentNode;
      while (hl.firstChild) p.insertBefore(hl.firstChild, hl);
      p.removeChild(hl);
    }
  });

  let node = sel.anchorNode;
  while (node && node !== document.body) {
    if (node.nodeType === 1 && node.classList.contains('hl')) {
      const p = node.parentNode;
      while (node.firstChild) p.insertBefore(node.firstChild, node);
      p.removeChild(node);
      break;
    }
    node = node.parentNode;
  }
  
  sel.removeAllRanges();
  const popup = document.getElementById('hl-popup');
  if (popup) popup.classList.remove('show');
  syncAnnotations();
}

function setupHighlighter() {
  const popup = document.getElementById('hl-popup');
  if (!popup) return;

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) {
      popup.classList.remove('show');
    }
  });

  document.addEventListener('mouseup', (e) => {
    // ONLY allow highlighter during the active test. Disable in Review Mode.
    if (state.stage !== 'reading' || document.body.classList.contains('review-mode')) {
        return;
    }

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel.rangeCount || sel.isCollapsed) return;
      
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // The official adder carries only Note and Highlight. Clear is ours, and
      // it is revealed only when the selection already lies on a highlight —
      // otherwise the resting toolbar is wider than the real one.
      let onHl = false;
      try {
        const n = range.commonAncestorContainer;
        const el = n.nodeType === 1 ? n : n.parentElement;
        onHl = !!(el && el.closest('span.hl'));
        if (!onHl) {
          const scope = (n.nodeType === 1 ? n : n.parentElement);
          if (scope && scope.querySelectorAll) {
            onHl = [...scope.querySelectorAll('span.hl')].some(h => sel.containsNode(h, true));
          }
        }
      } catch (e) { onHl = false; }
      popup.classList.toggle('has-hl', onHl);

      popup.style.top = (rect.bottom + window.scrollY) + 'px';
      popup.style.left = (rect.left + window.scrollX + (rect.width / 2)) + 'px';
      popup.classList.add('show');
    }, 10);
  });
}

// ====================================================================
// FLOW CONTROL
// ====================================================================

function validateStart() {
  const nameEl = document.getElementById('start-name');
  const field  = document.getElementById('start-field');
  const hint   = document.getElementById('start-hint-text');
  /* The entry screen no longer asks for a name; it is only checked if a name field is present. */
  const name   = nameEl ? nameEl.value.trim() : (state.student.name || '');
  if (nameEl && name.length < 2) {
    // A designed inline error rather than a toast: the fault is in the field,
    // so the correction belongs beside the field.
    if (field) { field.classList.remove('is-invalid'); void field.offsetWidth; field.classList.add('is-invalid'); }
    if (hint) hint.textContent = 'Please type your full name.';
    nameEl.focus();
    return;
  }
  if (field) field.classList.remove('is-invalid');
  if (hint) hint.textContent = '';

  state.student.name = name;
  saveState();
  updateHeaderName(name);
  // The briefing greets the candidate by first name — the one place in the
  // whole shell where the product speaks to a person rather than a user.
  const greet = document.getElementById('intro-greet');
  if (greet) {
    const first = name.split(/\s+/)[0];
    greet.textContent = first.length <= 18
      ? 'Ready when you are, ' + first + '.'
      : 'Ready when you are.';
  }
  beginExam();
}

function beginExam() {
  state.startedAt = new Date().toISOString();
  saveState();

  const p = enterFullscreen();
  const advance = () => {
    document.body.classList.add('no-select');
    // The briefing stage was removed from this build, so the login card hands
    // straight over to the paper. beginReading() is what renders it, starts
    // the 60-minute clock and installs the resizer.
    beginReading();
  };
  
  if (p && typeof p.finally === 'function') {
    p.finally(advance);
  } else {
    advance();
  }
}

function beginReading() {
  state.finishing = false;
  // Curtain: fade the particle layer out and drop the briefing card BEFORE the
  // stage swap, so the plain-white Arial exam never inherits a frame of the
  // shell. Without it the two screens cross-dissolve into each other and the
  // boundary the whole design rests on is visibly broken for ~240ms.
  if (window.CDIAtmosphere && window.CDIAtmosphere.dim) window.CDIAtmosphere.dim();
  document.body.classList.add('cdi-exit');
  const go = () => {
    goToStage('reading');
    renderReading();
    startTimer('reading', () => {
      toast('Reading time is up — exam complete', 'success');
      finishExam();
    });
    setupResizer();
    /* goToStage() above has NOT swapped yet — it cross-fades the outgoing
       stage for 240ms first. Dropping the curtain here re-lit the field for
       exactly that long. It comes down once the exam is actually on screen. */
    setTimeout(function () { document.body.classList.remove('cdi-exit'); }, 240);
  };
  if (window.__cdiReduced) go(); else setTimeout(go, 260);
}

function confirmSubmit(btn) {
  // Real-exam ✓ icon button: confirm via colour + toast (keeps the two-step safety)
  if (btn && btn.id === 'sub-btn') {
    if (!btn.dataset.confirm) {
      btn.dataset.confirm = '1';
      btn.classList.add('sub-armed');
      toast('Press \u2713 once more to submit \u2014 this cannot be undone', 'warn');
      setTimeout(() => {
        btn.dataset.confirm = '';
        btn.classList.remove('sub-armed');
      }, 3000);
      return;
    }
    finishExam();
    return;
  }
  if (btn && !btn.dataset.confirm) {
    btn.dataset.confirm = '1';
    btn.textContent = 'Click again to submit';
    btn.style.color = 'var(--crimson)';
    btn.style.borderColor = 'var(--crimson)';
    setTimeout(() => {
      btn.dataset.confirm = '';
      btn.textContent = 'Submit & finish';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 3000);
    return;
  }
  finishExam();
}

function backToResults() {
  openResultsModal();
}

function finishExam() {
  pauseTimer();
  state.finishedAt = new Date().toISOString();
  // Submitting leaves full-screen on purpose. The fullscreen-change handler
  // fires before goToStage('completion') has run — and goToStage only assigns
  // state.stage inside its deferred cross-fade settle() — so the anti-cheat
  // still saw stage 'reading' and charged the student a strike for their own
  // submit. Flag the deliberate exit; recordViolation() honours it.
  state.finishing = true;
  saveState();
  document.body.classList.remove('no-select');
  exitFullscreen();
  // The reference paper has no interstitial: submitting shows the report.
  openResultsModal();
}

function unlockResults() {
  openResultsModal();
}

function resetExam() {
  // No confirm(): a native browser dialog is the one place the wrapper used to
  // drop out of its own design language, and this button only exists on the
  // results screen, where the attempt is already over and already scored.
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  window.__cdiIntentionalReload = true;
  location.reload();
}

// Contrast on the official Options page is Black on white / White on black /
// Yellow on black; those three rows drive the light / dark / sepia themes this
// file already ships, so the tick has to follow whichever way the theme changed.
const THEME_TO_CONTRAST = { light:'bw', dark:'wb', sepia:'yb' };
function setTheme(name) {
  document.body.classList.remove('dark-mode','theme-sepia');
  if (name === 'dark') document.body.classList.add('dark-mode');
  else if (name === 'sepia') document.body.classList.add('theme-sepia');
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === name));
  const val = THEME_TO_CONTRAST[name] || 'bw';
  document.querySelectorAll('#stage-reading .ex-contrast-opt').forEach(b =>
    b.classList.toggle('is-on', b.getAttribute('data-val') === val));
  localStorage.setItem('cdi_reading_theme', name);
}

// The official Text size page offers Regular / Large / Extra large, which the
// player renders as 16 / 19.2 / 22.4px. --text-zoom is an additive offset, so
// those are +0 / +3.2 / +6.4. A numeric argument still steps as before.
const TEXT_SIZE_ZOOM = { regular:0, large:3.2, xlarge:6.4 };
let currentTextZoom = 0;
function zoomText(step) {
  if (typeof step === 'string') {
    currentTextZoom = TEXT_SIZE_ZOOM[step] || 0;
  } else {
    currentTextZoom += step;
    if (currentTextZoom < -3) currentTextZoom = -3;
    if (currentTextZoom > 8) currentTextZoom = 8;
  }
  document.documentElement.style.setProperty('--text-zoom', currentTextZoom + 'px');
}

// ====================================================================
// RESULTS COMPUTATION
// ====================================================================

function checkAnswerMatch(given, correct) {
  if (!given) return false;
  const givenStr = given.toString().trim().toLowerCase();
  const correctArr = correct.toString().toLowerCase().split('|');
  return correctArr.includes(givenStr);
}

function bandFor(score) {
  /* One passage is marked on its own, so the raw mark is first scaled onto the
     40-question table. */
  score = Math.round(score / QTOTAL * 40);
  /* The conversion table supplied for these papers, 40 questions. */
  if (score >= 40) return 9.0;
  if (score >= 38) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 33) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 27) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 20) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 14) return 4.5;
  if (score >= 12) return 4.0;
  if (score >= 10) return 3.5;
  if (score >= 8)  return 3.0;
  if (score >   0) return 2.5;
  return 0;
}

// V3 — why a mark was actually lost.
// A student self-marking a completion answer sees red and concludes "my reading
// is bad", when a large share of those losses are a missing plural or one wrong
// letter on an answer they located correctly. Naming the cause changes what
// they do next: one of these is fixed in an evening, the other takes months.
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({length: n + 1}, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// Only completion-style answers can have a "near miss". Letters, TRUE/FALSE and
// roman numerals are either right or wrong — a typo there is not a spelling slip.
function isOpenAnswer(correct) {
  const c = String(correct || '').trim();
  if (!c || c.length < 3) return false;
  if (/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(c)) return false;
  if (/^[A-J]$/i.test(c)) return false;
  if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv)$/i.test(c)) return false;
  return /[a-z]/i.test(c);
}

// One place to name a loss cause, so a new cause never renders as the wrong
// label in the answer table (the old code hardcoded plural-or-spelling).
const CAUSE_LABEL = { plural:'plural', spelling:'spelling', limit:'over limit' };

// V3 — the word limit is authored per section and already enforced visually
// while typing (onReadingInput paints an amber border). It was never checked
// at grading time, so "the 29 centimeters" for a ONE WORD answer scored zero
// with no explanation. Over-limit is a rule slip, not a comprehension failure.
function classifyMiss(given, correct, limit) {
  const g = String(given || '').trim().toLowerCase();
  if (!g) return null;
  if (limit && g.split(/\s+/).filter(Boolean).length > limit) return 'limit';
  const variants = String(correct || '').toLowerCase().split('|').map(s => s.trim());
  for (const c of variants) {
    if (!c || g === c) continue;
    // singular/plural only — not any trailing letter
    if (g === c + 's' || c === g + 's' || g === c + 'es' || c === g + 'es') return 'plural';
    const d = levenshtein(g, c);
    if (d > 0 && d <= 2 && c.length >= 4 && Math.abs(g.length - c.length) <= 2) return 'spelling';
  }
  return null;
}

function gradeReading() {
  let score = 0;
  const detail = [];
  const map = {};
  [1,2,3].forEach(p => (SECTIONS[p]||[]).forEach(sec => (sec.items||[]).forEach(it => { map[it.id] = it.answer; })));

  for (let i = 1; i <= 40; i++) {
    const correct = map[i];
    if (correct === undefined) continue;
    const given = (state.readingAnswers[i] || '').toString().trim();
    let isCorrect = false;
    if (typeof correct === 'string' && correct.length > 2 && !/^(TRUE|FALSE|YES|NO|NOT GIVEN)$/i.test(correct) && !correct.includes('|')) {
      isCorrect = given.toUpperCase() === correct.toUpperCase();
    } else {
      isCorrect = checkAnswerMatch(given, correct);
    }
    if (isCorrect) score++;

    let status = 'skipped';
    if(given) {
       status = isCorrect ? 'correct' : 'wrong';
    }

    // V3 — carry the section through. Without `type` here nothing downstream
    // can express a per-type accuracy or a False-vs-Not-Given confusion rate,
    // which is what the highest-error question type actually needs.
    const sec = sectionOf(i) || {};
    let cause = null;
    if (status === 'wrong' && isOpenAnswer(correct)) cause = classifyMiss(given, correct, sec.wordLimit);
    state.answerCauses[i] = cause;
    // `passage` is the only field added to a row. Everything the review screen
    // already reads — id, ua, ca, status, cause, type, secs — is untouched.
    detail.push({ id: i, ua: given, ca: correct ? correct : '', status: status,
                  cause: cause, type: sec.type || null,
                  passage: passageOf(i),
                  secs: state.timePerQuestion[i] || 0 });
  }

  // ── V3 / R3 — the shape grew, it never changed. `score`, `total` and
  // `detail` are exactly what they were; `counts`, `byPassage` and `band` are
  // additions the certificate and the printed report need, and any caller
  // that ignores them behaves as before.
  const counts = {
    correct: detail.filter(q => q.status === 'correct').length,
    wrong:   detail.filter(q => q.status === 'wrong').length,
    skipped: detail.filter(q => q.status === 'skipped').length
  };
  const byPassage = [1,2,3].map(p => {
    const rows = detail.filter(q => q.passage === p);
    const ids  = rows.map(q => q.id);
    return {
      passage: p,
      total:   rows.length,
      correct: rows.filter(q => q.status === 'correct').length,
      wrong:   rows.filter(q => q.status === 'wrong').length,
      skipped: rows.filter(q => q.status === 'skipped').length,
      first:   ids.length ? Math.min.apply(null, ids) : 0,
      last:    ids.length ? Math.max.apply(null, ids) : 0,
      secs:    (state.passageTimes && state.passageTimes[p]) || 0
    };
  }).filter(x => x.total > 0);

  return { score, total: QTOTAL, detail, counts, byPassage, band: bandFor(score) };
}

/* ── Band vocabulary ───────────────────────────────────────────
   Ported verbatim from the Writing engine so a Reading report and a Writing
   report describe the same band in the same words. */
function bandLabel(b) {
  if (b >= 8.5) return 'Expert user';
  if (b >= 7.5) return 'Very good user';
  if (b >= 6.5) return 'Good user';
  if (b >= 5.5) return 'Competent user';
  if (b >= 4.5) return 'Modest user';
  if (b > 0)    return 'Limited user';
  return 'No score';
}
/* Chrome tier for the whole document, driven by the overall band only. */
function bandTier(b) {
  if (b >= 8) return 'high';
  if (b >= 7) return 'good';
  if (b >= 5.5) return 'mid';
  return 'low';
}
/* Score colour ramp. Deliberately calm: a weak band is graphite, never red —
   the certificate reports, it does not scold. The --cv-* tokens are defined on
   #stage-results .cert and on #print-report, so the same call works in both. */
function bandColorVar(b) {
  if (b >= 7)   return 'var(--cv-strong,#1f7a43)';
  if (b >= 5.5) return 'var(--cv-mid,#a97f34)';
  if (b > 0)    return 'var(--cv-low,#78818f)';
  return 'var(--cv-none,#b3ada4)';
}
/* Council-of-Europe equivalence — the thing a university admissions page
   actually quotes back at the candidate. */
function cefrOf(b) {
  if (b >= 8.5) return 'C2';
  if (b >= 7.0) return 'C1';
  if (b >= 5.5) return 'B2';
  if (b >= 4.0) return 'B1';
  if (b > 0)    return 'A2';
  return '—';
}
/* The official IELTS band description for the awarded level. Public wording,
   not personalised feedback. */
function bandDescriptor(b) {
  if (b >= 8.5) return { n: 'Expert user', t: 'Has fully operational command of the language: appropriate, accurate and fluent, with complete understanding.' };
  if (b >= 7.5) return { n: 'Very good user', t: 'Has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriacies. Handles complex, detailed argumentation well.' };
  if (b >= 6.5) return { n: 'Good user', t: 'Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations. Generally handles complex language well.' };
  if (b >= 5.5) return { n: 'Competent user', t: 'Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings. Can use fairly complex language, particularly in familiar situations.' };
  if (b >= 4.5) return { n: 'Modest user', t: 'Has partial command of the language and copes with overall meaning in most situations, though is likely to make many mistakes. Should be able to handle basic communication in their own field.' };
  if (b > 0)    return { n: 'Limited user', t: 'Basic competence is limited to familiar situations. Has frequent problems in understanding and expression, and is not yet able to use complex language.' };
  return { n: 'No score', t: 'No assessable response was submitted, so no band could be awarded for this attempt.' };
}
function bandDescHeading(b, screen) {
  if (b <= 0) return 'No band was awarded';
  return screen ? 'What Band ' + b.toFixed(1) + ' means · ' + bandDescriptor(b).n
                : 'Band ' + b.toFixed(1) + ' · ' + bandDescriptor(b).n;
}
/* What the band actually buys the candidate — the one honest sentence that
   keeps a 5.5 from feeling like a dead end and an 8.5 from feeling flat. */
const BAND_TARGETS = [
  { b: 5.5, why: 'the usual floor for foundation and pathway courses' },
  { b: 6.0, why: 'the common entry point for undergraduate study' },
  { b: 6.5, why: 'the level most undergraduate programmes ask for' },
  { b: 7.0, why: 'the level most postgraduate programmes ask for' },
  { b: 7.5, why: 'the level competitive courses and many visa routes ask for' },
  { b: 8.0, why: 'the level asked for by medicine, law and permanent-residency routes' }
];
/* Reading is the one paper where the next band has a price in marks, and that
   is a far more useful sentence than "keep practising". */
function marksForBand(target) {
  for (let raw = 0; raw <= QTOTAL; raw++) if (bandFor(raw) >= target) return raw;
  return QTOTAL;
}
function bandMilestone(overall, raw) {
  if (overall <= 0) return 'No answers were submitted, so no band could be awarded.';
  const next = BAND_TARGETS.find(t => t.b > overall + 0.001);
  if (!next) return '<b>Band ' + overall.toFixed(1) + '</b> sits at or above what virtually every university and visa route requires.';
  const need = marksForBand(next.b) - raw;
  const marks = need > 0 ? '<b>' + need + ' more mark' + (need > 1 ? 's' : '') + '</b>' : '<b>' + (next.b - overall).toFixed(1) + ' to go</b>';
  return marks + ' to Band ' + next.b.toFixed(1) + ' — ' + next.why + '.';
}

/* ── Document furniture ────────────────────────────────────── */
const CERT_TEST_NO = (String(STORAGE_KEY).match(/(\d+)\s*$/) || [0,'1'])[1].replace(/^0+/, '') || '1';
function certReduced() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
function certLogoSrc() { const i = document.querySelector('.brand-logo, .reg-mark, .brand-ref'); return (i && i.getAttribute('src')) || ''; }
function certDate() { return state.startedAt ? new Date(state.startedAt) : new Date(); }
function certDateStr(d) { try { return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }); } catch (e) { return ''; } }
function certTestName() { return 'Full Reading Test ' + CERT_TEST_NO; }
/* A stable-looking reference number. Purely cosmetic, but it is what makes a
   sheet of paper read as a record rather than a screenshot. */
function certId(name, d) {
  const src = (name || 'candidate') + '|' + d.toDateString() + '|' + CERT_TEST_NO;
  let h = 2166136261;
  for (let i = 0; i < src.length; i++) { h ^= src.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const ini = ((name || '').trim().split(/\s+/).map(w => w[0]).join('') || 'C').toUpperCase().slice(0, 2).padEnd(2, 'X');
  const ymd = String(d.getFullYear()) + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  return 'RCDI-' + CERT_TEST_NO + '-' + ymd + '-' + ini + (h % 9000 + 1000);
}
function certMinSec(secs) {
  secs = Math.max(0, Math.round(secs || 0));
  return Math.floor(secs/60) + 'm ' + String(secs % 60).padStart(2,'0') + 's';
}
/* A passage mark converted to the band it would be worth over a whole paper.
   Scaling to 40 is the only honest way to put a 9-out-of-13 on the 0–9 scale,
   and the legend says so rather than letting the number imply more. */
function passageBand(p) { return p.total ? bandFor(Math.round(p.correct / p.total * QTOTAL)) : 0; }

/* Which passage is the candidate's best, and which one is costing them most.
   Judged on accuracy, so a 14-question passage is not flagged simply for
   holding more questions. Returns [] when the profile is flat — a level
   profile has no headline. */
function passageTags(rows) {
  const acc = r => r.total ? r.correct / r.total : 0;
  const out = rows.map(() => '');
  if (!rows.length || !rows.some(r => r.correct > 0)) return out;
  let hi = 0, lo = 0;
  rows.forEach((r, i) => { if (acc(r) > acc(rows[hi])) hi = i; if (acc(r) < acc(rows[lo])) lo = i; });
  if (hi === lo || acc(rows[hi]) - acc(rows[lo]) < 0.001) return out;
  out[hi] = '<span class="cc-tag best">Strongest</span>';
  out[lo] = '<span class="cc-tag focus">Focus</span>';
  return out;
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric'});
  } catch(e) { return iso; }
}

/* One half of the forty rows. The row keeps every data- attribute the filter
   chips read, and the cause tag, the seconds and the trap note that make this
   table worth reading at all. */
function renderCol(qs) {
  return `
    <table class="answer-table">
      <thead><tr><th>#</th><th>Your answer</th><th>Key</th><th></th></tr></thead>
      <tbody>${qs.map((q,i)=>`
        <tr class="${i%2===1?'alt':''}" data-st="${q.status}" data-slip="${q.cause?1:0}" data-slow="${(q.secs||0)>90?1:0}">
          <td class="td-num">${q.id}${q.secs?`<span class="td-secs${q.secs>90?' slow':''}">${q.secs>=60?Math.floor(q.secs/60)+'m'+(q.secs%60?(q.secs%60)+'s':''):q.secs+'s'}</span>`:''}</td>
          <td class="td-user ${q.status==='wrong'?'wrong':''}">${q.ua?escapeHtml(q.ua):'<span class="empty">not answered</span>'}${q.cause?`<span class="cause-tag ${q.cause}">${CAUSE_LABEL[q.cause]||q.cause}</span>`:''}</td>
          <td class="td-correct">${q.status!=='correct'?escapeHtml(q.ca.replace(/\|/g,' / ')):'<span class="dash">—</span>'}</td>
          <td class="td-status ${q.status}">${q.status==='correct'?'✓':q.status==='wrong'?'✗':'—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

// V3 — band trend across every V3 reading test, not just this one.
/* ── Where the marks went ──/* ── Where the marks went ──────────────────────────────────────
   The one diagnosis Reading can make that Writing cannot. A mark lost to a
   plural, a spelling or a word-limit breach is a proofreading problem; a mark
   lost to a misread is a comprehension problem; a blank is a clock problem.
   Shared by the screen certificate and the printed report so the two can
   never disagree about what happened. */
function lossAnalysis(qs) {
  const missed   = qs.filter(q => q.status === 'wrong');
  const blank    = qs.filter(q => q.status === 'skipped');
  const plural   = missed.filter(q => q.cause === 'plural').length;
  const spelling = missed.filter(q => q.cause === 'spelling').length;
  const limitOv  = missed.filter(q => q.cause === 'limit').length;
  const fixable  = plural + spelling + limitOv;
  const real     = missed.length - fixable;
  const lost     = missed.length + blank.length;
  let lead;
  if (!lost) lead = 'Every one of the forty marks was scored. There is nothing to diagnose on this paper.';
  else if (blank.length && missed.length)
    lead = 'You lost ' + lost + ' marks — ' + blank.length + ' left blank, ' + missed.length + ' answered wrong.';
  else if (blank.length)
    lead = 'You lost ' + lost + ' mark' + (lost>1?'s':'') + ', every one of them left blank. That is a clock problem, not a reading one.';
  else if (fixable)
    lead = 'You lost ' + lost + ' mark' + (lost>1?'s':'') + ' — but ' + fixable + ' of them ' + (fixable>1?'were':'was') + ' a slip, not a misread.';
  else
    lead = 'You lost ' + lost + ' mark' + (lost>1?'s':'') + ', and all of them were genuine misreads.';
  const notes = [];
  if (fixable) notes.push('You found the right place in the passage on ' + fixable + ' of these — the answer just did not come out of your pen the way the key wanted it. That is proofreading, and it is the cheapest band you will ever gain.');
  if (blank.length >= 5) notes.push(blank.length + ' blanks is the single biggest thing standing between you and a higher band. A guess costs nothing in IELTS Reading — there is no penalty for a wrong answer, so never leave one empty.');
  return { missed:missed.length, blank:blank.length, plural, spelling, limitOv, fixable, real, lost, lead, notes };
}

/* ── The certificate ─────────────────────────────────────────── */
function renderResults() {
  /* "Exam Results" screen — header, grey title bar, then band score,
     incorrect questions, mistakes by passage and mistakes by question type,
     with Report Issue / Review Mistakes / Finish underneath. Unanswered
     questions count as incorrect, exactly as on the real answer sheet. */
  const rd   = gradeReading();
  const band = bandFor(rd.score);
  const qs   = rd.detail;
  const tot  = qs.length || QTOTAL;
  const nC   = rd.counts.correct;
  const pct  = Math.round(nC / tot * 100);
  const bad  = qs.filter(q => q.status !== 'correct');

  const TYPE_LABELS = {
    'tfng':'True False Not Given', 'ynng':'Yes No Not Given',
    'mcq':'Multiple Choice', 'mcq-multi':'Multiple Choice (Choose Two)',
    'matching-headings':'Matching Headings', 'matching-info':'Matching Information',
    'matching-features':'Matching Features', 'sentence-endings':'Sentence Endings',
    'notes':'Notes Completion', 'summary':'Summary Completion',
    'table':'Table Completion', 'short-answer':'Short Answer'
  };
  const typeLabel = t => TYPE_LABELS[t] || String(t || 'Other')
    .replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const mistakes = n => '<span class="rx-n' + (n ? '' : ' is-zero') + '">' + n + '</span> ' + (n === 1 ? 'mistake' : 'mistakes');

  /* header: same logo, same passage title, same clock the student just left */
  const logoEl  = document.querySelector('#hdr .ex-logo');
  const titleEl = document.getElementById('hdr-title');
  const timeEl  = document.getElementById('timer-text');
  const title   = titleEl ? titleEl.textContent.trim() : 'Reading Test';
  const remain  = timeEl ? timeEl.textContent.trim() : '';

  /* incorrect questions */
  const chips = bad.length
    ? bad.map(q => '<button type="button" class="rx-chip" onclick="ExamApp.reviewQuestion(' + q.id + ')">Question ' + q.id + '</button>').join('')
    : '<p class="rx-perfect">No incorrect questions &mdash; every answer is correct.</p>';

  /* by passage */
  const byP = [1,2,3].map(p => {
    const rows = qs.filter(q => q.passage === p);
    return rows.length ? { p: p, n: rows.filter(q => q.status !== 'correct').length } : null;
  }).filter(Boolean);
  const passRows = byP.map(x =>
    '<div class="rx-row"><span class="rx-row-l">Passage ' + x.p + '</span><span class="rx-row-r">' + mistakes(x.n) + '</span></div>').join('');

  /* by question type */
  const typeMap = {};
  bad.forEach(q => { const k = typeLabel(q.type); typeMap[k] = (typeMap[k] || 0) + 1; });
  const typeList = Object.keys(typeMap).map(k => ({ k: k, n: typeMap[k] })).sort((a, b) => b.n - a.n);
  const typeRows = typeList.length
    ? typeList.map(x => '<div class="rx-row"><span class="rx-row-l">' + escapeHtml(x.k) + '</span><span class="rx-row-r">' + mistakes(x.n) + '</span></div>').join('')
    : '<p class="rx-perfect">No mistakes to analyse.</p>';

  document.getElementById('results-content').innerHTML =
  '<div class="rx-page">' +
    '<div class="rx-top">' +
      '<div class="rx-logo">' + (logoEl ? logoEl.innerHTML : '') + '</div>' +
      '<div class="rx-title">' + escapeHtml(title) + '</div>' +
      '<div class="rx-time">' + escapeHtml(remain) + '</div>' +
    '</div>' +
    '<div class="rx-bar">Exam Results</div>' +
    '<div class="rx-scroll">' +
      '<div class="rx-head"><h1>Exam Results</h1><span class="rx-pill">READING Section</span></div>' +
      '<section class="rx-card rx-band">' +
        '<h2>Your Band Score</h2>' +
        '<div class="rx-band-num">' + (band === 0 ? '0' : band.toFixed(1)) + '</div>' +
        '<div class="rx-band-of">out of 9</div>' +
        '<div class="rx-band-pct">' + pct + '% (' + nC + '/' + tot + ' correct)</div>' +
      '</section>' +
      '<section class="rx-card"><h3>Incorrect Questions</h3><div class="rx-chips">' + chips + '</div></section>' +
      '<section class="rx-card"><h3>Mistakes by Passage</h3><div class="rx-grid">' + passRows + '</div></section>' +
      '<section class="rx-card"><h3>Mistakes by Question Type</h3><div class="rx-list">' + typeRows + '</div></section>' +
      '<div class="rx-actions">' +
        '<button type="button" class="rx-btn" onclick="exReportIssue()">Report Issue</button>' +
        '<button type="button" class="rx-btn" onclick="ExamApp.closeResultsModal()">Review Mistakes</button>' +
        '<button type="button" class="rx-btn rx-primary" onclick="exFinish()">Finish</button>' +
      '</div>' +
    '</div>' +
    '<div class="rx-foot"></div>' +
  '</div>';
}

/* A chip on the results screen: close the report and land on that question
   in review mode (the passage it belongs to is switched in for you). */
function reviewQuestion(qid) {
  closeResultsModal();
  try { jumpToReading(qid); } catch (e) {}
}

/* ── the reveal ─────────────────────────────────────────────────
   The band counts up, the ruler and every bar grow from zero. All of it
   degrades to the finished state instantly when motion is reduced. */
function playCertReveal(root) {
  if (!root) return;
  const reduce = certReduced();
  const num = root.querySelector('.band-num');
  const target = num ? parseFloat(num.getAttribute('data-band')) : NaN;
  const settle = () => {
    root.querySelectorAll('[data-w]').forEach(el => { el.style.width = el.getAttribute('data-w'); });
    const dot = root.querySelector('.band-scale-dot');
    if (dot) dot.style.left = dot.getAttribute('data-left');
    const sc = root.querySelector('.band-scale');
    if (sc) sc.classList.add('on');
  };
  if (reduce) {
    if (num && !isNaN(target)) num.textContent = target.toFixed(1);
    settle();
    return;
  }
  requestAnimationFrame(() => requestAnimationFrame(settle));
  if (!num || isNaN(target)) return;
  num.textContent = '0.0';
  const dur = 1150, t0 = performance.now() + 220;
  const step = now => {
    const t = Math.max(0, Math.min(1, (now - t0) / dur));
    const e = 1 - Math.pow(1 - t, 3);
    num.textContent = (target * e).toFixed(1);
    if (t < 1) requestAnimationFrame(step); else num.textContent = target.toFixed(1);
  };
  requestAnimationFrame(step);
}

// ====================================================================
// PRINTABLE REPORT — exactly two A4 pages:
//   1 · the Test Report Form   2 · the Schedule of Answers (all forty)
// Typeset for A4 in ink, not a screenshot of the dark score panel: the
// screen certificate is never what reaches the paper.
// ====================================================================
function printStylesheet() {
  return '<style>' +
    '#print-report{font-family:var(--cert-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif);color:#151310;' +
      '--cv-strong:#1f7a43;--cv-mid:#a97f34;--cv-low:#78818f;--cv-none:#b3ada4}' +
    '#print-report .print-page{position:relative;padding:0;font-size:10.5pt;line-height:1.5;min-height:265mm;display:flex;flex-direction:column}' +
    '#print-report .pr-rule{height:2.6pt;background:linear-gradient(90deg,#17356a,#2c5fa8 58%,#c9a24f);border-radius:2pt}' +
    '#print-report .pr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12mm;padding:5mm 0 4mm}' +
    '#print-report .pr-brand{display:flex;align-items:center;gap:3mm}' +
    '#print-report .pr-brand img{width:12mm;height:12mm;border-radius:3mm;display:block}' +
    '#print-report .pr-brand-name{font-family:var(--cert-display,inherit);font-weight:700;font-size:13pt;letter-spacing:-.01em;line-height:1.1}' +
    '#print-report .pr-brand-sub{font-size:6.5pt;font-weight:800;letter-spacing:.18em;color:#7b7062;margin-top:1mm}' +
    '#print-report .pr-headr{text-align:right}' +
    '#print-report .pr-kicker{font-size:6.5pt;font-weight:800;letter-spacing:.2em;color:#2c5fa8;text-transform:uppercase}' +
    '#print-report .pr-title{font-family:var(--cert-display,inherit);font-size:19pt;font-weight:700;letter-spacing:-.03em;line-height:1.1;margin-top:1mm}' +
    '#print-report .pr-date{font-size:8pt;color:#7b7062;margin-top:1mm}' +
    '#print-report .pr-id{display:grid;grid-template-columns:repeat(4,1fr);border:0.6pt solid #cdc6bb;border-radius:2mm;overflow:hidden}' +
    '#print-report .pr-id > div{padding:2.6mm 4mm;border-left:0.6pt solid #cdc6bb}' +
    '#print-report .pr-id > div:first-child{border-left:none}' +
    '#print-report .pr-id .l{font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70}' +
    '#print-report .pr-id .v{font-size:10.5pt;font-weight:700;margin-top:1mm;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#print-report .pr-id .v.mod{font-size:9.6pt}' +
    '#print-report .pr-score{display:grid;grid-template-columns:53mm 1fr;gap:0;border:0.6pt solid #cdc6bb;border-top:1.6pt solid #17356a;border-radius:0 0 2mm 2mm;margin-top:5mm;background:#fbfaf7}' +
    '#print-report .pr-band{padding:4mm 4mm 4mm 5mm;border-right:0.6pt solid #cdc6bb;text-align:center}' +
    '#print-report .pr-band-lbl{font-size:6pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#7b7062}' +
    '#print-report .pr-band-num{font-family:var(--cert-display,inherit);font-size:46pt;font-weight:700;line-height:.95;letter-spacing:-.04em;color:#17356a;margin-top:1mm}' +
    '#print-report .pr-band-lvl{font-family:var(--cert-display,inherit);font-size:10.5pt;font-weight:600;margin-top:1.5mm;letter-spacing:-.01em}' +
    '#print-report .pr-band-f{font-size:7pt;color:#7b7062;margin-top:1.5mm;line-height:1.35}' +
    '#print-report .pr-side{padding:4mm 5mm}' +
    '#print-report .pr-scale-cap{font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70;margin-bottom:2mm}' +
    '#print-report .pr-scale{position:relative;height:3.4mm;border:0.6pt solid #cdc6bb;border-radius:99px;background:#f1ece3;overflow:hidden}' +
    '#print-report .pr-scale i{position:absolute;top:0;bottom:0;left:0;background:#2c5fa8;border-radius:99px;display:block}' +
    '#print-report .pr-ticks{display:flex;justify-content:space-between;margin-top:1.2mm}' +
    '#print-report .pr-ticks span{font-size:6pt;color:#9c9284}' +
    '#print-report .pr-ticks span.hit{color:#17356a;font-weight:800}' +
    '#print-report .pr-note-line{font-size:8pt;color:#5a5045;margin-top:2.5mm;line-height:1.45}' +
    '#print-report .pr-tasks{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:3.5mm}' +
    '#print-report .pr-task{border:0.6pt solid #cdc6bb;border-radius:2mm;padding:2.4mm 3mm;background:#fff}' +
    '#print-report .pr-task-top{display:flex;align-items:baseline;justify-content:space-between;gap:2mm}' +
    '#print-report .pr-task-t{font-size:6.5pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#7b7062}' +
    '#print-report .pr-task-b{font-family:var(--cert-display,inherit);font-size:16pt;font-weight:700;line-height:1;letter-spacing:-.03em}' +
    '#print-report .pr-task-w{font-size:7pt;color:#8a7f70;margin-top:1.2mm}' +
    '#print-report .pr-sec{display:flex;align-items:center;gap:3mm;margin:5.6mm 0 3mm;font-size:6.5pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#2c5fa8}' +
    '#print-report .pr-sec::before,#print-report .pr-sec::after{content:"";flex:1;height:0.6pt;background:#ddd6ca}' +
    '#print-report table.pr-crit{width:100%;border-collapse:collapse;border:0.6pt solid #cdc6bb}' +
    '#print-report table.pr-crit th,#print-report table.pr-crit td{border:0.6pt solid #ddd6ca;padding:2.6mm 3.5mm;text-align:left;vertical-align:middle}' +
    '#print-report table.pr-crit thead th{background:#f6f1e8;font-size:6.5pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#5a5045}' +
    '#print-report table.pr-crit thead th b{font-family:var(--cert-display,inherit);font-size:12pt;font-weight:700;letter-spacing:-.03em;float:right;line-height:.9}' +
    '#print-report table.pr-crit td.n{font-size:9.5pt;font-weight:600;color:#3d372e;width:44%}' +
    '#print-report table.pr-crit td.n em{font-style:normal;font-size:7.6pt;color:#8a7f70;margin-left:2mm}' +
    '#print-report table.pr-crit tr.tot td{background:#f9f4ea;font-weight:800}' +
    '#print-report .pr-tag{display:inline-block;margin-left:2.5mm;font-size:5.8pt;font-weight:800;letter-spacing:.12em;' +
      'text-transform:uppercase;padding:0.6mm 1.6mm;border-radius:1mm;vertical-align:middle}' +
    '#print-report .pr-tag.best{color:#1f7a43;background:#e6f1ea}' +
    '#print-report .pr-tag.focus{color:#8f6f2c;background:#f6eeda}' +
    '#print-report table.pr-crit td.v{width:28%}' +
    '#print-report .pr-cellwrap{display:flex;align-items:center;gap:3mm}' +
    '#print-report .pr-bar{flex:1;height:2.2mm;border-radius:99px;background:#ece6db;overflow:hidden;min-width:12mm}' +
    '#print-report .pr-bar i{display:block;height:100%;border-radius:99px}' +
    '#print-report .pr-num{font-family:var(--cert-display,inherit);font-size:11pt;font-weight:700;letter-spacing:-.02em;min-width:11mm;text-align:right}' +
    '#print-report .pr-num small{font-family:inherit;font-size:7.6pt;font-weight:600;color:#8a7f70}' +
    '#print-report .pr-legend{font-size:7.5pt;color:#8a7f70;line-height:1.5;margin-top:2.5mm}' +
    '#print-report .pr-desc{margin-top:4.4mm;border-left:2pt solid #2c5fa8;background:#f8f4ec;border-radius:0 2mm 2mm 0;padding:3mm 4mm}' +
    '#print-report .pr-desc-h{font-family:var(--cert-display,inherit);font-size:9.5pt;font-weight:700;letter-spacing:-.01em;color:#17356a}' +
    '#print-report .pr-desc p{margin:1.4mm 0 0;font-size:8.6pt;line-height:1.5;color:#4a4237}' +
    '#print-report .pr-cause{margin-top:4.4mm;border:0.6pt solid #cdc6bb;border-radius:2mm;padding:3mm 4mm;background:#fff}' +
    '#print-report .pr-cause-lead{font-size:9.5pt;font-weight:600;color:#3d372e;line-height:1.45}' +
    '#print-report .pr-cause-row{display:flex;flex-wrap:wrap;gap:2mm 3mm;margin-top:2.5mm}' +
    '#print-report .pr-cause-row span{font-size:8pt;color:#5a5045;border:0.6pt solid #ddd6ca;border-radius:1.5mm;padding:1mm 2.5mm}' +
    '#print-report .pr-cause-row span b{font-weight:800;color:#17356a}' +
    '#print-report .pr-pace{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:3mm}' +
    '#print-report .pr-pace div{border:0.6pt solid #ddd6ca;border-radius:1.5mm;padding:2mm 2.6mm;font-size:8pt;color:#5a5045}' +
    '#print-report .pr-pace div b{display:block;font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70;margin-bottom:.8mm}' +
    '#print-report .pr-notes{flex:1;display:flex;flex-direction:column;margin-top:6mm;min-height:22mm;' +
      'border:0.6pt solid #cdc6bb;border-radius:2mm;padding:3mm 4mm 2mm}' +
    '#print-report .pr-notes-h{font-size:6.2pt;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#8a7f70;margin-bottom:2mm}' +
    '#print-report .pr-notes-lines{flex:1;min-height:18mm;background-image:repeating-linear-gradient(180deg,transparent 0 7.3mm,#d6cdbd 7.3mm 7.6mm)}' +
    '#print-report .pr-foot{margin-top:auto;display:flex;justify-content:space-between;gap:6mm;padding-top:2.5mm;' +
      'border-top:0.6pt solid #ddd6ca;font-size:6.8pt;color:#8a7f70;letter-spacing:.04em}' +
    /* page 2 — the schedule */
    '#print-report .print-head{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1.2pt solid #17356a;padding-bottom:2mm;margin-bottom:4mm}' +
    '#print-report .print-brand{font-family:var(--cert-display,inherit);font-weight:700;font-size:11pt;color:#17356a;letter-spacing:-.01em}' +
    '#print-report .print-task-tag{font-size:7pt;font-weight:800;text-transform:uppercase;letter-spacing:.18em;color:#7b7062}' +
    '#print-report .pr-scols{display:grid;grid-template-columns:1fr 1fr;gap:0 7mm}' +
    '#print-report table.pr-sched{width:100%;border-collapse:collapse;font-size:8.6pt;font-family:inherit;' +
      'font-style:normal;font-variant:normal;letter-spacing:0}' +
    '#print-report table.pr-sched th{text-align:left;font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;' +
      'font-family:inherit;font-style:normal;color:#8a7f70;border-bottom:0.8pt solid #17356a;padding:0 2mm 1.4mm}' +
    '#print-report table.pr-sched td{padding:1.5mm 2mm;border-bottom:0.4pt solid #e6dfd3;vertical-align:top;line-height:1.3;' +
      'font-family:inherit;font-style:normal;color:#2c261e}' +
    '#print-report table.pr-sched .pr-sn{width:8mm;text-align:right;color:#8a7f70;font-weight:700;font-variant-numeric:tabular-nums}' +
    '#print-report table.pr-sched .pr-sa{width:34%}' +
    '#print-report table.pr-sched td.pr-sk{color:#1f7a43}' +
    '#print-report table.pr-sched .pr-sm{width:9mm;text-align:center;font-weight:700;color:#8a7f70;font-variant-numeric:tabular-nums}' +
    '#print-report table.pr-sched tr.is-wrong .pr-sa{font-style:italic;color:#8f6f2c}' +
    '#print-report table.pr-sched tr.is-blank .pr-sa{color:#b3ada4}' +
    '#print-report table.pr-sched tr.is-right .pr-sm{color:#1f7a43}' +
    '#print-report .pr-pagefoot{margin-top:auto;border-top:0.6pt solid #ddd6ca;padding-top:2.5mm;' +
      'display:flex;justify-content:space-between;gap:6mm;font-size:6.8pt;color:#9c9284;letter-spacing:.04em}' +
    '</style>';
}

function printCertPage(rd, band, d) {
  const qs = rd.detail, tot = qs.length || QTOTAL;
  const nC = rd.counts.correct, nW = rd.counts.wrong, nS = rd.counts.skipped;
  const name = state.student.name || 'Candidate';
  const id   = certId(state.student.name, d);
  const head = '<div class="pr-rule"></div><div class="pr-head">' +
    '<div class="pr-brand"><img src="' + certLogoSrc() + '" alt=""><div>' +
    '<div class="pr-brand-name">READING CDI</div><div class="pr-brand-sub">IELTS ACADEMIC · READING</div></div></div>' +
    '<div class="pr-headr"><div class="pr-kicker">' + escapeHtml(certTestName()) + '</div>' +
    '<div class="pr-title">Test Report Form</div><div class="pr-date">' + certDateStr(d) + '</div></div></div>' +
    '<div class="pr-id">' +
    '<div><div class="l">Candidate</div><div class="v">' + escapeHtml(name) + '</div></div>' +
    '<div><div class="l">Test date</div><div class="v">' + certDateStr(d) + '</div></div>' +
    '<div><div class="l">Module</div><div class="v mod">Academic Reading</div></div>' +
    '<div><div class="l">Report no.</div><div class="v" style="font-size:8.2pt;letter-spacing:.03em;white-space:nowrap">' + id + '</div></div></div>';
  const foot = '<div class="pr-foot"><span>READING CDI · @READING_CDI · practice score, not an official IELTS result</span>' +
    '<span>' + id + '</span></div>';

  const ticks = [0,1,2,3,4,5,6,7,8,9].map(n =>
    '<span class="' + (Math.floor(band) === n && band > 0 ? 'hit' : '') + '">' + n + '</span>').join('');
  const statCard = (t, n) => '<div class="pr-task"><div class="pr-task-top"><span class="pr-task-t">' + t + '</span>' +
    '<span class="pr-task-b">' + n + '</span></div>' +
    '<div class="pr-task-w">' + Math.round(n / tot * 100) + '% of the paper</div></div>';

  const rows = rd.byPassage, tags = passageTags(rows).map(t =>
    t.indexOf('best') > -1 ? '<span class="pr-tag best">Strongest</span>'
      : t.indexOf('focus') > -1 ? '<span class="pr-tag focus">Focus</span>' : '');
  const barCell = (w, col, text) => '<td class="v"><div class="pr-cellwrap"><div class="pr-bar"><i style="width:' + w +
    '%;background:' + col + '"></i></div><span class="pr-num" style="color:' + col + '">' + text + '</span></div></td>';
  const critRows = rows.map((p, i) => {
    const b = passageBand(p), col = bandColorVar(b);
    return '<tr><td class="n">Passage ' + p.passage + '<em>Q' + p.first + '–' + p.last + '</em>' + tags[i] + '</td>' +
      barCell((p.correct / p.total * 100).toFixed(1), col, p.correct + '<small>/' + p.total + '</small>') +
      barCell((b / 9 * 100).toFixed(1), col, b.toFixed(1)) + '</tr>';
  }).join('') +
  '<tr class="tot"><td class="n">Whole paper<em>' + tot + ' questions</em></td>' +
    barCell((nC / tot * 100).toFixed(1), bandColorVar(band), nC + '<small>/' + tot + '</small>') +
    barCell((band / 9 * 100).toFixed(1), bandColorVar(band), band.toFixed(1)) + '</tr>';

  const L = lossAnalysis(qs);
  const causeBits = [
    L.plural   ? '<span><b>' + L.plural   + '</b> singular / plural</span>' : '',
    L.spelling ? '<span><b>' + L.spelling + '</b> spelling slip</span>'     : '',
    L.limitOv  ? '<span><b>' + L.limitOv  + '</b> over the word limit</span>' : '',
    L.real     ? '<span><b>' + L.real     + '</b> comprehension</span>'     : '',
    L.blank    ? '<span><b>' + L.blank    + '</b> left blank</span>'        : ''
  ].join('');
  const pace = rows.map(p => '<div><b>Passage ' + p.passage + '</b>' + certMinSec(p.secs) +
    (p.secs > 20*60 ? ' · over the 20-minute target' : '') + '</div>').join('');

  return '<div class="print-page pr-cert">' + head +
    '<div class="pr-score"><div class="pr-band">' +
    '<div class="pr-band-lbl">Overall band</div><div class="pr-band-num">' + band.toFixed(1) + '</div>' +
    '<div class="pr-band-lvl">' + bandLabel(band) + '</div>' +
    '<div class="pr-band-f" style="margin-top:1mm">CEFR ' + cefrOf(band) + '</div>' +
    '<div class="pr-band-f">' + nC + ' of ' + tot + ' correct, converted on<br>the Academic Reading band table</div></div>' +
    '<div class="pr-side"><div class="pr-scale-cap">Position on the IELTS 0–9 scale</div>' +
    '<div class="pr-scale"><i style="width:' + (band / 9 * 100).toFixed(1) + '%;background:' + bandColorVar(band) + '"></i></div>' +
    '<div class="pr-ticks">' + ticks + '</div>' +
    '<div class="pr-note-line">' + bandMilestone(band, nC).replace(/<\/?b>/g, '') + '</div>' +
    '<div class="pr-tasks">' + statCard('Correct', nC) + statCard('Incorrect', nW) + statCard('Unanswered', nS) + '</div></div></div>' +
    '<div class="pr-desc"><div class="pr-desc-h">' + bandDescHeading(band) + '</div>' +
    '<p>' + bandDescriptor(band).t + '</p></div>' +
    '<div class="pr-notes"><div class="pr-notes-h">Teacher\'s notes</div>' + '<div class="pr-notes-lines"></div></div>' +
    foot + '</div>';
}

/* Page two: the Schedule of Answers, the way an awarding body issues one —
   number, answer given, key, mark. No ticks, no colour blocks: a wrong answer
   is set in italic beside its key, which is the apparatus of a critical
   edition and prints far better than a red cross. */
function printSchedulePage(rd, d) {
  const qs = rd.detail;
  const id = certId(state.student.name, d);
  const markRow = q => {
    const blank = q.status === 'skipped', wrong = q.status === 'wrong';
    const ua = blank ? '&ndash;' : escapeHtml(String(q.ua));
    return '<tr class="' + (wrong ? 'is-wrong' : blank ? 'is-blank' : 'is-right') + '">' +
      '<td class="pr-sn">' + q.id + '</td>' +
      '<td class="pr-sa">' + ua + '</td>' +
      '<td class="pr-sk">' + ((wrong || blank) ? escapeHtml(String(q.ca == null ? '' : q.ca).replace(/\|/g, ' / ')) : '') + '</td>' +
      '<td class="pr-sm">' + (q.status === 'correct' ? '1' : '0') + '</td></tr>';
  };
  const table = rows => '<table class="pr-sched"><thead><tr>' +
    '<th class="pr-sn">No.</th><th class="pr-sa">Answer given</th>' +
    '<th class="pr-sk">Key</th><th class="pr-sm">Mark</th></tr></thead><tbody>' + rows + '</tbody></table>';
  const half = Math.ceil(qs.length / 2);
  return '<div class="print-page">' +
    '<div class="print-head"><span class="print-brand">' + escapeHtml(certTestName()) + '</span>' +
    '<span class="print-task-tag">Schedule of Answers</span></div>' +
    '<div class="pr-scols">' + table(qs.slice(0, half).map(markRow).join('')) +
    table(qs.slice(half).map(markRow).join('')) + '</div>' +
    '<div class="pr-notes"><div class="pr-notes-h">Teacher\'s notes</div><div class="pr-notes-lines"></div></div>' +
    '<div class="pr-pagefoot"><span>' + escapeHtml(state.student.name || 'Candidate') + ' · ' + certDateStr(d) +
    ' · ' + rd.counts.correct + ' of ' + (qs.length || QTOTAL) + '</span>' +
    '<span>Page 2 of 2 · ' + id + '</span></div></div>';
}

function printReportHtml() {
  const rd = gradeReading();
  const band = bandFor(rd.score);
  const d = certDate();
  /* ONE A4 sheet. The report used to carry a second page — the Schedule of
     Answers, all forty rows. The certificate is the thing a student keeps and
     shows, so it is the whole document now; the per-question record still
     lives on the results screen, which is where it is actually read. Listening
     is composed identically, so the two certificates are one artefact in two
     modules. */
  return printStylesheet() + printCertPage(rd, band, d);
}

/* Cmd/Ctrl+P is the other way people print, so the pages are built on demand
   and a browser-initiated print produces the same typeset report as the
   Download Report button. */
function buildPrintReport() {
  const host = document.getElementById('print-report');
  if (!host) return;
  try { host.innerHTML = printReportHtml(); }
  catch (e) { host.innerHTML = ''; return; }
  try { fitPrintPages(host); } catch (e) { /* fitting is an optimisation, never a blocker */ }
}

/* A4 content box: 297mm tall less the 14mm/12mm @page margins. If the schedule
   or the first page runs long, the type is tightened a quarter point at a time
   rather than being allowed to spill onto a third sheet. */
function fitPrintPages(host) {
  host.classList.add('pr-measuring');
  try { measurePrintPages(host); } finally { host.classList.remove('pr-measuring'); }
}
function measurePrintPages(host) {
  const probe = document.createElement('div');
  probe.style.cssText = 'height:100mm;width:1mm;position:absolute;visibility:hidden';
  host.appendChild(probe);
  const pxPerMm = probe.getBoundingClientRect().height / 100;
  probe.remove();
  if (!pxPerMm) return;
  const limit = 265 * pxPerMm;
  host.querySelectorAll('.print-page').forEach(page => {
    if (page.getBoundingClientRect().height <= limit) return;
    /* 1 · the ruled annotation space gives up its height before it gives up
           its existence — a report with nowhere to write on it is worse than
           a short one. */
    const notes = page.querySelector('.pr-notes');
    if (notes) {
      const lines = notes.querySelector('.pr-notes-lines');
      for (const mm of ['16mm','12mm','9mm']) {
        notes.style.minHeight = mm;
        if (lines) lines.style.minHeight = mm;
        if (page.getBoundingClientRect().height <= limit) return;
      }
      notes.remove();
      if (page.getBoundingClientRect().height <= limit) return;
    }
    const tbl = page.querySelectorAll('table.pr-sched, table.pr-crit');
    if (!tbl.length) return;
    for (let pt = 8.6; pt >= 6.2; pt -= 0.25) {
      tbl.forEach(t => { t.style.fontSize = pt.toFixed(2) + 'pt'; });
      if (page.getBoundingClientRect().height <= limit) return;
    }
  });
}
try { window.addEventListener('beforeprint', buildPrintReport); } catch (e) { /* the button still works */ }

/* ── "Save Report as PDF" ─────────────────────────────────────────────────
   The button used to be labelled "Download Report" and call window.print()
   raw, which is a promise the page could not keep: nothing is downloaded, and
   the report was only ever built by the beforeprint listener above — a hook
   Safari fires late and headless Chrome does not fire at all, so the dialog
   could open onto an empty sheet.

   The alternative considered was vendoring html2canvas + jsPDF (they are
   loaded from a CDN at the top of this file, so they are already dead when the
   page runs offline, which is most of the time). It was rejected on the
   artefact, not the file size: that pair can only rasterise the report and
   pdf.addImage() it, which yields a picture of a page — no selectable text, no
   vector rules, and visible softness on any real printer. This file already
   owns a properly typeset A4 report (#print-report, fitted by fitPrintPages),
   and every browser's "Save as PDF" destination turns it into a genuine PDF
   with live text. So: build the report first, then open the dialog, and say
   plainly on the button and in the toast what the next step is. */
/* A4 · the ONE @page rule this file declares is size:A4;margin:14mm 15mm 12mm,
   and PDFX must be told the same box or the report is typeset to one geometry
   and imposed onto another. Listening and Writing use 14mm all round; Reading
   is 15mm on the sides. */
const PDF_PAGE = { w: 210, h: 297, mt: 14, mr: 15, mb: 12, ml: 15 };

/* The downloaded file is named for the certificate it contains: same wording,
   same order — V3-Reading-1-Islom-Kenjayev-20260902. The sitting date is what
   stops a re-sit silently overwriting the first attempt; without it the browser
   just appends "(1)" and the two are no longer tellable apart. */
function reportFileStem() {
  const d = certDate();
  const name = (state.student.name || 'Candidate').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const ymd = String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return 'READING-CDI-' + CERT_TEST_NO + '-' + name + '-' + ymd;
}

/* One click, one file. Until now this test was the only one of the three that
   could not hand the candidate a certificate: its single button opened the
   print dialog and asked them to find "Save as PDF" themselves. PDFX — the
   block inlined above, byte-identical to the copies in Listening and Writing —
   walks the already-typeset #print-report and writes a real vector PDF with
   live text, offline, with no CDN. The print route stays beside it, because a
   real printer still renders sharper than any exporter. */
/* PDFX walks whatever host it is given and treats each .print-page inside it
   as a sheet, so the export can simply be pointed at the real certificate. The
   node is tagged in place rather than cloned: cloning it out of #stage-results
   would stop `#stage-results .cert` matching and strip the whole design. */
function buildCertSheet() {
  var cert = document.querySelector('#results-content .cert');
  if (cert) cert.classList.add('print-page');
}

let pdfBusy = false;
/* The certificate, photographed rather than redrawn. A capture cannot drift
   from the screen the way a second typesetting can — what you see is the file.
   html2canvas + jsPDF are already loaded above, but they come from a CDN, so
   when they are absent (offline) this hands over to the vector exporter. */
function downloadReport() {
  if (pdfBusy) return;
  var cert = document.querySelector('#results-content .cert');
  if (!cert || typeof html2canvas === 'undefined' || !window.jspdf) {
    return downloadReportVector();
  }
  pdfBusy = true;
  var btn = document.getElementById('results-download-btn');
  var was = btn ? btn.textContent : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Building…'; }

  var settled = false;
  var done = function () {
    if (settled) return;
    settled = true;
    pdfBusy = false;
    if (btn) { btn.disabled = false; btn.textContent = was; }
  };

  /* A capture is CPU work with no timeout of its own: on a slow machine, or one
     without hardware acceleration, it can run long enough that the button looks
     dead — and if it never settles, it stays that way for the rest of the
     session. After twenty-five seconds the vector exporter answers instead, so
     the button always comes back and a PDF always arrives. */
  var watchdog = setTimeout(function () {
    if (settled) return;
    done();
    downloadReportVector();
  }, 25000);

  html2canvas(cert, {
    scale: 2,                       /* 2x so the type survives the fit-to-page */
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    /* Two things are skipped outright.
       · the star field: a live canvas behind the sheet, no part of the document
       · the review call-to-action: it is a button, useless on paper — and it is
         also the only thing here styled with color-mix(), which html2canvas
         1.4.1 cannot parse. It throws "unsupported color function" in 50ms and
         takes the whole capture with it. Not cloning it avoids both. */
    /* only the star field is skipped outright — a live canvas behind the
       sheet, no part of the document */
    ignoreElements: function (el) { return el.id === 'cdi-stars-host'; },
    /* html2canvas rasterises a CLONE of the document, and in that clone the
       certificate's entrance keyframes start again from the top. It paints
       immediately, so every part is caught at opacity 0 and the capture comes
       back a blank white sheet — in 50ms, which is the tell. Killing animation
       in the clone leaves every part at its resting state. */
    onclone: function (doc) {
      var st = doc.createElement('style');
      st.textContent =
        /* the entrance keyframes, as above */
        '*,*::before,*::after{animation:none!important;transition:none!important}' +
        /* The band score is gradient-filled text — background-clip:text with a
           transparent colour. html2canvas 1.4.1 cannot clip a background to
           glyphs, so it painted the gradient as a solid block and the number
           itself, being transparent, never appeared: the most important figure
           on the certificate came out a blank rectangle. Flatten it to ink. */
        '#stage-results .band-num{background:none!important;' +
        '-webkit-background-clip:border-box!important;background-clip:border-box!important;' +
        'color:#ffffff!important}' +
        /* The call-to-action is a button — meaningless on paper — and it is the
           only thing here painted with color-mix(). Chrome serialises that to
           `color(srgb …)`, which html2canvas 1.4.1 reports as an unsupported
           colour function and dies on in 50ms. Hiding it is not enough on its
           own, because the computed value is still read; the colours have to be
           overridden too, so nothing in the tree computes to color(srgb …).
           Doing both here also removes its box, which skipping the clone did
           not — that left a dark band above the footer. */
        '.review-cta{display:none!important;background:#ffffff!important;' +
        'border-color:#e6eaf2!important;background-image:none!important}';
      (doc.head || doc.documentElement).appendChild(st);
    }
  }).then(function (canvas) {
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var PW = 210, PH = 297, M = 8;
    var boxW = PW - M * 2, boxH = PH - M * 2;
    /* the sheet is far taller than A4 is, so height is what binds: fit by
       height and centre what is left over horizontally */
    var s = Math.min(boxW / canvas.width, boxH / canvas.height);
    var w = canvas.width * s, h = canvas.height * s;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG',
                 M + (boxW - w) / 2, M + (boxH - h) / 2, w, h);
    var name = reportFileStem();
    if (!/\.pdf$/i.test(name)) name += '.pdf';
    pdf.save(name);
    try { toast('Certificate saved to your downloads.', 'success', 4200); } catch (e) {}
    done();
  }).catch(function () {
    /* a failed capture is not a dead end — the drawn report still works */
    done();
    downloadReportVector();
  });
}

function downloadReportVector() {
  if (pdfBusy) return;
  if (typeof PDFX === 'undefined') { saveReportPdf(); return; }   /* never a dead button */
  pdfBusy = true;
  const btn = document.getElementById('results-download-btn');
  const was = btn ? btn.textContent : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Building…'; }
  PDFX.save({
    hostId: 'results-content',
    page: PDF_PAGE,
    build: buildCertSheet,
    fileName: reportFileStem(),
    meta: { title: 'READING CDI — ' + (state.student.name || 'Candidate'), author: 'READING CDI', subject: 'IELTS Academic Reading · Test Report Form' }
  }).then(function (r) {
    toast('Report saved to your downloads — ' + r.pages.length + ' pages, ' +
          Math.max(1, Math.round(r.bytes / 1024)) + ' KB, with selectable text.', 'success', 5200);
  }).catch(function () {
    toast('Could not build the PDF here — opening the print dialog instead.', 'error', 5000);
    saveReportPdf();
  }).then(function () {
    pdfBusy = false;
    if (btn) { btn.disabled = false; btn.textContent = was; }
  });
}

function saveReportPdf() {
  try { buildPrintReport(); } catch (e) { /* print still shows whatever is there */ }
  try { toast('Choose “Save as PDF” as the destination to keep a copy.', 'info', 5000); } catch (e) {}
  // One frame, so the freshly built report has been laid out before the
  // dialog snapshots the document.
  requestAnimationFrame(() => { try { window.print(); } catch (e) {} });
}

// ====================================================================
// REVIEW MODE
// ====================================================================

// Always-visible correct answer for the currently rendered passage.
// Generic: detects each question's anchor element and reveals the answer
// the same way for every IELTS task type. Source of truth = SECTIONS
// (surfaced via gradeReading().detail). Safe to call repeatedly and per
// passage — missing elements are simply skipped.
function applyReviewReveal() {
  gradeReading().detail.forEach(d => revealOne(d));
}

function ansText(ca) { return escapeHtml(String(ca == null ? '' : ca).replace(/\|/g, ' / ')); }

// One builder for the answer-feedback chip, ported from the Listening engine.
// `ans` must already be escaped by the caller. The badge states the verdict;
// the field beside it holds the CORRECT answer, which is why it stays green
// even on a wrong answer — only the badge turns crimson.
function feedbackHTML(ok, ans) {
  if (ok) return '<span class="fb-badge fb-ok" aria-hidden="true">\u2713</span>';
  return '<span class="fb-badge fb-no" aria-hidden="true">\u2717</span>' +
         '<span class="fb-ans">' + ans + '</span>';
}

function setStatusPill(id, correct, caText) {
  const fb = document.getElementById('rfb-' + id);
  if (!fb) return;
  fb.className = 'feedback-pill show ' + (correct ? 'correct' : 'wrong');
  fb.innerHTML = feedbackHTML(correct, caText);
}

function revealOne(d) {
  const correct = d.status === 'correct';
  const caText = ansText(d.ca);

  // 1) Choose-TWO multi-select (Q21–22): highlight the correct options green,
  //    mark the student's wrong picks red.
  const mg = multiGroupOf(d.id);
  if (mg) {
    const right = document.getElementById('opt-multi-' + mg.gid + '-' + d.ca);
    if (right) {
      right.classList.add('correct');
      const fb = right.querySelector('.feedback-pill');
      if (fb && !fb.classList.contains('show')) { fb.className = 'feedback-pill show correct'; fb.innerHTML = feedbackHTML(true, ''); }
    }
    if (d.status === 'wrong' && d.ua && d.ua !== d.ca) {
      const wrong = document.getElementById('opt-multi-' + mg.gid + '-' + d.ua);
      if (wrong) {
        wrong.classList.add('wrong');
        const fb = wrong.querySelector('.feedback-pill');
        if (fb && !fb.classList.contains('show')) { fb.className = 'feedback-pill show wrong'; fb.innerHTML = feedbackHTML(false, 'Your choice'); }
      }
    }
    return;
  }

  const el = document.getElementById('rq-' + d.id);

  // 2) Text gaps (sentence / notes / summary / table / flow-chart / short-answer / map labels)
  if (el && el.tagName === 'INPUT' && el.type === 'text') {
    el.readOnly = true;
    el.classList.remove('correct', 'incorrect');
    el.classList.add(correct ? 'correct' : 'incorrect');
    setStatusPill(d.id, correct, caText);
    return;
  }

  // 2b) Dropdown <select> (matching features / sentence endings / letter maps)
  if (el && el.tagName === 'SELECT') {
    el.disabled = true;
    el.classList.remove('correct','incorrect');
    el.classList.add(correct ? 'correct' : 'incorrect');
    const sec = sectionOf(d.id);
    const lookup = {};
    ((sec && (sec.people || sec.endings)) || []).forEach(o => { lookup[o.l] = o.name || o.text || ''; });
    const cname = lookup[d.ca] ? (' — ' + lookup[d.ca]) : '';
    setStatusPill(d.id, correct, caText + cname);
    return;
  }

  // 3) Matching info / features → paragraph (drop-zone div, shares id rq-{id})
  if (el && el.classList.contains('drop-zone')) {
    el.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      const ua = d.ua ? `<span class="wd-wrong">${ansText(d.ua)}</span> ` : '';
      el.innerHTML = ua + `<span class="wd-correct">${caText}</span>`;
    }
    setStatusPill(d.id, correct, caText);
    return;
  }

  // 4) Word-bank drag summary (Q37–40 style)
  const wdrop = document.getElementById('wdrop-' + d.id);
  if (wdrop) {
    const correctWord = (bankOf(d.id).find(w => w.id === d.ca) || {}).word || d.ca;
    wdrop.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      const wrongWord = d.ua ? (bankOf(d.id).find(w => w.id === d.ua) || {}).word || d.ua : '';
      const ua = wrongWord ? `<span class="wd-wrong">${escapeHtml(wrongWord)}</span> ` : '';
      wdrop.classList.add('filled');
      wdrop.innerHTML = ua + `<span class="wd-correct">${escapeHtml(correctWord)}</span>`;
    }
    return;
  }

  // 5) Matching headings (passage-pane slot)
  const slot = document.getElementById('hslot-' + d.id);
  if (slot) {
    const p = PASSAGES[String(state.currentPassage)];
    const head = (p && p.headings) ? p.headings.find(h => h.id === d.ca) : null;
    const correctLabel = head ? `${head.id}. ${head.text}` : String(d.ca);
    slot.classList.add('filled', correct ? 'correct' : 'wrong');
    if (correct) {
      const cur = slot.querySelector('.slot-text');
      if (cur && !slot.querySelector('.slot-tick')) cur.insertAdjacentHTML('beforeend', '<span class="slot-tick">✓</span>');
    } else {
      slot.innerHTML = `<span class="slot-correct">✓ ${escapeHtml(correctLabel)}</span>`;
    }
    return;
  }

  // 6a) Grid questions (matching-information / matching-features): the row is
  //     a <tr>, not a .q-card, so mark the key cell green and any wrong pick red.
  const gridRow = document.getElementById('rq-card-' + d.id);
  if (gridRow && gridRow.tagName === 'TR') {
    const want = String(d.ca || '').trim().toUpperCase();
    gridRow.querySelectorAll('.mg-cell').forEach(cell => {
      const ri = cell.querySelector('input[type=radio]');
      if (!ri) return;
      const val = String(ri.value).toUpperCase();
      if (val === want) cell.classList.add('cell-correct');
      else if (ri.checked) cell.classList.add('cell-wrong');
    });
    gridRow.classList.add(correct ? 'row-correct' : 'row-wrong');
    setStatusPill(d.id, correct, caText);
    return;
  }

  // 6) Radio questions (TFNG / Y-N-NG / single MCQ): highlight the correct
  //    option green, mark the student's wrong pick red.
  const card = document.getElementById('rq-card-' + d.id);
  if (card) {
    card.querySelectorAll('.option').forEach(opt => {
      const ri = opt.querySelector('input[type=radio]');
      if (!ri) return;
      if (String(ri.value).toUpperCase() === String(d.ca).toUpperCase()) {
        opt.classList.add('correct');
      } else if (opt.classList.contains('selected')) {
        opt.classList.remove('selected');
        opt.classList.add('wrong');
      }
    });
    setStatusPill(d.id, correct, caText);
  }
}

function reviewExam(then) {
  // Review is the exam screen, unlocked: the same passage beside the same
  // questions the student sat, with every answer revealed in place and an
  // explanation button on each question. It is NOT a separate screen — the
  // whole point is that the student sees what they saw, annotated.
  document.body.classList.add('review-mode');

  /* The double-click dictionary is wired inside loadReadingPassage(), behind
     a review-mode check — and review deliberately does NOT re-render the
     passage, so it was never bound when review was entered from the results
     screen. It only appeared if the student moved to another passage. It is
     idempotent, so binding it here too is safe. */
  try { setupDictionary(state.currentPassage); } catch (e) {}

  // Reveal the correct answer for every question on the currently rendered
  // passage. loadReadingPassage() re-runs this on each passage switch, so the
  // reveal persists as the student navigates P1↔P2↔P3.
  applyReviewReveal();

  setTimeout(() => injectExplanationButtons(), 100);
  setTimeout(fpStart, 120);
  updateReadingNav();
  goToStage('reading', then);
  window.scrollTo(0,0);
}

// ====================================================================
// V3: RESULTS AS A MODAL WINDOW OVER THE PASSAGE
// ====================================================================
// The report used to be its own full-screen stage. It now opens as a card
// floating over the (already-reviewed) passage, Flower Power-style: the
// paper stays mounted and visible behind a dimmed backdrop, and closing the
// card is all it takes to get back to it — no second screen to navigate.
function openResultsModal() {
  renderResults();
  reviewExam(() => {
    const rs = document.getElementById('stage-results');
    if (rs) rs.classList.add('active');
  });
}

function closeResultsModal() {
  const rs = document.getElementById('stage-results');
  if (rs) rs.classList.remove('active');
}

// ====================================================================
// SPLIT PANE RESIZER
// ====================================================================

function setupResizer() {
  const resizer = document.getElementById('resizer');
  const left = document.getElementById('passage-pane');
  const right = document.getElementById('questions-pane');
  if (!resizer || !left || !right) return;
  // The grab target is the 16px transparent .resizeBar to the right of the 2px
  // rule, plus the 36px handle sitting on it — not the 2px rule itself.
  const grab = document.getElementById('resize-bar') || resizer;
  let dragging = false;
  grab.addEventListener('mousedown', (e) => { dragging = true; document.body.style.cursor = 'ew-resize'; e.preventDefault(); });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const main = resizer.parentElement;
    const rect = main.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    if (pct > 20 && pct < 80) {
      left.style.flex = `0 0 ${pct}%`;
      left.style.width = `${pct}%`;
    }
  });
  document.addEventListener('mouseup', () => { dragging = false; document.body.style.cursor = ''; });
}

// ====================================================================
// V3: EXPLANATION BUTTONS injection (review mode)
// ====================================================================

// The button's mark. Was the 💡 emoji, which each OS draws as a different
// picture at a size and colour the page cannot control — next to drawn,
// stroked icons everywhere else, it read as a sticker. One stroke glyph,
// inheriting currentColor so it flips to white when the button fills.
const EXPLAIN_ICON =
  '<svg class="eb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
  '<path d="M9.5 18h5"/><path d="M10.2 21h3.6"/>' +
  '<path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6h5.2c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z"/></svg>';
function explainLabel(text) {
  return EXPLAIN_ICON + '<span class="eb-lb">' + escapeHtml(String(text)) + '</span>';
}

function clearExplainHighlights() {
  document.querySelectorAll('.ep-highlight-src,.syn-hl-applied').forEach(el => {
    const p = el.parentNode; while (el.firstChild) p.insertBefore(el.firstChild, el); p.removeChild(el);
  });
}

function injectExplanationButtons() {
  const qPane = document.getElementById('questions-pane');
  if (!qPane) return;

  // ── Helper: build a shared panel + lightbulb row for grouped questions ──
  function injectGroupRow(container, ids) {
    if (!container || container.querySelector('.explain-trigger-row')) return;
    const sharedPanel = document.createElement('div');
    sharedPanel.className = 'explain-panel';
    const row = document.createElement('div');
    row.className = 'explain-trigger-row';

    ids.forEach(id => {
      const data = READING_EXPLANATIONS[id];
      if (!data) return;
      const btn = document.createElement('button');
      btn.className = 'explain-btn-sm';
      btn.dataset.qid = id;
      btn.innerHTML = explainLabel(id);
      btn.addEventListener('click', () => {
        const already = sharedPanel.classList.contains('show') && sharedPanel.dataset.activeQ == id;
        document.querySelectorAll('.explain-panel.show').forEach(p => p.classList.remove('show'));
        document.querySelectorAll('.explain-btn-sm.open,.explain-btn.open').forEach(b => b.classList.remove('open'));
        clearExplainHighlights();
        if (!already) {
          // Build Synonym Map (paraphrase bridge)
          let bridgeHTML = '';
          if (data.paraphraseMap && data.paraphraseMap.length > 0) {
            const rows = data.paraphraseMap.map(pm =>
              `<div class="pb-row"><span class="pb-q">${pm.q}</span><span class="pb-icon">→</span><span class="pb-p">${pm.p}</span></div>`
            ).join('');
            bridgeHTML = `<div class="pb-header">Synonym Map</div><div class="paraphrase-bridge">${rows}</div>`;
          }
          sharedPanel.dataset.activeQ = id;
          sharedPanel.innerHTML = `<div class="ep-title">Q${id} — Why this answer?</div><div class="ep-text">${data.explanation}</div>${bridgeHTML}`;
          sharedPanel.classList.add('show');
          btn.classList.add('open');
          if (data.highlights?.length) highlightPassagePhrases(data.highlights);
          // Highlight BOTH sides of each paraphrase pair. The question side was
          // missing here, so grouped types (summary completion, notes, table)
          // only ever lit up the passage — half the point of a synonym map.
          // `container` is the whole q-card; the matcher already skips
          // .explain-panel, so the panel's own copy of the text is not hit.
          if (data.paraphraseMap?.length) {
            data.paraphraseMap.forEach((mapObj, idx) => {
              const cc = `syn-hl-${(idx%4)+1}`;
              if (container && mapObj.q) highlightNodeText(container, mapObj.q, cc);
              if (mapObj.p) highlightNodeText(document.querySelector('#passage-pane .passage-text'), mapObj.p, cc);
            });
          } else if (data.synonyms?.length) {
            data.synonyms.forEach((pair, idx) => {
              const cc = `syn-hl-${(idx%4)+1}`;
              if (container && pair[0]) highlightNodeText(container, pair[0], cc);
              if (pair[1]) highlightNodeText(document.querySelector('#passage-pane .passage-text'), pair[1], cc);
            });
          }
          setTimeout(() => {
            const h = document.querySelector('.ep-highlight-src,.syn-hl-applied');
            if (h) h.scrollIntoView({ behavior:'smooth', block:'center' });
          }, 50);
        }
      });
      row.appendChild(btn);
    });

    container.appendChild(row);
    container.appendChild(sharedPanel);
  }

  // ── Helper: build a standard full-text button for a single q-card ──
  function injectFullBtn(card, numId, labelOverride) {
    if (!card || card.querySelector(`.explain-btn[data-qid="${numId}"]`)) return;
    const data = READING_EXPLANATIONS[numId]; if (!data) return;
    const btn = document.createElement('button');
    btn.className = 'explain-btn';
    btn.dataset.qid = numId;
    btn.innerHTML = explainLabel(labelOverride || 'Explanation');
    const panel = document.createElement('div');
    panel.className = 'explain-panel';
    // Build Synonym Map (paraphrase bridge)
    let bridgeHTML = '';
    if (data.paraphraseMap && data.paraphraseMap.length > 0) {
      const rows = data.paraphraseMap.map(pm =>
        `<div class="pb-row"><span class="pb-q">${pm.q}</span><span class="pb-icon">→</span><span class="pb-p">${pm.p}</span></div>`
      ).join('');
      bridgeHTML = `<div class="pb-header">Synonym Map</div><div class="paraphrase-bridge">${rows}</div>`;
    }
    panel.innerHTML = `<div class="ep-title">Q${labelOverride || numId} — Why this answer?</div><div class="ep-text">${data.explanation}</div>${bridgeHTML}`;
    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('show');
      document.querySelectorAll('.explain-panel.show').forEach(p => p.classList.remove('show'));
      document.querySelectorAll('.explain-btn.open,.explain-btn-sm.open').forEach(b => b.classList.remove('open'));
      clearExplainHighlights();
      if (!isOpen) {
        panel.classList.add('show'); btn.classList.add('open');
        if (data.highlights?.length) highlightPassagePhrases(data.highlights);
        if (data.paraphraseMap?.length) {
          // grid rows (matching features / information) are <tr> with .mg-label,
          // not .q-text — fall back to the row so the question side still lights up
          const qTextEl = card.querySelector('.q-text') || card;
          data.paraphraseMap.forEach((mapObj, idx) => {
            const cc = `syn-hl-${(idx%4)+1}`;
            if (qTextEl && mapObj.q) highlightNodeText(qTextEl, mapObj.q, cc);
            if (mapObj.p) highlightNodeText(document.querySelector('#passage-pane .passage-text'), mapObj.p, cc);
          });
        } else if (data.synonyms?.length) {
          // grid rows (matching features / information) are <tr> with .mg-label,
          // not .q-text — fall back to the row so the question side still lights up
          const qTextEl = card.querySelector('.q-text') || card;
          data.synonyms.forEach((pair, idx) => {
            const cc = `syn-hl-${(idx%4)+1}`;
            if (qTextEl && pair[0]) highlightNodeText(qTextEl, pair[0], cc);
            if (pair[1]) highlightNodeText(document.querySelector('#passage-pane .passage-text'), pair[1], cc);
          });
        }
        setTimeout(() => {
          const h = document.querySelector('.ep-highlight-src,.syn-hl-applied');
          if (h) h.scrollIntoView({ behavior:'smooth', block:'center' });
        }, 50);
      }
    });
    card.appendChild(btn); card.appendChild(panel);
  }

  // ── Matching-headings helper: one explanation per paragraph, injected
  //    in the passage pane directly above that paragraph's heading slot ──
  function injectHeadingSlotBtn(qNum) {
    const slot = document.getElementById('hslot-' + qNum);
    if (!slot) return;
    const data = READING_EXPLANATIONS[qNum]; if (!data) return;
    if (slot.previousElementSibling && slot.previousElementSibling.classList.contains('heading-explain-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'heading-explain-wrap';
    const btn = document.createElement('button');
    btn.className = 'explain-btn';
    btn.dataset.qid = qNum;
    btn.innerHTML = explainLabel('Q' + qNum + ' Explanation');
    const panel = document.createElement('div');
    panel.className = 'explain-panel';
    let bridgeHTML = '';
    if (data.paraphraseMap && data.paraphraseMap.length) {
      const rows = data.paraphraseMap.map(pm =>
        `<div class="pb-row"><span class="pb-q">${pm.q}</span><span class="pb-icon">→</span><span class="pb-p">${pm.p}</span></div>`
      ).join('');
      bridgeHTML = `<div class="pb-header">Synonym Map</div><div class="paraphrase-bridge">${rows}</div>`;
    }
    panel.innerHTML = `<div class="ep-title">Q${qNum} — Why this answer?</div><div class="ep-text">${data.explanation}</div>${bridgeHTML}`;
    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('show');
      document.querySelectorAll('.explain-panel.show').forEach(p => p.classList.remove('show'));
      document.querySelectorAll('.explain-btn.open,.explain-btn-sm.open').forEach(b => b.classList.remove('open'));
      clearExplainHighlights();
      if (!isOpen) {
        panel.classList.add('show'); btn.classList.add('open');
        if (data.highlights?.length) highlightPassagePhrases(data.highlights);
        const passageEl = document.querySelector('#passage-pane .passage-text');
        const qPane = document.getElementById('questions-pane');
        (data.paraphraseMap || []).forEach((pm, idx) => {
          const cc = `syn-hl-${(idx%4)+1}`;
          if (qPane && pm.q) highlightNodeText(qPane, pm.q, cc);
          if (pm.p) highlightNodeText(passageEl, pm.p, cc);
        });
        setTimeout(() => {
          const h = document.querySelector('.ep-highlight-src,.syn-hl-applied');
          if (h) h.scrollIntoView({ behavior:'smooth', block:'center' });
        }, 50);
      }
    });
    wrap.appendChild(btn); wrap.appendChild(panel);
    slot.parentNode.insertBefore(wrap, slot);
  }

  // ── DATA-DRIVEN PLACEMENT ────────────────────────────────────────────
  // The button style is decided purely by the section's `type`, so a new
  // test never needs this function edited. Per-card full buttons for
  // single-answer types; one compact 💡-row for grouped/prose types;
  // per-paragraph buttons in the passage pane for matching-headings;
  // one combined button for choose-TWO.
  // matching-info / matching-features render as a .match-grid whose questions are
  // <tr> rows, not .q-card elements — so the per-card path silently found no
  // container and those types ended up with no explanation button at all.
  // They belong on the grouped path: one compact lightbulb row placed BELOW the
  // grid, the same way summary/notes completion does it.
  const PER_CARD  = new Set(['tfng','ynng','mcq','sentence-endings']);
  const GROUP_ROW = new Set(['notes','summary','sentence','wordbank','table','flowchart',
                             'map','diagram','matching-info','matching-features']);

  [1,2,3].forEach(pp => (SECTIONS[pp] || []).forEach((sec, i) => {
    const ids = siblingIds(sec);
    if (sec.type === 'matching-headings') {
      ids.forEach(injectHeadingSlotBtn);
    } else if (sec.type === 'mcq-multi') {
      const label = ids.length > 1 ? (ids[0] + '–' + ids[ids.length - 1] + ' Explanation') : 'Explanation';
      injectFullBtn(document.getElementById('rq-multi-' + sec.gid), ids[0], label);
    } else if (PER_CARD.has(sec.type)) {
      ids.forEach(id => injectFullBtn(document.getElementById('rq-card-' + id), id));
    } else if (GROUP_ROW.has(sec.type)) {
      const block = document.getElementById('secblock-' + pp + '-' + i);
      // Grid types (.match-grid) have no .q-card wrapper — fall back to the
      // section block so the row still lands, after the grid.
      const card = block ? (block.querySelector('.q-card') || block) : null;
      injectGroupRow(card, ids);
    }
  }));
}

// Was a second copy of the single-text-node matcher, with the same bug: any
// supporting sentence that crossed inline markup, or differed by a curly quote
// or a line break, silently failed to highlight. Now shares the one matcher.
function highlightPassagePhrases(phrases) {
  const passageEl = document.querySelector('#passage-pane .passage-text');
  if (!passageEl || !phrases) return;
  phrases.forEach(function (phrase) {
    highlightNodeText(passageEl, phrase, '', 'ep-highlight-src');
  });
}

// Length-preserving normalisation so match offsets still map 1:1 back onto the
// original text. Curly quotes, the various dashes and nbsp are the characters
// that differ between the authored explanation strings and the passage HTML.
function normForMatch(str) {
  return str
    .replace(/[‘’‛ʼ]/g, "'")
    .replace(/[“”‟]/g, '"')
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/[   ]/g, ' ');
}

// V3 — the old version searched each text node in isolation, so any phrase that
// crossed an inline element (<strong>, the paragraph letter, an <em>) simply
// never matched and the highlight silently didn't appear. That is why summary
// completion in particular kept failing: its supporting sentences are long and
// routinely span markup. This walks the passage as ONE flat string, matches
// there, then maps the hit back onto the individual nodes.
function highlightNodeText(rootEl, textToFind, colorClass, baseClass) {
  if (!rootEl || !textToFind) return false;
  const base = baseClass || 'syn-hl-applied';
  const cls  = (base + ' ' + (colorClass || '')).trim();

  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    if (n.parentNode && n.parentNode.closest &&
        n.parentNode.closest('.' + base + ',.explain-panel,.fp-note,input,textarea,select,button')) continue;
    nodes.push(n);
  }
  if (!nodes.length) return false;

  // flat text + a map from flat index -> {node, offset}
  let flat = '';
  const map = [];
  nodes.forEach(node => {
    const t = node.nodeValue;
    for (let i = 0; i < t.length; i++) map.push({ node: node, off: i });
    flat += t;
  });
  flat = normForMatch(flat);

  // whitespace in the authored string may be a newline or a run of spaces in
  // the markup, so match any whitespace run against any whitespace run
  const needle = normForMatch(String(textToFind).trim());
  const pattern = needle
    .split(/\s+/)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s+');
  let m;
  try { m = new RegExp(pattern, 'i').exec(flat); } catch (e) { return false; }
  if (!m) return false;

  const startIdx = m.index, endIdx = m.index + m[0].length - 1;
  const a = map[startIdx], b = map[endIdx];
  if (!a || !b) return false;

  const range = document.createRange();
  range.setStart(a.node, a.off);
  range.setEnd(b.node, b.off + 1);

  // one node — the cheap path; otherwise wrap each intersecting slice
  try {
    const span = document.createElement('span');
    span.className = cls;
    range.surroundContents(span);
    return true;
  } catch (e) { /* spans multiple nodes — fall through */ }

  const jobs = [];
  nodes.forEach(node => {
    if (!range.intersectsNode(node)) return;
    const s = (node === range.startContainer) ? range.startOffset : 0;
    const e = (node === range.endContainer)   ? range.endOffset   : node.nodeValue.length;
    if (e > s) jobs.push({ node: node, s: s, e: e });
  });
  jobs.forEach(j => {
    let target = j.node;
    if (j.s > 0) target = target.splitText(j.s);
    if (target.nodeValue.length > (j.e - j.s)) target.splitText(j.e - j.s);
    const span = document.createElement('span');
    span.className = cls;
    target.parentNode.insertBefore(span, target);
    span.appendChild(target);
  });
  return jobs.length > 0;
}

// ====================================================================
// V3: DOUBLE-CLICK DICTIONARY SETUP
// ====================================================================

let dictListenersAttached = false;
let dictRequestSeq = 0;

function getWordAtPoint(x, y) {
  let range = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos) { range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); }
  }
  if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return '';
  const text = range.startContainer.textContent;
  let start = range.startOffset, end = range.startOffset;
  while (start > 0 && /[a-zA-Z]/.test(text[start - 1])) start--;
  while (end < text.length && /[a-zA-Z]/.test(text[end])) end++;
  return text.slice(start, end);
}

function setupDictionary(passageNum) {
  if (dictListenersAttached) return;
  dictListenersAttached = true;

  document.addEventListener('dblclick', (e) => {
    if (!document.body.classList.contains('review-mode') || state.stage !== 'reading') return;

    const passagePane = document.getElementById('passage-pane');
    if (!passagePane || !passagePane.contains(e.target)) return;

    const rawSel = window.getSelection().toString().trim() || getWordAtPoint(e.clientX, e.clientY);
    const sel = rawSel.toLowerCase().replace(/[^a-z]/g, '');
    if (!sel) return;

    let found = null;
    for (let p in VOCABULARY_DATA) {
      const match = VOCABULARY_DATA[p].words.find(w => w.word === sel || w.word + 's' === sel || w.word === sel + 's');
      if (match) { found = match; break; }
    }

    let popup = document.getElementById('dict-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'dict-popup';
      popup.className = 'dict-popup';
      document.body.appendChild(popup);
    }

    popup.style.top = (e.pageY + 15) + 'px';
    popup.style.left = e.pageX + 'px';
    popup.classList.add('show');

    if (found) {
      popup.innerHTML = `<div class="dict-word">${found.word} <span class="dict-pos">${found.pos}</span>${found.cefr ? `<span class="dict-cefr">${found.cefr}</span>` : ''}</div>`
        + `<div class="dict-def">${found.uz}</div>`
        + (found.model ? `<div class="dict-example">${escapeHtml(found.model)}</div>` : '');
    } else {
      popup.innerHTML = `<div class="dict-word" style="text-transform:capitalize;">${sel}</div><div class="dict-def" style="color:var(--ink-soft); font-style:italic;">Translating...</div>`;
      const seq = ++dictRequestSeq;

      /* fetch() has no timeout of its own: a slow link or a captive portal
         leaves a request that neither resolves nor rejects, and the popup used
         to hold "Translating…" for the rest of the session. */
      const ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      const bail = setTimeout(() => { if (ctl) ctl.abort(); }, 6000);
      const settle = (msg, cls) => {
          if (seq !== dictRequestSeq) return;
          popup.innerHTML = `<div class="dict-word" style="text-transform:capitalize;">${sel}</div>` +
                            `<div class="dict-def${cls ? ' ' + cls : ''}">${msg}</div>`;
      };

      fetch(`https://api.mymemory.translated.net/get?q=${sel}&langpair=en|uz`,
            ctl ? { signal: ctl.signal } : undefined)
        .then(res => res.json())
        .then(data => {
            clearTimeout(bail);
            if (seq !== dictRequestSeq) return;
            let trans = data && data.responseData && data.responseData.translatedText;
            /* a reply with nothing usable in it is still an answer — say so
               rather than leaving the spinner running */
            if (!trans) { settle('No translation came back for this word.', 'dict-miss'); return; }
            if (trans.toLowerCase() === sel.toLowerCase() && data.responseData.match < 0.5) {
                settle('Translation not found in dictionary.', 'dict-miss'); return;
            }
            settle(trans);
        }).catch(() => {
            clearTimeout(bail);
            settle('Not in the offline glossary, and it could not be looked up — check your connection.', 'dict-miss');
        });
    }
  });

  document.addEventListener('mousedown', (e) => {
    const popup = document.getElementById('dict-popup');
    if (popup && !popup.contains(e.target)) popup.classList.remove('show');
  });
}

// Every C1/C2 word in the test, passage 1 -> 3, in the order authored.
function c1c2Words() {
  const out = [];
  Object.keys(VOCABULARY_DATA)
    .map(Number).sort((x, y) => x - y)
    .forEach(p => {
      const d = VOCABULARY_DATA[p];
      if (!d) return;
      d.words.filter(w => w.cefr === 'C1' || w.cefr === 'C2')
             .forEach(w => out.push(Object.assign({ passage: p, passageTitle: d.passageTitle }, w)));
    });
  return out;
}

// ====================================================================
// V3: VOCAB PDF EXPORT
// ====================================================================

function exportVocabularyPdf() {
  const words = c1c2Words();
  if (!words.length) { toast('No C1/C2 words found in this test.'); return; }

  const container = document.getElementById('vocab-print') || (() => {
    const d = document.createElement('div');
    d.id = 'vocab-print';
    document.body.appendChild(d);
    return d;
  })();

  // The mark is pasted once on the registration card; reference it rather than
  // re-embedding ~21KB of base64 in every generated page.
  const markEl = document.querySelector('.reg-mark, .brand-logo');
  const markSrc = markEl ? markEl.getAttribute('src') : '';

  // Paginate by passage, then split any passage that will not fit one A4 sheet.
  /* Eight to a sheet left a third of every page empty, and because the run is
     paginated per passage the tail passage could land a page holding two words.
     PER_PAGE is now the most a sheet may carry, and the split is balanced: a
     passage needing two sheets gets them halved rather than filled-then-orphaned. */
  const PER_PAGE = 14;
  const chunks = [];
  Object.keys(VOCABULARY_DATA).map(Number).sort((x, y) => x - y).forEach(p => {
    const ws = words.filter(w => w.passage === p);
    const parts = Math.max(1, Math.ceil(ws.length / PER_PAGE));
    const size = Math.ceil(ws.length / parts);
    for (let k = 0; k < ws.length; k += size) {
      chunks.push({ passage: p, title: ws[0].passageTitle, words: ws.slice(k, k + size),
                    part: Math.floor(k / size) + 1,
                    parts: parts });
    }
  });
  const totalPages = chunks.length;

  container.innerHTML = chunks.map((chunk, idx) => {
    const rows = chunk.words.map(w => `
      <div class="vp-entry" style="padding: 13px 0; border-bottom: 1px solid rgba(16,24,40,.09);">
        <div style="margin-bottom: 6px;">
          <span class="vp-word" style="font-size: 17px; font-weight: 700; color: #16305c; letter-spacing: -.005em;">${escapeHtml(w.word)}</span>
          <span class="vp-cefr" style="font-size: 11px; font-weight: 800; color: #fff; background: #2c5fa8; padding: 2px 7px; border-radius: 4px; margin-left: 8px; vertical-align: middle;">${w.cefr}</span>
          <span class="vp-uz" style="font-size: 14px; font-weight: 600; color: #0f172a; margin-left: 6px;">— ${escapeHtml(w.uz)}</span>
        </div>
        <div class="vp-model" style="font-size: 12.5px; color: #7c88a0; font-style: italic;">"${escapeHtml(w.model)}"</div>
      </div>`).join('');

    return `
      <div class="vp-page" style="display: flex; flex-direction: column; justify-content: space-between; padding: 56px 60px;">
        <div>
          <div class="vp-header">
            <div class="vp-logo-block">
              <img src="${markSrc}" style="width:42px;height:42px;border-radius:6px;object-fit:cover;display:block;" alt="CDI">
              <div class="vp-logo-text">READING CDI<div class="sub">IELTS Academic Vocabulary · C1 &amp; C2</div></div>
            </div>
            <div class="vp-meta">
              <div class="passage-label">Passage ${chunk.passage} · C1 &amp; C2 Vocabulary${chunk.parts > 1 ? ' (' + chunk.part + '/' + chunk.parts + ')' : ''}</div>
              <div class="passage-title-text">${escapeHtml(chunk.title)}</div>
            </div>
          </div>
          <div style="margin-top: 10px;">${rows}</div>
        </div>
        <div class="vp-footer">
          <div>READING CDI · Practice tests for serious results</div>
          <div>Page ${idx + 1} of ${totalPages}</div>
        </div>
      </div>`;
  }).join('');

  container.style.left = '0';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.zIndex = '-1';

  const safeName = (state.name || 'Student').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  toast(`Generating vocabulary PDF (${words.length} C1/C2 words)…`);

  setTimeout(async () => {
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = container.querySelectorAll('.vp-page');
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgW = 210;
        const imgH = (canvas.height * imgW) / canvas.width;
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, imgW, Math.min(imgH, 297));
      }
      pdf.save(`CDI_Reading_C1-C2_Vocabulary_${safeName}.pdf`);
      toast('Vocabulary PDF downloaded!', 'success');
    } catch (e) {
      console.error(e);
      toast('PDF export failed', 'error');
    } finally {
      container.style.position = 'absolute';
      container.style.left = '-10000px';
    }
  }, 300);
}

// ====================================================================
// INIT
// ====================================================================

function toggleTimer() {
  if (state.timers.reading <= 300) {
    toast('Timer cannot be hidden in the final 5 minutes.', 'warn');
    return;
  }
  state.timerHidden = !state.timerHidden;
  updateTimerDisplay('reading');
  saveState();
}

// V3 — resume, without a browser dialog. A raw confirm() was the one place the
// wrapper dropped out of its own design language, and it blocks the page while
// open. This is the same decision in a styled sheet.
/* V3 — a reload ends the sitting, and the page says so before it acts.
   This used to offer Resume, and before that it silently wiped the save with no
   prompt at all. Both were wrong in the same direction: the engine decided.
   Now there is one honest outcome — the paper starts again — and the candidate
   is told what that costs before anything is destroyed. Closing the tab on this
   sheet leaves the save untouched. */
function restartSheet(onGo) {
  const el = document.getElementById('resume-sheet');
  if (!el) { onGo(); return; }
  const finished = ['completion', 'results'].includes(state.stage);
  const t = document.getElementById('resume-title');
  const sub = el.querySelector('.rsm-sub');
  const meta = document.getElementById('resume-meta');
  const warn = el.querySelector('.rsm-warn');
  const yes = document.getElementById('resume-yes');
  const no = document.getElementById('resume-no');
  if (t) t.textContent = finished ? 'That sitting is closed.' : 'This test starts again.';
  if (sub) sub.textContent = 'Reloading the page ends a sitting.';
  if (warn) warn.textContent = finished
    ? 'The band score and the marked answers from that attempt are gone.'
    : 'The answers, the flags and the notes from that attempt are gone.';
  // Name what is being lost rather than gesturing at it — an unfinished paper
  // has a number attached, and the number is the argument.
  if (meta) {
    if (finished) { meta.textContent = ''; }
    else {
      const done = state.readingAnswers ? Object.keys(state.readingAnswers).filter(k => {
        const v = state.readingAnswers[k];
        return v != null && String(v).trim() !== '';
      }).length : 0;
      const left = Math.max(0, (state.timers && state.timers.reading) || 0);
      const mm = String(Math.floor(left / 60)).padStart(2, '0');
      const ss = String(left % 60).padStart(2, '0');
      meta.textContent = `${done} of ${QTOTAL} answered \u00b7 ${mm}:${ss} remaining`;
    }
  }
  if (yes) yes.textContent = 'Start the paper';
  // A second button that leads nowhere would be furniture pretending to be a
  // choice; there is only one answer to this question.
  if (no) no.style.display = 'none';
  let answered = false;
  if (yes) yes.onclick = () => {
    if (answered) return;
    answered = true;
    el.classList.remove('show');
    setTimeout(onGo, 160);
  };
  // The prelude is for a first arrival. Someone whose sitting just ended gets
  // the card already standing behind the sheet instead of a boot sequence
  // detonating under a modal.
  try {
    if (window.CDIAtmosphere && window.CDIAtmosphere.skip) window.CDIAtmosphere.skip();
    if (window.__cdiReveal) window.__cdiReveal();
  } catch (e) {}
  requestAnimationFrame(() => {
    el.classList.add('show');
    if (yes) setTimeout(() => { try { yes.focus({ preventScroll: true }); } catch (e) { yes.focus(); } }, 220);
  });
}

function init() {
  try { applyBrandLogo(); } catch(e) {}
  setupAntiCheat();
  setupHighlighter();
    // Restore saved theme
  const savedTheme = localStorage.getItem('cdi_reading_theme') || 'light';
  setTheme(savedTheme);
  try { exInitSettingsPrefs({ setTheme: setTheme, zoomText: zoomText }); } catch(e) {}

  loadState();
  startFresh();
}

function startFresh() {
  state.finishing = false;
  // V3 — a declined "resume?" must leave nothing of the old attempt behind.
  // loadState() has already merged the previous session in by this point, so
  // every key it touched has to be reset here. Missing `annotations` carried
  // the last attempt's highlights into a "fresh" test; missing `paceShown`
  // left both pacing markers flagged as fired, so they never showed again.
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, {
    student: { name: '' }, stage: 'registration', startedAt: new Date().toISOString(), finishedAt: null,
    readingAnswers: {}, readingFlags: {},
    timers: { reading: MINUTES*60 },
    passageTimes: { 1: 0, 2: 0, 3: 0 },
    annotations: { 1: [], 2: [], 3: [] },
    paceShown: {}, timePerQuestion: {}, answerCauses: {}, vocabBasket: [],
    warnings: 0, currentPassage: PONLY, activeQuestion: null
  });

  // The login card opens the paper again. Nothing is rendered and no clock
  // runs until the candidate has given a name and pressed "Start test" —
  // validateStart() -> beginExam() -> beginReading() is the whole route.
  document.body.classList.remove('no-select');
  goToStage('registration');
  const nm = document.getElementById('start-name');
  if (nm) {
    nm.value = '';
    setTimeout(function () {
      try { nm.focus({ preventScroll: true }); } catch (e) {}
    }, 150);
  }
}

// V3 — the band score counts up on reveal. Small thing; it makes the score
// report feel like a result being delivered rather than a number that was
// always sitting there.
// V3 — let a student jump straight to the questions worth re-reading, instead
// of scrolling 40 rows to find the four that matter.
function bindResultFilters() {
  const root = document.getElementById('stage-results');
  if (!root) return;
  root.querySelectorAll('.v3-fchip').forEach(chip => {
    chip.onclick = () => {
      root.querySelectorAll('.v3-fchip').forEach(c => c.classList.remove('on'));
      chip.classList.add('on');
      const f = chip.dataset.f;
      root.querySelectorAll('.answer-table tbody tr').forEach(tr => {
        const show = f === 'all'
          || (f === 'wrong'   && tr.dataset.st === 'wrong')
          || (f === 'skipped' && tr.dataset.st === 'skipped')
          || (f === 'slip'    && tr.dataset.slip === '1')
          || (f === 'slow'    && tr.dataset.slow === '1');
        tr.style.display = show ? '' : 'none';
      });
      root.querySelectorAll('.q-bubble').forEach(b => {
        b.style.opacity = (f === 'all' || b.classList.contains(f)) ? '1' : '.25';
      });
    };
  });
}

function animateBand() {
  // V3 — deliberately inert. A certificate is a document, not a dashboard:
  // counting the band up made the figure disagree with the written words
  // ("3.5" while the line read "Band Four") for the whole 900ms.
  return;
  /* eslint-disable no-unreachable */
  if (reducedMotion()) return;
  const el = document.querySelector('#stage-results .band-num');
  if (!el) return;
  const target = parseFloat(el.textContent);
  if (!isFinite(target)) return;
  const t0 = performance.now(), dur = 900;
  function step(now) {
    const k = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = (Math.round(target * eased * 2) / 2).toFixed(1);
    if (k < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(1);
  }
  el.textContent = '0.0';
  requestAnimationFrame(step);
}

// Fire it whenever the results stage becomes visible.
new MutationObserver(() => {
  const r = document.getElementById('stage-results');
  if (r && r.classList.contains('active') && !r.dataset.counted) {
    r.dataset.counted = '1';
    setTimeout(animateBand, 240);
    bindResultFilters();
  }
}).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

document.addEventListener('DOMContentLoaded', init);


// ====================================================================
// FLOWER POWER — every answer sentence highlighted in the passage, with
// the English + Uzbek note opening inline underneath when it is clicked.
// ====================================================================
function fpNoteHTML(id, data) {
  return '<span class="fp-row fp-en"><b>Q' + id + ' — Why:</b> ' + (data.en || '') + '</span>'
       + '<span class="fp-row"><b>Tushuntirish:</b> ' + (data.uz || '') + '</span>';
}
function fpPaintPassage() {
  if (!document.body.classList.contains('review-mode')) return;
  const root = document.querySelector('#passage-pane .passage-text');
  if (!root) return;
  const p = state.currentPassage;
  if (root.dataset.fpDone === String(p)) return;
  root.dataset.fpDone = String(p);

  (SECTIONS[p] || []).forEach(sec => (sec.items || []).forEach(it => {
    const data = READING_EXPLANATIONS[it.id];
    if (!data || !data.highlights || !data.highlights.length) return;
    if (root.querySelector('.fp-hl[data-q="' + it.id + '"]')) return;
    if (!highlightNodeText(root, data.highlights[0], '', 'fp-hl')) return;
    const fresh = Array.prototype.slice.call(root.querySelectorAll('.fp-hl:not([data-q])'));
    if (!fresh.length) return;
    fresh.forEach(s => { s.dataset.q = it.id; });
    const last = fresh[fresh.length - 1];
    last.classList.add('fp-last');
    const note = document.createElement('span');
    note.className = 'fp-note';
    note.id = 'fp-note-' + it.id;
    note.innerHTML = fpNoteHTML(it.id, data);
    note.addEventListener('click', e => e.stopPropagation());
    // drop the note UNDER the paragraph rather than mid-sentence, so the
    // passage still reads as written when the note is closed
    const block = last.closest('p,li,blockquote,h1,h2,h3,h4');
    if (block && root.contains(block) && block.parentNode) block.parentNode.insertBefore(note, block.nextSibling);
    else last.parentNode.insertBefore(note, last.nextSibling);
  }));

  if (!root.dataset.fpBound) {
    root.dataset.fpBound = '1';
    root.addEventListener('click', e => {
      const hl = e.target.closest && e.target.closest('.fp-hl');
      if (!hl) return;
      const note = document.getElementById('fp-note-' + hl.dataset.q);
      if (note) note.classList.toggle('show');
    });
  }
}
let fpTimer = null;
function fpStart() {
  fpPaintPassage();
  setTimeout(fpPaintPassage, 250);
  if (fpTimer) return;
  fpTimer = setInterval(fpPaintPassage, 600);
}

// ====================================================================
// PUBLIC API
// ====================================================================

return {
  validateStart, beginReading, finishExam, fpPaintPassage,
  switchPassage, jumpToReading, toggleFlag, onReadingInput, onSelectChange, onMultiSelect,
  onDragStart, allowDrop, dragLeave, onDrop, onBankClick, onDropZoneClick,
  onGridPick,
  applyHighlight, clearHighlight, addNote, openNote, saveNote, closeNote, deleteNote,
  toggleNotesDrawer, jumpToNote, deleteNoteAt, dismissWarning, unlockResults, resetExam, reviewExam,
  confirmSubmit, backToResults, setTheme, zoomText, exportVocabularyPdf, saveReportPdf, downloadReport, toggleFullscreen, toggleTimer, updateReadingNav,
  openResultsModal, closeResultsModal, reviewQuestion,
  prevPart, nextPart, injectHeadingSlots,
  onHeadingDragStart, onHeadingDragEnd, onSlotDragOver, onSlotDragLeave,
  onSlotDrop, onSlotClick, onHeadingTileClick,
  onWordDragStart, onWordDragEnd, onWordDragOver, onWordDragLeave,
  onWordDrop, onWordZoneClick, onWordTileClick
};

})();

/* The particle atmosphere, the Three.js build it needed and the cosmic-dust
   canvas have all been removed: this paper's wrapper screens are flat white,
   nothing was ever drawn on them, and between them they cost ~780KB of parse
   plus a permanent requestAnimationFrame loop. Every consumer of the layer
   calls it through this object, so the stub is all that has to remain. */
window.CDIAtmosphere = { progress(){}, sealed(){}, dim(){}, skip(){}, sync(){} };
window.__cdiReduced = (function(){ try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; } })();
window.__cdiReveal = function(){ document.body.classList.remove('cdi-booting'); };
window.__cdiRevealed = function(){ return true; };

/* Two strings, because the copy they replace lived in markup that is now
   hidden: the strike rule (which the briefing screen does not repeat) and the
   name field's own label. */
(function () {
  function say() {
    var fp = document.querySelector('#stage-registration .ch-fineprint');
    if (fp) fp.textContent = 'This test was prepared & built by Islom Kenjayev ' +
                             '· IELTS 8.5 (L 9.0 · R 9.0)';
    var el = document.getElementById('start-name');
    if (el) el.placeholder = 'Type your full name';

    /* The briefing's opening paragraph, cut to its first clause. #intro-greet is
       kept as the same element rather than rewritten: validateStart() greets the
       candidate by first name through that node, so it has to survive. */
    var sub = document.querySelector('#stage-reading-intro .trans-sub');
    if (sub) {
      var greet = document.getElementById('intro-greet');
      sub.innerHTML = '';
      if (greet) sub.appendChild(greet);
      sub.appendChild(document.createTextNode(
        ' Three passages, forty questions, one 60‑minute clock.'));
    }
    /* the two notes worth keeping out of the five, plus what the button does */
    var bf = document.querySelector('#stage-reading-intro .ch-fineprint');
    if (bf) bf.textContent = 'This test was prepared & built by Islom Kenjayev ' +
                             '· IELTS 8.5 (L 9.0 · R 9.0)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', say);
  else say();
})();

/* ── full-screen at the door ────────────────────────────────────────────────
   A browser will not hand out full-screen on page load: the API requires a
   transient user gesture, and a load-time request is refused by every engine.
   So the FIRST gesture on the registration screen is armed instead — the click
   into the name field, or the first key pressed. In practice that is
   indistinguishable from automatic, because typing a name is the first thing
   anyone does on this screen; by the time they reach Begin they are already
   full-screen. (For genuinely automatic, the page has to be launched that way:
   Chrome's --start-fullscreen / --kiosk, or F11 · ctrl-cmd-F.)

   It deliberately does NOT call the engine's enterFullscreen(). That sets
   state.fsGranted, which is what arms the strike counter — so a candidate who
   opens the paper, goes full-screen, then leaves before starting would be
   charged a violation for it. Leaving the flag alone means the engine arms the
   counter itself, at the point the exam actually begins. */
(function () {
  var EV = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  function active() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement ||
              document.mozFullScreenElement || document.msFullscreenElement);
  }
  function disarm() {
    EV.forEach(function (e) { window.removeEventListener(e, go, true); });
  }
  function go() {
    disarm();
    if (active()) return;
    var el = document.documentElement;
    var req = el.requestFullscreen || el.webkitRequestFullscreen ||
              el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!req) return;
    try {
      var p = req.call(el, { navigationUI: 'hide' });
      /* A refusal is a normal outcome here, not an error: an iframe without the
         permission, or a browser configured to deny it. The screen simply stays
         windowed, exactly as it does today. */
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) {}
    /* the transition can take focus off the field the candidate just clicked */
    var n = document.getElementById('start-name');
    if (n) setTimeout(function () {
      try { n.focus({ preventScroll: true }); } catch (e) { n.focus(); }
    }, 280);
  }
  function arm() {
    var reg = document.getElementById('stage-registration');
    if (!reg || !reg.classList.contains('active') || active()) return;
    EV.forEach(function (e) {
      window.addEventListener(e, go, { capture: true, passive: true });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm);
  else arm();
})();

/* The three filter chips on the report. Filtering is a class on the list, not
   a re-render: the forty explanation panels stay in the DOM and nothing is
   rebuilt, which is what keeps the chips instant on a slow machine. */
function setResFilter(f, btn){
  var list = document.getElementById('res-details');
  if (!list) return;
  list.classList.remove('f-wrong','f-skipped');
  if (f === 'wrong')   list.classList.add('f-wrong');
  if (f === 'skipped') list.classList.add('f-skipped');
  var bar = btn && btn.parentNode;
  if (bar) for (var i = 0; i < bar.children.length; i++) bar.children[i].classList.remove('active');
  if (btn) btn.classList.add('active');
}