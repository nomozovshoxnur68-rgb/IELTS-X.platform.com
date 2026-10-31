/* ═══ IELTS Listening — part-practice engine (one part per page) ═══
   Data (answer key, transcript, questions) is supplied by the page via window.PART_PRACTICE. */

function toggleMenu(){var d=document.getElementById('menu-dropdown');if(d)d.classList.toggle('open');}
document.addEventListener('click',function(e){var w=document.getElementById('menu-wrap'),d=document.getElementById('menu-dropdown');if(w&&d&&!w.contains(e.target)&&!d.contains(e.target))d.classList.remove('open');var np=document.getElementById('notif-popup'),bb=document.getElementById('bell-btn');if(np&&bb&&!np.contains(e.target)&&!bb.contains(e.target))np.classList.remove('open');});
function updateWifiStatus(){var on=navigator.onLine;var btn=document.getElementById('wifi-btn'),st=document.getElementById('hdr-conn-status');if(!btn)return;btn.classList.toggle('offline',!on);btn.setAttribute('aria-label',on?'Connected':'No internet connection');if(st)st.textContent=on?'':'No internet connection';}
window.addEventListener('online',updateWifiStatus);window.addEventListener('offline',updateWifiStatus);updateWifiStatus();
function toggleNotifPopup(e){e.stopPropagation();var np=document.getElementById('notif-popup');if(np)np.classList.toggle('open');}
function toggleNotesPanel(){
  var open=document.body.classList.toggle('notes-open');
  var ta=document.getElementById('notes-area');
  if(!ta)return;
  if(!ta._wired){
    ta._wired=1;
    try{ta.value=localStorage.getItem('cdi_listening_notes')||'';}catch(e){}
    ta.addEventListener('input',function(){
      try{localStorage.setItem('cdi_listening_notes',ta.value);}catch(e){}
    });
  }
  if(open)setTimeout(function(){try{ta.focus();}catch(e){}},0);
}
function updateHeaderName(name){
  const lab=document.getElementById('hdr-name');
  if(!lab)return;
  lab.title=(name||'').trim();
}


;

const ExamApp=(function(){
'use strict';


/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  PART PRACTICE — this engine knows nothing about any particular test.  ║
   ║  The page defines window.PART_PRACTICE before loading this file:       ║
   ║    part, from, to, minutes, name, id, audioStart, audioEnd,            ║
   ║    navGroups, answers, transcript, build(helpers)                      ║
   ║  The answer key, the transcript and the question markup all live in    ║
   ║  the HTML. Only the functions live here.                               ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
const CFG=window.PART_PRACTICE;
if(!CFG||!CFG.answers||typeof CFG.build!=='function')throw new Error('listening.js: window.PART_PRACTICE is missing or incomplete — define it in the page before this script.');
const PART_NO=+CFG.part;
const PART_LABEL=CFG.label||('Part '+PART_NO);   // a full paper (Parts 1-4 on one page) says so instead of 'Part 1'
const Q_FROM=+CFG.from,Q_TO=+CFG.to;
const PART_SECS=Math.round((+CFG.minutes||10)*60);
const LISTENING_ANSWERS=CFG.answers;
const TRANSCRIPT=CFG.transcript||[];
const ANSWER_TIMES=CFG.answerTimes||{};
const NAV_GROUPS={};NAV_GROUPS[PART_NO]=CFG.navGroups||(function(){var a=[];for(var i=Q_FROM;i<=Q_TO;i++)a.push([i]);return a;})();
/* The recording is the full paper; a part plays only its own window of it.
   ?audioStart=SEC&audioEnd=SEC in the address bar overrides the page, which is
   the quickest way to find the right second for a part. */
const A_START=(function(){try{var v=new URLSearchParams(location.search).get('audioStart');if(v!==null&&v!==''&&!isNaN(+v))return +v;}catch(e){}return +CFG.audioStart||0;})();
const A_END=(function(){try{var v=new URLSearchParams(location.search).get('audioEnd');if(v!==null&&v!==''&&!isNaN(+v))return +v;}catch(e){}return +CFG.audioEnd||0;})();
function HELPERS(){return {nb,gapInput,mcqOption,mcqCard,kbHelp,dropInline,mapZone,poolChips,flowArrow,flowChart,msCard,msCard3,dragGroup,matchRows,mapMatrix};}



/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · IDS  —  see BUILD_INSTRUCTIONS.md §3                   ║
   ║  STORAGE_KEY MUST be unique per test or saved progress collides.       ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
const STORAGE_KEY="cdi_listening_"+(CFG.id||"part")+"_p"+PART_NO;   // trailing digits also set CERT_TEST_NO

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · SECTION CONTENT  —  see BUILD_INSTRUCTIONS.md §6       ║
   ║  buildSection1..4 each return one section's HTML (IDs S1:1-10 S2:11-20 ║
   ║  S3:21-30 S4:31-40). Mix any block type per §4: gap-fill / MCQ /       ║
   ║  drag-match / map-label. Keep all data-q / data-lq / data-dm / data-   ║
   ║  val / data-pool attributes. MAP = swap image + labels + letters only. ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
// QUESTION BUILDERS
/* The note block is ONE inline flow (§7): bare text nodes, <br> line breaks and
   runs of &nbsp; for indentation, at line-height 24px. gapInput() therefore emits
   an INLINE span with no wrapper row, no padding and no stray whitespace — the
   whitespace either side of the input has to come from the surrounding text. */
function nb(n){var o='';while(n-->0)o+='&nbsp;';return o;}
function gapInput(id){
  return '<span class="gap-field" id="lq-row-'+id+'">'+
    '<input type="text" id="lq-'+id+'" class="gap-input" data-lq="'+id+'" oninput="ExamApp.onListeningInput('+id+')" '+
    'autocomplete="off" spellcheck="false" size="10" maxlength="500" tabindex="0" aria-label="Insert answer" placeholder="'+id+'">'+
    '<span class="feedback-pill" id="lfb-'+id+'"></span></span>';
}

/* measured option row: 1154 x 43.2, #fff, no border, padding 9.6px 8px 9.6px 32px,
   16px/24px Arial, with the radio inside the 32px left pad. The official Listening
   MCQ rows carry no A/B/C letter — the letter is kept in the DOM for grading only. */
function mcqOption(qid,letter,text) {
  return `<label class="option"><input type="radio" name="lq-${qid}" value="${letter}" tabindex="0" data-q="${qid}"><span class="opt-letter" aria-hidden="true">${letter}</span>${text}</label>`;
}

function mcqCard(qid,qText,options) {
  return `<div class="q-card" id="lq-card-${qid}">
    <div class="q-row">
      <span class="q-pill" data-qnum="${qid}">${qid}</span>
      <div class="q-text">${qText}</div>
      <span class="feedback-pill" id="lfb-${qid}"></span>
    </div>
    <div class="options">${options.map(o=>mcqOption(qid,o.letter,o.text)).join('')}</div>
  </div>`;
}


/* ── CATALOGUE HELPERS (2026-09-02) — one per widget the official player renders ── */
/* The "⌨ Help" link every drag question carries on the official player. Native
   <details>, so it needs no engine code. */
function kbHelp(){
  return '<details class="kb-help"><summary><svg viewBox="0 0 20 14" aria-hidden="true"><rect x="0.5" y="0.5" width="19" height="13" rx="1.5" fill="none" stroke="currentColor"/><g fill="currentColor"><rect x="3" y="3" width="2" height="2"/><rect x="7" y="3" width="2" height="2"/><rect x="11" y="3" width="2" height="2"/><rect x="15" y="3" width="2" height="2"/><rect x="3" y="6.5" width="2" height="2"/><rect x="7" y="6.5" width="2" height="2"/><rect x="11" y="6.5" width="2" height="2"/><rect x="15" y="6.5" width="2" height="2"/><rect x="5" y="10" width="10" height="2"/></g></svg>Help</summary>'+
    '<div class="kb-help-text">Drag an answer into a gap. To change an answer, drag it to another gap or back to the list. An answer can be used once unless the instructions say otherwise.</div></details>';
}
/* An inline drop zone inside running text (summary, notes, sentence or flow-chart
   completion "from the box"). Same contract as the row drops: data-q on the zone,
   hidden input with data-lq + data-dm, pill lfb-N, wrapper lq-row-N for the jump button. */
function dropInline(id){
  return '<span class="gap-field" id="lq-row-'+id+'"><span class="drag-drop drag-drop-inline" id="drop-'+id+'" data-q="'+id+'"><span class="drag-num-hint">'+id+'</span></span>'+
    '<input type="hidden" id="lq-'+id+'" data-lq="'+id+'" data-dm="1"><span class="feedback-pill" id="lfb-'+id+'"></span></span>';
}
/* A drop zone positioned on a plan / map / diagram. x,y are percentages of the stage. */
function mapZone(id,x,y){
  return '<div class="map-zone" id="lq-row-'+id+'" style="left:'+x+'%;top:'+y+'%"><div class="drag-drop" id="drop-'+id+'" data-q="'+id+'"><span class="drag-num-hint">'+id+'</span></div>'+
    '<input type="hidden" id="lq-'+id+'" data-lq="'+id+'" data-dm="1"><span class="feedback-pill" id="lfb-'+id+'"></span></div>';
}
function poolChips(poolId,words){
  return words.map((w,i)=>'<div class="drag-chip" id="dchip-'+poolId+'-'+i+'" data-val="'+w+'" data-pool="pool-'+poolId+'">'+w+'</div>').join('');
}
function flowArrow(){return '<div class="flow-arrow"><svg viewBox="0 0 22 28" aria-hidden="true"><path d="M8 0h6v15h6L11 28 2 15h6z" fill="#000"/></svg></div>';}
/* Flow-chart: boxes joined by arrows. Each box is a string; a gap is either a typed
   ${gapInput(n)} or a dragged ${dropInline(n)} — the caller decides. */
function flowChart(title,boxes){
  return (title?'<div class="flow-title">'+title+'</div>':'')+'<div class="flow-chart">'+boxes.map((b,i)=>(i?flowArrow():'')+'<div class="flow-box">'+b+'</div>').join('')+'</div>';
}
/* "Choose TWO letters": one card, two ids, checkbox rows on the measured .option row. */
function msCard(a,b,question,opts){
  const optHTML=opts.map(([l,t])=>'<label class="option ms-option"><input type="checkbox" class="ms-box" value="'+l+'"><span class="opt-letter" aria-hidden="true">'+l+'</span><span>'+t+'</span></label>').join('');
  return '<div class="q-card ms-group" id="lq-card-'+a+'" data-ms-ids="'+a+','+b+'"><div class="q-row"><span class="q-pill" data-qnum="'+a+'">'+a+'–'+b+'</span><div class="q-text">'+question+'</div><span class="feedback-pill" id="lfb-'+a+'"></span></div>'+
    '<div class="ms-hint">Choose TWO letters.</div><div class="options ms-options">'+optHTML+'</div></div>';
}
/* "Choose THREE letters": same card as msCard, three ids (the engine splits data-ms-ids, so any count works). */
function msCard3(a,b,c,question,opts,word){
  const optHTML=opts.map(([l,t])=>'<label class="option ms-option"><input type="checkbox" class="ms-box" value="'+l+'"><span class="opt-letter" aria-hidden="true">'+l+'</span><span>'+t+'</span></label>').join('');
  return '<div class="q-card ms-group" id="lq-card-'+a+'" data-ms-ids="'+a+','+b+','+c+'"><div class="q-row"><span class="q-pill" data-qnum="'+a+'">'+a+'&ndash;'+c+'</span><div class="q-text">'+question+'</div><span class="feedback-pill" id="lfb-'+a+'"></span></div>'+
    '<div class="ms-hint">Choose '+(word||'THREE')+' letters.</div><div class="options ms-options">'+optHTML+'</div></div>';
}
/* A drag-and-drop group: rows on the left, a pool of lettered answers on the right.
   More rows than answers means an answer may be used more than once (data-reuse). */
function dragGroup(id,items,opts){
  const pool=opts.map(([l,t],i)=>'<div class="drag-chip" id="dchip-'+id+'-'+i+'" data-val="'+l+'" data-pool="pool-'+id+'"><b>'+l+'</b>'+(t?'&nbsp;&nbsp;'+t:'')+'</div>').join('');
  const reuse=(items.length>opts.length)?' data-reuse="1"':'';
  const box='<div class="drag-right"><div class="drag-col-hdr">Answers</div><div class="drag-pool" id="pool-'+id+'" data-pool="pool-'+id+'"'+reuse+'>'+pool+'</div></div>';
  if(!items.length) return '<div class="drag-match-layout">'+box+'</div>';
  return '<div class="drag-match-layout"><div class="drag-left"><div class="drag-items">'+matchRows(items)+'</div></div>'+box+'</div>';
}
/* Row-per-item drag match (the official "IELTS Matching"): label, zone, chips on the right. */
function matchRows(items,small){
  return items.map(([id,name])=>'<div class="drag-item-row" id="lq-row-'+id+'"><span class="drag-item-label">'+name+'</span><div class="drag-drop'+(small?' drag-drop-sm':'')+'" id="drop-'+id+'" data-q="'+id+'"><span class="drag-num-hint">'+id+'</span></div>'+
    '<input type="hidden" id="lq-'+id+'" data-lq="'+id+'" data-dm="1"><span class="feedback-pill" id="lfb-'+id+'"></span></div>').join('');
}


/* Map labelling as the official grid: one row per place, one radio per letter.
   Radios carry name="lq-N" data-q="N", so the existing radio pipeline (state,
   save/restore, nav, grading) handles them with no extra wiring. The row label
   cell carries lq-row-N, which the review jump-button and scroll-to code target. */
function mapMatrix(items,letters){
  const head='<tr><td class="mx-corner"></td>'+letters.map(l=>'<th scope="col">'+l+'</th>').join('')+'</tr>';
  const body=items.map(([id,name])=>'<tr class="mx-row" id="mx-tr-'+id+'" data-q="'+id+'"><th scope="row" class="mx-lbl" id="lq-row-'+id+'"><b class="mx-n">'+id+'</b><span class="mx-t">'+name+'</span><span class="feedback-pill" id="lfb-'+id+'"></span></th>'+
    letters.map(l=>'<td class="mx-c" data-val="'+l+'"><input type="radio" name="lq-'+id+'" value="'+l+'" data-q="'+id+'" tabindex="0" aria-label="Question '+id+', '+name+': '+l+'"></td>').join('')+'</tr>').join('');
  return '<div class="mx-box"><table class="mx-table"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';
}

/* ══════════════════ PART 1 · notes (typed) ══════════════════ */

/* ══════════════════════════════════════════════════════════════════
   HIGHLIGHTS + ANCHORED NOTES - ported from the Reading master.
   Annotations are stored as character offsets into #listening-render, so
   they survive buildSectionN() re-rendering the part. restoreAnnotations()
   is called at the end of renderSection().
   ══════════════════════════════════════════════════════════════════ */
let activeNoteSpan = null;
const USER_HL_CLASSES = ['hl-y','hl-g','hl-p','hl-note'];

function partRoot() {
  return document.getElementById('listening-render');
}

function annoTextNodes(root) {
  if (!root) return [];
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (n.parentElement && n.parentElement.closest(
            '.section-head, select, input, textarea, button, .drag-chip, .drag-drop, .gap-input, .feedback-pill, .q-pill, .ms-hint')) {
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
  const root = partRoot();
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
  const root = partRoot();
  if (!root || state.stage !== 'listening') return;
  const p = state.currentSection;
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
  const root = partRoot();
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

function allNotes() {
  const out = [];
  [1, 2, 3, 4].forEach(p => ((state.annotations && state.annotations[p]) || [])
    .forEach((a, i) => { if (a.c === 'hl-note' && (a.n || '').trim()) out.push({ ...a, p, i }); }));
  return out;
}

function renderNotesDrawer() {
  const body = document.getElementById('anno-drawer-body');
  const badge = document.getElementById('anno-count');
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
    if (n.p !== lastP) { html += `<div class="nd-group">Part ${n.p}</div>`; lastP = n.p; }
    html += `<div class="nd-item" onclick="ExamApp.jumpToNote(${n.p},${n.s})">
        <button class="nd-del" title="Delete note"
                onclick="event.stopPropagation();ExamApp.deleteNoteAt(${n.p},${n.s})">&times;</button>
        <div class="nd-quote">${escapeHtml(n.t || '')}</div>
        <div class="nd-text">${escapeHtml(n.n)}</div>
      </div>`;
  });
  body.innerHTML = html;
}

function toggleAnnoDrawer(force) {
  const d = document.getElementById('anno-drawer');
  if (!d) return;
  const open = (force === undefined) ? !d.classList.contains('open') : !!force;
  d.classList.toggle('open', open);
  d.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.body.classList.toggle('anno-open', open);
  if (open) renderNotesDrawer();
}

function jumpToNote(passage, start) {
  const go = () => {
    const root = partRoot();
    if (!root) return;
    const span = [...root.querySelectorAll('span.hl-note')].find(s => {
      const first = annoTextNodes(s)[0];
      return first && offsetOfPoint(root, first, 0) === start;
    });
    if (!span) return;
    span.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
    span.classList.add('note-flash');
    setTimeout(() => span.classList.remove('note-flash'), 1200);
  };
  if (state.currentSection !== passage) { renderSection(passage); setTimeout(go, 260); }
  else go();
}

function deleteNoteAt(passage, start) {
  const list = (state.annotations && state.annotations[passage]) || [];
  state.annotations[passage] = list.filter(a => !(a.c === 'hl-note' && a.s === start));
  saveState();
  if (state.currentSection === passage) restoreAnnotations(passage);
  renderNotesDrawer();
}


// STATE
const state={student:{name:''},stage:'registration',startedAt:null,finishedAt:null,listeningAnswers:{},listeningFlags:{},annotations:{1:[],2:[],3:[],4:[]},timers:{listening:PART_SECS},currentSection:PART_NO,activeQuestion:null,timerHidden:false,warnings:0};
let timerInterval=null;
let _tpIdx=-1;
/* Progress is deliberately NOT persisted. A sitting lives in memory only:
   reload and the paper restarts, which is what the Cosmos build already
   implied by removing the resume sheet. Preferences (theme, text size,
   notes) are unaffected — those are stored under their own keys.
   STORAGE_KEY stays because its trailing digits set the test number. */
function saveState(){/* no-op — progress is not saved */}
function loadState(){return false;}   /* nothing is ever restored */

// STAGE NAV
const STAGES=['registration','listening-intro','listening','completion','results'];
function goToStage(name){
  STAGES.forEach(s=>{const el=document.getElementById('stage-'+s);if(el)el.classList.remove('active');});
  const t=document.getElementById('stage-'+name);
  if(t)t.classList.add('active');
  // The cosmic stages re-run their entrance every time they are shown; the exam
  // screen and the certificate never get one.
  if(t&&['registration','listening-intro','completion'].includes(name)){
    t.classList.remove('cdi-enter');
    requestAnimationFrame(()=>t.classList.add('cdi-enter'));
  }
  // the resume sheet can never outlive the question it asked
  const _rs=document.getElementById('ch-resume');if(_rs)_rs.classList.remove('show');
  state.stage=name;saveState();window.scrollTo(0,0);
  if(name!=='listening')document.body.classList.remove('notes-open');
  // Hand-off to the particle layer in the SAME tick as the stage swap, so the
  // white exam screen never inherits a frame of the shell.
  try{if(window.CDIAtmosphere&&window.CDIAtmosphere.sync)window.CDIAtmosphere.sync();}catch(e){}
}

// FULLSCREEN + ANTI-CHEAT
function enterFullscreen(){const el=document.documentElement;const req=el.requestFullscreen||el.webkitRequestFullscreen||el.mozRequestFullScreen||el.msRequestFullscreen;if(req){try{const p=req.call(el);if(p&&typeof p.catch==='function')return p.catch(()=>{});}catch(e){}}return Promise.resolve();}
function exitFullscreen(){if(!document.fullscreenElement&&!document.webkitFullscreenElement)return;const ex=document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen;if(ex)ex.call(document);}
function toggleFullscreen(){if(!document.fullscreenElement&&!document.webkitFullscreenElement)enterFullscreen();else exitFullscreen();}
// TEST HARNESS: ?test=1 disables proctoring so automated visual QA can drive the exam
// across tabs without tripping integrity warnings. Has no effect in normal use.
const TEST_MODE=(function(){try{return new URLSearchParams(location.search).has('test');}catch(e){return false;}})();
/* Anything worth losing: an unfinished paper, and equally a finished one whose
   certificate is on screen. A reload ends the sitting, so the browser's own
   "leave site?" is the last place the candidate can still change their mind. */
function hasLiveAttempt(){if(TEST_MODE)return false;if(window.__cdiIntentionalReload)return false;return !!(state.stage&&state.stage!=='registration');}
/* PROCTORING REMOVED. */
function isInExamMode(){return false;}
// A page that is being closed fires visibilitychange->hidden on its way out.
// That is not a candidate switching tabs, and banking a strike for it also
// re-wrote the saved session a moment after it had been cleared.
let _unloading=false;
function recordViolation(){}
function dismissWarning(){}
function forceTerminate(){}
function setupAntiCheat(){
  window.addEventListener('pagehide',()=>{_unloading=true;});
  const fsClass=function(){document.body.classList.toggle('is-fullscreen',!!(document.fullscreenElement||document.webkitFullscreenElement));};
  document.addEventListener('fullscreenchange',fsClass);document.addEventListener('webkitfullscreenchange',fsClass);fsClass();
  window.addEventListener('beforeunload',(e)=>{if(hasLiveAttempt()){e.preventDefault();e.returnValue='Are you sure?';return e.returnValue;}});
}

// TIMER
function minsLeft(s){const m=Math.ceil(Math.max(0,s)/60);return m+(m===1?' minute':' minutes')+' remaining';}
function fmt(s){if(s<0)s=0;return Math.floor(s/60).toString().padStart(2,'0')+':'+(s%60).toString().padStart(2,'0');}
/* The official Listening player has no timer in the DOM at any point (§1.5). This
   is the practice product's own clock, shown in the header in the candidate block's
   type. The bug it replaces: a SILENT 40-minute countdown that called finishExam()
   with no element to display it and no warning of any kind. It now warns. */
let _expireCb=null,_tuTimer=null;
function startTimer(section,onExpire){pauseTimer();function tick(){state.timers[section]--;updateTimerDisplay(section);if(state.timers[section]%5===0)saveState();if(state.timers[section]<=0){pauseTimer();timeUp(onExpire);}}updateTimerDisplay(section);timerInterval=setInterval(tick,1000);}
function updateTimerDisplay(section){
  const el=document.getElementById('timer-'+section),box=document.getElementById('hdr-clock');
  const t=Math.max(0,state.timers[section]);
  if(el)el.textContent=minsLeft(t);
  if(box){box.classList.toggle('warn',t<=300&&t>60);box.classList.toggle('crit',t<=60);box.classList.toggle('hidden',!!state.timerHidden&&t>300);}
  if(t<=300)state.timerHidden=false;
}
function pauseTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}}
function toggleTimer(){if(state.timers.listening<=300)return;state.timerHidden=!state.timerHidden;updateTimerDisplay('listening');saveState();}
function timeUp(onExpire){
  _expireCb=onExpire||finishExam;
  const d=document.getElementById('time-up');
  if(!d){const cb=_expireCb;_expireCb=null;cb();return;}
  d.classList.add('open');
  if(_tuTimer)clearTimeout(_tuTimer);
  _tuTimer=setTimeout(timeUpAck,25000);
}
function timeUpAck(){
  if(_tuTimer){clearTimeout(_tuTimer);_tuTimer=null;}
  const d=document.getElementById('time-up');if(d)d.classList.remove('open');
  const cb=_expireCb;_expireCb=null;if(cb)cb();
}

