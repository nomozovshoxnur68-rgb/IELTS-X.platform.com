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
  var field  = document.getElementById('entry-field');
  var hint   = document.getElementById('entry-hint');
  var input  = document.getElementById('entry-name');
  var btn    = document.getElementById('entry-start');
  var fill   = document.getElementById('entry-progress-fill');
  var label  = document.getElementById('entry-progress-label');
  var overlay= document.getElementById('entry-overlay');
  if(!btn||!input||!overlay) return;

  function start(){
    var name = input.value.trim();
    if(name.length < 2){
      field.classList.remove('is-invalid'); void field.offsetWidth;
      field.classList.add('is-invalid');
      hint.textContent = name ? 'That looks a little short — please enter your full name.'
                              : 'Enter your name to begin. It appears on your score report.';
      input.focus();
      return;
    }
    field.classList.remove('is-invalid');
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
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') start(); });
  input.addEventListener('input', function(){
    if(input.value.trim().length >= 2){
      field.classList.remove('is-invalid');
      hint.textContent = 'It appears on your score report.';
    }
  });
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ try{ input.focus(); }catch(e){} }, 120); });
  } else { setTimeout(function(){ try{ input.focus(); }catch(e){} }, 120); }
})();