// TOAST
const TOAST_ICON={
  error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 2.8 20h18.4L12 4.5Z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>',
  warn:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5"/><path d="M12 16h.01"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.8h.01"/></svg>'
};
let toastTimeout=null;
function toast(msg,type,duration){
  const el=document.getElementById('toast');
  el.setAttribute('role',type==='error'?'alert':'status');
  el.innerHTML='<span class="t-ic" aria-hidden="true">'+(TOAST_ICON[type]||TOAST_ICON.info)+'</span>'
             +'<span class="t-msg">'+escapeHtml(msg)+'</span>';
  el.className='toast show'+(type?' '+type:'');
  clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>el.classList.remove('show'),duration||3200);
}

// RENDER
const BUILDERS=[];BUILDERS[PART_NO]=function(){return CFG.build(HELPERS());};
function renderListening(){renderSection(state.currentSection||1);}
function renderSection(n){
  n=PART_NO;state.currentSection=n;
  const root=document.getElementById('listening-render');
  root.innerHTML=BUILDERS[n]();
  attachHandlers();
  const [a,b]=NAV_RANGES[n];
  for(let i=a;i<=b;i++){if(state.listeningAnswers[i])setInput(i,state.listeningAnswers[i]);if(state.listeningFlags[i])applyFlagToPill(i);}restoreMultiGroups();
    const pt=document.getElementById('pbar-title'),pd=document.getElementById('pbar-desc');
  if(pt)pt.textContent=CFG.label||('Part '+n);if(pd)pd.textContent='Listen and answer questions '+Q_FROM+'\u2013'+Q_TO+'.';
  const area=document.getElementById('listening-area');if(area)area.scrollTop=0;
  document.querySelectorAll('#listening-render .gap-input').forEach(gapAutoGrow);
  updateListeningNav();saveState();
  restoreAnnotations(n);   // bring highlights/notes back after the re-render
  if(document.body.classList.contains('review-mode')){setTimeout(()=>{applyReviewReveal();reviewMultiGroups();addJumpButtons();
    try{showTranscriptPart(currentPaperPart());}catch(e){}
  },50);}
}
function setInput(qid,ans){const inp=document.getElementById('lq-'+qid);if(inp&&inp.dataset.dm){dmRestore(qid,ans);return;}if(inp&&(inp.tagName==='INPUT'||inp.tagName==='SELECT')){inp.value=ans;return;}const radios=document.getElementsByName('lq-'+qid);if(radios.length)radios.forEach(r=>{if(r.value===ans){r.checked=true;const opt=r.closest('.option');if(opt){opt.parentElement.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));opt.classList.add('selected');}}});}
function attachHandlers(){
  attachMultiHandlers();
  document.querySelectorAll('input[type="radio"][data-q]').forEach(r=>{
    r.addEventListener('change',()=>{const q=r.dataset.q;const opt=r.closest('.option');if(opt){opt.parentElement.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));opt.classList.add('selected');}state.listeningAnswers[q]=r.value;state.activeQuestion=parseInt(q,10);updateListeningNav();saveState();});
    r.addEventListener('focus',()=>{state.activeQuestion=parseInt(r.dataset.q,10);updateListeningNav();});
  });
  // clicking into a box makes that question the active scorable item, exactly as
  // clicking a footer number box does
  document.querySelectorAll('#listening-render .gap-input').forEach(inp=>{
    inp.addEventListener('focus',()=>{state.activeQuestion=parseInt(inp.dataset.lq,10);updateListeningNav();});
  });
}
/* THE AUTO-GROW. The official rewrites the input's inline width from a hidden
   mirror span (span.textEntry__shadowElement, font 16px/24px Arial, white-space
   pre): "" -> 20px, "round" -> 60.92px, "extraordinarily" -> 120.484px, with
   min-width:104px and max-width:100% doing the clamping. */
function gapAutoGrow(el){
  if(!el)return;
  const cs=getComputedStyle(el);
  let m=gapAutoGrow._m;
  if(!m){m=gapAutoGrow._m=document.createElement('span');m.className='gap-mirror';m.style.cssText='position:absolute;top:-9999px;left:-9999px;visibility:hidden;white-space:pre;height:0;overflow:hidden';document.body.appendChild(m);}
  m.style.font=cs.font||(cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily);
  m.style.letterSpacing=cs.letterSpacing;
  m.textContent=el.value||'';
  const extra=(parseFloat(cs.paddingLeft)||0)+(parseFloat(cs.paddingRight)||0)+
              (parseFloat(cs.borderLeftWidth)||0)+(parseFloat(cs.borderRightWidth)||0);
  el.style.width=(m.getBoundingClientRect().width+extra+2)+'px';
}
function onListeningInput(qid){const el=document.getElementById('lq-'+qid);if(!el)return;gapAutoGrow(el);state.listeningAnswers[qid]=el.value.trim();state.activeQuestion=parseInt(qid,10);updateListeningNav();saveState();}
function setDragAnswer(qid,val){if(val){state.listeningAnswers[qid]=val;}else{delete state.listeningAnswers[qid];}updateListeningNav();saveState();}
function toggleFlag(qid){state.listeningFlags[qid]=!state.listeningFlags[qid];applyFlagToPill(qid);updateListeningNav();saveState();}
function applyFlagToPill(qid){document.querySelectorAll('.q-pill[data-flag="'+qid+'"]').forEach(p=>p.classList.toggle('flagged',!!state.listeningFlags[qid]));}

// NAV

// ── ADDED: multi-select 'choose TWO' (sorted picks -> per-id matcher) ──
function msSync(g,changed){
  var ids=g.dataset.msIds.split(',').map(function(s){return s.trim();});
  var max=ids.length;
  var boxes=[].slice.call(g.querySelectorAll('.ms-box'));
  var checked=boxes.filter(function(b){return b.checked;});
  if(checked.length>max&&changed){changed.checked=false;checked=boxes.filter(function(b){return b.checked;});}
  boxes.forEach(function(b){var o=b.closest('.ms-option');if(o)o.classList.toggle('selected',b.checked);});
  var vals=checked.map(function(b){return b.value;}).sort();
  ids.forEach(function(id,i){setDragAnswer(id,vals[i]||'');});
}
function attachMultiHandlers(){
  document.querySelectorAll('.ms-group').forEach(function(g){
    g.querySelectorAll('.ms-box').forEach(function(b){
      b.addEventListener('change',function(){msSync(g,b);});
    });
  });
}
function restoreMultiGroups(){
  document.querySelectorAll('.ms-group').forEach(function(g){
    var ids=g.dataset.msIds.split(',').map(function(s){return s.trim();});
    var vals=ids.map(function(id){return state.listeningAnswers[id];}).filter(Boolean);
    g.querySelectorAll('.ms-box').forEach(function(b){
      var on=vals.indexOf(b.value)>=0;b.checked=on;
      var o=b.closest('.ms-option');if(o)o.classList.toggle('selected',on);
    });
  });
}
function reviewMultiGroups(){
  document.querySelectorAll('.ms-group').forEach(function(g){
    var ids=g.dataset.msIds.split(',').map(function(s){return s.trim();});
    var cset={};
    ids.forEach(function(id){String(LISTENING_ANSWERS[id]||'').split('|').forEach(function(c){if(c.trim())cset[c.trim().toUpperCase()]=1;});});
    var correct=Object.keys(cset);
    g.querySelectorAll('.ms-box').forEach(function(b){
      var o=b.closest('.ms-option');if(!o)return;
      if(cset[b.value.toUpperCase()])o.classList.add('correct');
      else if(b.checked)o.classList.add('wrong');
    });
    var got=[].slice.call(g.querySelectorAll('.ms-box')).filter(function(b){return b.checked;}).map(function(b){return b.value.toUpperCase();});
    var nRight=got.filter(function(v){return cset[v];}).length;
    var ok=(nRight===correct.length&&got.length===correct.length);
    var fb=document.getElementById('lfb-'+ids[0]);
    if(fb){fb.className='feedback-pill show '+(ok?'correct':'wrong');
      fb.innerHTML=feedbackHTML(ok,escapeHtml(correct.join(', ')));}
  });
}

const NAV_RANGES={};NAV_RANGES[PART_NO]=[Q_FROM,Q_TO];
/* NAV_GROUPS now lives in the test pack above */
function isAnswered(i){return !!(state.listeningAnswers[i]&&state.listeningAnswers[i].toString().trim()!=='');}
function groupAnswered(g){return g.every(isAnswered);}
function sectionComplete(s){const [a,b]=NAV_RANGES[s];for(let i=a;i<=b;i++)if(!isAnswered(i))return false;return true;}
function firstUnanswered(s){const [a,b]=NAV_RANGES[s];for(let i=a;i<=b;i++)if(!isAnswered(i))return i;return b;}
function navScoreLabel(s){const [a,b]=NAV_RANGES[s];let c=0;for(let i=a;i<=b;i++)if(isAnswered(i))c++;return c+'/'+(b-a+1);}
/* THE FOUR-CELL FOOTER (§8). Every cell is flex:1 1 0% with min-width:auto — the
   growth rule. The selected cell shows its ten number boxes and is justified to
   flex-start; the other three centre a "Part N   n of 10" label. The 3px rail is
   the ::before on the label and on each number-box wrapper; an ATTEMPTED question
   turns its own segment #358E14 and the box itself does not change. */
function isSubmitting(){const st=document.getElementById('stage-listening');return !!(st&&st.classList.contains('submitting'));}
function updateListeningNav(){
  const nav=document.getElementById('listening-nav');if(!nav)return;
  const submitting=isSubmitting();
  const cur=state.currentSection||1,curQ=state.activeQuestion||firstUnanswered(cur);
  function partLabel(s){return CFG.label?'<span class="sectionNr">'+CFG.label.replace(/</g,'&lt;')+'</span>':'<span class="section-prefix">Part&nbsp;</span><span class="sectionNr">'+s+'</span>';}
  function sH(s){
    const groups=NAV_GROUPS[s];
    if(s===cur&&!submitting){
      let pills='';
      groups.forEach(g=>{
        const label=g[0],answered=isAnswered(g[0]);
        let cls='qpill';if(g[0]===curQ)cls+=' current';if(state.listeningFlags[g[0]])cls+=' flagged';
        pills+='<div class="qpill-wrap'+(answered?' answered':'')+'"><div class="'+cls+'" onclick="ExamApp.jumpToListening('+g[0]+')">'+label+'</div></div>';
      });
      return '<div class="bnav-section sel"><div class="bnav-part cur"><div class="bnav-row"><span class="bnav-plabel" onclick="ExamApp.jumpToListeningPart('+s+')">'+partLabel(s)+'</span><div class="bnav-pills">'+pills+'</div></div></div></div>';
    }
    return '<div class="bnav-section"><div class="bnav-part other" onclick="ExamApp.jumpToListeningPart('+s+')"><span class="bnav-plabel2">'+partLabel(s)+'<span class="bnav-pscore">'+navScoreLabel(s)+'</span></span></div></div>';
  }
  const submitBtn=!document.body.classList.contains('review-mode')?'<button id="sub-btn"'+(submitting?' class="active"':'')+' onclick="LSN.deliverClick()" title="Go to submission page" aria-label="Go to submission page"><svg class="fa-glyph" width="19" height="19" viewBox="0 0 1792 1792" aria-hidden="true" focusable="false"><g transform="translate(0,1536) scale(1,-1)"><path fill="currentColor" d="M1671 970q0 -40 -28 -68l-724 -724l-136 -136q-28 -28 -68 -28t-68 28l-136 136l-362 362q-28 28 -28 68t28 68l136 136q28 28 68 28t68 -28l294 -295l656 657q28 28 68 28t68 -28l136 -136q28 -28 28 -68z"/></g></svg></button>':'<button id="sub-btn" onclick="ExamApp.backToResults()" style="font-size:14px;width:auto;max-width:none;padding:0 16px;">← Results</button>';
  nav.innerHTML=sH(PART_NO)+submitBtn;
  document.querySelectorAll('#listening-render .q-pill').forEach(function(pl){
    pl.classList.toggle('current',parseInt(pl.dataset.qnum,10)===curQ);
  });
  document.querySelectorAll('#listening-render .drag-drop').forEach(function(dz){
    dz.classList.toggle('dm-active-q',parseInt(dz.dataset.q,10)===curQ);
  });
  document.querySelectorAll('#listening-render .mx-row').forEach(function(tr){
    tr.classList.toggle('mx-active',parseInt(tr.dataset.q,10)===curQ);
  });
  // the practice clock is exam furniture only; review has the transport strip there
  const clk=document.getElementById('hdr-clock');
  if(clk)clk.style.display=document.body.classList.contains('review-mode')?'none':'';
  updateArrowState();
}
/* the official previous arrow is #dddddd — DISABLED — at Part 1, and only turns
   #4C4C4C once there is somewhere to go back to. It is never faded. */
function updateArrowState(){
  const cur=state.currentSection||1,submitting=isSubmitting();
  const prev=document.querySelector('#qnav-arrows .prev'),next=document.querySelector('#qnav-arrows .next');
  if(prev)prev.disabled=!submitting;
  if(next)next.disabled=submitting;
}
function nextSection(){if(isSubmitting())return;const cur=state.currentSection||1;LSN.goToSubmission();}

/* ══════════════════════════════════════════════════════════════════════════
   EXAM-SCREEN CHROME — Options page, Messages page, Notes sidebar, submission
   page. Exposed on window.LSN rather than on ExamApp's frozen public API.
   ══════════════════════════════════════════════════════════════════════════ */
var LSN=(function(){
  function stage(){return document.getElementById('stage-listening');}

  /* ---- Exam Settings: a centred dialog — Theme, Text Size, Audio Speed,
          Report Issue, Leave Test Without Saving ---- */
  var _theme='light';          // 'light' | 'dark' | 'system' (| legacy 'yob')
  var _textSize='regular';     // 'regular' | 'large' | 'xlarge'
  var _rate=1;
  var _sysMQ=null,_sysFn=null;
  var _lastFocus=null;

  function overlay(){return document.getElementById('set-overlay');}
  function openOptions(){
    const o=overlay();if(!o)return;
    _lastFocus=document.activeElement;
    syncSettings();
    o.classList.add('open');o.setAttribute('aria-hidden','false');
    const sel=o.querySelector('.set-opt.sel')||o.querySelector('.set-opt');
    if(sel)setTimeout(function(){try{sel.focus({preventScroll:true});}catch(e){}},0);
  }
  function closeOptions(){
    const o=overlay();if(!o)return;
    o.classList.remove('open');o.setAttribute('aria-hidden','true');
    if(_lastFocus&&_lastFocus.focus){try{_lastFocus.focus({preventScroll:true});}catch(e){}}
    _lastFocus=null;
  }
  function syncSettings(){
    const o=overlay();if(!o)return;
    const mark=function(attr,val){o.querySelectorAll('['+attr+']').forEach(function(b){
      const on=String(b.getAttribute(attr))===String(val);
      b.classList.toggle('sel',on);b.setAttribute('aria-checked',on?'true':'false');b.tabIndex=on?0:-1;});};
    mark('data-theme-opt',_theme==='yob'?'dark':_theme);
    mark('data-size-opt',_textSize);
    mark('data-rate-opt',_rate);
  }
  /* Esc closes; Tab stays inside the dialog; a click on the backdrop closes. */
  document.addEventListener('keydown',function(e){
    const o=overlay();if(!o||!o.classList.contains('open'))return;
    if(e.key==='Escape'){e.preventDefault();closeOptions();return;}
    if(e.key==='Tab'){
      const f=[].slice.call(o.querySelectorAll('button')).filter(function(b){return b.offsetParent!==null;});
      if(!f.length)return;
      const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
    if((e.key==='ArrowDown'||e.key==='ArrowUp'||e.key==='ArrowRight'||e.key==='ArrowLeft')&&document.activeElement&&document.activeElement.getAttribute('role')==='radio'){
      const grp=[].slice.call(document.activeElement.parentElement.querySelectorAll('[role=radio]'));
      const i=grp.indexOf(document.activeElement),d=(e.key==='ArrowDown'||e.key==='ArrowRight')?1:-1;
      const nx=grp[(i+d+grp.length)%grp.length];
      if(nx){e.preventDefault();nx.focus();nx.click();}
    }
  });
  document.addEventListener('click',function(e){const o=overlay();if(o&&e.target===o)closeOptions();});

  /* Theme. "System" follows the OS and keeps following it while it is chosen. */
  function applyTheme(dark){
    const st=stage();
    if(st&&_theme!=='yob')st.classList.remove('yob');
    ExamApp.setTheme(dark?'dark':'light');
  }
  function setContrast(v){
    if(v!=='light'&&v!=='dark'&&v!=='system'&&v!=='yob')v='light';
    _theme=v;
    const st=stage();
    if(_sysMQ&&_sysFn){try{_sysMQ.removeEventListener('change',_sysFn);}catch(e){try{_sysMQ.removeListener(_sysFn);}catch(e2){}}_sysMQ=_sysFn=null;}
    if(v==='yob'){ExamApp.setTheme('dark');if(st)st.classList.add('yob');}
    else if(v==='system'){
      let mq=null;try{mq=window.matchMedia('(prefers-color-scheme: dark)');}catch(e){}
      applyTheme(!!(mq&&mq.matches));
      if(mq){
        _sysMQ=mq;_sysFn=function(ev){if(_theme==='system')applyTheme(ev.matches);};
        try{mq.addEventListener('change',_sysFn);}catch(e){try{mq.addListener(_sysFn);}catch(e2){}}
      }
    }
    else{applyTheme(v==='dark');}
    try{localStorage.setItem('cdi_listening_contrast',v);}catch(e){}
    syncSettings();
  }

  /* Text size. The whole paper is scaled — questions, tables, the map, the
     answer grid, drag chips — by the same factor the official player uses
     (16 -> 19 -> 22 px on a 16 px base). CSS `zoom` reflows layout, so nothing
     overlaps; a browser without it falls back to growing the text classes. */
  var TEXT_SCALE={regular:1,large:19/16,xlarge:22/16};
  var TEXT_PX={regular:0,large:3,xlarge:6};
  var HAS_ZOOM=(function(){try{return !!(window.CSS&&CSS.supports&&CSS.supports('zoom','1.2'));}catch(e){return false;}})();
  function setTextSize(v){
    if(!(v in TEXT_SCALE))v='regular';
    const area=document.getElementById('listening-area');
    // keep the reader on the same line: remember how far down the paper they are
    const frac=(area&&area.scrollHeight>area.clientHeight)?area.scrollTop/area.scrollHeight:0;
    _textSize=v;
    const root=document.documentElement;
    if(HAS_ZOOM){
      root.style.setProperty('--text-scale',String(TEXT_SCALE[v]));
      root.style.setProperty('--text-zoom','0px');
    }else{
      root.style.setProperty('--text-scale','1');
      root.style.setProperty('--text-zoom',TEXT_PX[v]+'px');
    }
    document.body.setAttribute('data-text-size',v);
    try{localStorage.setItem('cdi_listening_textsize',v);}catch(e){}
    syncSettings();
    requestAnimationFrame(function(){
      document.querySelectorAll('#listening-render .gap-input').forEach(gapAutoGrow);
      if(area&&frac)area.scrollTop=frac*area.scrollHeight;
    });
  }

  /* Audio speed. Applied to the recording and mirrored on the review transport. */
  function setRate(r){
    r=parseFloat(r);if(!(r>=0.5&&r<=2))r=1;
    _rate=r;
    try{ExamApp.setPlaybackRate(r);}catch(e){}
    const sel=document.getElementById('speed-select');
    if(sel){const m=[].slice.call(sel.options).find(function(o){return parseFloat(o.value)===r;});if(m)sel.value=m.value;}
    try{localStorage.setItem('cdi_listening_rate',String(r));}catch(e){}
    syncSettings();
  }

  function reportIssue(){try{if(window.MockBridge&&MockBridge.reportIssue)MockBridge.reportIssue();}catch(e){}}
  function leaveTest(){
    if(!window.confirm('Leave the test without saving?\n\nYour answers for this attempt will be erased.'))return;
    try{pauseTimer();}catch(e){}
    try{stopAudio();}catch(e){}
    try{exitFullscreen();}catch(e){}
    window.__cdiIntentionalReload=true;wipeSession();location.reload();
  }
  function restorePrefs(){
    try{
      const c=localStorage.getItem('cdi_listening_contrast');if(c)setContrast(c);
      const z=localStorage.getItem('cdi_listening_textsize');if(z)setTextSize(z);
      const r=localStorage.getItem('cdi_listening_rate');if(r)setRate(r);
    }catch(e){}
    syncSettings();
  }

  /* ---- Messages: an empty white full-screen page, standard chrome ---- */
  function openMessages(){const p=document.getElementById('msg-page');if(p)p.classList.add('open');}
  function closeMessages(){const p=document.getElementById('msg-page');if(p)p.classList.remove('open');}

  /* ---- Notes: a 300px sidebar docked at x=1140 that SQUEEZES the exam ---- */
  function buildNotes(){
    const panel=document.getElementById('notes-panel');
    if(!panel||panel._lsn)return;
    panel._lsn=1;
    panel.innerHTML=
      '<div class="np-hdr"><span class="np-title">Notes</span>'+
      '<button type="button" class="np-close" onclick="LSN.toggleNotes(false)" aria-label="Hide notes">&#10005;</button></div>'+
      '<div class="np-body">'+
      '<div class="np-empty"><b>Your private notes will<br>show here</b>'+
      '<i>Select text to highlight or create a note.</i></div>'+
      '<textarea id="notes-area" spellcheck="false" aria-label="Notes"></textarea></div>';
    const ta=document.getElementById('notes-area');
    try{ta.value=localStorage.getItem('cdi_listening_notes')||'';}catch(e){}
    document.body.classList.toggle('notes-typed',!!ta.value);
    ta.addEventListener('input',function(){
      try{localStorage.setItem('cdi_listening_notes',ta.value);}catch(e){}
      document.body.classList.toggle('notes-typed',!!ta.value);
    });
  }
  function toggleNotes(force){
    buildNotes();
    const open=(force===undefined)?!document.body.classList.contains('notes-open'):!!force;
    document.body.classList.toggle('notes-open',open);
    const b=document.getElementById('notes-btn');
    if(b)b.setAttribute('aria-label',open?'Hide notes':'Show notes');
    if(open)setTimeout(function(){const ta=document.getElementById('notes-area');if(ta)try{ta.focus();}catch(e){}},0);
  }

  /* ---- Submission page (§13). The audio keeps playing throughout; the back
          arrow returns to the exam with the audio still running. ---- */
  function goToSubmission(){
    closeOptions();
    const st=stage();if(!st)return;
    st.classList.add('submitting');
    updateListeningNav();
    const a=document.getElementById('listening-area');if(a)a.scrollTop=0;
  }
  function backFromSubmission(){
    const st=stage();if(!st)return;
    st.classList.remove('submitting');
    updateListeningNav();
  }
  function deliverClick(){if(isSubmitting())backFromSubmission();else goToSubmission();}
  function submitConfirm(){ExamApp.finishExam();}

  return {openOptions,closeOptions,setContrast,setTextSize,setRate,reportIssue,leaveTest,
          openMessages,closeMessages,toggleNotes,buildNotes,
          goToSubmission,backFromSubmission,deliverClick,submitConfirm,
          timeUpAck:function(){timeUpAck();},restorePrefs};
})();
window.LSN=LSN;
function prevSection(){if(isSubmitting()){LSN.backFromSubmission();return;}const cur=state.currentSection||1;}
function jumpToListeningPart(n){if(isSubmitting())LSN.backFromSubmission();state.activeQuestion=null;renderSection(n);updateArrowState();}
function jumpToListening(qid){
  const numId=parseInt(qid);let s=PART_NO;
  state.activeQuestion=numId;
  if(s!==state.currentSection){renderSection(s);updateArrowState();setTimeout(()=>doScrollTo(numId),80);}
  else{doScrollTo(numId);updateListeningNav();}
}
function doScrollTo(qid){
  const area=document.getElementById('listening-area');if(!area)return;
  const el=document.getElementById('lq-card-'+qid)||document.getElementById('lq-row-'+qid)||
           (document.getElementById('lq-'+qid)&&document.getElementById('lq-'+qid).closest('.q-card,.gap-line'));
  if(!el)return;
  const areaRect=area.getBoundingClientRect(),elRect=el.getBoundingClientRect();
  area.scrollTo({top:area.scrollTop+(elRect.top-areaRect.top)-102,behavior:'smooth'});
  const inp=document.getElementById('lq-'+qid);
  if(inp&&inp.tagName==='INPUT'&&inp.type==='text')setTimeout(()=>{try{inp.focus();}catch(e){}},260);
}

// AUDIO
function audioWindowEnd(a){var d=(a&&a.duration)||0;return (A_END&&A_END>A_START)?(d?Math.min(A_END,d):A_END):d;}
function audioWindowLen(a){return Math.max(0,audioWindowEnd(a)-A_START);}
function wirePartWindow(audio){
  if(!audio||audio._winWired)return;audio._winWired=1;
  const toStart=function(){if(A_START>0&&audio.currentTime<A_START-0.5){try{audio.currentTime=A_START;}catch(e){}}};
  audio.addEventListener('loadedmetadata',toStart);
  audio.addEventListener('canplay',toStart,{once:true});
  audio.addEventListener('playing',function(){if(!audio._winPlayed){audio._winPlayed=true;toStart();}});
  if(audio.readyState>=1)toStart();
  audio.addEventListener('play',function(){
    if(audio._partDone){audio._partDone=false;try{audio.currentTime=A_START;}catch(e){}}
  });
  audio.addEventListener('timeupdate',function(){
    if(!A_END||audio._partDone||audio.seeking)return;
    if(audio.currentTime>=audioWindowEnd(audio)){
      audio._partDone=true;audio.pause();
      try{audio.dispatchEvent(new Event('ended'));}catch(e){}
    }
  });
}
var FA_VOLUME_UP_SVG='<svg class="fa-glyph" width="12.3828" height="13.3333" viewBox="0 0 1664 1792" aria-hidden="true" focusable="false"><g transform="translate(0,1536) scale(1,-1)"><path fill="currentColor" d="M768 1184v-1088q0 -26 -19 -45t-45 -19t-45 19l-333 333h-262q-26 0 -45 19t-19 45v384q0 26 19 45t45 19h262l333 333q19 19 45 19t45 -19t19 -45zM1152 640q0 -76 -42.5 -141.5t-112.5 -93.5q-10 -5 -25 -5q-26 0 -45 18.5t-19 45.5q0 21 12 35.5t29 25t34 23t29 36t12 56.5t-12 56.5t-29 36t-34 23t-29 25t-12 35.5q0 27 19 45.5t45 18.5q15 0 25 -5q70 -27 112.5 -93t42.5 -142zM1408 640q0 -153 -85 -282.5t-225 -188.5q-13 -5 -25 -5q-27 0 -46 19t-19 45q0 39 39 59q56 29 76 44q74 54 115.5 135.5t41.5 173.5t-41.5 173.5t-115.5 135.5q-20 15 -76 44q-39 20 -39 59q0 26 19 45t45 19q13 0 26 -5q140 -59 225 -188.5t85 -282.5zM1664 640q0 -230 -127 -422.5t-338 -283.5q-13 -5 -26 -5q-26 0 -45 19t-19 45q0 36 39 59q7 4 22.5 10.5t22.5 10.5q46 25 82 51q123 91 192 227t69 289t-69 289t-192 227q-36 26 -82 51q-7 4 -22.5 10.5t-22.5 10.5q-39 23 -39 59q0 26 19 45t45 19q13 0 26 -5q211 -91 338 -283.5t127 -422.5z"/></g></svg>';
function startLockedAudio(){if(startLockedAudio._done){showAudioGate();return;}startLockedAudio._done=1;
  const audio=document.getElementById('exam-audio'),badge=document.getElementById('audio-state-badge'),hdrBadge=document.getElementById('audio-hdr-badge'),overlay=document.getElementById('audio-click-overlay');if(!audio)return;
  // review mode only. The exam screen must never expose a seek or replay affordance.
  overlay&&overlay.addEventListener('click',(e)=>{if(!document.body.classList.contains('review-mode'))return;const track=document.getElementById('audio-progress-track');if(track&&audio.duration){const rect=track.getBoundingClientRect();audio.currentTime=A_START+Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*audioWindowLen(audio);audio.play().catch(()=>{});}});
  audio.addEventListener('play',()=>{if(badge){badge.textContent='● PLAYING';badge.style.color='var(--emerald)';}if(hdrBadge){hdrBadge.innerHTML=FA_VOLUME_UP_SVG+'<span class="ttid-sub-title">Audio is Playing</span>';}const b=document.getElementById('pp-btn');if(b)b.textContent='⏸';});
  audio.addEventListener('ended',()=>{if(badge){badge.textContent='■ FINISHED';badge.style.color='var(--ink-mute)';}if(hdrBadge){hdrBadge.innerHTML='';}const b=document.getElementById('pp-btn');if(b)b.textContent='▶';});
  const resumeGuard=function(){const g=document.getElementById('audio-gate');return isExamActive()&&!audio.ended&&!audio._partDone&&state.stage==='listening'&&!document.body.classList.contains('review-mode')&&!(g&&g.classList.contains('show'));};
  audio.addEventListener('pause',()=>{const b=document.getElementById('pp-btn');if(b&&!audio.ended)b.textContent='▶';if(resumeGuard())setTimeout(()=>{if(resumeGuard())audio.play().catch(()=>{});},50);});
  if(badge){badge.textContent='◌ LOADING';badge.className='';badge.style.color='';}if(hdrBadge){hdrBadge.innerHTML='';}
  wireTransport(audio);wirePartWindow(audio);
  audio.load();showAudioGate();
}
function wireTransport(audio){
  // Idempotent, and called from BOTH startLockedAudio and reviewExam: the
  // display wiring used to live only in startLockedAudio, so reloading
  // straight into review left the scrub bar and clock permanently dead.
  if(!audio||audio._transportWired)return;
  audio._transportWired=1;
  const badge=document.getElementById('audio-state-badge');
  audio.addEventListener('timeupdate',()=>{const fill=document.getElementById('audio-progress-fill'),disp=document.getElementById('audio-time-display');const len=audioWindowLen(audio);if(len>0){const cur=Math.max(0,Math.min(len,audio.currentTime-A_START));const pct=(cur/len*100);const trk=document.getElementById('audio-progress-track');if(trk)trk.style.setProperty('--pp',pct+'%');if(fill)fill.style.width=pct+'%';if(disp){const p2=n=>Math.floor(n).toString().padStart(2,'0');disp.textContent=p2(cur/60)+':'+p2(cur%60)+' / '+p2(len/60)+':'+p2(len%60);}}});
  // The badge used to be written only by `play` and `ended`, so a track that
  // never loads sat on LOADING forever with no explanation.
  var setBadge=function(txt,cls){if(badge){badge.textContent=txt;badge.className=cls||'';}};
  audio.addEventListener('canplay',function(){if(audio.paused)setBadge('● READY','is-ready');});
  audio.addEventListener('waiting',function(){setBadge('◌ BUFFERING','');});
  audio.addEventListener('stalled',function(){setBadge('◌ STALLED','');});
  audio.addEventListener('error',function(){setBadge('✕ NO AUDIO','is-error');});
  audio.addEventListener('progress',function(){
    var b=document.getElementById('audio-buffered');
    if(b&&audio.duration&&audio.buffered.length){
      b.style.width=(audio.buffered.end(audio.buffered.length-1)/audio.duration*100)+'%';
    }
  });
}

function stopAudio(){hideAudioGate();const audio=document.getElementById('exam-audio');if(audio){try{audio.pause();audio.removeAttribute('src');audio.load();}catch(e){}}}
function showAudioGate(){if(document.body.classList.contains('review-mode'))return;/* the gate belongs to the running paper only: a rejected play() promise can land after the test has been submitted, and at z-index 1000 it would sit over the score sheet and swallow every click. */if(state.stage!=='listening'||document.body.classList.contains('pre-entry'))return;const g=document.getElementById('audio-gate');if(!g)return;g.classList.add('show');const b=document.getElementById('ag-play-btn');if(b)setTimeout(function(){try{b.focus();}catch(e){}},0);}
function hideAudioGate(){const g=document.getElementById('audio-gate');if(g)g.classList.remove('show');}
function startGatedAudio(){const audio=document.getElementById('exam-audio');hideAudioGate();if(!audio)return;const p=audio.play();if(p&&p.catch)p.catch(function(){showAudioGate();});}
function setVolume(val){const audio=document.getElementById('exam-audio');if(audio)audio.volume=parseFloat(val);}
function setPlaybackRate(val){const audio=document.getElementById('exam-audio');if(audio)audio.playbackRate=parseFloat(val);}
function seekAudio(delta){const audio=document.getElementById('exam-audio');if(!audio||!audio.duration)return;audio._partDone=false;audio.currentTime=Math.max(A_START,Math.min(audioWindowEnd(audio),audio.currentTime+delta));}
function togglePlayPause(){const audio=document.getElementById('exam-audio'),btn=document.getElementById('pp-btn');if(!audio)return;if(audio.paused){audio.play().catch(()=>{});if(btn)btn.textContent='⏸';}else{audio.pause();if(btn)btn.textContent='▶';}}
function isExamActive(){return state.stage==='listening';}

// HIGHLIGHTER
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
    const g = document.getElementById('audio-gate');
    if (g && g.classList.contains('show')) return;
    // ONLY allow highlighter during the active test. Disable in Review Mode.
    if (state.stage !== 'listening' || document.body.classList.contains('review-mode')) {
        return;
    }

    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel.rangeCount || sel.isCollapsed) return;
      
      const range = sel.getRangeAt(0);
      // Highlight and Note exist only on the listening paper itself: the
      // selection must sit wholly inside #listening-render, and never in a field.
      const host = document.getElementById('listening-render');
      const inHost = n => { const el = n && (n.nodeType === 1 ? n : n.parentElement); return !!(host && el && host.contains(el) && !el.closest('input,textarea,select,button')); };
      if (!inHost(range.startContainer) || !inHost(range.endContainer)) { popup.classList.remove('show'); return; }
      const rect = range.getBoundingClientRect();

      // Plain text offers Note + Highlight; a selection on an existing highlight
      // offers Remove + Add Note instead.
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

function validateStart(){
  const nameEl=document.getElementById('start-name');
  const field=document.getElementById('start-field');
  const hint=document.getElementById('start-hint-text');
  const name=nameEl.value.trim();
  if(name.length<2){
    // A designed inline error rather than a toast: the fault is in the field,
    // so the correction belongs beside the field.
    if(field){field.classList.remove('is-invalid');void field.offsetWidth;field.classList.add('is-invalid');}
    if(hint)hint.textContent=name
      ?'That looks a little short — please enter your full name.'
      :'Enter your name to begin. It appears on your band-score certificate.';
    nameEl.focus();
    return;
  }
  if(field)field.classList.remove('is-invalid');
  if(hint)hint.textContent='Appears on your band\u2011score certificate.';
  state.student.name=name;saveState();updateHeaderName(name);
  // the briefing greets the candidate by first name — the one place in the
  // whole shell where the product speaks to a person rather than a user
  const greet=document.getElementById('intro-greet');
  if(greet){
    const first=name.split(/\s+/)[0];
    greet.textContent=first.length<=18?'Ready when you are, '+first+'.':'Ready when you are.';
  }
  beginExam();
}
function beginExam(){state.startedAt=new Date().toISOString();saveState();const p=enterFullscreen();const advance=()=>{document.body.classList.add('no-select');goToStage('listening-intro');};if(p&&typeof p.finally==='function')p.finally(advance);else advance();}
function beginListening(){
  // Curtain: dim the particle layer and drop the briefing card *before* the
  // stage swap, so the plain white exam never inherits a frame of the shell.
  if(window.CDIAtmosphere&&window.CDIAtmosphere.dim)window.CDIAtmosphere.dim();
  document.body.classList.add('cdi-exit');
  const go=()=>{
    goToStage('listening');renderListening();
    startTimer('listening',()=>{toast('Time is up — well done!','success');finishExam();});
    startLockedAudio();
    setTimeout(function () { document.body.classList.remove('cdi-exit'); }, 240);
  };
  if(window.__cdiReduced)go();else setTimeout(go, 260);
}
/* One press submits (the ✓ used to need a second press within 3 seconds); only while the test runs, so a double click submits once. */
function confirmSubmit(btn){if(state.stage!=='listening')return;finishExam();}
function backToResults(){
  // Move audio controls back to pbar
  const audioEl=document.getElementById('pbar-audio');
  const pbarInner=document.getElementById('pbar-inner');
  if(audioEl&&pbarInner)pbarInner.appendChild(audioEl);
  document.body.classList.remove('tp-active');
  goToStage('results');window.scrollTo(0,0);
}
/* The submission page is a state of the RUNNING exam: `.submitting` hides the
   whole question sheet and raises the "Click next to continue" bar in its
   place. Nothing used to take it off, and the class outlived the exam — so
   review, which re-shows #stage-listening, re-showed it still wearing the
   submission page: a blank sheet under a toc bar, with the transcript beside
   it working perfectly. It comes off here, at the moment the exam stops,
   rather than in review, which is only where the damage happened to surface. */
function finishExam(){
  pauseTimer();
  try{window.getSelection().removeAllRanges();const hp=document.getElementById('hl-popup');if(hp)hp.classList.remove('show');}catch(e){}
  try{stopAudio();}catch(e){}
  state.finishedAt=new Date().toISOString();saveState();
  document.body.classList.remove('no-select');
  const st=document.getElementById('stage-listening');if(st)st.classList.remove('submitting');
  try{updateListeningNav();updateArrowState();}catch(e){}
  try{exitFullscreen();}catch(e){}
  try{const g=gradeListening();window.dispatchEvent(new CustomEvent('ieltsx:test-finished',{detail:{correct:g.score,total:g.total,band:g.band}}));}catch(e){}
  /* FULL MOCK: hand the graded paper to the mock shell (see js/bridge.js). */
  if(window.MockBridge&&MockBridge.embedded){MockBridge.done('listening',gradeListening());return;}
  goToStage('results');
  renderResults();
}
function unlockResults(){goToStage('results');renderResults();}
/* 'Finish' on the results screen: this attempt is done (the result is already saved), so go back to the list the test came from */
function finishAndLeave(){
  var url=CFG.finishUrl;
  if(!url){var p=location.pathname;url=(/^\/(full-tests\/listening|listening)\//i.test(p)||CFG.label)?'/full-tests/listening/':'/part/practice/listening';}
  window.__cdiIntentionalReload=true;wipeSession();location.href=url;
}
function resetExam(){
  /* The confirmation sheet lived on the registration card and went with it, so
     the question is asked plainly instead of silently taking the safe path. */
  if(!window.confirm('Clear this test and start again?\n\nYour answers, your band score and the marked transcript for this attempt are erased.'))return;
  window.__cdiIntentionalReload=true;wipeSession();location.reload();
}
function resetExamLegacy(){
  chSheet({
    eyebrow:'Start over',
    title:'Clear this test and start again?',
    body:'Your answers, your band score and the marked transcript for this attempt are erased. There is no way back to them.',
    goLabel:'Start a fresh test',
    ghostLabel:'Keep my results',
    onGo:function(){window.__cdiIntentionalReload=true;wipeSession();location.reload();}
  });
}
function setTheme(name){document.body.classList.remove('dark-mode','theme-sepia');if(name==='dark')document.body.classList.add('dark-mode');else if(name==='sepia')document.body.classList.add('theme-sepia');document.querySelectorAll('.theme-dot').forEach(d=>d.classList.toggle('active',d.dataset.theme===name));localStorage.setItem('cdi_reading_theme',name);}
let currentTextZoom=0;
function zoomText(step){currentTextZoom+=step;if(currentTextZoom<-3)currentTextZoom=-3;if(currentTextZoom>8)currentTextZoom=8;document.documentElement.style.setProperty('--text-zoom',currentTextZoom+'px');}

// GRADING
function checkAnswerMatch(given,correct){if(!given)return false;const g=given.toString().trim().toLowerCase();return correct.toString().toLowerCase().split('|').some(a=>a.trim()===g);}
/* Q1–10 are Part 1, 11–20 Part 2, and so on: the paper is four ten-mark
   sections and every downstream breakdown hangs off that. */
function partOf(id){return id<=10?1:id<=20?2:id<=30?3:4;}
function mmss(sec){if(sec==null||isNaN(sec))return'';const s=Math.max(0,Math.round(sec));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
/* The single source of truth for every marked number in the app: the score
   report, the print report and review mode all read this one object.
   The shape only ever grows — `detail[i].{id,ua,ca,given,correct,isCorrect,
   status}` is what review mode binds to and must never move. Added on top:
   `part`, `at` (the second in the recording where the answer is spoken) and
   `atLabel`, plus per-part tallies and the band on the envelope.          */
function gradeListening(){
  let score=0;const detail=[];
  const parts=[{part:PART_NO,from:Q_FROM,to:Q_TO,total:0,correct:0,wrong:0,skipped:0}];
  for(let i=Q_FROM;i<=Q_TO;i++){
    const correct=LISTENING_ANSWERS[i];
    const given=(state.listeningAnswers[i]||'').toString().trim();
    let isCorrect=false;
    if(correct!==undefined){isCorrect=checkAnswerMatch(given,correct);if(isCorrect)score++;}
    const status=(correct===undefined)?(given?'unmarked':'skipped'):(given?(isCorrect?'correct':'wrong'):'skipped');
    const pn=PART_NO;
    const p=parts[0];p.total++;p[status]++;
    let at=null;
    try{if(typeof ANSWER_TIMES!=='undefined'&&ANSWER_TIMES[i]!=null)at=ANSWER_TIMES[i];}catch(e){}
    /* `cause` is added, never substituted: review mode binds to id/ua/ca/
       status and must not move. Only a typed question can carry one. */
    let cause=null;
    if(status==='wrong'&&listeningIsTyped(i))cause=classifyMiss(given,correct,listeningWordLimit(i));
    detail.push({id:i,ua:given,ca:correct?correct.replace(/\|/g,' / '):'',given,correct:correct?correct.replace(/\|/g,' / '):'',
                 isCorrect,status,part:pn,at:at,atLabel:mmss(at),cause:cause});
  }
  const nCorrect=detail.filter(q=>q.status==='correct').length;
  const nWrong=detail.filter(q=>q.status==='wrong').length;
  const nSkipped=detail.filter(q=>q.status==='skipped').length;
  return {score,total:Q_TO-Q_FROM+1,detail,band:bandFor(Math.round(score*40/(Q_TO-Q_FROM+1))),nCorrect,nWrong,nSkipped,parts};
}
/* ── Why a mark was actually lost ────────────────────────────────────────
   Ported from the Reading engine, which is the half of the report that changes
   what a candidate does next: "6 marks went on plurals" is an evening's work,
   "6 marks went on comprehension" is months of it. Two things are adapted for
   a recording rather than a page.

   ONE. Only Q1–10 and Q31–40 are typed. The rest are dragged chips and A–H
   map letters, where a plural or a spelling slip is not a thing that can
   happen — misclassifying those as "fixable" would flatter the candidate.

   TWO. Reading also prints a per-passage pace block. That is deliberately NOT
   here: Reading is self-paced, so time spent is a candidate's decision and
   worth reporting. Listening runs at the recording's speed for everyone, so
   the same block would report a choice nobody made. */
function levenshtein(a,b){
  const m=a.length,n=b.length;
  if(!m)return n; if(!n)return m;
  let prev=Array.from({length:n+1},(_,j)=>j),cur=new Array(n+1);
  for(let i=1;i<=m;i++){
    cur[0]=i;
    for(let j=1;j<=n;j++){
      cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    }
    [prev,cur]=[cur,prev];
  }
  return prev[n];
}
/* Which questions are TYPED, and their word limit, are read off the paper itself: each
   section is rendered once into a detached element, every gap-input is a typed question,
   and its limit is the nearest instruction above it ("ONE WORD AND/OR A NUMBER" → 1,
   "NO MORE THAN TWO WORDS" → 2). This used to be the ID range 1–10 / 31–40, which is
   only true of one particular paper — a Part 4 matching task would have had its letters
   scored for spelling slips. */
const _typedLimits={};let _typedScanned=false;
function parseWordLimit(t){const m=/(ONE|TWO|THREE)\s+WORDS?/.exec(String(t||'').toUpperCase());return m?({ONE:1,TWO:2,THREE:3})[m[1]]:null;}
function scanTypedQuestions(){
  if(_typedScanned)return;_typedScanned=true;
  const d=document.createElement('div');
  [PART_NO].forEach(function(n){
    try{d.innerHTML=BUILDERS[n]();}catch(e){return;}
    let cur=null;
    d.querySelectorAll('.instruction, input.gap-input[data-lq]').forEach(function(el){
      if(el.classList.contains('instruction')){const l=parseWordLimit(el.textContent);if(l!=null)cur=l;return;}
      _typedLimits[+el.dataset.lq]=cur==null?2:cur;
    });
  });
}
function listeningWordLimit(id){scanTypedQuestions();return (id in _typedLimits)?_typedLimits[id]:null;}
function listeningIsTyped(id){scanTypedQuestions();return id in _typedLimits;}

function classifyMiss(given,correct,limit){
  const g=String(given||'').trim().toLowerCase();
  if(!g)return null;
  if(limit&&g.split(/\s+/).filter(Boolean).length>limit)return 'limit';
  const variants=String(correct||'').toLowerCase().split('|').map(x=>x.trim());
  for(const c of variants){
    if(!c||g===c)continue;
    if(g===c+'s'||c===g+'s'||g===c+'es'||c===g+'es')return 'plural';
    const d=levenshtein(g,c);
    if(d>0&&d<=2&&c.length>=4&&Math.abs(g.length-c.length)<=2)return 'spelling';
  }
  return null;
}

function lossAnalysis(qs){
  const missed=qs.filter(q=>q.status==='wrong');
  const blank=qs.filter(q=>q.status==='skipped');
  const plural=missed.filter(q=>q.cause==='plural').length;
  const spelling=missed.filter(q=>q.cause==='spelling').length;
  const limitOv=missed.filter(q=>q.cause==='limit').length;
  const fixable=plural+spelling+limitOv;
  const real=missed.length-fixable;
  const lost=missed.length+blank.length;
  let lead;
  if(!lost)lead='Every one of the forty marks was scored. There is nothing to diagnose on this paper.';
  else if(blank.length&&missed.length)
    lead='You lost '+lost+' marks — '+blank.length+' left blank, '+missed.length+' answered wrong.';
  else if(blank.length)
    lead='You lost '+lost+' mark'+(lost>1?'s':'')+', every one of them left blank. The recording plays once, so a half-caught guess is always worth more than an empty box.';
  else if(fixable)
    lead='You lost '+lost+' mark'+(lost>1?'s':'')+' — but '+fixable+' of them '+(fixable>1?'were':'was')+' a slip, not a mishearing.';
  else
    lead='You lost '+lost+' mark'+(lost>1?'s':'')+', and all of them were genuine mishearings.';
  const notes=[];
  if(fixable)notes.push('You heard the answer on '+fixable+' of these — it just did not reach the box in the form the key wanted. That is spelling and grammar, and it is the cheapest band you will ever gain.');
  if(blank.length>=5)notes.push(blank.length+' blanks is the single biggest thing standing between you and a higher band. There is no penalty for a wrong answer in IELTS Listening, so never leave one empty.');
  return {missed:missed.length,blank:blank.length,plural,spelling,limitOv,fixable,real,lost,lead,notes};
}

function bandFor(score){if(score>=39)return 9.0;if(score>=37)return 8.5;if(score>=35)return 8.0;if(score>=33)return 7.5;if(score>=30)return 7.0;if(score>=27)return 6.5;if(score>=23)return 6.0;if(score>=19)return 5.5;if(score>=15)return 5.0;if(score>=13)return 4.5;if(score>=10)return 4.0;if(score>=8)return 3.5;if(score>=6)return 3.0;if(score>0)return 2.5;return 0;}
function bandLabel(b){if(b>=8.5)return'Expert user';if(b>=7.5)return'Very good user';if(b>=6.5)return'Good user';if(b>=5.5)return'Competent user';if(b>=4.5)return'Modest user';if(b>0)return'Limited user';return'No score';}
/* Chrome tier for the whole document, driven by the band only. Identical
   thresholds to the Writing report so a 7.0 lights the same way in both. */
function bandTier(b){if(b>=8)return'high';if(b>=7)return'good';if(b>=5.5)return'mid';return'low';}
/* Score colour ramp. Deliberately calm: a weak section is graphite, never
   red — the certificate reports, it does not scold. The --cv-* tokens are
   defined on both #stage-results .cert and #print-report, and the literal
   fallbacks keep the call honest anywhere else. */
function bandColorVar(b){
  if(b>=7)return'var(--cv-strong,#1f7a43)';
  if(b>=5.5)return'var(--cv-mid,#a97f34)';
  if(b>0)return'var(--cv-low,#78818f)';
  return'var(--cv-none,#b3ada4)';
}
/* Council-of-Europe equivalence — what an admissions page quotes back. */
function cefrOf(b){if(b>=8.5)return'C2';if(b>=7.0)return'C1';if(b>=5.5)return'B2';if(b>=4.0)return'B1';if(b>0)return'A2';return'—';}
/* What the band actually buys the candidate: the one honest sentence that
   keeps a 5.5 from feeling like a dead end and an 8.5 from feeling flat. */
const BAND_TARGETS=[
  {b:5.5,why:'the usual floor for foundation and pathway courses'},
  {b:6.0,why:'the common entry point for undergraduate study'},
  {b:6.5,why:'the level most undergraduate programmes ask for'},
  {b:7.0,why:'the level most postgraduate programmes ask for'},
  {b:7.5,why:'the level competitive courses and many visa routes ask for'},
  {b:8.0,why:'the level asked for by medicine, law and permanent-residency routes'}
];
function bandMilestone(band){
  if(band<=0)return'No answers were submitted, so no band could be awarded.';
  const next=BAND_TARGETS.find(t=>t.b>band+0.001);
  if(!next)return'<b>Band '+band.toFixed(1)+'</b> sits at or above what virtually every university and visa route requires.';
  const gap=Math.round((next.b-band)*10)/10;
  return'<b>'+gap.toFixed(1)+' to go</b> to Band '+next.b.toFixed(1)+' — '+next.why+'.';
}
/* The official IELTS band description for the awarded level. Public
   wording, not personalised feedback, so it belongs on the certificate. */
function bandDescriptor(b){
  if(b>=8.5)return{n:'Expert user',t:'Has fully operational command of the language: appropriate, accurate and fluent, with complete understanding.'};
  if(b>=7.5)return{n:'Very good user',t:'Has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriacies. Handles complex, detailed argumentation well.'};
  if(b>=6.5)return{n:'Good user',t:'Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations. Generally handles complex language well.'};
  if(b>=5.5)return{n:'Competent user',t:'Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings. Can use fairly complex language, particularly in familiar situations.'};
  if(b>=4.5)return{n:'Modest user',t:'Has partial command of the language and copes with overall meaning in most situations, though is likely to make many mistakes. Should be able to handle basic communication in their own field.'};
  if(b>0)return{n:'Limited user',t:'Basic competence is limited to familiar situations. Has frequent problems in understanding and expression, and is not yet able to use complex language.'};
  return{n:'No score',t:'No assessable response was submitted, so no band could be awarded for this attempt.'};
}
function bandDescHeading(b,screen){
  if(b<=0)return'No band was awarded';
  return screen?'What Band '+b.toFixed(1)+' means · '+bandDescriptor(b).n
               :'Band '+b.toFixed(1)+' · '+bandDescriptor(b).n;
}
function escapeHtml(s){if(s==null)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function formatDate(iso){if(!iso)return'—';try{const d=new Date(iso);return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}catch(e){return iso;}}

// RESULTS
/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  EDIT PER TEST · REPORT NUMBER  —  used in CDI-L<n>-<date>-<initials> ║
   ╚══════════════════════════════════════════════════════════════════════╝ */
/* The test number is DERIVED from STORAGE_KEY's trailing digits, exactly as the
   Reading engine derives it — so there is one thing to change per test, not two.
   It used to be a hardcoded 1 buried here in the engine, which the build guide
   never mentioned: you could follow that guide to the letter and ship test 2
   branded, numbered and filed as test 1. If your key does not end in digits,
   every certificate says 1. */
const CERT_TEST_NO=+((String(STORAGE_KEY).match(/(\d+)\s*$/)||[0,'1'])[1].replace(/^0+/,'')||'1');
function testName(){return CFG.name||'Listening';}
/* The four parts of an IELTS Listening paper never change shape, so these
   labels are structural, not test-specific — nothing to re-edit per test. */
const PART_META=[
  {n:1,kind:'Conversation · everyday social context'},
  {n:2,kind:'Monologue · everyday social context'},
  {n:3,kind:'Discussion · education or training'},
  {n:4,kind:'Monologue · academic subject'}
];
function certDate(){return state.startedAt?new Date(state.startedAt):new Date();}
function certDateStr(d){try{return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}catch(e){return'—';}}
/* A stable-looking reference number. Purely cosmetic, but it is what makes
   a sheet of paper read as a record rather than a screenshot. */
function certId(name,d){
  const src=(name||'candidate')+'|'+d.toDateString()+'|'+CERT_TEST_NO;
  let h=2166136261;
  for(let i=0;i<src.length;i++){h^=src.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  const ini=((name||'').trim().split(/\s+/).map(w=>w[0]).join('')||'C').toUpperCase().slice(0,2).padEnd(2,'X');
  const ymd=String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  return'CDI-L'+CERT_TEST_NO+'-'+ymd+'-'+ini+(h%9000+1000);
}
function timeTakenStr(){
  const e=(state.startedAt&&state.finishedAt)?Math.round((new Date(state.finishedAt)-new Date(state.startedAt))/1000):(PART_SECS-state.timers.listening);
  const s=Math.max(0,e);
  return Math.floor(s/60)+'m '+String(s%60).padStart(2,'0')+'s';
}
/* Which part carried the candidate, and which one cost them. Judged on the
   whole row, and silent when the profile is flat or nothing was answered —
   a level profile has no headline. */
function partTags(parts){
  const out=parts.map(()=>'');
  if(!parts.some(p=>p.correct>0))return out;
  let hi=0,lo=0;
  parts.forEach((p,i)=>{if(p.correct>parts[hi].correct)hi=i;if(p.correct<parts[lo].correct)lo=i;});
  if(hi===lo||parts[hi].correct===parts[lo].correct)return out;
  out[hi]='<span class="cc-tag best">Strongest</span>';
  out[lo]='<span class="cc-tag focus">Focus</span>';
  return out;
}
/* The accepted answer, with the alternative wordings kept but set back so
   the eye lands on one form rather than on a list. */
function acceptedHTML(ca){
  const parts=String(ca||'').split(' / ');
  if(!parts[0])return'';
  return escapeHtml(parts[0])+(parts.length>1?'<span class="alt"> / '+parts.slice(1).map(escapeHtml).join(' / ')+'</span>':'');
}
/* The answer record. Every mark the grader produced is printed: what was
   typed, what was accepted, and the second in the recording where the
   answer was spoken. */
function renderCol(qs){
  return'<table class="answer-table"><thead><tr><th>#</th><th>Your answer</th><th>Accepted</th><th style="text-align:right">Heard at</th><th></th></tr></thead><tbody>'+
    qs.map((q,i)=>'<tr class="'+(i%2===1?'alt ':'')+(q.id%10===1&&q.id>1?'pbreak':'')+'">'+
      '<td class="td-num">'+q.id+'</td>'+
      '<td class="td-user '+(q.status==='wrong'?'wrong':'')+'">'+(q.ua?escapeHtml(q.ua):'<span class="empty">no answer</span>')+'</td>'+
      '<td class="td-correct">'+(q.status!=='correct'?acceptedHTML(q.ca):'<span class="dash">—</span>')+'</td>'+
      '<td class="td-at">'+(q.atLabel||'—')+'</td>'+
      '<td class="td-status '+q.status+'">'+(q.status==='correct'?'✓':q.status==='wrong'?'✗':'–')+'</td>'+
    '</tr>').join('')+'</tbody></table>';
}

/* ── THE SCORE SHEET ──────────────────────────────────────────────────
   Deliberately plain: raw score, band, and every one of the forty answers
   next to what was typed for it. Everything that explains *why* a mark was
   lost lives one click away, on the paper itself, with the transcript
   docked beside it — which is what the button at the foot opens. */
/* Which kind of question each id is, read off the paper itself (same scan the
   typed-answer limits use) so the results page can group mistakes by type. */
const _qTypes={};let _qTypesScanned=false;
function scanQuestionTypes(){
  if(_qTypesScanned)return;_qTypesScanned=true;
  const d=document.createElement('div');
  [PART_NO].forEach(function(n){
    try{d.innerHTML=BUILDERS[n]();}catch(e){return;}
    d.querySelectorAll('input.gap-input[data-lq]').forEach(function(el){_qTypes[+el.dataset.lq]='Note Completion';});
    d.querySelectorAll('.ms-group').forEach(function(g){
      String(g.dataset.msIds||'').split(',').forEach(function(i){if(i)_qTypes[+i]='Multiple Choice (Choose Two)';});
    });
    d.querySelectorAll('input[type=radio][data-q]').forEach(function(r){
      _qTypes[+r.dataset.q]=r.closest('.mx-table')?'Map Labelling':'Multiple Choice';
    });
    d.querySelectorAll('.drag-drop[data-q]').forEach(function(z){if(!(+z.dataset.q in _qTypes))_qTypes[+z.dataset.q]='Matching';});
  });
}
function xrRemainingLabel(){
  const t=Math.max(0,Math.round(state.timers.listening||0));
  if(t>=60){const m=Math.floor(t/60);return m+(m===1?' minute':' minutes')+' remaining';}
  return t+(t===1?' second':' seconds')+' remaining';
}
function renderResults(){
  const rd=gradeListening();
  scanQuestionTypes();
  const pct=Math.round(rd.score/rd.total*100);
  const bad=rd.detail.filter(function(q){return q.status!=='correct';});
  const rem=document.getElementById('xr-rem');if(rem)rem.textContent=xrRemainingLabel();

  const pills=bad.length
    ?'<div class="xr-pills">'+bad.map(function(q){return '<span class="xr-pill">Question '+q.id+'</span>';}).join('')+'</div>'
    :'<div class="xr-none">No incorrect questions. Well done!</div>';

  const byPart=rd.parts.map(function(p){return {label:'Part '+p.part,n:p.wrong+p.skipped};}).filter(function(r){return r.n>0;});
  const typeCount={},typeOrder=[];
  bad.forEach(function(q){const t=_qTypes[q.id]||'Other';if(!(t in typeCount)){typeCount[t]=0;typeOrder.push(t);}typeCount[t]++;});
  const row=function(l,n){return '<div class="xr-row"><span class="xr-row-l">'+escapeHtml(l)+'</span><span class="xr-row-r"><b>'+n+'</b> '+(n===1?'mistake':'mistakes')+'</span></div>';};

  document.getElementById('results-content').innerHTML=
  '<div class="xr-wrap">'+
    '<h1 class="xr-h1">Exam Results</h1>'+
    '<div class="xr-sec"><span>LISTENING · '+(CFG.label||'Part '+PART_NO+' practice')+'</span></div>'+
    '<div class="xr-card xr-band">'+
      '<div class="xr-band-t">Your Score · '+PART_LABEL+'</div>'+
      '<div class="xr-band-n">'+rd.score+'</div>'+
      '<div class="xr-band-o">out of '+rd.total+'</div>'+
      '<div class="xr-band-p">'+pct+'% correct</div>'+
    '</div>'+
    '<div class="xr-card"><h2 class="xr-h2">Incorrect Questions</h2>'+pills+'</div>'+
    (false?'<div class="xr-card"><h2 class="xr-h2">Mistakes by Part</h2>'+byPart.map(function(r){return row(r.label,r.n);}).join('')+'</div>':'')+
    (typeOrder.length?'<div class="xr-card"><h2 class="xr-h2">Mistakes by Question Type</h2>'+typeOrder.map(function(t){return row(t,typeCount[t]);}).join('')+'</div>':'')+
    '<div class="xr-actions">'+
      '<button type="button" class="xr-btn" onclick="window.MockBridge&&MockBridge.reportIssue&&MockBridge.reportIssue()">Report Issue</button>'+
      '<button type="button" class="xr-btn" onclick="ExamApp.reviewExam()">Review Mistakes</button>'+
      '<button type="button" class="xr-btn dark" onclick="ExamApp.finishAndLeave()">Finish</button>'+
    '</div>'+
  '</div>';
}

function renderResultsLegacy(){
  const rd=gradeListening(),band=rd.band,qs=rd.detail;
  const nC=rd.nCorrect,nW=rd.nWrong,nS=rd.nSkipped,tot=rd.total;
  const tier=bandTier(band);
  const d=certDate(),dateStr=certDateStr(d),rid=certId(state.student.name,d);
  const pct=(band/9*100).toFixed(1)+'%';
  const ticks=[0,1,2,3,4,5,6,7,8,9].map(n=>
    '<span class="'+(Math.floor(band)===n&&band>0?'hit':'')+'">'+n+'</span>').join('');

  const tally=(label,n,note)=>'<div class="tally">'+
    '<div class="tally-top"><span class="tally-title">'+label+'</span><span class="tally-n">'+n+'</span></div>'+
    '<div class="tally-track"><div class="tally-fill" data-w="'+(n/tot*100).toFixed(1)+'%" style="width:0"></div></div>'+
    '<div class="tally-note">'+note+'</div></div>';

  const tags=partTags(rd.parts);
  /* A part band is that part's ten marks scaled to the full forty and put
     through the same table — the move the Reading form makes per passage, so
     the two reports can be read the same way. */
  const ccBandCell=(b,delay)=>'<div class="cc-cell"><div class="cc-track">'+
    '<div class="cc-fill" data-w="'+(b/9*100).toFixed(1)+'%" style="width:0;background:'+bandColorVar(b)+';transition-delay:'+delay+'s"></div></div>'+
    '<span class="cc-val" style="color:'+bandColorVar(b)+'">'+b.toFixed(1)+'</span></div>';
  const partRows=rd.parts.map((p,i)=>{
    const meta=PART_META[i];
    const w=v=>(v/p.total*100).toFixed(1)+'%';
    const pb=bandFor(p.correct*4);
    return'<div class="cc-row">'+
      '<div class="cc-name">Part '+p.part+' <em>Questions '+p.from+'–'+p.to+'</em>'+tags[i]+'</div>'+
      '<div class="cc-cell"><div class="cc-track">'+
        '<i class="cc-seg ok" data-w="'+w(p.correct)+'" style="width:0"></i>'+
        '<i class="cc-seg no" data-w="'+w(p.wrong)+'" style="width:0"></i>'+
        '<i class="cc-seg sk" data-w="'+w(p.skipped)+'" style="width:0"></i>'+
      '</div><span class="cc-val" style="color:'+bandColorVar(pb)+'">'+p.correct+' <small>/ '+p.total+'</small></span></div>'+
      ccBandCell(pb,(0.30+i*0.06).toFixed(2))+
    '</div>';
  }).join('')+
  '<div class="cc-row cc-total"><div class="cc-name">Whole paper <em>'+tot+' questions</em></div>'+
    '<div class="cc-cell"><div class="cc-track">'+
      '<i class="cc-seg ok" data-w="'+(nC/tot*100).toFixed(1)+'%" style="width:0"></i>'+
      '<i class="cc-seg no" data-w="'+(nW/tot*100).toFixed(1)+'%" style="width:0"></i>'+
      '<i class="cc-seg sk" data-w="'+(nS/tot*100).toFixed(1)+'%" style="width:0"></i>'+
    '</div><span class="cc-val" style="color:'+bandColorVar(band)+'">'+nC+' <small>/ '+tot+'</small></span></div>'+
    ccBandCell(band,'0.56')+
  '</div>';

  const L=lossAnalysis(qs);
  const causeCard=(n,label,cls)=>n?'<div class="cause-card '+cls+'"><b>'+n+'</b><span>'+label+'</span></div>':'';
  const causeCards=[
    causeCard(L.plural,'Singular / plural','fixable'),
    causeCard(L.spelling,'Spelling slip','fixable'),
    causeCard(L.limitOv,'Over the word limit','fixable'),
    causeCard(L.real,'Comprehension','real'),
    causeCard(L.blank,'Left blank','blank')
  ].join('');
  const insightHTML='';   /* COSMOS: section cut */

  const bubbles=qs.map(q=>'<div class="q-bubble '+q.status+'" title="Q'+q.id+' · '+(q.ua?escapeHtml(q.ua).replace(/"/g,'')+' → ':'')+
    (q.status==='correct'?'correct':escapeHtml(q.ca).replace(/"/g,''))+(q.atLabel?' · heard at '+q.atLabel:'')+'">'+q.id+'</div>').join('');

  document.getElementById('results-content').innerHTML=
  '<div class="cert" data-tier="'+tier+'">'+
    '<div class="cert-header">'+
      '<div class="cert-logo">'+
        '<div class="logo-mark" role="img" aria-label="CDI Materials"></div>'+
        '<div><div class="cert-logo-name">CDI Materials</div>'+
        '<div class="cert-logo-sub">IELTS Academic · Listening</div></div>'+
      '</div>'+
      '<div class="cert-title-block">'+
        '<div class="cert-type-tag">'+escapeHtml(testName())+'</div>'+
        '<div class="cert-title-main">Test Report Form</div>'+
        '<div class="cert-date-val">Issued '+dateStr+'</div>'+
      '</div>'+
    '</div>'+
    '<div class="student-row">'+
      '<div><div class="field-label">Test date</div><div class="field-value">'+dateStr+'</div></div>'+
      '<div><div class="field-label">Module</div><div class="field-value">Academic Listening</div></div>'+
      '<div><div class="field-label">Report no.</div><div class="field-value" style="font-size:12px;letter-spacing:.04em">'+rid+'</div></div>'+
    '</div>'+
    '<div class="score-section">'+
      '<div class="band-card">'+
        '<div class="band-lbl">Overall band</div>'+
        '<div class="band-fig"><span class="band-num" data-band="'+band+'">'+band.toFixed(1)+'</span><span class="band-of">of 9</span></div>'+
        '<div class="band-level">'+bandLabel(band)+'</div>'+
        '<div class="band-formula"><b>'+nC+' of '+tot+'</b> correct, converted on the IELTS Listening raw-score band table</div>'+
      '</div>'+
      '<div class="band-side">'+
        '<div class="band-scale">'+
          '<div class="band-scale-top"><span class="band-scale-cap">Position on the IELTS scale</span>'+
          '<span class="band-scale-note">CEFR <b>'+cefrOf(band)+'</b></span></div>'+
          '<div class="band-scale-track">'+
            '<div class="band-scale-fill" data-w="'+pct+'" style="width:0"></div>'+
            '<div class="band-scale-dot" data-left="'+pct+'" style="left:0"></div>'+
          '</div>'+
          '<div class="band-scale-ticks">'+ticks+'</div>'+
        '</div>'+
        '<div class="band-verdict">'+bandMilestone(band)+'</div>'+
        '<div class="tally-grid">'+
          tally('Correct',nC,'<b>'+Math.round(nC/tot*100)+'%</b> of the paper')+
          tally('Incorrect',nW,'<b>'+Math.round(nW/tot*100)+'%</b> of the paper')+
          tally('Unanswered',nS,'<b>'+Math.round(nS/tot*100)+'%</b> of the paper')+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="band-desc"><div class="band-desc-h">'+bandDescHeading(band,true)+'</div>'+
    '<p>'+bandDescriptor(band).t+'</p></div>'+
    insightHTML+
    '<div class="section-heading"><span>Answer record</span></div>'+
    '<div class="answer-section">'+
      '<div class="q-grid">'+bubbles+'</div>'+
      '<div class="answer-cols">'+renderCol(qs.slice(0,20))+renderCol(qs.slice(20))+'</div>'+
      '<p class="answer-note"><b>Heard at</b> is the point in the recording where the answer is spoken — the audio runs '+mmss(1778)+' end to end. '+
      'Where several wordings are accepted they are separated by a slash.</p>'+
    '</div>'+
    '<div class="review-cta">'+
      '<div><div class="review-cta-title">Hear exactly where each mark went</div>'+
      '<div class="review-cta-sub">Every question re-opens beside the timed transcript, so you can play back the seconds that decided it.</div></div>'+
      '<button class="btn btn-primary" onclick="ExamApp.reviewExam()">Review Test &amp; Transcript &rarr;</button>'+
    '</div>'+
    '<div class="cert-footer">'+
      '<span>CDI Materials</span>'+
      '<span class="cert-id">'+rid+'</span>'+
      '<span>Practice score — not an official IELTS result</span>'+
    '</div>'+
  '</div>';

  applyBrandLogo();
  playCertReveal(document.getElementById('results-content'));
  buildPrintReport();
}

/* ── the reveal ─────────────────────────────────────────────────
   The band counts up, the ruler and every bar grow from zero. All of it
   degrades to the finished state instantly when motion is reduced. */
function certReduced(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
function playCertReveal(root){
  if(!root)return;
  const reduce=certReduced();
  const num=root.querySelector('.band-num');
  const target=num?parseFloat(num.getAttribute('data-band')):NaN;
  const settle=()=>{
    root.querySelectorAll('[data-w]').forEach(el=>{el.style.width=el.getAttribute('data-w');});
    const dot=root.querySelector('.band-scale-dot');
    if(dot)dot.style.left=dot.getAttribute('data-left');
    const sc=root.querySelector('.band-scale');
    if(sc)sc.classList.add('on');
  };
  if(reduce){if(num&&!isNaN(target))num.textContent=target.toFixed(1);settle();return;}
  requestAnimationFrame(()=>requestAnimationFrame(settle));
  if(!num||isNaN(target))return;
  num.textContent='0.0';
  const dur=1150,t0=performance.now()+220;
  const step=now=>{
    const t=Math.max(0,Math.min(1,(now-t0)/dur));
    const e=1-Math.pow(1-t,3);
    num.textContent=(target*e).toFixed(1);
    if(t<1)requestAnimationFrame(step);else num.textContent=target.toFixed(1);
  };
  requestAnimationFrame(step);
}

// Paint the REAL logo (the base64 PNG already on the registration card) onto
// the results topbar mark, the certificate header mark and the printed
// report. Referenced, never copied - duplicating the data URI would add
// ~42KB and three places to update.
function certLogoSrc(){var i=document.querySelector('.brand-logo');return i?i.getAttribute('src'):'';}
function applyBrandLogo(){
  var url=certLogoSrc();
  if(!url)return;
  var marks=document.querySelectorAll('#stage-results .logo-mark');
  for(var i=0;i<marks.length;i++){
    var el=marks[i];
    el.textContent='';
    el.style.backgroundImage='url("'+url+'")';
    el.style.backgroundColor='transparent';
    el.style.backgroundSize='contain';
    el.style.backgroundRepeat='no-repeat';
    el.style.backgroundPosition='center';
  }
}

// One builder for the answer-feedback chip (was three inline copies).
// `ans` must already be escaped by the caller.
function feedbackHTML(ok,ans){
  if(ok)return '<span class="fb-badge fb-ok" aria-hidden="true">✓</span>';
  return '<span class="fb-badge fb-no" aria-hidden="true">✗</span>'+
         '<span class="fb-ans">'+ans+'</span>';
}

// ====================================================================
// PRINTABLE REPORT — two A4 pages:
//   1 · the Test Report Form   2 · the full answer record
// Typeset in ink, not a screenshot of the dark score panel. The whole
// stylesheet ships inside #print-report so the sheet cannot inherit the
// chamber ground, a dark theme or the on-screen animations.
// ====================================================================
function printStylesheet(){
  /* NB: no @page here. The single @page rule for the document lives in the
     head stylesheet; two of them is what broke A4. */
  return'<style>'+
    '@media print{'+
      'html,body{background:#fff!important;overflow:visible!important;height:auto!important}'+
      /* every body-level overlay the app can leave open; the sheet carries the report and nothing else */
      '.stage,.warning-overlay,.toast,#audio-gate,#hl-popup,#cdi-webgl,'+
      '#notes-panel,#menu-dropdown,#notif-popup,#transcript-panel{display:none!important}'+
      '#print-report{display:block!important;background:#fff!important}'+
      '#print-report *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;'+
        'box-shadow:none!important;text-shadow:none!important;filter:none!important;animation:none!important;transition:none!important}'+
      '#print-report .print-page{break-after:page;page-break-after:always}'+
      '#print-report .print-page:last-child{break-after:auto;page-break-after:auto}'+
      '#print-report .pr-id,#print-report .pr-score,#print-report .pr-tally,#print-report .pr-desc,'+
      '#print-report .pr-notes,#print-report .pr-cause,#print-report table.pr-crit tr,#print-report .pr-sec{break-inside:avoid;page-break-inside:avoid}'+
      '#print-report table.pr-ans thead{display:table-header-group}'+
      '#print-report a{color:inherit!important;text-decoration:none!important}'+
    '}'+
    '#print-report{font-family:var(--pw-ui);color:#151310;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    '#print-report .print-page{position:relative;box-sizing:border-box;padding:0 1mm;font-size:10.5pt;line-height:1.5;'+
      /* A4 minus 14mm top and 12mm bottom is 271mm of usable height; 265mm fills
         the sheet (the page foot is margin-top:auto) with 6mm of headroom, so a
         long name or a longer band descriptor cannot tip a page into a fourth. */
      'min-height:265mm;display:flex;flex-direction:column}'+
    '#print-report .pr-rule{height:2.6pt;background:linear-gradient(90deg,#17356a,#2c5fa8 58%,#c9a24f);border-radius:2pt}'+
    '#print-report .pr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12mm;padding:5mm 0 4mm}'+
    '#print-report .pr-brand{display:flex;align-items:center;gap:3mm}'+
    '#print-report .pr-brand img{width:12mm;height:12mm;border-radius:3mm;display:block}'+
    '#print-report .pr-brand-name{font-family:var(--pw-display);font-weight:700;font-size:13pt;letter-spacing:-.01em;line-height:1.1}'+
    '#print-report .pr-brand-sub{font-size:6.5pt;font-weight:800;letter-spacing:.18em;color:#7b7062;margin-top:1mm}'+
    '#print-report .pr-headr{text-align:right}'+
    '#print-report .pr-kicker{font-size:6.5pt;font-weight:800;letter-spacing:.2em;color:#2c5fa8;text-transform:uppercase}'+
    '#print-report .pr-title{font-family:var(--pw-display);font-size:19pt;font-weight:700;letter-spacing:-.03em;line-height:1.1;margin-top:1mm}'+
    '#print-report .pr-date{font-size:8pt;color:#7b7062;margin-top:1mm}'+
    '#print-report .pr-id{display:grid;grid-template-columns:repeat(4,1fr);border:0.6pt solid #cdc6bb;border-radius:2mm;overflow:hidden}'+
    '#print-report .pr-id > div{padding:2.6mm 4mm;border-left:0.6pt solid #cdc6bb}'+
    '#print-report .pr-id > div:first-child{border-left:none}'+
    '#print-report .pr-id .l{font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70}'+
    '#print-report .pr-id .v{font-size:10.5pt;font-weight:700;margin-top:1mm;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '#print-report .pr-id .v.mod{font-size:9.6pt}'+
    '#print-report .pr-score{display:grid;grid-template-columns:53mm 1fr;gap:0;border:0.6pt solid #cdc6bb;border-top:1.6pt solid #17356a;border-radius:0 0 2mm 2mm;margin-top:5mm;background:#fbfaf7}'+
    '#print-report .pr-band{padding:4mm 4mm 4mm 5mm;border-right:0.6pt solid #cdc6bb;text-align:center}'+
    '#print-report .pr-band-lbl{font-size:6pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#7b7062}'+
    '#print-report .pr-band-num{font-family:var(--pw-display);font-size:46pt;font-weight:700;line-height:.95;letter-spacing:-.04em;color:#17356a;margin-top:1mm}'+
    '#print-report .pr-band-lvl{font-family:var(--pw-display);font-size:10.5pt;font-weight:600;margin-top:1.5mm;letter-spacing:-.01em}'+
    '#print-report .pr-band-f{font-size:7pt;color:#7b7062;margin-top:1.5mm;line-height:1.35}'+
    '#print-report .pr-side{padding:4mm 5mm}'+
    '#print-report .pr-scale-cap{font-size:6pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8a7f70;margin-bottom:2mm}'+
    '#print-report .pr-scale{position:relative;height:3.4mm;border:0.6pt solid #cdc6bb;border-radius:99px;background:#f1ece3;overflow:hidden}'+
    '#print-report .pr-scale i{position:absolute;top:0;bottom:0;left:0;background:#2c5fa8;border-radius:99px;display:block}'+
    '#print-report{--cv-strong:#1f7a43;--cv-mid:#a97f34;--cv-low:#78818f;--cv-none:#b3ada4;--st-no:#ad3a2c}'+
    '#print-report .pr-ticks{display:flex;justify-content:space-between;margin-top:1.2mm}'+
    '#print-report .pr-ticks span{font-size:6pt;color:#9c9284}'+
    '#print-report .pr-ticks span.hit{color:#17356a;font-weight:800}'+
    '#print-report .pr-note-line{font-size:8pt;color:#5a5045;margin-top:2.5mm;line-height:1.45}'+
    '#print-report .pr-tally{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:3.5mm}'+
    '#print-report .pr-t{border:0.6pt solid #cdc6bb;border-radius:2mm;padding:2.4mm 3mm;background:#fff}'+
    '#print-report .pr-t-top{display:flex;align-items:baseline;justify-content:space-between;gap:2mm}'+
    '#print-report .pr-t-l{font-size:6.5pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#7b7062}'+
    '#print-report .pr-t-n{font-family:var(--pw-display);font-size:16pt;font-weight:700;line-height:1;letter-spacing:-.03em}'+
    '#print-report .pr-t-w{font-size:7pt;color:#8a7f70;margin-top:1.2mm}'+
    '#print-report .pr-sec{display:flex;align-items:center;gap:3mm;margin:6mm 0 3mm;font-size:6.5pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#2c5fa8}'+
    '#print-report .pr-sec::before,#print-report .pr-sec::after{content:"";flex:1;height:0.6pt;background:#ddd6ca}'+
    '#print-report table.pr-crit{width:100%;border-collapse:collapse;border:0.6pt solid #cdc6bb}'+
    '#print-report table.pr-crit th,#print-report table.pr-crit td{border:0.6pt solid #ddd6ca;padding:3mm 3.5mm;text-align:left;vertical-align:middle}'+
    '#print-report table.pr-crit thead th{background:#f6f1e8;font-size:6.5pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#5a5045}'+
    '#print-report table.pr-crit thead th b{font-family:var(--pw-display);font-size:12pt;font-weight:700;letter-spacing:-.03em;float:right;line-height:.9}'+
    '#print-report table.pr-crit td.n{font-size:9.5pt;font-weight:600;color:#3d372e;width:44%}'+
    '#print-report table.pr-crit td.n em{font-style:normal;font-size:7.6pt;color:#8a7f70;margin-left:2mm}'+
    '#print-report table.pr-crit td.v{width:28%}'+
    '#print-report table.pr-crit tr.tot td{background:#f9f4ea;font-weight:800}'+
    '#print-report .pr-cause{margin-top:4.4mm;border:0.6pt solid #cdc6bb;border-radius:2mm;padding:3mm 4mm;background:#fff}'+
    '#print-report .pr-cause-lead{font-size:9.5pt;font-weight:600;color:#3d372e;line-height:1.45}'+
    '#print-report .pr-cause-row{display:flex;flex-wrap:wrap;gap:2mm 3mm;margin-top:2.5mm}'+
    '#print-report .pr-cause-row span{font-size:8pt;color:#5a5045;border:0.6pt solid #ddd6ca;border-radius:1.5mm;padding:1mm 2.5mm}'+
    '#print-report .pr-cause-row span b{font-weight:800;color:#17356a}'+
    '#print-report .pr-tag{display:inline-block;margin-left:2.5mm;font-size:5.8pt;font-weight:800;letter-spacing:.12em;'+
    'text-transform:uppercase;padding:0.6mm 1.6mm;border-radius:1mm;vertical-align:middle}'+
    '#print-report .pr-tag.best{color:#1f7a43;background:#e6f1ea}'+
    '#print-report .pr-tag.focus{color:#8f6f2c;background:#f6eeda}'+
    '#print-report .pr-cellwrap{display:flex;align-items:center;gap:3mm}'+
    '#print-report .pr-bar{flex:1;height:2.4mm;border-radius:99px;background:#ece6db;overflow:hidden;min-width:20mm;display:flex}'+
    '#print-report .pr-bar i{display:block;height:100%}'+
    '#print-report .pr-bar i.ok{background:#1f7a43}'+
    '#print-report .pr-bar i.no{background:#ad3a2c}'+
    '#print-report .pr-bar i.sk{background:#d8d0c3}'+
    '#print-report .pr-num{font-family:var(--pw-display);font-size:11pt;font-weight:700;letter-spacing:-.02em;min-width:12mm;text-align:right;white-space:nowrap}'+
    '#print-report .pr-num small{font-size:8pt;font-weight:600;color:#8a7f70}'+
    '#print-report .pr-legend{font-size:7.5pt;color:#8a7f70;line-height:1.5;margin-top:3mm}'+
    '#print-report .pr-desc{margin-top:5mm;border-left:2pt solid #2c5fa8;background:#f8f4ec;border-radius:0 2mm 2mm 0;padding:3mm 4mm}'+
    '#print-report .pr-desc-h{font-family:var(--pw-display);font-size:9.5pt;font-weight:700;letter-spacing:-.01em;color:#17356a}'+
    '#print-report .pr-desc p{margin:1.4mm 0 0;font-size:8.6pt;line-height:1.5;color:#4a4237}'+
    '#print-report .pr-notes{flex:1;display:flex;flex-direction:column;margin-top:5mm;min-height:30mm;'+
    'border:0.6pt solid #cdc6bb;border-radius:2mm;padding:3mm 4mm 2mm}'+
    '#print-report .pr-notes-h{font-size:6.2pt;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#8a7f70;margin-bottom:2mm}'+
    '#print-report .pr-notes-lines{flex:1;min-height:20mm;background-image:repeating-linear-gradient(180deg,transparent 0 7.3mm,#d6cdbd 7.3mm 7.6mm)}'+
    '#print-report .pr-foot{margin-top:auto;display:flex;justify-content:space-between;gap:6mm;padding-top:2.5mm;'+
    'border-top:0.6pt solid #ddd6ca;font-size:6.8pt;color:#8a7f70;letter-spacing:.04em}'+
    /* page 2 — the answer record */
    '#print-report .print-head{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1.2pt solid #17356a;padding-bottom:2mm;margin-bottom:5mm}'+
    '#print-report .print-brand{font-family:var(--pw-display);font-weight:700;font-size:11pt;color:#17356a;letter-spacing:-.01em}'+
    '#print-report .print-task-tag{font-size:7pt;font-weight:800;text-transform:uppercase;letter-spacing:.18em;color:#7b7062}'+
    '#print-report .pr-ans-cols{border:0.6pt solid #cdc6bb;border-radius:2mm;overflow:hidden}'+
    '#print-report table.pr-ans{width:100%;border-collapse:collapse;font-size:8.4pt}'+
    '#print-report table.pr-ans th{background:#f6f1e8;text-align:left;font-size:5.8pt;font-weight:800;letter-spacing:.15em;'+
    'text-transform:uppercase;color:#8a7f70;padding:2mm 2.6mm;border-bottom:0.6pt solid #cdc6bb;white-space:nowrap}'+
    '#print-report table.pr-ans td{padding:1.5mm 3mm;border-top:0.6pt solid #eae4d9;vertical-align:baseline;line-height:1.32}'+
    '#print-report table.pr-ans tr:first-child td{border-top:none}'+
    '#print-report table.pr-ans tr.alt td{background:#faf7f1}'+
    '#print-report table.pr-ans .n{width:9mm;font-size:7.4pt;font-weight:700;color:#9c9284}'+
    '#print-report table.pr-ans .u{width:34%;font-weight:600;color:#2b251d;overflow-wrap:break-word}'+
    '#print-report table.pr-ans .u.bad{color:#ad3a2c;font-weight:700}'+
    '#print-report table.pr-ans .u em{color:#a9a196;font-style:italic;font-weight:500}'+
    '#print-report table.pr-ans .c{color:#1f7a43;font-weight:600;overflow-wrap:break-word}'+
    '#print-report table.pr-ans .u,#print-report table.pr-ans .c{hyphens:none}'+
    '#print-report table.pr-ans .c .alt{color:#9c9284;font-weight:500}'+
    '#print-report table.pr-ans tr.pbreak td{border-top:0.6pt solid #cdc6bb}'+
    '#print-report table.pr-ans .t{width:16mm;text-align:right;font-size:7.4pt;color:#9c9284;white-space:nowrap}'+
    '#print-report table.pr-ans .s{width:7mm;text-align:center;font-weight:800}'+
    '#print-report table.pr-ans .s.correct{color:#1f7a43}'+
    '#print-report table.pr-ans .s.wrong{color:#ad3a2c}'+
    '#print-report table.pr-ans .s.skipped{color:#c3bbae}'+
    '#print-report .pr-pagefoot{margin-top:auto;border-top:0.6pt solid #ddd6ca;padding-top:2.5mm;'+
    'display:flex;justify-content:space-between;gap:6mm;font-size:6.8pt;color:#9c9284;letter-spacing:.04em}'+
    '</style>';
}

function printCertPage(rd,d,rid){
  const band=rd.band,tot=rd.total,nC=rd.nCorrect,nW=rd.nWrong,nS=rd.nSkipped;
  const ticks=[0,1,2,3,4,5,6,7,8,9].map(n=>
    '<span class="'+(Math.floor(band)===n&&band>0?'hit':'')+'">'+n+'</span>').join('');
  const head='<div class="pr-rule"></div><div class="pr-head">'+
    '<div class="pr-brand"><img src="'+certLogoSrc()+'" alt=""><div>'+
    '<div class="pr-brand-name">CDI Materials</div><div class="pr-brand-sub">IELTS ACADEMIC · LISTENING</div></div></div>'+
    '<div class="pr-headr"><div class="pr-kicker">'+escapeHtml(testName())+'</div>'+
    '<div class="pr-title">Test Report Form</div><div class="pr-date">'+certDateStr(d)+'</div></div></div>'+
    '<div class="pr-id">'+
    '<div><div class="l">Test date</div><div class="v">'+certDateStr(d)+'</div></div>'+
    '<div><div class="l">Module</div><div class="v mod">Academic Listening</div></div>'+
    '<div><div class="l">Report no.</div><div class="v" style="font-size:8.2pt;letter-spacing:.03em;white-space:nowrap">'+rid+'</div></div></div>';
  const t=(l,n,w)=>'<div class="pr-t"><div class="pr-t-top"><span class="pr-t-l">'+l+'</span>'+
    '<span class="pr-t-n">'+n+'</span></div><div class="pr-t-w">'+w+'</div></div>';
  const tags=partTags(rd.parts);
  /* A part band is that part's ten marks scaled to the full forty and put
     through the same table, so the four parts can be compared with each other
     and with the paper — exactly the move the Reading form makes per passage. */
  const bandCell=(b)=>{const col=bandColorVar(b);
    return'<td class="v"><div class="pr-cellwrap"><div class="pr-bar"><i style="width:'+(b/9*100).toFixed(1)+'%;background:'+col+'"></i></div>'+
      '<span class="pr-num" style="color:'+col+'">'+b.toFixed(1)+'</span></div></td>';};
  const rows=rd.parts.map((p,i)=>{
    const meta=PART_META[i];
    const w=v=>(v/p.total*100).toFixed(1)+'%';
    const pb=bandFor(p.correct*4);
    /* One line per part, as the Reading sheet sets its passages. The part's
       kind ("Conversation · everyday social context") used to sit on a second
       line inside the cell, which made every row in this table twice the height
       of the same table on the Reading certificate — the two are meant to read
       as one artefact. The kind is still on the results screen. */
    return'<tr><td class="n">Part '+p.part+'<em>Q'+p.from+'–'+p.to+'</em>'+
      (tags[i].indexOf('best')>-1?'<span class="pr-tag best">Strongest</span>':tags[i].indexOf('focus')>-1?'<span class="pr-tag focus">Focus</span>':'')+
      '</td>'+
      '<td class="v"><div class="pr-cellwrap"><div class="pr-bar">'+
      '<i class="ok" style="width:'+w(p.correct)+'"></i><i class="no" style="width:'+w(p.wrong)+'"></i><i class="sk" style="width:'+w(p.skipped)+'"></i>'+
      '</div><span class="pr-num" style="color:'+bandColorVar(pb)+'">'+p.correct+' <small>/ '+p.total+'</small></span></div></td>'+
      bandCell(pb)+'</tr>';
  }).join('')+
  '<tr class="tot"><td class="n">Whole paper<em>'+tot+' questions</em></td>'+
    '<td class="v"><div class="pr-cellwrap"><div class="pr-bar">'+
    '<i class="ok" style="width:'+(nC/tot*100).toFixed(1)+'%"></i><i class="no" style="width:'+(nW/tot*100).toFixed(1)+'%"></i><i class="sk" style="width:'+(nS/tot*100).toFixed(1)+'%"></i>'+
    '</div><span class="pr-num" style="color:'+bandColorVar(band)+'">'+nC+' <small>/ '+tot+'</small></span></div></td>'+
    bandCell(band)+'</tr>';
  const L=lossAnalysis(rd.detail);
  const causeBits=[
    L.plural  ?'<span><b>'+L.plural  +'</b> singular / plural</span>':'',
    L.spelling?'<span><b>'+L.spelling+'</b> spelling slip</span>'    :'',
    L.limitOv ?'<span><b>'+L.limitOv +'</b> over the word limit</span>':'',
    L.real    ?'<span><b>'+L.real    +'</b> comprehension</span>'    :'',
    L.blank   ?'<span><b>'+L.blank   +'</b> left blank</span>'       :''
  ].join('');
  return'<div class="print-page pr-cert">'+head+
    '<div class="pr-score"><div class="pr-band">'+
    '<div class="pr-band-lbl">Overall band</div><div class="pr-band-num">'+band.toFixed(1)+'</div>'+
    '<div class="pr-band-lvl">'+bandLabel(band)+'</div>'+
    '<div class="pr-band-f" style="margin-top:1mm">CEFR '+cefrOf(band)+'</div>'+
    '<div class="pr-band-f">'+nC+' of '+tot+' correct, converted on<br>the IELTS Listening band table</div></div>'+
    '<div class="pr-side"><div class="pr-scale-cap">Position on the IELTS 0–9 scale</div>'+
    '<div class="pr-scale"><i style="width:'+(band/9*100).toFixed(1)+'%;background:'+bandColorVar(band)+'"></i></div>'+
    '<div class="pr-ticks">'+ticks+'</div>'+
    '<div class="pr-note-line">'+bandMilestone(band).replace(/<\/?b>/g,'')+'</div>'+
    '<div class="pr-tally">'+t('Correct',nC,Math.round(nC/tot*100)+'% of the paper')+
      t('Incorrect',nW,Math.round(nW/tot*100)+'% of the paper')+
      t('Unanswered',nS,Math.round(nS/tot*100)+'% of the paper')+'</div></div></div>'+
    '<div class="pr-desc"><div class="pr-desc-h">'+bandDescHeading(band)+'</div>'+
    '<p>'+bandDescriptor(band).t+'</p></div>'+
    '<div class="pr-foot"><span>CDI Materials · @READING_CDI · practice score, not an official IELTS result</span>'+
    '<span>'+rid+'</span></div></div>';
}

function printAnswerPage(rd,rid,from,to,pageNo){
  const qs=rd.detail.filter(q=>q.id>=from&&q.id<=to);
  const last=pageNo===3;
  return'<div class="print-page">'+
    '<div class="print-head"><span class="print-brand">'+escapeHtml(testName())+'</span>'+
    '<span class="print-task-tag">Answer record · Questions '+from+'–'+to+'</span></div>'+
    '<div class="pr-ans-cols"><table class="pr-ans"><thead><tr><th>#</th><th>Your answer</th><th>Accepted</th>'+
    '<th style="text-align:right">Heard at</th><th></th></tr></thead><tbody>'+
    qs.map((q,i)=>'<tr class="'+(i%2===1?'alt ':'')+(q.id%10===1&&q.id>from?'pbreak':'')+'">'+
      '<td class="n">'+q.id+'</td>'+
      '<td class="u '+(q.status==='wrong'?'bad':'')+'">'+(q.ua?escapeHtml(q.ua):'<em>no answer</em>')+'</td>'+
      '<td class="c">'+(q.status!=='correct'?acceptedHTML(q.ca):'—')+'</td>'+
      '<td class="t">'+(q.atLabel||'—')+'</td>'+
      '<td class="s '+q.status+'">'+(q.status==='correct'?'✓':q.status==='wrong'?'✗':'–')+'</td>'+
    '</tr>').join('')+'</tbody></table></div>'+
    '<p class="pr-legend"><b>Heard at</b> is the point in the recording where the answer is spoken; the audio runs '+mmss(1778)+' end to end. '+
    'Where several wordings are accepted they are separated by a slash; a dash in the Accepted column means the answer was marked correct as written.</p>'+
    (last?'<div class="pr-notes"><div class="pr-notes-h">Teacher’s notes</div><div class="pr-notes-lines"></div></div>':'')+
    '<div class="pr-pagefoot"><span>'+escapeHtml(testName())+'</span>'+
    '<span>Page '+pageNo+' of 3 · '+rid+'</span></div></div>';
}

/* Built with the certificate, and rebuilt on Cmd/Ctrl+P, so the sheet is
   always in the document whichever way the print is started. */
function buildPrintReport(){
  const host=document.getElementById('print-report');
  if(!host)return;
  const rd=gradeListening(),d=certDate(),rid=certId(state.student.name,d);
  /* ONE A4 sheet — see the note in the Reading engine. The two answer-record
     pages are gone; the same record is still on the results screen. */
  host.innerHTML=printStylesheet()+printCertPage(rd,d,rid);
}
try{window.addEventListener('beforeprint',buildPrintReport);}catch(e){/* non-fatal */}

/* The downloaded file is named for the certificate it contains: same wording,
   same order — V3-Reading-1-Islom-Kenjayev-20260902. The sitting date is what
   stops a re-sit silently overwriting the first attempt; without it the browser
   just appends "(1)" and the two are no longer tellable apart. */
function reportFileStem(){
  const d=certDate();
  const name='Result';
  const ymd=String(d.getFullYear())+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  return 'Volume-10-Listening-Test-1-'+name+'-'+ymd;
}

/* ── How the report leaves the page ───────────────────────────────────────
   Two controls, and each label says exactly what it does.

   "Download PDF" is one click and a file on disk. PDFX — the block inlined
   just above this script — walks the three typeset sheets and re-emits them
   as PDF vector operators: real text objects, real paths, positioned by the
   browser's own layout so every line break and every box is the one the
   print route would have produced. The file is tens of kilobytes, its text
   is selectable, searchable and extractable, and it needs neither a print
   dialog nor a network. The only bitmap in it is the CDI logo, which is a
   picture and is embedded as one.

   The obvious alternative, jsPDF + html2canvas, was rejected: ~360KB of
   library to screenshot the report into a bitmap — a picture of text, which
   cannot be selected or searched, weighs megabytes and prints soft. PDFX
   costs about a tenth of that and keeps the type real.

   "Print" hands the same three sheets to the browser's own print engine.
   That is still the highest-fidelity route — it sets the report in the very
   faces it was designed in and embeds them — but it costs a trip through the
   print dialog and a destination choice, so it is not a download and is not
   called one. It is also the automatic fallback if the exporter ever fails.

   The page box below must stay identical to the document's single @page rule;
   it is what the exporter uses for the sheet size and the margins. */
const PDF_PAGE = { w: 210, h: 297, mt: 14, mr: 14, mb: 12, ml: 14 };   /* A4 · @page{size:A4 portrait;margin:14mm 14mm 12mm} */

function printReport() {
  buildPrintReport();
  toast('Choose “Save as PDF” as the destination to keep a copy.', 'info', 6000);
  setTimeout(function(){ try { window.print(); } catch (e) { toast('Your browser blocked printing.', 'error'); } }, 220);
}

/* PDFX walks whatever host it is given and treats each .print-page inside it as
   a sheet, so the export can simply be pointed at the real certificate. The node
   is tagged in place rather than cloned: cloning it out of #stage-results would
   stop `#stage-results .cert` matching and strip the whole design. */
function buildCertSheet() {
  var cert = document.querySelector('#results-content .cert');
  if (cert) cert.classList.add('print-page');
}

let pdfBusy = false;
/* The certificate, photographed rather than redrawn. A capture cannot drift
   from the screen the way a second typesetting can, and it fills the sheet
   instead of being shrunk to fit it. html2canvas and jsPDF are embedded above,
   so this needs no network; if either is somehow missing the vector exporter
   still answers. */
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
    /* 1.6x lands about 200dpi once the image is placed at ~193mm wide — sharp
       in print, and appreciably less canvas to rasterise than 2x, which is
       what makes the difference on a machine without a GPU. */
    scale: 1.6,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    /* the star field is a live canvas behind the sheet, no part of the
       document; the CTA is a button, useless on paper — and it is the only
       thing here painted with color-mix(), which Chrome serialises to
       color(srgb …) and html2canvas 1.4.1 dies on */
    ignoreElements: function (el) {
      return el.id === 'cdi-stars-host' ||
             (el.classList && el.classList.contains('review-cta'));
    },
    onclone: function (doc) {
      var st = doc.createElement('style');
      st.textContent =
        /* the clone restarts the sheet's entrance keyframes and paints before
           they run, so every part would be caught at opacity 0 — a blank page */
        '*,*::before,*::after{animation:none!important;transition:none!important}' +
        /* the band score is gradient-filled text; html2canvas cannot clip a
           background to glyphs, so it painted the gradient and lost the number */
        '#stage-results .band-num{background:none!important;' +
        '-webkit-background-clip:border-box!important;background-clip:border-box!important;' +
        'color:#ffffff!important}';
      (doc.head || doc.documentElement).appendChild(st);
    }
  }).then(function (canvas) {
    clearTimeout(watchdog);
    if (settled) return;          /* the watchdog got there first */
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    var PW = 210, PH = 297, M = 8;
    var boxW = PW - M * 2, boxH = PH - M * 2;
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
    clearTimeout(watchdog);
    if (settled) return;
    done();
    downloadReportVector();
  });
}

function downloadReportVector() {
  if (pdfBusy) return;
  if (typeof PDFX === 'undefined') { printReport(); return; }   /* never a dead button */
  pdfBusy = true;
  const btn = document.getElementById('results-download-btn');
  const was = btn ? btn.textContent : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Building…'; }
  PDFX.save({
    hostId: 'results-content',
    page: PDF_PAGE,
    build: buildCertSheet,
    fileName: reportFileStem(),
    meta: { title: testName(), author: 'CDI Materials', subject: 'IELTS Academic Listening · Test Report Form' }
  }).then(function (r) {
    toast('Report saved to your downloads — ' + r.pages.length + ' pages, ' +
          Math.max(1, Math.round(r.bytes / 1024)) + ' KB, with selectable text.', 'success', 5200);
  }).catch(function () {
    toast('Could not build the PDF here — opening the print dialog instead.', 'error', 5000);
    printReport();
  }).then(function () {
    pdfBusy = false;
    if (btn) { btn.disabled = false; btn.textContent = was; }
  });
}

// REVIEW
// ---------------------------------------------------------------------------
// The ORIGINAL review architecture, restored.
//
//   the exam sheet, in place, with every answer revealed
// + a transcript panel docked to the right, following the recording
// + the transport the exam withholds, in the header
// + a timecode on every question and every transcript line: press one and the
//   recording seeks there and the transcript scrolls to that moment.
//
// The timecode jump is the point of the screen. Everything else serves it.
// Nothing here touches #stage-listening's geometry or the audio gate: review
// is a body class, not a different screen.
// ---------------------------------------------------------------------------

/* Reveal the marks on the exam sheet itself: the field turns, the feedback
   chip opens with the correct answer, the right option is named. */
function applyReviewReveal(){gradeListening().detail.forEach(d=>{
  const fb=document.getElementById('lfb-'+d.id);
  if(fb){
    fb.className='feedback-pill show '+(d.isCorrect?'correct':'wrong');
    fb.innerHTML=feedbackHTML(d.isCorrect,escapeHtml(d.ca));
  }
  const mxr=document.getElementById('mx-tr-'+d.id);
  if(mxr){
    mxr.classList.remove('mx-correct','mx-wrong');mxr.classList.add(d.isCorrect?'mx-correct':'mx-wrong');
    mxr.querySelectorAll('.mx-c').forEach(function(c){c.classList.toggle('mx-ca',c.dataset.val===d.ca);});
    return;
  }
  const el=document.getElementById('lq-'+d.id);
  if(el&&el.dataset&&el.dataset.dm){
    const drop=document.getElementById('drop-'+d.id);
    if(drop){drop.classList.remove('dm-correct','dm-wrong');drop.classList.add(d.isCorrect?'dm-correct':'dm-wrong');}
    return;
  }
  if(el&&(el.tagName==='INPUT'||el.tagName==='SELECT'))el.classList.add(d.isCorrect?'correct':'incorrect');
  const card=document.getElementById('lq-card-'+d.id);
  if(card)card.querySelectorAll('.option').forEach(opt=>{const ri=opt.querySelector('input[type=radio]');if(!ri)return;if(ri.value===d.ca)opt.classList.add('correct');else if(opt.classList.contains('selected')){opt.classList.remove('selected');opt.classList.add('wrong');}});
});}

function reviewExam(){
  document.body.classList.add('review-mode','tp-active');
  // the notes rail is exam furniture; the transcript takes that side now
  document.body.classList.remove('notes-open');
  // the play gate stays up when the stream never started; at z-index 1000 it
  // would float over review and swallow every click
  try{hideAudioGate();}catch(e){}
  // Move the transport into the header. It is display:none outside review, so
  // this is the only place in the app where it becomes visible.
  const audioEl=document.getElementById('pbar-audio');
  const hdrRight=document.getElementById('hdr-right');
  const wifiBtn=document.getElementById('wifi-btn');
  if(audioEl&&hdrRight){hdrRight.insertBefore(audioEl,wifiBtn||null);}
  renderListening(); // renderSection() schedules applyReviewReveal+addJumpButtons after 50ms
  updateListeningNav();
  goToStage('listening');
  // goToStage has just persisted stage:'listening'. The test is finished, and a
  // reload must not greet the candidate with "you left a test running" and offer
  // to resume it. Review is entered from the certificate, so that is where a
  // reload belongs; one click brings this screen straight back.
  state.stage='results';saveState();
  window.scrollTo(0,0);
  buildTranscriptPanel();
  const audio=document.getElementById('exam-audio');
  if(audio){
    wireTransport(audio);wirePartWindow(audio);
    wireReviewAudio(audio);
    if(reviewExam._tu)audio.removeEventListener('timeupdate',reviewExam._tu);
    reviewExam._tu=function(){syncTranscriptPanel(audio.currentTime);};
    audio.addEventListener('timeupdate',reviewExam._tu);
  }
  // Sync is two-way: the transcript drives the audio as well as following it.
  const tpBody=document.getElementById('tp-body');
  if(tpBody&&!tpBody._seekWired){
    tpBody._seekWired=1;
    tpBody.addEventListener('click',function(e){
      const item=e.target.closest?e.target.closest('.tp-item'):null;
      if(!item||item.classList.contains('tp-break'))return;
      const t=parseFloat(item.getAttribute('data-t'));
      if(!isNaN(t))jumpToTime(t,{runup:0,from:item});
    });
    tpBody.addEventListener('keydown',function(e){
      if(e.key!=='Enter'&&e.key!==' ')return;
      const item=e.target.closest?e.target.closest('.tp-item'):null;
      if(!item||item.classList.contains('tp-break'))return;
      e.preventDefault();
      const t=parseFloat(item.getAttribute('data-t'));
      if(!isNaN(t))jumpToTime(t,{runup:0,from:item});
    });
  }
  _tpIdx=-1;
  try{showTranscriptPart(currentPaperPart());}catch(e){}
}

/* The recording streams from the CDI server. With no connection it never
   arrives — and the screen must say so rather than look broken, because the
   transcript, the timecodes and the revealed answers are all still usable. */
function reviewAudioDown(on){
  document.body.classList.toggle('audio-down',!!on);
  const b=document.getElementById('audio-state-badge');
  if(on&&b){b.textContent='✕ NO AUDIO';b.className='is-error';}
  if(!on&&reviewAudioDown._wd){clearTimeout(reviewAudioDown._wd);reviewAudioDown._wd=null;}
}
function wireReviewAudio(audio){
  if(!audio)return;
  if(!audio._rvWired){
    audio._rvWired=1;
    const down=function(){reviewAudioDown(true);};
    const up=function(){reviewAudioDown(false);};
    audio.addEventListener('error',down);
    // `play` fires the instant play() is called — its promise rejects later —
    // so it is NOT proof the stream arrived. `playing` is.
    audio.addEventListener('playing',up);
    audio.addEventListener('canplay',up);
    audio.addEventListener('loadedmetadata',up);
    // wireTransport writes BUFFERING / STALLED on these; it registered first,
    // so re-asserting here wins and the badge stays honest while nothing loads.
    audio.addEventListener('waiting',function(){if(audio.readyState<1)down();});
    audio.addEventListener('stalled',function(){if(audio.readyState<1)down();});
    const src=audio.querySelector('source');
    if(src)src.addEventListener('error',down);
  }
  if(audio.readyState>=1){reviewAudioDown(false);return;}
  try{audio.load();}catch(e){}
  if(reviewAudioDown._wd)clearTimeout(reviewAudioDown._wd);
  reviewAudioDown._wd=setTimeout(function(){if(audio.readyState<1)reviewAudioDown(true);},9000);
}

// TRANSCRIPT
/* One transcript line, rendered as karaoke-able words with the answers it
   contains marked in place. The cursor advances by CHUNK (sentence), not by
   word: word timings would have to be a linear split of the line's duration,
   which is wrong for real speech — a phrase arriving early reads as pacing, a
   word does not. `ans` carries the verdict so the pill can wear its colour. */
function buildWordSpans(tx,aw,answers,verdicts){
  var pill=answers&&answers.length?answers.map(function(q){
    var st=(verdicts&&verdicts[q])||'skipped';
    return '<span class="tp-apill-i is-'+st+'" title="Question '+q+' — '+st+'">Q'+q+'</span>';
  }).join(''):'';
  var awIdx=aw?tx.toLowerCase().indexOf(aw.toLowerCase()):-1;
  var wi=0, ci=0, inChunk=0;
  function endChunk(){ if(inChunk>0){ ci++; inChunk=0; } }
  function wrapWords(str,cls){
    return str.split(/(\s+)/).map(function(tok){
      if(/^\s+$/.test(tok))return tok;
      var html='<span class="tp-w'+(cls?' '+cls:'')+'" data-wi="'+(wi++)+'" data-ci="'+ci+'">'+escapeHtml(tok||'')+'</span>';
      inChunk++;
      // sentence-final punctuation only — commas and clause breaks do not split
      if(/[.!?…]["')\]]?$/.test(tok)) endChunk();
      return html;
    }).join('');
  }
  if(awIdx<0){var only=wrapWords(tx,'');endChunk();return only+pill;}
  var before=tx.slice(0,awIdx);
  var matchedStr=tx.slice(awIdx, awIdx+aw.length);
  var after=tx.slice(awIdx+aw.length);
  var r='';
  if(before)r+=wrapWords(before,'');
  // no forced break here: the answer belongs to the sentence around it, and its
  // gold styling comes from .tp-ans-w rather than from being its own chunk
  r+='<mark class="tp-ans-mark">'+wrapWords(matchedStr,'tp-ans-w')+'</mark>'+pill;
  if(after)r+=wrapWords(after,'');
  endChunk();
  return r;
}

function buildTranscriptPanel(){
  const panel=document.getElementById('transcript-panel');
  if(!panel)return;
  const verdicts={};
  try{gradeListening().detail.forEach(function(d){verdicts[d.id]=d.status;});}catch(e){}
  let marked=0;
  const groups=[];
  TRANSCRIPT.forEach(function(e,i){
    if(e.type==='break'){groups.push({label:e.label||'',items:[]});return;}
    if(!groups.length)groups.push({label:PART_LABEL+' · Questions '+Q_FROM+'–'+Q_TO,items:[]});
    groups[groups.length-1].items.push({e:e,i:i});
  });
  let tabs='';
  groups.forEach(function(g,gi){
    tabs+='<button type="button" class="tp-tab'+(gi===0?' is-on':'')+'" data-part="'+(gi+1)+'">Part '+(gi+PART_NO)+'</button>';
  });
  let h='<div class="tp-hdr"><span class="tp-live-dot"></span>'+
        '<span class="tp-hdr-lbl">Transcript</span>'+
        '<span class="tp-hdr-count" id="tp-hdr-count"></span></div>';
  h+='<div class="tp-tabs">'+tabs+'</div>';
  h+='<div class="tp-wrap"><div class="tp-fade-top"></div><div class="tp-fade-bot"></div><div class="tp-body" id="tp-body">';
  if(!groups.length){
    h+='<div class="tp-item"><div class="tp-tx" style="color:var(--rv-ink-3,#5b6472)">'+
       'The script for this section has not been added yet.</div></div>';
  }
  groups.forEach(function(g,gi){
    h+='<div class="tp-part" data-part="'+(gi+1)+'"'+(gi===0?'':' hidden')+'>';
    h+='<div class="tp-item tp-break"><div class="tp-br-line"></div>'+
       '<span class="tp-br-lbl">'+escapeHtml(g.label)+'</span><div class="tp-br-line"></div></div>';
    g.items.forEach(function(o){
      var e=o.e;
      var txHtml=buildWordSpans(e.tx,e.aw||null,e.answers||[],verdicts);
      if(e.answers&&e.answers.length)marked+=e.answers.length;
      h+='<div class="tp-item" id="tpi-'+o.i+'" data-sp="'+escapeHtml(e.sp||'')+'">'+
         '<div class="tp-sp">'+escapeHtml(e.sp||'')+'</div>'+
         '<div class="tp-tx">'+txHtml+'</div></div>';
    });
    h+='</div>';
  });
  h+='</div></div>';
  panel.innerHTML=h;
  const cnt=document.getElementById('tp-hdr-count');
  if(cnt)cnt.textContent=marked?(marked+' answers marked'):'';
  const tabWrap=panel.querySelector('.tp-tabs');
  if(tabWrap)tabWrap.addEventListener('click',function(ev){
    const b=ev.target.closest('.tp-tab');
    if(b)showTranscriptPart(+b.dataset.part);
  });
}
function currentPaperPart(){
  const b=document.querySelector('#stage-listening .section-block[id^="listening-part-"]');
  const n=b?parseInt(b.id.replace('listening-part-',''),10):1;
  return (n>=1&&n<=4)?n:1;
}
function showTranscriptPart(n){
  const panel=document.getElementById('transcript-panel');
  if(!panel)return;
  const parts=panel.querySelectorAll('.tp-part');
  if(!parts.length)return;
  if(!(n>=1&&n<=parts.length))n=1;
  parts.forEach(function(g){g.hidden=(+g.dataset.part!==n);});
  panel.querySelectorAll('.tp-tab').forEach(function(b){b.classList.toggle('is-on',+b.dataset.part===n);});
  const body=document.getElementById('tp-body');
  if(body)body.scrollTop=0;
}

/* m:ss, the label every timecode in review wears. */
function tcLabel(t){
  t=Math.max(0,Math.round(+t||0));
  return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');
}

function syncTranscriptPanel(currentTime){
  return; /* plain transcript: no timecode sync */
  if(!Array.isArray(TRANSCRIPT)||!TRANSCRIPT.length)return;
  let idx=0;
  for(let i=0;i<TRANSCRIPT.length;i++){
    if(TRANSCRIPT[i].t<=currentTime)idx=i; else break;
  }
  if(idx!==_tpIdx){
    _tpIdx=idx;
    document.querySelectorAll('#transcript-panel .tp-item').forEach(function(el,i){
      el.classList.toggle('tp-past',i<idx);
      el.classList.toggle('tp-cur',i===idx);
    });
    document.querySelectorAll('#transcript-panel .tp-w-lit').forEach(function(w){w.classList.remove('tp-w-lit');});
    const cur=document.getElementById('tpi-'+idx);
    const body=document.getElementById('tp-body');
    if(cur&&body){
      const bRect=body.getBoundingClientRect(),cRect=cur.getBoundingClientRect();
      body.scrollTop=body.scrollTop+(cRect.top-bRect.top)-body.clientHeight/2+cRect.height/2;
    }
  }
  // karaoke: progressively light words in current entry
  const entry=TRANSCRIPT[idx];
  if(!entry||entry.type==='break')return;
  const next=TRANSCRIPT[idx+1];
  // `e` is the line's true spoken end. Without it the window would stretch across
  // the silence that follows the line - the 30s question-reading pauses - and the
  // words would light far slower than they are said. Cap the fallback for the same
  // reason: no line of speech runs longer than ~12s.
  let dur;
  if(typeof entry.e==='number'&&entry.e>entry.t){
    dur=entry.e-entry.t;
  }else{
    dur=next?(next.t-entry.t):8;
    if(dur>12)dur=12;
  }
  if(!(dur>0))dur=8;
  const prog=Math.min(1,Math.max(0,(currentTime-entry.t)/dur));
  const curEl=document.getElementById('tpi-'+idx);
  if(!curEl)return;
  const words=curEl.querySelectorAll('.tp-w');
  let chunks=0;
  words.forEach(function(w){var c=+(w.dataset.ci||0);if(c+1>chunks)chunks=c+1;});
  if(!chunks)chunks=1;
  // +1: a line is usually ONE sentence, and floor(prog*1) is 0 until the very
  // end — without this the current line would never light while being spoken.
  const litChunks=Math.min(chunks,Math.floor(prog*chunks)+1);
  words.forEach(function(w){w.classList.toggle('tp-w-lit',(+(w.dataset.ci||0))<litChunks);});
}

/* The timecode beside every question that has one. Pressing it seeks the
   recording to the moment that answer is spoken and pulls the transcript
   there with it. Colour carries the verdict, so the sheet reads at a glance. */
function addJumpButtons(){
  const grades={};gradeListening().detail.forEach(function(d){grades[d.id]=d.status;});
  for(let i=Q_FROM;i<=Q_TO;i++){
    const t=(typeof ANSWER_TIMES!=='undefined'&&ANSWER_TIMES[i]!=null)?ANSWER_TIMES[i]:null;
    if(t==null)continue;
    const row=document.getElementById('lq-row-'+i);
    const card=document.getElementById('lq-card-'+i);
    const target=row||(card?card.querySelector('.q-row'):null)||card;
    if(!target||target.querySelector('.q-jump-btn'))continue;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='q-jump-btn is-'+(grades[i]||'skipped')+(row?'':' q-jump-btn-inline');
    btn.textContent=tcLabel(t);
    btn.title='Question '+i+' is answered at '+tcLabel(t)+' — play from there';
    btn.setAttribute('aria-label','Play the recording from '+tcLabel(t)+', where question '+i+' is answered');
    btn.onclick=function(ev){ev.preventDefault();jumpToTime(t,{from:btn});};
    target.appendChild(btn);
  }
}

/* Seek to a moment and take the transcript with it.
   opts.runup — seconds of lead-in (12s by default, so the question is heard
   as well as the answer); the transcript's own lines jump exactly.
   opts.from  — the control that was pressed, flashed so the click is answered. */
function jumpToTime(t,opts){
  opts=opts||{};
  const audio=document.getElementById('exam-audio');
  const runup=opts.runup==null?12:opts.runup;
  const seek=Math.max(0,(+t||0)-runup);
  if(opts.from){
    const el=opts.from;
    el.classList.add('is-jumping');
    setTimeout(function(){el.classList.remove('is-jumping');},420);
  }
  // No audio (offline, or the stream never arrived) is not a dead end: the
  // transcript still travels to the moment, which is what was asked for.
  _tpIdx=-1;
  syncTranscriptPanel(seek);
  if(!audio)return;
  try{audio.currentTime=seek;}catch(e){}
  const p=audio.play();
  if(p&&p.catch)p.catch(function(){});
  setTimeout(function(){_tpIdx=-1;syncTranscriptPanel(audio.currentTime||seek);},80);
}


/* ── the sheet that replaces confirm() ─────────────────────────────────────
   Two questions in this app are destructive, and the browser answered both of
   them in a system dialog that lands before the shell has drawn a frame and
   states the stakes in the flattest possible way. This is the same glass the
   entrance is made of, and it says what "start fresh" actually destroys. */
function wipeSession(){
  // A declined resume must leave NOTHING of the previous attempt behind — not
  // the answers, not the flags, not the scratch notes the candidate typed into
  // the pencil panel, which live under their own key.
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
  try{localStorage.removeItem('cdi_listening_notes');}catch(e){}
  const ta=document.getElementById('notes-area');if(ta)ta.value='';
  document.body.classList.remove('no-select','review-mode','notes-open','cdi-exit');
}
function chSheet(o){
  const el=document.getElementById('ch-resume');
  if(!el){ // no sheet in the DOM: never trap the candidate, just take the safe path
    if(o.onGhost)o.onGhost();else if(o.onGo)o.onGo();
    return;
  }
  el.querySelector('.ch-sheet-eyebrow').textContent=o.eyebrow||'Unfinished session';
  el.querySelector('#ch-resume-title').textContent=o.title||'';
  el.querySelector('#ch-resume-body').textContent=o.body||'';
  const go=el.querySelector('#ch-resume-go'),gh=el.querySelector('#ch-resume-fresh');
  go.querySelector('span').textContent=o.goLabel||'Resume test';
  gh.textContent=o.ghostLabel||'Start fresh';
  // Some questions have only one honest answer. A second button that leads
  // nowhere would be furniture pretending to be a choice.
  gh.style.display=o.solo?'none':'';
  const close=()=>{el.classList.remove('show');go.onclick=null;gh.onclick=null;};
  go.onclick=()=>{close();if(o.onGo)o.onGo();};
  gh.onclick=()=>{close();if(o.onGhost)o.onGhost();};
  el.classList.add('show');
  // the prelude does not detonate behind a modal
  try{if(window.__cdiReveal)window.__cdiReveal();}catch(e){}
  setTimeout(()=>{try{go.focus({preventScroll:true});}catch(e){}},60);
}

// INIT
function freshStart(){
  /* The briefing and completion screens are gone: entry card -> paper -> score
     sheet -> review. The paper is built here but stays behind the entry card
     until beginTest() is called, so the clock cannot run before Start. */
  wipeSession();
  Object.assign(state,{student:{name:''},stage:'listening',startedAt:null,finishedAt:null,listeningAnswers:{},listeningFlags:{},annotations:{1:[],2:[],3:[],4:[]},timers:{listening:PART_SECS},currentSection:PART_NO,activeQuestion:null,timerHidden:false,warnings:0});
  document.body.classList.remove('cdi-booting','cdi-exit','review-mode','tp-active');
  goToStage('listening');
  renderListening();
  try{updateListeningNav();}catch(e){}
}
/* Called by the entry card once the candidate has a name and the recording has
   buffered. The click that got here is the user gesture the audio needs, so
   playback is attempted directly; the play gate is the fallback, not the rule. */
function beginTest(name){
  state.student.name=(name||'').trim();
  state.startedAt=new Date().toISOString();
  saveState();updateHeaderName(state.student.name);
  document.body.classList.remove('pre-entry');
  document.body.classList.add('entry-done','no-select');
  goToStage('listening');
  startTimer('listening',function(){toast('Time is up — well done!','success');finishExam();});
  startLockedAudio();
  try{startGatedAudio();}catch(e){}
}
function init(){
  document.addEventListener('contextmenu',function(e){e.preventDefault();},true);
  setupAntiCheat();setupHighlighter();
  const savedTheme=localStorage.getItem('cdi_reading_theme')||'light';setTheme(savedTheme);
  applyBrandLogo();
  // TEST HARNESS: ?test=1&stage=<name>&part=<1-4> boots straight to a stage for visual QA.
  // Skips the resume sheet, fullscreen and proctoring so screenshots are deterministic.
  if(TEST_MODE){
    const p=new URLSearchParams(location.search);
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state,{student:{name:p.get('name')||'Test Candidate'},stage:'registration',startedAt:Date.now(),finishedAt:null,listeningAnswers:{},listeningFlags:{},annotations:{1:[],2:[],3:[],4:[]},timers:{listening:PART_SECS},currentSection:PART_NO,activeQuestion:null,timerHidden:false,warnings:0});
    updateHeaderName(state.student.name);
    const st=p.get('stage')||'registration';
    renderListening();
    if(st==='results'){renderResults();}
    goToStage(st);
    if(st==='listening'){jumpToListeningPart(+(p.get('part')||1));updateListeningNav();if(p.has('gate'))startLockedAudio();}
    return;
  }
  const restored=loadState();
  // A reload ends the sitting. There is no picking a paper back up: the page
  // returns, says plainly what that cost, and opens the test again from the
  // beginning. Nothing is erased until the candidate acknowledges it, so
  // closing the tab on this sheet leaves the save exactly where it was.
  /* listening resume sheet: a reload restarts the paper */
  
  freshStart();
}
document.addEventListener('DOMContentLoaded',init);

/* ====================================================================
   FULL MOCK BRIDGE  (only active inside the mock iframe: ?embed=1)
   ==================================================================== */
window.__mockStart = function(n){
  var i=document.getElementById('entry-name'); if(i) i.value = n || 'Candidate';
  var b=document.getElementById('entry-start'); if(b) b.click();
};
/* reopen the paper with the student's answers + transcript */
window.__mockReview = function(n, ans){
  var i=document.getElementById('entry-name'); if(i) i.value = n || 'Candidate';
  var b=document.getElementById('entry-start'); if(b) b.click();
  var tries=0;
  var t=setInterval(function(){
    tries++;
    if(state.stage==='listening' && document.getElementById('listening-render')){
      clearInterval(t);
      setTimeout(function(){
        try{ pauseTimer(); }catch(e){}
        try{ var a=document.getElementById('exam-audio'); if(a) a.pause(); }catch(e){}
        try{ Object.keys(ans||{}).forEach(function(k){ if(ans[k]!=null && ans[k]!=='') state.listeningAnswers[k]=ans[k]; }); }catch(e){}
        try{ renderResults(); }catch(e){}
        try{ reviewExam(); }catch(e){}
        try{ pauseTimer(); }catch(e){}
        try{ MockBridge.exitButton(); }catch(e){}
      },400);
    } else if(tries>400){ clearInterval(t); try{ MockBridge.exitButton(); }catch(e){} }
  },60);
};

return{validateStart,beginListening,beginTest,renderResults,finishExam,finishAndLeave,jumpToListening,jumpToListeningPart,prevSection,nextSection,toggleFlag,onListeningInput,setDragAnswer,applyHighlight,clearHighlight,addNote,openNote,saveNote,deleteNote,closeNote,toggleAnnoDrawer,jumpToNote,deleteNoteAt,renderNotesDrawer,setVolume,setPlaybackRate,seekAudio,togglePlayPause,dismissWarning,unlockResults,resetExam,reviewExam,confirmSubmit,backToResults,printReport,downloadReport,setTheme,zoomText,toggleFullscreen,toggleTimer,updateListeningNav,jumpToTime,startGatedAudio};
})();

// ── DRAG MATCH (pointer-based, robust) ──
let _dm=null; // {chip, ghost, ox, oy, home, lastOver}
function dmReturnHint(drop){
  if(drop.querySelector('.drag-num-hint'))return;
  const hint=document.createElement('span');hint.className='drag-num-hint';hint.textContent=drop.dataset.q;
  drop.appendChild(hint);
}
function dmClearDrop(drop){
  if(!drop)return;
  drop.classList.remove('dm-filled');
  dmReturnHint(drop);
  if(drop.dataset.q)ExamApp.setDragAnswer(drop.dataset.q,'');
}
function dmPlace(chip,drop){
  const oldDrop=chip.closest('.drag-drop');
  if(oldDrop&&oldDrop!==drop)dmClearDrop(oldDrop);
  const existing=drop.querySelector('.drag-chip');
  if(existing&&existing!==chip){
    if(existing.classList.contains('dm-reuse-chip')){existing.remove();}
    else{const pool=document.getElementById(existing.dataset.pool);if(pool)pool.appendChild(existing);}
  }
  drop.querySelectorAll('.drag-num-hint').forEach(h=>h.remove());
  drop.appendChild(chip);
  drop.classList.add('dm-filled');
  ExamApp.setDragAnswer(drop.dataset.q,chip.dataset.val);
}
function dmToPool(chip){
  const oldDrop=chip.closest('.drag-drop');
  if(oldDrop)dmClearDrop(oldDrop);
  if(chip.classList.contains('dm-reuse-chip')){chip.remove();return;}
  const pool=document.getElementById(chip.dataset.pool);
  if(pool)pool.appendChild(chip);
}
function dmDown(e){
  if(document.body.classList.contains('review-mode'))return;
  let chip=e.target.closest('.drag-chip');
  if(!chip)return;
  e.preventDefault();
  const r=chip.getBoundingClientRect();
  const srcPool=chip.closest('.drag-pool');
  if(srcPool&&srcPool.dataset.reuse){const cl=chip.cloneNode(true);cl.classList.add('dm-reuse-chip');chip=cl;}
  const ghost=chip.cloneNode(true);
  ghost.classList.add('dm-ghost');
  ghost.style.width=r.width+'px';ghost.style.height=r.height+'px';
  ghost.style.left=r.left+'px';ghost.style.top=r.top+'px';
  document.body.appendChild(ghost);
  chip.classList.add('dm-dragging');
  document.body.classList.add('dm-active');
  _dm={chip,ghost,ox:e.clientX-r.left,oy:e.clientY-r.top,lastOver:null};
  window.addEventListener('pointermove',dmMove);
  window.addEventListener('pointerup',dmUp);
}
function dmMove(e){
  if(!_dm)return;
  _dm.ghost.style.left=(e.clientX-_dm.ox)+'px';
  _dm.ghost.style.top=(e.clientY-_dm.oy)+'px';
  _dm.ghost.style.display='none';
  const el=document.elementFromPoint(e.clientX,e.clientY);
  _dm.ghost.style.display='';
  const drop=el?el.closest('.drag-drop'):null;
  if(_dm.lastOver&&_dm.lastOver!==drop)_dm.lastOver.classList.remove('dm-over');
  if(drop)drop.classList.add('dm-over');
  _dm.lastOver=drop;
}
function dmUp(e){
  if(!_dm)return;
  window.removeEventListener('pointermove',dmMove);
  window.removeEventListener('pointerup',dmUp);
  const el=(_dm.ghost.style.display='none',document.elementFromPoint(e.clientX,e.clientY));
  const drop=el?el.closest('.drag-drop'):null;
  const pool=el?el.closest('.drag-pool'):null;
  if(_dm.lastOver)_dm.lastOver.classList.remove('dm-over');
  if(drop){dmPlace(_dm.chip,drop);}
  else if(pool){dmToPool(_dm.chip);}
  // else: no valid target → leave chip where it was (snap back)
  _dm.chip.classList.remove('dm-dragging');
  _dm.ghost.remove();
  document.body.classList.remove('dm-active');
  _dm=null;
}
// delegate pointerdown for all current/future chips
document.addEventListener('pointerdown',dmDown);
(function(){
  function boot(){try{LSN.buildNotes();LSN.restorePrefs();}catch(e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);});
  else setTimeout(boot,0);
})();
function dmRestore(qid,val){
  const drop=document.getElementById('drop-'+qid);
  if(!drop)return;
  let chip=null;
  const tmpl=document.querySelector('.drag-pool[data-reuse] [data-val="'+CSS.escape(val)+'"]');
  if(tmpl){chip=tmpl.cloneNode(true);chip.classList.add('dm-reuse-chip');}
  else{chip=document.querySelector('[data-pool][data-val="'+CSS.escape(val)+'"]');}
  if(!chip)return;
  drop.querySelectorAll('.drag-num-hint').forEach(h=>h.remove());
  drop.appendChild(chip);drop.classList.add('dm-filled');
  const inp=document.getElementById('lq-'+qid);if(inp)inp.value=val;
}

;

/* ════════════════════════════════════════════════════════════════════════════
   CDI COSMIC SHELL — boot orchestration (no dependencies).
   Runs whether or not WebGL / Three.js is available, so the entrance screens
   can never be left blocked by a failed particle layer.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  var body = document.body;
  var RM = false;
  try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  window.__cdiReduced = RM;
  window.__cdiBootStart = (window.performance && performance.now) ? performance.now() : Date.now();

  var revealed = false;
  window.__cdiReveal = function () {
    if (revealed) return;
    revealed = true;
    body.classList.remove('cdi-booting');
    body.classList.add('cdi-reveal');
    var el = document.getElementById('start-name');
    var reg = document.getElementById('stage-registration');
    var sheet = document.getElementById('ch-resume');
    var blocked = sheet && sheet.classList.contains('show');
    if (el && reg && reg.classList.contains('active') && !RM && !blocked) {
      setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }, 780);
    }
  };
  window.__cdiRevealed = function () { return revealed; };

  var reg = document.getElementById('stage-registration');
  /* COSMOS: no prelude — the card arrives on a sky that is already moving. */
  var booting = false;
  if (!booting || RM) {
    /* resumed test, or motion-sensitive user: no prelude at all */
    window.__cdiReveal();
  } else {
    /* THE PRELUDE BUDGET.
       The particle layer needs a WebGL context, two shader compiles and a first
       frame; on a software renderer that can be most of a second — long enough
       that a prelude started on module-load would play *after* the card had
       already been forced on screen. So the prelude gets a hard audition
       window: if the atmosphere has not signalled ready inside the budget, the
       card performs its own entrance and the particle layer fades in behind it
       whenever it finally arrives. The entrance is never hostage to the GPU. */
    var since = window.__cdiBootStart;          // ms since navigation started
    setTimeout(function () {
      if (!window.__cdiAtmoReady) window.__cdiReveal();
    }, Math.max(150, 940 - since));
    /* absolute ceiling, in case the layer starts but then throws mid-prelude */
    setTimeout(window.__cdiReveal, Math.max(320, 2050 - since));
  }

  /* skip the prelude on any deliberate interaction */
  ['pointerdown', 'keydown', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, function () {
      if (window.CDIAtmosphere && window.CDIAtmosphere.skip) window.CDIAtmosphere.skip();
      window.__cdiReveal();
    }, { once: true, passive: true });
  });

  /* ── registration micro-interactions ─────────────────────────────────── */
  function wireRegistration() {
    var input = document.getElementById('start-name');
    var field = document.getElementById('start-field');
    var btn = document.getElementById('start-btn');
    if (!input || !btn) return;
    var wasOk = null;
    var sync = function () {
      var ok = input.value.trim().length >= 2;
      btn.classList.toggle('is-dormant', !ok);
      if (ok && wasOk === false && !RM) {
        btn.classList.remove('is-live'); void btn.offsetWidth; btn.classList.add('is-live');
      }
      if (!ok) btn.classList.remove('is-live');
      wasOk = ok;
      if (ok && field) field.classList.remove('is-invalid');
    };
    input.addEventListener('input', sync);
    input.addEventListener('blur', sync);
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireRegistration);
  else wireRegistration();

  /* ── completion: the "sealing" sequence ──────────────────────────────────
     Listening is marked the instant the tape stops — there is no examiner to
     wait for. The seal is therefore not a progress bar pretending to work; it
     is the two and a half seconds in which a candidate stops being a candidate,
     given a shape. It runs once, on the way past. */
  var STEP_AT = [0.20, 0.50, 0.80];
  var STATUS = [
    [0.00, 'Sealing your answer sheet…'],
    [0.22, 'Checking spellings and accepted alternatives…'],
    [0.52, 'Applying the official band conversion…'],
    [0.82, 'Preparing your report and transcript…']
  ];
  var compRun = false;
  function runCompletion() {
    if (compRun) return;
    compRun = true;
    var stage = document.getElementById('stage-completion');
    var arc = document.getElementById('ch-seal-arc');
    var pct = document.getElementById('ch-seal-pct');
    var status = document.getElementById('ch-status');
    var steps = document.querySelectorAll('#ch-steps li');
    var CIRC = 175.93;

    function paint(e) {
      if (arc) arc.style.strokeDashoffset = String(CIRC * (1 - e));
      if (pct) pct.textContent = Math.round(e * 100) + '%';
      var nowIdx = -1;
      for (var i = 0; i < steps.length; i++) {
        var done = e >= STEP_AT[i];
        steps[i].classList.toggle('on', done);
        if (!done && nowIdx < 0) nowIdx = i;
      }
      for (var n = 0; n < steps.length; n++) steps[n].classList.toggle('now', n === nowIdx);
      if (status) {
        var txt = STATUS[0][1];
        for (var j = 0; j < STATUS.length; j++) if (e >= STATUS[j][0]) txt = STATUS[j][1];
        if (status.textContent !== txt) status.textContent = txt;
      }
      if (window.CDIAtmosphere && window.CDIAtmosphere.progress) window.CDIAtmosphere.progress(e);
    }
    function seal() {
      paint(1);
      for (var i = 0; i < steps.length; i++) steps[i].classList.remove('now');
      if (status) status.textContent = 'Sealed · your answers are marked and ready.';
      if (stage) stage.classList.add('is-sealed');
      if (window.CDIAtmosphere && window.CDIAtmosphere.sealed) window.CDIAtmosphere.sealed();
    }
    if (RM) { seal(); return; }

    var t0 = performance.now();
    var HOLD = 260, DUR = 2280;
    (function step(now) {
      var p = Math.min(Math.max((now - t0 - HOLD) / DUR, 0), 1);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      paint(e);
      if (p < 1) requestAnimationFrame(step);
      else seal();
    })(performance.now());
  }
  function watchCompletion() {
    var stage = document.getElementById('stage-completion');
    if (!stage) return;
    if (stage.classList.contains('active')) runCompletion();
    try {
      new MutationObserver(function () {
        if (stage.classList.contains('active')) runCompletion();
      }).observe(stage, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchCompletion);
  else watchCompletion();
})();

;

/* The former Three.js particle prelude lived here and was retired: it short-circuited
   at boot and rendered nothing. The engine still calls these hooks (guarded), so the
   no-op surface is kept. The DEEP FIELD module further down is the atmosphere now. */
(function () {
  var host = document.getElementById('cdi-webgl');
  if (host) host.style.display = 'none';
  window.CDIAtmosphere = { progress: function () {}, sealed: function () {}, dim: function () {},
                           skip: function () {}, sync: function () {} };
})();

;

/* the registration fine print becomes the credit line, as on Reading */
(function () {
  function say() {
    var fp = document.querySelector('#stage-registration .ch-fineprint');
    if (fp) fp.textContent = 'This test was prepared & built by Islom Kenjayev '
                           + '\u00b7 IELTS 8.5 (L\u00a09.0 \u00b7 R\u00a09.0)';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', say);
  else say();
})();

;

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

;

/* ════════════════════════════════════════════════════════════════════════
   ENTRY CARD
   The candidate names themselves, the recording is fetched, and only then
   does the paper appear and the clock start. The progress bar tracks the
   real download where the browser reports it and falls back to the audio
   element's own readiness where it does not.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
  var form   = document.getElementById('entry-form');
  var load   = document.getElementById('entry-loading');
  var btn    = document.getElementById('entry-start');
  var fill   = document.getElementById('entry-progress-fill');
  var label  = document.getElementById('entry-progress-label');
  var overlay= document.getElementById('entry-overlay');
  if(!btn||!overlay) return;

  function start(){
    var name = '';
    /* the Start click is the user gesture fullscreen needs, so ask for it here */
    try{
      var de=document.documentElement;
      if(!document.fullscreenElement&&!document.webkitFullscreenElement){
        var rq=de.requestFullscreen||de.webkitRequestFullscreen||de.mozRequestFullScreen||de.msRequestFullscreen;
        if(rq){var rp=rq.call(de);if(rp&&rp.catch)rp.catch(function(){});}
      }
    }catch(e){}
    form.hidden = true;
    load.hidden = false;

    var audio = document.getElementById('exam-audio');
    var pct = 0, ready = false, done = false;

    function finish(){
      if(done) return; done = true;
      fill.style.width = '100%'; label.textContent = '100%';
      setTimeout(function(){
        overlay.style.display = 'none';
        try{ ExamApp.beginTest(name); }catch(e){}
      }, 220);
    }
    function tick(){
      if(done) return;
      pct = Math.min(96, pct + (ready ? 16 : 2.5));
      fill.style.width = pct + '%';
      label.textContent = Math.round(pct) + '%';
      if(pct >= 96 && ready){ finish(); return; }
      setTimeout(tick, 90);
    }
    function markReady(){ ready = true; }

    if(audio){
      audio.addEventListener('canplaythrough', markReady, {once:true});
      audio.addEventListener('canplay',        markReady, {once:true});
      audio.addEventListener('loadeddata',     markReady, {once:true});
      audio.addEventListener('error',          markReady, {once:true});
      audio.preload = 'auto';
      try{ audio.load(); }catch(e){}
      if(audio.readyState >= 2) markReady();
      /* preload="auto" means the fetch may have finished — or failed — before
         the candidate ever clicked Start, in which case no further event is
         coming and the listeners above would wait forever. */
      if(audio.error) markReady();
    } else { markReady(); }

    /* Never hold a candidate on a spinner because a CDN is slow: after ten
       seconds the paper opens anyway and the play gate handles the rest. */
    setTimeout(markReady, 6000);
    tick();
  }

  btn.addEventListener('click', start);
  setTimeout(function(){ try{ btn.focus(); }catch(e){} }, 120);
})();

;

/* ═══ Skin glue: header volume popover · exam-mode cards on the start page ═══ */
(function(){
  var vb=document.getElementById('vol-btn'),vp=document.getElementById('vol-pop'),vs=document.getElementById('vol-slider-hdr');
  if(vb&&vp){
    vb.addEventListener('click',function(e){e.stopPropagation();var o=vp.classList.toggle('open');vb.setAttribute('aria-expanded',o?'true':'false');});
    document.addEventListener('click',function(e){if(!vp.contains(e.target)&&!vb.contains(e.target)){vp.classList.remove('open');vb.setAttribute('aria-expanded','false');}});
    if(vs)vs.addEventListener('input',function(){try{ExamApp.setVolume(vs.value);}catch(e){}});
  }
  var cards=[].slice.call(document.querySelectorAll('.st-mode'));
  function pick(card){
    cards.forEach(function(c){var on=c===card;c.classList.toggle('sel',on);c.setAttribute('aria-checked',on?'true':'false');if(on)c.classList.add('unlocked');});
    document.body.setAttribute('data-exam-mode',card.getAttribute('data-mode'));
  }
  cards.forEach(function(c){
    c.addEventListener('click',function(){pick(c);});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(c);}});
  });
  document.body.setAttribute('data-exam-mode','practice');
})();
