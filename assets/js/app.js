/* Built-in (old) cards of the Part practice pages. false = only the cards made in the admin panel are shown. Set to true to bring the old ones back. */
window.IELTSX_SHOW_BUILTIN_CARDS = false;
/*
 * IELTSX — single JavaScript bundle (assets/js/app.js)
 * 1) shared constants & helpers  2) page modules (original code, unchanged)  3) router
 */
(function () {
  /* ======
   * 1) SHARED CONSTANTS & HELPERS (new) — window.IELTSX
   *    Names inside this block are kept exactly as in the original bundle.
   * ====== */
  var lz = (e => (e.LISTENING = "LISTENING",
  e.READING = "READING",
  e.WRITING_TASK1 = "WRITING_TASK1",
  e.WRITING_TASK2 = "WRITING_TASK2",
  e.SPEAKING = "SPEAKING",
  e.WRITING = "WRITING",
  e.MOCK = "MOCK",
  e))(lz || {})
    , cz = (e => (e.NOTE_COMPLETION = "NOTE_COMPLETION",
  e.MATCHING = "MATCHING",
  e.MATCHING_NAMES = "MATCHING_NAMES",
  e.MATCHING_FEATURES = "MATCHING_FEATURES",
  e.MATCHING_SENTENCE_ENDINGS = "MATCHING_SENTENCE_ENDINGS",
  e.DIAGRAM_LABELING = "DIAGRAM_LABELING",
  e.DIAGRAM_COMPLETION = "DIAGRAM_COMPLETION",
  e.FLOW_CHART_MATCHING = "FLOW_CHART_MATCHING",
  e.FLOW_CHART_COMPLETION = "FLOW_CHART_COMPLETION",
  e.MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  e.TABLE_COMPLETION = "TABLE_COMPLETION",
  e.FORM_COMPLETION = "FORM_COMPLETION",
  e.SHORT_ANSWER_COMPLETION = "SHORT_ANSWER_COMPLETION",
  e.SENTENCE_COMPLETION = "SENTENCE_COMPLETION",
  e.MATCHING_HEADINGS = "MATCHING_HEADINGS",
  e.MATCHING_INFORMATION = "MATCHING_INFORMATION",
  e.MULTIPLE_CHOICE_MANY = "MULTIPLE_CHOICE_MANY",
  e.SUMMARY_COMPLETION = "SUMMARY_COMPLETION",
  e.SUMMARY_COMPLETION_OPTIONS = "SUMMARY_COMPLETION_OPTIONS",
  e.TRUE_FALSE_NOT_GIVEN = "TRUE_FALSE_NOT_GIVEN",
  e.YES_NO_NOT_GIVEN = "YES_NO_NOT_GIVEN",
  e.GAP_FILLING = "GAP_FILLING",
  e.WRITING_TASK1 = "WRITING_TASK1",
  e.WRITING_TASK2 = "WRITING_TASK2",
  e.SPEAKING = "SPEAKING",
  e.SPEAKING_PART1 = "SPEAKING_PART1",
  e.SPEAKING_PART2 = "SPEAKING_PART2",
  e.SPEAKING_PART3 = "SPEAKING_PART3",
  e))(cz || {})
    , uz = (e => (e.PLAIN = "PLAIN",
  e.LABELED = "LABELED",
  e.QUESTION = "QUESTION",
  e.QUESTION_LABELED = "QUESTION_LABELED",
  e))(uz || {})
    , dz = (e => (e.AUDIO = "AUDIO",
  e.IMAGE = "IMAGE",
  e.PDF = "PDF",
  e.DOCX = "DOCX",
  e))(dz || {});
  const fz = [{
      value: "MULTIPLE_CHOICE",
      label: "Multiple Choice"
  }, {
      value: "MULTIPLE_CHOICE_MANY",
      label: "Multiple Choice Many"
  }, {
      value: "TRUE_FALSE_NOT_GIVEN",
      label: "True/False/Not Given"
  }, {
      value: "YES_NO_NOT_GIVEN",
      label: "Yes/No/Not Given"
  }, {
      value: "MATCHING_HEADINGS",
      label: "Matching Headings"
  }, {
      value: "MATCHING_INFORMATION",
      label: "Matching Information"
  }, {
      value: "MATCHING_NAMES",
      label: "Matching Names"
  }, {
      value: "MATCHING_FEATURES",
      label: "Matching Features"
  }, {
      value: "MATCHING_SENTENCE_ENDINGS",
      label: "Matching Sentence Endings"
  }, {
      value: "FORM_COMPLETION",
      label: "Form Completion"
  }, {
      value: "NOTE_COMPLETION",
      label: "Note Completion"
  }, {
      value: "GAP_FILLING",
      label: "Gap Filling"
  }, {
      value: "SENTENCE_COMPLETION",
      label: "Sentence Completion"
  }, {
      value: "SHORT_ANSWER_COMPLETION",
      label: "Short answer Completion"
  }, {
      value: "SUMMARY_COMPLETION",
      label: "Summary Completion"
  }, {
      value: "SUMMARY_COMPLETION_OPTIONS",
      label: "Summary Completion Options"
  }, {
      value: "TABLE_COMPLETION",
      label: "Table Completion"
  }, {
      value: "DIAGRAM_COMPLETION",
      label: "Diagram Completion"
  }, {
      value: "FLOW_CHART_COMPLETION",
      label: "Flow Chart Completion"
  }]
    , pz = [{
      value: "MULTIPLE_CHOICE",
      label: "Multiple Choice"
  }, {
      value: "MULTIPLE_CHOICE_MANY",
      label: "Multiple Choice Many"
  }, {
      value: "MATCHING_NAMES",
      label: "Matching Names"
  }, {
      value: "MATCHING_FEATURES",
      label: "Matching Features"
  }, {
      value: "MATCHING_SENTENCE_ENDINGS",
      label: "Matching Sentence Endings"
  }, {
      value: "FORM_COMPLETION",
      label: "Form Completion"
  }, {
      value: "NOTE_COMPLETION",
      label: "Note Completion"
  }, {
      value: "TABLE_COMPLETION",
      label: "Table Completion"
  }, {
      value: "DIAGRAM_LABELING",
      label: "Diagram Labeling"
  }, {
      value: "DIAGRAM_COMPLETION",
      label: "Diagram Completion"
  }, {
      value: "SENTENCE_COMPLETION",
      label: "Sentence Completion"
  }, {
      value: "FLOW_CHART_MATCHING",
      label: "Flow Chart Matching"
  }, {
      value: "FLOW_CHART_COMPLETION",
      label: "Flow Chart Completion"
  }]
    , hz = () => ({
      id: crypto.randomUUID(),
      instruction: "",
      questions: []
  })
    , mz = {
      reading: ["Access reading passages and tests", "Practice with IELTS practice materials", "Get detailed answer explanations"],
      listening: ["Access listening tests", "Practice with real exam audio", "Get full transcripts and explanations"],
      writing: ["Access writing tasks and prompts", "Get AI-powered feedback on your essays", "Review detailed band score breakdown"],
      speaking: ["Access speaking topics", "Practice with AI speaking partner", "Get pronunciation feedback"],
      mock: ["Access full mock exams", "Get comprehensive score reports", "Simulate actual test day experience"],
      general: ["Access all tests and content", "Get detailed performance analytics", "Priority support and updates"]
  }
    , yz = {
      DEMO: "Demo",
      STANDARD: "Standard",
      MAX: "MAX",
      ULTRA: "Ultra"
  }
    , gz = {
      DEMO: 0,
      STANDARD: 1,
      MAX: 2,
      ULTRA: 3
  }
    , vz = {
      reading: "Reading",
      listening: "Listening",
      writing: "Writing",
      speaking: "Speaking",
      mock: "Mock tests",
      general: "all premium content"
  };

  // ---- Articles page: sources / topics / passages / sort options ----
  const gW = [{
      name: "All Live Sources",
      code: "all"
  }, {
      name: "National Geographic (P1)",
      code: "national-geographic"
  }, {
      name: "BBC News (P1, P2)",
      code: "bbc-news"
  }, {
      name: "Bloomberg (P3)",
      code: "bloomberg"
  }, {
      name: "The Wall Street Journal (P3)",
      code: "the-wall-street-journal"
  }, {
      name: "Washington Post (P2)",
      code: "the-washington-post"
  }, {
      name: "Wired (P2, P3)",
      code: "wired"
  }, {
      name: "Medical News Today (P2)",
      code: "medical-news-today"
  }, {
      name: "New Scientist (P2, P3)",
      code: "new-scientist"
  }, {
      name: "History Today (P2)",
      code: "history-today"
  }, {
      name: "The Conversation (P3)",
      code: "the-conversation"
  }]
    , vW = [{
      name: "History",
      code: "history"
  }, {
      name: "Science",
      code: "science"
  }, {
      name: "Environment",
      code: "environment"
  }, {
      name: "Technology",
      code: "technology"
  }, {
      name: "Society",
      code: "society"
  }, {
      name: "Culture",
      code: "culture"
  }, {
      name: "Education",
      code: "education"
  }, {
      name: "Health",
      code: "health"
  }, {
      name: "Business",
      code: "business"
  }, {
      name: "Psychology",
      code: "psychology"
  }, {
      name: "Economics",
      code: "economics"
  }, {
      name: "Politics",
      code: "politics"
  }]
    , bW = [{
      name: "Any Passage",
      code: "all"
  }, {
      name: "Passage 1",
      code: "1"
  }, {
      name: "Passage 2",
      code: "2"
  }, {
      name: "Passage 3",
      code: "3"
  }]
    , xW = [{
      name: "Recommended",
      code: "recommended"
  }, {
      name: "Newest",
      code: "newest"
  }, {
      name: "Oldest",
      code: "oldest"
  }, {
      name: "Title A-Z",
      code: "title"
  }]
    , wW = [{
      name: "Newest",
      code: "newest"
  }, {
      name: "Oldest",
      code: "oldest"
  }, {
      name: "Title A-Z",
      code: "title"
  }, {
      name: "Source A-Z",
      code: "source"
  }];

  function jW(e) {
      return e ? e.replace(/\s*[-|–]\s*[^-–|]+$/g, "").trim() : ""
  }
  function SW(e) {
      if (e.summary && e.summary.trim().length > 0)
          return e.summary.length > 180 ? e.summary.slice(0, 177) + "..." : e.summary;
      const t = e.content?.find(e => e.text)?.text || "";
      return t.trim().length > 0 ? t.length > 180 ? t.slice(0, 177) + "..." : t : "No summary available."
  }

  // ---- Performance summary (from the analytics hook: totals + average band) ----
  function summarizeResults(t) {
      return {
          totalTests: t.length,
          averageBand: t.length ? t.reduce((e, t) => e + t.score, 0) / t.length : 0
      }
  }

  // ---- en-US locale: the self-contained parts (ordinals + name tables) ----
  const enUSLocale = {
      code: "en-US",
      ordinalNumber: (e, t) => {
          const r = Number(e)
            , n = r % 100;
          if (n > 20 || n < 10)
              switch (n % 10) {
              case 1:
                  return r + "st";
              case 2:
                  return r + "nd";
              case 3:
                  return r + "rd"
              }
          return r + "th"
      },
      values: {
          era: {
              narrow: ["B", "A"],
              abbreviated: ["BC", "AD"],
              wide: ["Before Christ", "Anno Domini"]
          },
          quarter: {
              narrow: ["1", "2", "3", "4"],
              abbreviated: ["Q1", "Q2", "Q3", "Q4"],
              wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
          },
          month: {
              narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
              abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
          },
          day: {
              narrow: ["S", "M", "T", "W", "T", "F", "S"],
              short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
              abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          },
          dayPeriod: {
              narrow: { am: "a", pm: "p", midnight: "mi", noon: "n", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" },
              abbreviated: { am: "AM", pm: "PM", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" },
              wide: { am: "a.m.", pm: "p.m.", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" }
          },
          dayPeriodFormatting: {
              narrow: { am: "a", pm: "p", midnight: "mi", noon: "n", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" },
              abbreviated: { am: "AM", pm: "PM", midnight: "midnight", noon: "noon", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" },
              wide: { am: "a.m.", pm: "p.m.", midnight: "midnight", noon: "noon", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" }
          }
      }
  };

  window.IELTSX = window.IELTSX || {};
  window.IELTSX.enums = { TestType: lz, QuestionType: cz, ContentStyle: uz, MediaType: dz };
  window.IELTSX.questionTypes = { reading: fz, listening: pz };
  window.IELTSX.newQuestionGroup = hz;
  window.IELTSX.planFeatures = mz;
  window.IELTSX.planNames = yz;
  window.IELTSX.planRank = gz;
  window.IELTSX.sectionNames = vz;
  window.IELTSX.articles = { sources: gW, topics: vW, passages: bW, sortOptions: xW, feedSortOptions: wW, cleanTitle: jW, summary: SW };
  window.IELTSX.summarizeResults = summarizeResults;
  window.IELTSX.locale = { enUS: enUSLocale };


  /* ======
   * 1b) THEME (light / dark / system), PROGRESS, QUESTION-TYPE HELPERS and
   *     the reusable FILTER BAR (single list + checkbox panel)
   * ====== */

  // ---- THEME: light | dark | system  (localStorage key "theme", as before) ----
  var IELTSXTheme = (function () {
    var KEY = 'theme', MODES = ['light', 'dark', 'system'];
    var htmlEl = document.documentElement;
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function getMode() {
      var v = null;
      try { v = localStorage.getItem(KEY); } catch (e) {}
      return MODES.indexOf(v) > -1 ? v : 'system';
    }
    function resolve(mode) {
      return mode === 'system' ? (mq && mq.matches ? 'dark' : 'light') : mode;
    }
    function syncSwitch(mode) {
      document.querySelectorAll('.theme-switch [data-theme-mode]').forEach(function (b) {
        var on = b.getAttribute('data-theme-mode') === mode;
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
    }
    function apply(mode, notify) {
      var dark = resolve(mode) === 'dark';
      var changed = htmlEl.classList.contains('dark-mode') !== dark;
      htmlEl.classList.toggle('dark-mode', dark);
      syncSwitch(mode);
      if (notify && changed) {
        document.dispatchEvent(new CustomEvent('ieltsx:themechange', {
          detail: { mode: mode, theme: dark ? 'dark' : 'light' }
        }));
      }
    }
    function setMode(mode) {
      if (MODES.indexOf(mode) === -1) mode = 'system';
      try { localStorage.setItem(KEY, mode); } catch (e) {}
      apply(mode, true);
    }
    function mount() {
      document.querySelectorAll('.theme-switch').forEach(function (sw) {
        sw.addEventListener('click', function (e) {
          var b = e.target.closest('[data-theme-mode]');
          if (b) setMode(b.getAttribute('data-theme-mode'));
        });
        sw.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          var btns = Array.prototype.slice.call(sw.querySelectorAll('[data-theme-mode]'));
          var i = btns.indexOf(document.activeElement);
          if (i === -1) return;
          e.preventDefault();
          var next = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
          next.focus();
          setMode(next.getAttribute('data-theme-mode'));
        });
      });
      syncSwitch(getMode());
    }

    if (mq) {
      var onSystemChange = function () { if (getMode() === 'system') apply('system', true); };
      if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
      else if (mq.addListener) mq.addListener(onSystemChange);
    }
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) apply(getMode(), true);
    });

    apply(getMode(), false);
    mount();
    return { getMode: getMode, setMode: setMode, resolved: function () { return resolve(getMode()); } };
  })();

  // ---- PROGRESS: which tests the user has completed (localStorage "ieltsx_completed") ----
  var IELTSXProgress = (function () {
    var KEY = 'ieltsx_completed';
    function read() {
      try {
        var a = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(a) ? a : [];
      } catch (e) { return []; }
    }
    function write(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
    return {
      all: read,
      isCompleted: function (key) { return read().indexOf(String(key)) > -1; },
      markCompleted: function (key) {
        var a = read(); key = String(key);
        if (a.indexOf(key) === -1) { a.push(key); write(a); }
      },
      unmark: function (key) {
        write(read().filter(function (k) { return k !== String(key); }));
      }
    };
  })();

  function completionKey(key) {
    return IELTSXProgress.isCompleted(key) ? 'completed' : 'not-completed';
  }
  function isFreeItem(item) {
    var s = String(item.status || item.badge || '').trim().toLowerCase();
    return item.free === true || s === 'free' || /^free\b/i.test(String(item.title || ''));
  }

  // ---- QUESTION TYPES: raw card text -> canonical filter values ----
  var MATCHING_ALL = ['matching-headings', 'matching-information', 'matching-names', 'matching-features', 'matching-sentence-endings', 'flow-chart-matching'];
  function canonicalQuestionTypes(raw, kind) {
    var k = String(raw || '').toLowerCase().replace(/[^a-z]/g, '');
    if (!k) return [];
    if (/truefalse|tfng/.test(k)) return ['tfng'];
    if (/yesno|ynng/.test(k)) return ['ynng'];
    if (k.indexOf('matchingheading') > -1) return ['matching-headings'];
    if (k.indexOf('matchinginformation') > -1) return ['matching-information'];
    if (k.indexOf('matchingname') > -1) return ['matching-names'];
    if (k.indexOf('matchingfeature') > -1) return ['matching-features'];
    if (k.indexOf('sentenceending') > -1) return ['matching-sentence-endings'];
    if (k.indexOf('flowchart') > -1) return k.indexOf('completion') > -1 ? ['completion'] : ['flow-chart-matching'];
    if (k.indexOf('diagram') > -1 || /^(map|plan)/.test(k)) {
      if (kind === 'listening') return ['map-plan-diagram'];
      return k.indexOf('label') > -1 ? ['diagram-labeling'] : (k.indexOf('diagram') > -1 ? ['completion'] : []);
    }
    if (k.indexOf('summary') > -1) return k.indexOf('option') > -1 ? ['summary-options'] : ['completion'];
    if (k.indexOf('multiplechoice') > -1) return /many|multipleanswer|twoormore/.test(k) ? ['mc-many'] : ['mc'];
    if (k === 'matching') {
      return kind === 'listening'
        ? ['matching-names', 'matching-features', 'matching-sentence-endings']
        : MATCHING_ALL.slice();
    }
    if (/completion|gapfill|shortanswer|note|form|table|sentence/.test(k)) return ['completion'];
    return [];
  }

  var WRITING_TYPE_KEYS = {
    linegraph: 'line-graph', barchart: 'bar-chart', piechart: 'pie-chart', mixedcharts: 'mixed-charts', table: 'table',
    process: 'process-diagram', diagram: 'process-diagram', processdiagram: 'process-diagram', map: 'map',
    opinion: 'opinion', discussion: 'discussion', discussbothviews: 'discuss-both-views',
    advantagesdisadvantages: 'advantages-disadvantages', problemsolution: 'problem-solution',
    agreedisagree: 'agree-disagree', positivenegative: 'positive-negative',
    twopart: 'two-part', twopartquestion: 'two-part'
  };
  function canonicalWritingTypes(raw) {
    var k = String(raw || '').toLowerCase().replace(/[^a-z]/g, '');
    return WRITING_TYPE_KEYS[k] ? [WRITING_TYPE_KEYS[k]] : [];
  }

  // ---- FILTER SPECS (labels/groups exactly as in the design) ----
  function opt(value, label) { return { value: value, label: label || value }; }
  var PLAN_OPTIONS = [opt('demo', 'Demo (Free)'), opt('standard', 'Standard'), opt('max', 'Max'), opt('ultra', 'Ultra')];
  var STATUS_OPTIONS = [opt('not-completed', 'Not Completed'), opt('completed', 'Completed')];
  var READING_TYPE_GROUPS = [
    { label: 'Completion', options: [opt('completion', 'Completion / Gap Fill'), opt('summary-options', 'Summary with Options'), opt('diagram-labeling', 'Diagram Labeling')] },
    { label: 'Multiple Choice', options: [opt('mc', 'Multiple Choice'), opt('mc-many', 'Multiple Choice (Many)'), opt('tfng', 'True / False / Not Given'), opt('ynng', 'Yes / No / Not Given')] },
    { label: 'Matching', options: [opt('matching-headings', 'Matching Headings'), opt('matching-information', 'Matching Information'), opt('matching-names', 'Matching Names'), opt('matching-features', 'Matching Features'), opt('matching-sentence-endings', 'Matching Sentence Endings'), opt('flow-chart-matching', 'Flow Chart Matching')] }
  ];
  var LISTENING_TYPE_GROUPS = [
    { label: 'Completion', options: [opt('completion', 'Completion / Gap Fill'), opt('map-plan-diagram', 'Map / Plan / Diagram')] },
    { label: 'Multiple Choice', options: [opt('mc', 'Multiple Choice'), opt('mc-many', 'Multiple Choice (Many)')] },
    { label: 'Matching', options: [opt('matching-names', 'Matching Names'), opt('matching-features', 'Matching Features'), opt('matching-sentence-endings', 'Matching Sentence Endings'), opt('flow-chart-matching', 'Flow Chart Matching')] }
  ];
  var WRITING_TYPE_GROUPS = [
    { label: 'Task 1', options: [opt('line-graph', 'Line Graph'), opt('bar-chart', 'Bar Chart'), opt('pie-chart', 'Pie Chart'), opt('mixed-charts', 'Mixed Charts'), opt('table', 'Table'), opt('process-diagram', 'Process / Diagram'), opt('map', 'Map')] },
    { label: 'Task 2', options: [opt('opinion', 'Opinion'), opt('discussion', 'Discussion'), opt('discuss-both-views', 'Discuss Both Views'), opt('advantages-disadvantages', 'Advantages / Disadvantages'), opt('problem-solution', 'Problem / Solution'), opt('agree-disagree', 'Agree / Disagree'), opt('positive-negative', 'Positive / Negative'), opt('two-part', 'Two-Part Question')] }
  ];
  function numbered(prefix, n) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push(opt(prefix + ' ' + i));
    return out;
  }
  function filterSpecs(page, packValues) {
    var packs = (packValues || []).map(function (v) { return opt(v); });
    var common = {
      status: { mode: 'single', defaultLabel: 'All Status', options: STATUS_OPTIONS },
      plan: { mode: 'single', defaultLabel: 'All Plans', options: PLAN_OPTIONS },
      pack: { mode: 'single', defaultLabel: 'All Packs', options: packs }
    };
    var lead = {};
    if (page === 'reading') {
      lead.passage = { mode: 'multi', defaultLabel: 'All Passages', options: numbered('Passage', 3) };
      lead.status = common.status;
      lead.type = { mode: 'multi', defaultLabel: 'All Types', title: 'Question Types', groups: READING_TYPE_GROUPS };
    } else if (page === 'listening') {
      lead.section = { mode: 'multi', defaultLabel: 'All Sections', options: numbered('Section', 4) };
      lead.status = common.status;
      lead.type = { mode: 'multi', defaultLabel: 'All Types', title: 'Question Types', groups: LISTENING_TYPE_GROUPS };
    } else if (page === 'speaking') {
      lead.part = { mode: 'multi', defaultLabel: 'All Parts', options: numbered('Part', 3) };
      lead.status = common.status;
    } else if (page === 'writing') {
      lead.task = { mode: 'multi', defaultLabel: 'All Tasks', options: numbered('Task', 2) };
      lead.status = common.status;
      lead.type = { mode: 'multi', defaultLabel: 'All Types', title: 'Question Types', groups: WRITING_TYPE_GROUPS };
    }
    lead.plan = common.plan;
    lead.pack = common.pack;
    return lead;
  }

  // ---- FILTER BAR: custom dropdowns (single list) + checkbox panels (multi) ----
  var CHEVRON_CHECK = '\u2713';
  function createFilterBar(opts) {
    var specs = opts.specs, keys = Object.keys(specs), state = {};
    var badgeBox = opts.badges === undefined ? document.getElementById('filter-badges') : opts.badges;

    function nrm(v) { return String(v == null ? '' : v).trim().toLowerCase(); }
    function esc(v) {
      return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function isMulti(k) { return specs[k].mode === 'multi'; }
    function allOptions(k) {
      var out = [];
      if (specs[k].groups) specs[k].groups.forEach(function (g) { g.options.forEach(function (o) { out.push(o); }); });
      else (specs[k].options || []).forEach(function (o) { out.push(o); });
      return out;
    }
    function labelOf(k, val) {
      var o = allOptions(k).filter(function (x) { return nrm(x.value) === nrm(val); })[0];
      return o ? o.label : val;
    }
    keys.forEach(function (k) { state[k] = isMulti(k) ? [] : null; });

    function isActive(k) { return isMulti(k) ? state[k].length > 0 : state[k] !== null; }
    function get(k) { return isMulti(k) ? state[k].slice() : state[k]; }
    function matches(k, candidates) {
      if (!specs[k] || !isActive(k)) return true;
      var c = (Array.isArray(candidates) ? candidates : [candidates]).map(nrm);
      if (isMulti(k)) return state[k].some(function (v) { return c.indexOf(nrm(v)) > -1; });
      return c.indexOf(nrm(state[k])) > -1;
    }

    var domCache = { t: {}, d: {} };
    function triggerOf(k) {
      return domCache.t[k] || (domCache.t[k] = document.querySelector('.filter-trigger[data-filter="' + k + '"]'));
    }
    function dropdownOf(k) {
      return domCache.d[k] || (domCache.d[k] = document.querySelector('.filter-dropdown[data-filter="' + k + '"]'));
    }
    function closeAll(exceptKey) {
      keys.forEach(function (k) {
        if (k === exceptKey) return;
        var d = dropdownOf(k), t = triggerOf(k);
        if (d) d.classList.remove('open');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }

    function triggerText(k) {
      var spec = specs[k];
      if (!isActive(k)) return spec.defaultLabel;
      if (isMulti(k)) return state[k].length === 1 ? labelOf(k, state[k][0]) : state[k].length + ' selected';
      return labelOf(k, state[k]);
    }
    function syncUI(k) {
      var t = triggerOf(k), d = dropdownOf(k);
      if (t) {
        var span = t.querySelector('.trigger-label');
        if (span) span.textContent = triggerText(k);
        t.classList.toggle('has-value', isActive(k));
      }
      if (!d) return;
      if (isMulti(k)) {
        d.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          cb.checked = state[k].some(function (v) { return nrm(v) === nrm(cb.value); });
        });
      } else {
        d.querySelectorAll('.filter-option').forEach(function (el) {
          var v = el.getAttribute('data-value');
          el.classList.toggle('active', v === '__all__' ? state[k] === null : nrm(v) === nrm(state[k]));
          el.setAttribute('aria-selected', el.classList.contains('active') ? 'true' : 'false');
        });
      }
    }

    function changed(k) {
      syncUI(k);
      renderBadges();
      if (opts.onChange) opts.onChange(k, get(k));
    }
    function set(k, val) {
      if (!specs[k]) return;
      if (isMulti(k)) state[k] = Array.isArray(val) ? val.slice() : (val == null ? [] : [val]);
      else state[k] = (val == null || val === '__all__') ? null : val;
      changed(k);
    }
    function reset(k) { set(k, isMulti(k) ? [] : null); }
    function resetAll() {
      keys.forEach(function (k) { state[k] = isMulti(k) ? [] : null; syncUI(k); });
      renderBadges();
      if (opts.onChange) opts.onChange(null, null);
    }

    function badgeName(k) { return specs[k].badgeLabel || (k.charAt(0).toUpperCase() + k.slice(1)); }
    function renderBadges() {
      if (!badgeBox) return;
      var items = [];
      keys.forEach(function (k) {
        if (!isActive(k)) return;
        if (isMulti(k)) state[k].forEach(function (v) { items.push({ k: k, v: v, text: badgeName(k) + ': ' + labelOf(k, v) }); });
        else items.push({ k: k, v: state[k], text: badgeName(k) + ': ' + labelOf(k, state[k]) });
      });
      var q = opts.getSearch ? opts.getSearch() : '';
      if (q) items.push({ k: 'search', v: q, text: '\uD83D\uDD0D "' + q + '"' });
      if (!items.length) { badgeBox.innerHTML = ''; return; }
      badgeBox.innerHTML = items.map(function (it, i) {
        return '<span class="filter-badge-clear" data-badge="' + i + '">' + esc(it.text) +
          ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>';
      }).join('');
      badgeBox.querySelectorAll('[data-badge]').forEach(function (el) {
        el.addEventListener('click', function () {
          var it = items[+el.getAttribute('data-badge')];
          if (it.k === 'search') {
            if (opts.clearSearch) opts.clearSearch();
            renderBadges();
            if (opts.onChange) opts.onChange('search', '');
          } else if (isMulti(it.k)) {
            set(it.k, state[it.k].filter(function (v) { return nrm(v) !== nrm(it.v); }));
          } else {
            reset(it.k);
          }
        });
      });
    }

    function buildDropdown(k) {
      var spec = specs[k], d = dropdownOf(k);
      if (!d) return;
      if (isMulti(k)) {
        var html = '';
        if (spec.title) html += '<div class="filter-panel-title">' + esc(spec.title) + '</div>';
        var box = function (o) {
          return '<label class="filter-check"><input type="checkbox" value="' + esc(o.value) + '"><span>' + esc(o.label) + '</span></label>';
        };
        if (spec.groups) {
          spec.groups.forEach(function (g) {
            html += '<div class="filter-group-title">' + esc(g.label) + '</div><div class="filter-checks">' + g.options.map(box).join('') + '</div>';
          });
          d.classList.add('filter-panel');
        } else {
          html += '<div class="filter-checks one-col">' + spec.options.map(box).join('') + '</div>';
          d.classList.add('filter-panel', 'compact');
        }
        d.innerHTML = html;
        d.addEventListener('change', function (e) {
          var cb = e.target;
          if (!cb || cb.type !== 'checkbox') return;
          var v = cb.value;
          var cur = state[k].filter(function (x) { return nrm(x) !== nrm(v); });
          if (cb.checked) cur.push(v);
          // keep the option order of the design
          var order = allOptions(k).map(function (o) { return nrm(o.value); });
          cur.sort(function (a, b) { return order.indexOf(nrm(a)) - order.indexOf(nrm(b)); });
          state[k] = cur;
          changed(k);
        });
      } else {
        var h = '<div class="filter-option active" role="option" data-value="__all__"><span>' + esc(spec.defaultLabel) + '</span><span class="check">' + CHEVRON_CHECK + '</span></div>';
        spec.options.forEach(function (o) {
          h += '<div class="filter-option" role="option" data-value="' + esc(o.value) + '"><span>' + esc(o.label) + '</span><span class="check">' + CHEVRON_CHECK + '</span></div>';
        });
        d.innerHTML = h;
        d.setAttribute('role', 'listbox');
        d.addEventListener('click', function (e) {
          var el = e.target.closest('.filter-option');
          if (!el) return;
          state[k] = el.getAttribute('data-value') === '__all__' ? null : el.getAttribute('data-value');
          d.classList.remove('open');
          var t = triggerOf(k); if (t) t.setAttribute('aria-expanded', 'false');
          changed(k);
        });
      }
      d.addEventListener('click', function (e) { e.stopPropagation(); });
    }

    keys.forEach(function (k) {
      var t = triggerOf(k), d = dropdownOf(k);
      if (!t || !d) return;
      buildDropdown(k);
      t.setAttribute('aria-expanded', 'false');
      t.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = d.classList.contains('open');
        closeAll();
        if (wasOpen) return;
        d.classList.remove('align-right');
        d.classList.add('open');
        t.setAttribute('aria-expanded', 'true');
        var r = d.getBoundingClientRect();
        if (r.right > window.innerWidth - 8) d.classList.add('align-right');
      });
      syncUI(k);
    });
    document.addEventListener('click', function () { closeAll(); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('.filter-dropdown.open');
      closeAll();
      if (open) {
        var t = open.parentNode && open.parentNode.querySelector('.filter-trigger');
        if (t) t.focus();
      }
    });
    renderBadges();

    return { get: get, set: set, reset: reset, resetAll: resetAll, matches: matches, isActive: isActive, renderBadges: renderBadges, close: closeAll };
  }


  // ---- PERFORMANCE HELPERS ----
  function debounce(fn, wait) {
    var timer = null;
    var debounced = function () {
      var args = arguments, ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
    debounced.cancel = function () { clearTimeout(timer); };
    return debounced;
  }

  // Countdown based on a fixed end time (no drift in background tabs),
  // writes only when a digit changes and sleeps while the tab is hidden.
  function startCountdown(totalSeconds, ids) {
    var els = ids.map(function (id) { return document.getElementById(id); });
    if (!els[0]) return null;
    var endAt = Date.now() + totalSeconds * 1000, timer = null;
    function pad(n) { return String(n).padStart(2, '0'); }
    function remaining() { return Math.max(0, Math.round((endAt - Date.now()) / 1000)); }
    function tick() {
      var r = remaining();
      var parts = [Math.floor(r / 86400), Math.floor((r % 86400) / 3600), Math.floor((r % 3600) / 60), r % 60];
      for (var i = 0; i < els.length; i++) {
        var text = pad(parts[i]);
        if (els[i] && els[i].textContent !== text) els[i].textContent = text;
      }
      if (r === 0) stop();
    }
    function start() { if (!timer && remaining() > 0) timer = setInterval(tick, 1000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else { tick(); start(); }
    });
    tick();
    start();
    return { stop: stop };
  }


  // "Completed" pill on the cards of tests the account has finished (list comes from /api/progress)
  function markCompleted() {
    var done = [];
    try { done = JSON.parse(localStorage.getItem('ieltsx_completed') || '[]'); } catch (e) { done = []; }
    var set = {};
    for (var i = 0; i < done.length; i++) set[done[i]] = true;
    document.querySelectorAll('#card-grid a[href]').forEach(function (link) {
      var card = link.closest('.rounded-xl');
      if (!card) return;
      var pill = card.querySelector('.ix-done');
      var isDone = !!set[link.getAttribute('href')];
      if (isDone && !pill) {
        var host = card.querySelector('.absolute.top-3.left-3') || card;
        var el = document.createElement('span');
        el.className = 'ix-done';
        el.textContent = '\u2713 Completed';
        el.style.cssText = 'display:inline-block;margin-left:6px;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe';
        host.appendChild(el);
      } else if (!isDone && pill) { pill.remove(); }
    });
  }
  document.addEventListener('ieltsx:progress', markCompleted);

  window.IELTSX.theme = IELTSXTheme;
  window.IELTSX.progress = IELTSXProgress;
  window.IELTSX.canonicalQuestionTypes = canonicalQuestionTypes;
  window.IELTSX.canonicalWritingTypes = canonicalWritingTypes;
  window.IELTSX.filterSpecs = filterSpecs;
  window.IELTSX.createFilterBar = createFilterBar;
  window.IELTSX.markCompleted = markCompleted;
  window.IELTSX.debounce = debounce;
  window.IELTSX.startCountdown = startCountdown;
  window.IELTSX.completionKey = completionKey;
  window.IELTSX.isFreeItem = isFreeItem;
  // "Get Access" on a locked card sends the visitor to the Price page (same as the Full Tests cards)
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-get-access]');
    if (!b || b.tagName === 'A') return;
    e.preventDefault();
    location.href = '/Price?premium=required&next=' + encodeURIComponent(location.pathname + location.search);
  });
  /* ======
   * 2) PAGE MODULES — original page scripts, copied verbatim
   * ====== */
  var pages = {};

  pages['index'] = function () {
      // ---- index.js ----
        (function () {
            // Sidebar toggle (the sidebar markup lives in index.html, like on the other pages)
            const sidebarContainer = document.getElementById('main-sidebar-root');
            const toggleButtons = document.querySelectorAll('[data-sidebar="trigger"], [data-sidebar="rail"]');
            if (!sidebarContainer) return;

            function toggleSidebar(e) {
                if (e) e.preventDefault();
                const isCollapsed = sidebarContainer.getAttribute('data-collapsible') === 'icon';

                sidebarContainer.setAttribute('data-collapsible', isCollapsed ? '' : 'icon');
                sidebarContainer.setAttribute('data-state', isCollapsed ? 'expanded' : 'collapsed');

                const wrapper = document.querySelector('.group\\/sidebar-wrapper');
                if (wrapper) {
                    wrapper.style.setProperty('--sidebar-width', isCollapsed ? '16rem' : '3rem');
                }
            }

            toggleButtons.forEach(function (btn) {
                btn.addEventListener('click', toggleSidebar);
            });
        })();

      // ---- index-2.js ----
        (function () {
            // Avatar dropdown
            const trigger = document.getElementById('avatar-dropdown-trigger');
            const dropdown = document.getElementById('user-dropdown');
            let isOpen = false;

            function closeDropdown() {
                if (dropdown) dropdown.classList.add('hidden');
                isOpen = false;
            }

            function openDropdown() {
                if (dropdown) dropdown.classList.remove('hidden');
                isOpen = true;
            }

            if (trigger && dropdown) {
                trigger.addEventListener('click', function (e) {
                    e.stopPropagation();
                    isOpen ? closeDropdown() : openDropdown();
                });

                document.addEventListener('click', function (e) {
                    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                        closeDropdown();
                    }
                });

                document.getElementById('dropdown-account')?.addEventListener('click', closeDropdown);

                document.getElementById('dropdown-logout')?.addEventListener('click', function () {
                    if (window.IELTSXAuth && window.IELTSXAuth.logout) { window.IELTSXAuth.logout(); return; }
                    closeDropdown();
                });
            }
        })();
    
      // ---- index-3.js ----
(function(){var e=localStorage.getItem('ieltsx_logged_in_email')||localStorage.getItem('userEmail');var el=document.getElementById('ieltsx-account-status');if(e&&el){el.textContent=e;el.style.display='block'}})();
  };

  pages['listening'] = function () {
      // ---- listening.js ----
    (function() {
        'use strict';

        // ---------- DISABLE CONTEXT MENU ----------
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // ---------- THEME: handled by IELTSX.theme (light / dark / system) ----------

        // ---------- EXTRACT CARD DATA FROM DOM ----------
        let cardDataCache = null;
        function extractCardData() {
            return cardDataCache || (cardDataCache = extractCardDataFromDOM());
        }

        function extractCardDataFromDOM() {
            const cards = document.querySelectorAll('#card-grid .h-full');
            const data = [];
            cards.forEach(el => {
                const card = el.querySelector('.rounded-xl');
                if (!card) return;

                // Title
                const titleEl = card.querySelector('h3');
                const title = titleEl ? titleEl.textContent.trim() : '';

                // Status (free badge)
                const statusEl = card.querySelector('.absolute.top-3.left-3 .inline-flex');
                let status = 'Free';
                if (statusEl) {
                    const txt = statusEl.textContent.trim();
                    if (txt) status = txt;
                }

                // Section
                const sectionEl = card.querySelector('.absolute.top-3.right-3 .inline-flex');
                let section = 'Section';
                if (sectionEl) {
                    const txt = sectionEl.textContent.trim();
                    if (txt) section = txt;
                }

                // Types
                const typeEls = card.querySelectorAll('.flex.flex-wrap.gap-1 .inline-flex');
                const types = [];
                typeEls.forEach(el => {
                    const t = el.textContent.trim();
                    if (t && !t.includes('more')) types.push(t);
                });

                // Plan & Pack from description
                const descEl = card.querySelector('.text-xs.text-muted-foreground .truncate');
                let plan = 'Starter Pack';
                let pack = 'Starter Pack';
                if (descEl) {
                    const desc = descEl.textContent.trim();
                    if (desc.includes('Free Practice')) {
                        plan = 'Starter Pack';
                        pack = 'Starter Pack';
                    } else if (desc.includes('Free Sample')) {
                        plan = 'Starter Pack';
                        pack = 'Starter Pack';
                    } else {
                        plan = 'Starter Pack';
                        pack = 'Starter Pack';
                    }
                }

                // Link
                const link = card.querySelector('a[href]');
                const href = link ? link.getAttribute('href') : '#';

                data.push({
                    id: data.length + 1,
                    title: title,
                    status: status,
                    types: types,
                    plan: plan,
                    pack: el.getAttribute('data-pack') || pack,
                    section: section,
                    href: href,
                    key: href,
                    freeCard: /^free$/i.test(status),
                    typeKeys: types.reduce(function(a, t) { return a.concat(IELTSX.canonicalQuestionTypes(t, 'listening')); }, []),
                    desc: descEl ? descEl.textContent.trim() : 'Free Practice',
                    badge: status,
                    element: el // reference to the card element
                });
            });
            return data;
        }

        // ---------- STATE ----------
        const filterKeys = ['section', 'status', 'type', 'plan', 'pack'];
        let filterBar = null;
        let searchQuery = '';
        let currentPage = 1;
        const perPage = 6;

        // ---------- DOM REFS ----------
        const grid = document.getElementById('card-grid');
        const countEl = document.getElementById('result-count');
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const filterBadges = document.getElementById('filter-badges');

        // ---------- HELPERS ----------
        function norm(str) { return (str || '').toLowerCase().trim(); }

        // ---------- FILTER LOGIC ----------
        function getFilteredCards(cardData) {
            return cardData.filter(card => {
                if (searchQuery) {
                    const q = norm(searchQuery);
                    const match = norm(card.title).includes(q) ||
                        norm(card.desc || '').includes(q) ||
                        (card.types || []).some(t => norm(t).includes(q)) ||
                        norm(card.section || '').includes(q);
                    if (!match) return false;
                }
                if (!filterBar) return true;
                return filterBar.matches('section', [card.section]) &&
                    filterBar.matches('status', [IELTSX.completionKey(card.key)]) &&
                    filterBar.matches('type', card.typeKeys) &&
                    filterBar.matches('plan', [IELTSX.cardPlanKey ? IELTSX.cardPlanKey(card, card.freeCard) : (card.freeCard ? 'demo' : 'max')]) &&
                    filterBar.matches('pack', [card.pack]);
            });
        }

        // ---------- RENDER ----------
        function render(cardData) {
            const filtered = getFilteredCards(cardData);
            const total = filtered.length;
            const totalPages = Math.max(1, Math.ceil(total / perPage));
            if (currentPage > totalPages) currentPage = totalPages;
            const start = (currentPage - 1) * perPage;
            const pageItems = filtered.slice(start, start + perPage);

            countEl.textContent = `Showing ${total} of ${cardData.length} tests`;

            // Hide all cards
            cardData.forEach(c => {
                if (c.element) c.element.classList.add('card-hidden');
            });

            // Show only page items
            pageItems.forEach(item => {
                if (item.element) item.element.classList.remove('card-hidden');
            });

            // If no items, show empty message
            if (total === 0) {
                let emptyMsg = grid.querySelector('.empty-message');
                if (!emptyMsg) {
                    emptyMsg = document.createElement('div');
                    emptyMsg.className = 'col-span-full text-center py-12 text-muted-foreground empty-message';
                    emptyMsg.textContent = 'No sections match your filters.';
                    grid.appendChild(emptyMsg);
                }
            } else {
                const emptyMsg = grid.querySelector('.empty-message');
                if (emptyMsg) emptyMsg.remove();
            }

            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
            updateBadges();
        }

        // ---------- BADGES ----------
        function updateBadges() {
            if (filterBar) filterBar.renderBadges();
            IELTSX.markCompleted();
        }

        // ---------- DROPDOWNS ----------
        function buildDropdowns(cardData) {
            const packs = Array.from(new Set(cardData.map(c => c.pack).filter(Boolean))).sort();
            filterBar = IELTSX.createFilterBar({
                specs: IELTSX.filterSpecs('listening', packs),
                getSearch: () => searchQuery,
                clearSearch: () => { searchInput.value = ''; searchQuery = ''; },
                onChange: function () {
                    currentPage = 1;
                    render(extractCardData());
                }
            });
        }

        // ---------- SEARCH ----------
        function handleSearch(cardData) {
            const val = searchInput.value.trim();
            searchQuery = val;
            currentPage = 1;
            render(cardData);
        }

        // ---------- PAGINATION ----------
        function goToPage(p, cardData) {
            const filtered = getFilteredCards(cardData);
            const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
            if (p < 1) p = 1;
            if (p > totalPages) p = totalPages;
            currentPage = p;
            render(cardData);
        }

        // ---------- SIDEBAR / AVATAR ----------
        function initSidebarAndAvatar() {
            const sidebarContainer = document.getElementById('main-sidebar-root');
            const toggleBtns = document.querySelectorAll('[data-sidebar="trigger"], [data-sidebar="rail"]');

            function updateSidebarState() {
                if (!sidebarContainer) return;
                const isCollapsed = sidebarContainer.getAttribute('data-collapsible') === 'icon';
                if (isCollapsed) {
                    sidebarContainer.setAttribute('data-collapsible', '');
                    sidebarContainer.setAttribute('data-state', 'expanded');
                } else {
                    sidebarContainer.setAttribute('data-collapsible', 'icon');
                    sidebarContainer.setAttribute('data-state', 'collapsed');
                }
            }
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateSidebarState();
                });
            });

            const avatarTrigger = document.getElementById('avatar-dropdown-trigger');
            const userDropdown = document.getElementById('user-dropdown');
            let isOpen = false;

            function closeDropdown() { userDropdown?.classList.add('hidden');
                isOpen = false; }

            function openDropdown() { userDropdown?.classList.remove('hidden');
                isOpen = true; }
            if (avatarTrigger && userDropdown) {
                avatarTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isOpen ? closeDropdown() : openDropdown();
                });
                document.addEventListener('click', (e) => {
                    if (!avatarTrigger.contains(e.target) && !userDropdown.contains(e.target)) closeDropdown();
                });
                document.getElementById('dropdown-account')?.addEventListener('click', closeDropdown);
                document.getElementById('dropdown-logout')?.addEventListener('click', () => {
                    if (window.IELTSXAuth && window.IELTSXAuth.logout) { window.IELTSXAuth.logout(); return; }
                    closeDropdown();
                });
            }
        }

        // ---------- INIT ----------
        function init() {
            // Extract card data from DOM
            let cardData = extractCardData();

            // Build dropdowns
            buildDropdowns(cardData);

            // Initial render
            render(cardData);

            // Search events
            searchBtn.addEventListener('click', function() {
                handleSearch(cardData);
            });
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') handleSearch(cardData);
            });

            // Pagination
            prevBtn.addEventListener('click', function() {
                goToPage(currentPage - 1, cardData);
            });
            nextBtn.addEventListener('click', function() {
                goToPage(currentPage + 1, cardData);
            });

            initSidebarAndAvatar();
        }

        /* Listening sections made in the admin panel become cards at the START of this same grid (newest first):
           same card, same filters, same pagination. Card-access.js reads window.IELTSX_ADMIN_CARDS for the lock. */
        function addAdminCards() {
            if (!window.fetch) return Promise.resolve();
            var ctl = window.AbortController ? new AbortController() : null;
            var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);
            var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
            return fetch('/api/materials?type=listening&mode=part', { credentials: 'same-origin', signal: ctl ? ctl.signal : undefined })
                .then(function (r) { return r.ok ? r.json() : { items: [] }; })
                .catch(function () { return { items: [] }; })
                .then(function (d) {
                    clearTimeout(timer);
                    var items = d.items || [];
                    window.IELTSX_ADMIN_CARDS = items.map(function (m) { return { href: m.href || ('/test?id=' + encodeURIComponent(m.id)), title: m.title, locked: !!m.locked, premium: !!m.premium, plan: m.plan || 'standard' }; });
                    var grid = document.getElementById('card-grid'); if (!grid || !items.length) return;
                    grid.insertAdjacentHTML('afterbegin', items.map(function (m) {
                        var href = m.href || ('/test?id=' + encodeURIComponent(m.id));
                        var media = m.coverUrl
                            ? '<img loading="lazy" decoding="async" src="' + esc(m.coverUrl) + '" alt="' + esc(m.title) + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /><div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>'
                            : '<div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/80 via-teal-500/70 to-green-600/80 dark:from-emerald-600/60 dark:via-teal-600/50 dark:to-green-700/60"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones w-8 h-8 text-white/90"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg><span class="mt-2 text-white/90 font-medium text-sm text-center px-4 line-clamp-2">' + esc(m.pack || 'Listening') + '</span></div>';
                        var chips = (m.types || []).slice(0, 3).map(function (t) { return '<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold border-transparent bg-secondary text-secondary-foreground text-xs">' + esc(t) + '</div>'; }).join('');
                        return '<div class="h-full" data-pack="' + esc(m.pack || 'Starter Pack') + '" style="opacity: 1; transform: none;"><div class="rounded-xl bg-card text-card-foreground shadow group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border h-full flex flex-col">' +
                            '<div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">' + media +
                            '<div class="absolute top-3 left-3 z-10"><span class="inline-flex items-center justify-center rounded-md font-medium border px-2.5 py-0.5 text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400">' + (m.premium ? 'Premium' : 'Free') + '</span></div>' +
                            '<div class="absolute top-3 right-3 z-10"><div class="inline-flex items-center rounded-md border px-2.5 py-0.5 bg-black/60 dark:bg-black/80 backdrop-blur-sm text-white border-white/20 text-xs font-medium shadow-md">' + esc(m.sectionLabel || 'Section 1') + '</div></div></div>' +
                            '<div class="p-4 flex flex-col flex-1 gap-3"><div class="flex flex-col gap-3 flex-1"><h3 class="font-semibold text-base leading-6 break-words text-foreground group-hover:text-primary transition-colors" title="' + esc(m.title) + '">' + esc(m.title) + '</h3>' +
                            '<div class="text-xs text-muted-foreground"><span class="flex items-center gap-1"><span class="truncate">' + esc(m.description || ((m.premium ? 'Premium' : 'Free Practice') + (m.pack ? ' | ' + m.pack : ''))) + '</span></span></div>' +
                            '<div class="flex flex-wrap gap-1">' + chips + '</div></div>' +
                            '<div class="flex gap-2 pt-1"><a href="' + esc(href) + '" class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl font-semibold transition-all h-8 rounded-md px-3 text-xs w-full">' + (m.premium ? 'Start' : 'Start Free') + '</a></div></div></div></div>';
                    }).join(''));
                });
        }
        window.IELTSX_ADMIN_CARDS_READY = addAdminCards();
        function start() { window.IELTSX_ADMIN_CARDS_READY.then(init, init); }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }

    })();
  };

  pages['reading'] = function () {
      // ---- reading.js ----
    (function() {
        'use strict';

        // ---------- DISABLE CONTEXT MENU ----------
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // ---------- THEME: handled by IELTSX.theme (light / dark / system) ----------

        // ---------- CARD DATA (exactly as provided) ----------
        const cardData = [{
            id: 1,
            title: 'Free: The history of cakes at weddings',
            status: 'FREE',
            types: ['True False Not Given', 'Sentence Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-1.html',
            img: 'pessage13.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 2,
            title: 'Free: Improving Patient Safety',
            status: 'FREE',
            types: [' Matching Information', 'Multiple Choice'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 2',
            href: '/pessages/test-2.html',
            img: '/reading/images/test-2.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 3,
            title: 'Free: The Baobabs of Madagascar',
            status: 'FREE',
            types: ['Summary Completion', 'Matching Information'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 3',
            href: '/pessages/test-3.html',
            img: 'pessage6.jpg',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE Volume 9'
        }, {
            id: 4,
            title: 'Free: Insect-inspired robots',
            status: 'FREE',
            types: ['Matching Information', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 3',
            href: '/pessages/test-4.html',
            img: 'https://picsum.photos/id/39/400/300',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 5,
            title: 'Free: Sign, Baby, Sign!',
            status: 'FREE',
            types: ['Yes No Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 3',
            href: '/pessages/test-5.html',
            img: 'https://picsum.photos/id/39/400/300',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 6,
            title: 'Free: The Whale Goes to Court',
            status: 'FREE',
            types: ['Yes No Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-6.html',
            img: 'pessage14.jpg',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 7,
            title: "Free: Australia's Airborne Dentists",
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-7.html',
            img: 'pessage16.jpg',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 8,
            title: 'Free: The History of Ice Cream',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-8.html',
            img: 'pessage17.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 9,
            title: 'Free: Seaweed',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-9.html',
            img: 'pessage17.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 10,
            title: 'Free: Health in the Wild',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-10.html',
            img: 'pessage19.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 11,
            title: 'Free: Evolution of the Calculator',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-11.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 12,
            title: 'Free: The continuing saga of the Galápagos Finches',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-12.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 13,
            title: 'Free: Sleeping on the job',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-13.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 14,
            title: 'Free: The English canal system',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-14.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 15,
            title: 'Free: Thomas Cole: American Nature Painter',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-15.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 16,
            title: 'Free: The Dugong: Sea Cow',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-16.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 17,
            title: 'Free: The development of plastics',
            status: 'FREE',
            types: ['True False Not Given', 'Table Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-17.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 18,
            title: 'Free: The growth of agriculture',
            status: 'FREE',
            types: ['True False Not Given', 'Note Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-18.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 19,
            title: 'Free: Dark Chocolate\'s Health-giving Benefits',
            status: 'FREE',
            types: ['Matching Information', 'Matching Features'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 2',
            href: '/pessages/test-19.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 20,
            title: 'Free: Growing More for Less',
            status: 'FREE',
            types: ['Matching Information', 'Multiple Choice Many'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 2',
            href: '/pessages/test-20.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }, {
            id: 21,
            title: 'Free: In Deep Water',
            status: 'FREE',
            types: ['True False Not Given', 'Completion'],
            plan: 'Starter Pack',
            pack: 'Starter Pack',
            passage: 'Passage 1',
            href: '/pessages/test-21.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }];

        if (!window.IELTSX_SHOW_BUILTIN_CARDS) cardData.length = 0;   // only the cards made in the admin panel
        cardData.forEach(function (c) {
            c.key = c.href;
            c.freeCard = /^free$/i.test(String(c.status || c.badge || ''));
            c.typeKeys = (c.types || []).reduce(function (a, t) { return a.concat(IELTSX.canonicalQuestionTypes(t, 'reading')); }, []);
        });

        // ---------- STATE ----------
        const filterKeys = ['passage', 'status', 'type', 'plan', 'pack'];
        let filterBar = null;
        let searchQuery = '';
        let currentPage = 1;
        const perPage = 6;

        // ---------- DOM REFS ----------
        const grid = document.getElementById('card-grid');
        const countEl = document.getElementById('result-count');
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const filterBadges = document.getElementById('filter-badges');

        // ---------- HELPERS ----------
        function norm(str) { return (str || '').toLowerCase().trim(); }

        function getUniqueValues(key) {
            const values = new Set();
            cardData.forEach(c => {
                if (key === 'type') {
                    (c.types || []).forEach(t => values.add(t));
                } else if (key === 'passage') {
                    if (c.passage) values.add(c.passage);
                } else if (key === 'status') {
                    if (c.status) values.add(c.status);
                } else if (key === 'plan') {
                    if (c.plan) values.add(c.plan);
                } else if (key === 'pack') {
                    if (c.pack) values.add(c.pack);
                }
            });
            return Array.from(values).sort();
        }

        // ---------- FILTER LOGIC ----------
        function getFilteredCards() {
            return cardData.filter(card => {
                if (searchQuery) {
                    const q = norm(searchQuery);
                    const match = norm(card.title).includes(q) ||
                        norm(card.desc || '').includes(q) ||
                        (card.types || []).some(t => norm(t).includes(q));
                    if (!match) return false;
                }
                if (!filterBar) return true;
                return filterBar.matches('passage', [card.passage]) &&
                    filterBar.matches('status', [IELTSX.completionKey(card.key)]) &&
                    filterBar.matches('type', card.typeKeys) &&
                    filterBar.matches('plan', [IELTSX.cardPlanKey ? IELTSX.cardPlanKey(card, card.freeCard) : (card.freeCard ? 'demo' : 'max')]) &&
                    filterBar.matches('pack', [card.pack]);
            });
        }

        // ---------- RENDER ----------
        function render() {
            const filtered = getFilteredCards();
            const total = filtered.length;
            const totalPages = Math.max(1, Math.ceil(total / perPage));
            if (currentPage > totalPages) currentPage = totalPages;
            const start = (currentPage - 1) * perPage;
            const pageItems = filtered.slice(start, start + perPage);

            countEl.textContent = `Showing ${total} of ${cardData.length} tests`;

            if (total === 0) {
                grid.innerHTML =
                    `<div class="col-span-full text-center py-12 text-muted-foreground">No passages match your filters.</div>`;
                pageInfo.textContent = `Page 1 of 1`;
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                updateBadges();
                return;
            }

            grid.innerHTML = pageItems.map(card => {
                // Build type tags
                const typeArr = card.types || [];
                let tagsHtml = '';
                if (typeArr.length === 0) {
                    tagsHtml = `<div class="text-xs text-muted-foreground">No types</div>`;
                } else if (typeArr.length <= 2) {
                    tagsHtml = typeArr.map(t =>
                        `<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs">${t}</div>`
                    ).join('');
                } else {
                    const firstTwo = typeArr.slice(0, 2);
                    const extra = typeArr.length - 2;
                    tagsHtml = firstTwo.map(t =>
                        `<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs">${t}</div>`
                    ).join('') +
                    `<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors">+${extra} more</div>`;
                }

                return `
                        <div class="h-full">
                            <div class="rounded-xl bg-card text-card-foreground shadow group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border h-full flex flex-col">
                                <div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                                    <img loading="lazy" decoding="async" src="${card.img || 'https://picsum.photos/seed/'+card.id+'/400/300'}" alt="${card.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://picsum.photos/seed/${card.id}/400/300'">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    <div class="absolute top-3 left-3 z-10">
                                        <span class="inline-flex items-center justify-center rounded-md font-semibold border px-2.5 py-0.5 text-xs gap-1.5 bg-green-100 text-green-800 border-green-200 shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-3 h-3"><path d="M11.608 3.306a.5.5 0 0 1 .784 0l1.342 1.96a1 1 0 0 0 .772.354l2.333.092a.5.5 0 0 1 .454.69l-.842 2.196a1 1 0 0 0 .064.888l1.31 1.931a.5.5 0 0 1-.387.78l-2.342.002a1 1 0 0 0-.842.466l-1.214 1.995a.5.5 0 0 1-.86 0l-1.214-1.995a1 1 0 0 0-.842-.466l-2.342-.002a.5.5 0 0 1-.387-.78l1.31-1.93a1 1 0 0 0 .064-.89l-.842-2.195a.5.5 0 0 1 .454-.69l2.333-.092a1 1 0 0 0 .772-.354z"/><path d="M6 5h0"/><path d="M6 18h0"/></svg>
                                            <span>${card.badge || 'FREE'}</span>
                                        </span>
                                    </div>
                                    <div class="absolute top-3 right-3 z-10">
                                        <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-black/60 dark:bg-black/80 backdrop-blur-sm text-white border-white/20 dark:border-white/30 text-xs font-medium shadow-md">${card.passage || 'Passage'}</div>
                                    </div>
                                </div>
                                <div class="p-4 flex flex-col flex-1 gap-3">
                                    <div class="flex flex-col gap-3 flex-1">
                                        <h3 class="font-semibold text-base leading-6 break-words text-foreground group-hover:text-primary transition-colors" title="${card.title}">${card.title}</h3>
                                        <div class="text-xs text-muted-foreground">
                                            <span class="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-3.5 h-3.5 flex-shrink-0"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                                                <span class="truncate">${card.desc || 'Free Sample | Starter Pack'}</span>
                                            </span>
                                        </div>
                                        <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                                    </div>
                                    <div class="flex gap-2 pt-1">
                                        <a href="${String(card.href || '#').replace(/\.html(?=$|[?#])/i, '')}" class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-8 rounded-md px-3 text-xs font-semibold shadow-lg hover:shadow-xl transition-all w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play w-3.5 h-3.5 mr-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                            Start Free →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            }).join('');

            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
            updateBadges();
        }

        // ---------- BADGES ----------
        function updateBadges() {
            if (filterBar) filterBar.renderBadges();
            IELTSX.markCompleted();
        }

        // ---------- DROPDOWNS ----------
        function buildDropdowns() {
            filterBar = IELTSX.createFilterBar({
                specs: IELTSX.filterSpecs('reading', getUniqueValues('pack')),
                getSearch: () => searchQuery,
                clearSearch: () => { searchInput.value = ''; searchQuery = ''; },
                onChange: function () {
                    currentPage = 1;
                    render();
                }
            });
        }

        // ---------- SEARCH ----------
        function handleSearch() {
            const val = searchInput.value.trim();
            searchQuery = val;
            currentPage = 1;
            render();
        }

        // ---------- PAGINATION ----------
        function goToPage(p) {
            const filtered = getFilteredCards();
            const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
            if (p < 1) p = 1;
            if (p > totalPages) p = totalPages;
            currentPage = p;
            render();
        }

        // ---------- SIDEBAR / AVATAR (unchanged) ----------
        function initSidebarAndAvatar() {
            // Sidebar toggle
            const sidebarContainer = document.querySelector(
                '.group\\/sidebar-wrapper .group.peer.hidden.md\\:block');
            const toggleBtns = document.querySelectorAll('[data-sidebar="trigger"], [data-sidebar="rail"]');

            function updateSidebarState() {
                if (!sidebarContainer) return;
                const isCollapsed = sidebarContainer.getAttribute('data-collapsible') === 'icon';
                if (isCollapsed) {
                    sidebarContainer.setAttribute('data-collapsible', '');
                    sidebarContainer.setAttribute('data-state', 'expanded');
                } else {
                    sidebarContainer.setAttribute('data-collapsible', 'icon');
                    sidebarContainer.setAttribute('data-state', 'collapsed');
                }
            }
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateSidebarState();
                });
            });

            // Avatar dropdown
            const avatarTrigger = document.getElementById('avatar-dropdown-trigger');
            const userDropdown = document.getElementById('user-dropdown');
            let isOpen = false;

            function closeDropdown() { userDropdown?.classList.add('hidden');
                isOpen = false; }

            function openDropdown() { userDropdown?.classList.remove('hidden');
                isOpen = true; }
            if (avatarTrigger && userDropdown) {
                avatarTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isOpen ? closeDropdown() : openDropdown();
                });
                document.addEventListener('click', (e) => {
                    if (!avatarTrigger.contains(e.target) && !userDropdown.contains(e.target)) closeDropdown();
                });
                document.getElementById('dropdown-account')?.addEventListener('click', closeDropdown);
                document.getElementById('dropdown-logout')?.addEventListener('click', () => {
                    if (window.IELTSXAuth && window.IELTSXAuth.logout) { window.IELTSXAuth.logout(); return; }
                    closeDropdown();
                });
            }
        }

        // ---------- INIT ----------
        function init() {
            buildDropdowns();

            render();

            // Search events
            searchBtn.addEventListener('click', handleSearch);
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') handleSearch();
            });

            // Pagination
            prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
            nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

            initSidebarAndAvatar();
        }

        /* Part tests made in the admin panel (Reading - Part) become cards in this same grid:
           same card, same filters, same pagination. Card-access.js reads window.IELTSX_ADMIN_CARDS for the lock. */
        function addAdminCards() {
            if (!window.fetch) return Promise.resolve();
            var ctl = window.AbortController ? new AbortController() : null;
            var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);
            return fetch('/api/materials?type=reading&mode=part', { credentials: 'same-origin', signal: ctl ? ctl.signal : undefined })
                .then(function (r) { return r.ok ? r.json() : { items: [] }; })
                .catch(function () { return { items: [] }; })
                .then(function (d) {
                    clearTimeout(timer);
                    var items = (d.items || []).filter(function (m) { return m.mode !== 'full'; });
                    window.IELTSX_ADMIN_CARDS = items.map(function (m) { return { href: m.href || ('/test?id=' + encodeURIComponent(m.id)), title: m.title, locked: !!m.locked, premium: !!m.premium, plan: m.plan || 'standard' }; });
                    var made = [];
                    // text typed in the admin panel goes into the card HTML: escape it
                    var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
                    items.forEach(function (m, n) {
                        var c = {
                            id: 1000 + n, title: esc(m.title), status: m.premium ? 'PREMIUM' : 'FREE', types: (m.types || []).map(esc), plan: esc(m.pack || 'Starter Pack'), pack: esc(m.pack || 'Starter Pack'),
                            passage: esc(m.passageLabel || 'Passage 1'), href: esc(m.href || ('/test?id=' + encodeURIComponent(m.id))), img: esc(m.coverUrl || ''),
                            desc: esc(m.description || (m.premium ? 'Premium' : 'Free Sample') + ' | ' + (m.pack || 'Starter Pack')), badge: m.premium ? 'PREMIUM' : 'FREE', admin: true
                        };
                        c.key = c.href; c.freeCard = !m.premium;
                        c.typeKeys = (c.types || []).reduce(function (a, t) { return a.concat(IELTSX.canonicalQuestionTypes(t, 'reading')); }, []);
                        made.push(c);
                    });
                    Array.prototype.unshift.apply(cardData, made);   // newest first
                });
        }
        window.IELTSX_ADMIN_CARDS_READY = addAdminCards();
        function start() { window.IELTSX_ADMIN_CARDS_READY.then(init, init); }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }

    })();
  };

  pages['speaking'] = function () {
      // ---- speaking.js ----
        // ─── Disable Context Menu ───
        document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });

        // ─── Dark / Light / System: IELTSX.theme ───
        document.addEventListener('ieltsx:themechange', function() { renderCards(); });

        // ─── Data (18 topics) ───
        const topicsData = [
            { id: 1, title: "Topic 19 - P3: Environmental protection", part: "Part 3", tier: "Tier 3",
                pack: "Jan-August", plan: "Plan A", tags: ["Environment Nature", "Urban Life Places"] },
            { id: 2, title: "Topic 19 - P2: Describe a person who encouraged you to protect the nature",
                part: "Part 2", tier: "Tier 3", pack: "Jan-August", plan: "Plan A",
                tags: ["Environment Nature", "Urban Life Places"] },
            { id: 3, title: "Topic 19 - P1: Museum", part: "Part 1", tier: "Tier 3", pack: "Jan-August",
                plan: "Plan A", tags: ["Environment Nature", "Urban Life Places"] },
            { id: 4, title: "Topic 16 - P3: Films", part: "Part 3", tier: "Tier 3", pack: "Jan-August",
                plan: "Plan B", tags: ["Education Work", "Media Entertainment Creativity"] },
            { id: 5, title: "Topic 16 - P2: Describe a film you watched and enjoyed", part: "Part 2",
                tier: "Tier 3", pack: "Jan-August", plan: "Plan B",
                tags: ["Education Work", "Media Entertainment Creativity"] },
            { id: 6, title: "Topic 16 - P1: Work/study", part: "Part 1", tier: "Tier 3", pack: "Jan-August",
                plan: "Plan B", tags: ["Education Work", "Media Entertainment Creativity"] },
            { id: 7, title: "Topic 21 - P3: Technology in education", part: "Part 3", tier: "Tier 2",
                pack: "Sep-Dec", plan: "Plan A", tags: ["Technology", "Education"] },
            { id: 8, title: "Topic 21 - P2: Describe a useful app you use", part: "Part 2", tier: "Tier 2",
                pack: "Sep-Dec", plan: "Plan A", tags: ["Technology", "Daily Life"] },
            { id: 9, title: "Topic 21 - P1: Smartphones", part: "Part 1", tier: "Tier 2", pack: "Sep-Dec",
                plan: "Plan A", tags: ["Technology", "Communication"] },
            { id: 10, title: "Topic 22 - P3: Travel and tourism", part: "Part 3", tier: "Tier 1",
                pack: "Sep-Dec", plan: "Plan B", tags: ["Travel", "Culture"] },
            { id: 11, title: "Topic 22 - P2: Describe a memorable trip", part: "Part 2", tier: "Tier 1",
                pack: "Sep-Dec", plan: "Plan B", tags: ["Travel", "Adventure"] },
            { id: 12, title: "Topic 22 - P1: Holidays", part: "Part 1", tier: "Tier 1", pack: "Sep-Dec",
                plan: "Plan B", tags: ["Travel", "Leisure"] },
            { id: 13, title: "Topic 23 - P3: Health and fitness", part: "Part 3", tier: "Tier 3",
                pack: "Jan-August", plan: "Plan A", tags: ["Health", "Lifestyle"] },
            { id: 14, title: "Topic 23 - P2: Describe a healthy habit", part: "Part 2", tier: "Tier 3",
                pack: "Jan-August", plan: "Plan A", tags: ["Health", "Wellness"] },
            { id: 15, title: "Topic 23 - P1: Exercise", part: "Part 1", tier: "Tier 3", pack: "Jan-August",
                plan: "Plan A", tags: ["Health", "Fitness"] },
            { id: 16, title: "Topic 24 - P3: Social media", part: "Part 3", tier: "Tier 2", pack: "Sep-Dec",
                plan: "Plan B", tags: ["Technology", "Communication"] },
            { id: 17, title: "Topic 24 - P2: Describe a social media platform", part: "Part 2", tier: "Tier 2",
                pack: "Sep-Dec", plan: "Plan B", tags: ["Technology", "Communication"] },
            { id: 18, title: "Topic 24 - P1: Online friendships", part: "Part 1", tier: "Tier 2",
                pack: "Sep-Dec", plan: "Plan B", tags: ["Technology", "Relationships"] }
        ];

        // ─── Render ───
        let currentPage = 1;
        const perPage = 6;

        let filterBar = null;

        function getFilteredData() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            return topicsData.filter(item => {
                if (!(search === '' || item.title.toLowerCase().includes(search) || item.tags.some(t => t
                    .toLowerCase().includes(search)))) return false;
                if (!filterBar) return true;
                return filterBar.matches('part', [item.part]) &&
                    filterBar.matches('status', [IELTSX.completionKey('speaking:' + item.id)]) &&
                    filterBar.matches('plan', [IELTSX.cardPlanKey ? IELTSX.cardPlanKey(item, IELTSX.isFreeItem(item)) : (IELTSX.isFreeItem(item) ? 'demo' : 'max')]) &&
                    filterBar.matches('pack', [item.pack]);
            });
        }

        function renderCards() {
            const filtered = getFilteredData();
            const total = filtered.length;
            const totalPages = Math.ceil(total / perPage) || 1;
            if (currentPage > totalPages) currentPage = totalPages;
            const start = (currentPage - 1) * perPage;
            const pageItems = filtered.slice(start, start + perPage);

            const grid = document.getElementById('cardsGrid');
            grid.innerHTML = pageItems.map(item => `
                        <div class="h-full">
                            <div class="rounded-xl bg-card text-card-foreground shadow group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border h-full flex flex-col">
                                <div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                                    <div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-500/80 via-pink-500/70 to-red-600/80 dark:from-rose-600/60 dark:via-pink-600/50 dark:to-red-700/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic w-8 h-8 text-white/90">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                            <line x1="12" x2="12" y1="19" y2="22"></line>
                                        </svg>
                                        <span class="mt-2 text-white/90 font-medium text-sm text-center px-4 line-clamp-2">${item.pack}</span>
                                    </div>
                                    <div class="absolute top-3 left-3 z-10">
                                        <span class="inline-flex items-center justify-center rounded-md font-medium border px-2.5 py-0.5 text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50">${item.tier}</span>
                                    </div>
                                    <div class="absolute top-3 right-3 z-10">
                                        <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-black/60 dark:bg-black/80 backdrop-blur-sm text-white border-white/20 dark:border-white/30 text-xs font-medium shadow-md hover:bg-black/70 dark:hover:bg-black/90 transition-colors">${item.part}</div>
                                    </div>
                                </div>
                                <div class="p-4 flex flex-col flex-1 gap-3">
                                    <div class="flex flex-col gap-3 flex-1">
                                        <h3 class="font-semibold text-base leading-6 break-words text-foreground group-hover:text-primary transition-colors">${item.title}</h3>
                                        <div class="text-xs text-muted-foreground">
                                            <span class="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-3.5 h-3.5 flex-shrink-0">
                                                    <path d="M12 7v14"></path>
                                                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                                                </svg>
                                                <span class="truncate">${item.pack}</span>
                                            </span>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            ${item.tags.map(t => `<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs">${t}</div>`).join('')}
                                        </div>
                                    </div>
                                    <div class="flex gap-2 pt-1">
                                        <button type="button" data-get-access class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-8 rounded-md px-3 text-xs bg-gradient-to-r text-white border-0 shadow-lg hover:shadow-xl font-semibold transition-all from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:via-rose-700 hover:to-orange-700 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown w-3.5 h-3.5 mr-1">
                                                <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
                                                <path d="M5 21h14"></path>
                                            </svg>Get Access
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('');

            document.getElementById('resultCount').textContent = `Showing ${pageItems.length} of ${total} tests`;
            document.getElementById('pageIndicator').textContent = `Page ${currentPage} of ${totalPages}`;
            document.getElementById('prevPageBtn').disabled = (currentPage === 1);
            document.getElementById('nextPageBtn').disabled = (currentPage === totalPages);
        }

        // ─── Pagination ───
        document.getElementById('prevPageBtn').addEventListener('click', function() {
            if (currentPage > 1) { currentPage--;
                renderCards(); }
        });
        document.getElementById('nextPageBtn').addEventListener('click', function() {
            const filtered = getFilteredData();
            const totalPages = Math.ceil(filtered.length / perPage);
            if (currentPage < totalPages) { currentPage++;
                renderCards(); }
        });

        // ─── Filters ───
        (function () {
            filterBar = IELTSX.createFilterBar({
                specs: IELTSX.filterSpecs('speaking', ['Jan-August', 'Sep-Dec']),
                badges: null,
                onChange: function () { currentPage = 1; renderCards(); }
            });
        })();
        document.getElementById('searchInput').addEventListener('input', IELTSX.debounce(function() { currentPage = 1; renderCards(); }, 150));
        document.getElementById('searchBtn').addEventListener('click', function() { currentPage = 1; renderCards(); });

        // ─── Sidebar Toggle ───
        (function() {
            const sidebarContainer = document.getElementById('sidebarContainer');
            const sidebarRoot = document.getElementById('main-sidebar-root');
            const toggleBtn = document.getElementById('sidebar-toggle-btn');
            const overlay = document.getElementById('sidebarOverlay');
            const railBtn = document.querySelector('[data-sidebar="rail"]');

            function toggleSidebar() {
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                    sidebarContainer.classList.toggle('mobile-open');
                    overlay.classList.toggle('active', sidebarContainer.classList.contains('mobile-open'));
                } else {
                    const currentState = sidebarContainer.getAttribute('data-collapsible');
                    const isIcon = currentState === 'icon';
                    const newState = isIcon ? '' : 'icon';
                    const newDataState = isIcon ? 'expanded' : 'collapsed';
                    sidebarContainer.setAttribute('data-collapsible', newState);
                    sidebarContainer.setAttribute('data-state', newDataState);
                    if (sidebarRoot) {
                        sidebarRoot.setAttribute('data-collapsible', newState);
                        sidebarRoot.setAttribute('data-state', newDataState);
                    }
                    void sidebarContainer.offsetWidth;
                }
            }

            if (toggleBtn) toggleBtn.addEventListener('click', function(e) { e.preventDefault();
                toggleSidebar(); });
            if (railBtn) railBtn.addEventListener('click', function(e) { e.preventDefault();
                toggleSidebar(); });
            if (overlay) overlay.addEventListener('click', function() {
                sidebarContainer.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    sidebarContainer.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
                }
            });
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768) {
                    sidebarContainer.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
                }
            });
            // sync initial
            if (sidebarRoot) {
                const cs = sidebarContainer.getAttribute('data-collapsible') || '';
                const cd = sidebarContainer.getAttribute('data-state') || 'expanded';
                if (cs !== sidebarRoot.getAttribute('data-collapsible')) sidebarRoot.setAttribute('data-collapsible',
                    cs);
                if (cd !== sidebarRoot.getAttribute('data-state')) sidebarRoot.setAttribute('data-state', cd);
            }
        })();

        // ─── Init ───
        renderCards();
    
  };

  pages['writing'] = function () {
      // ---- writing.js ----
        // ─── Disable Context Menu ───
        document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });

        // ─── Dark / Light / System: IELTSX.theme ───
        document.addEventListener('ieltsx:themechange', function() { renderCards(); });

        // ─── Data ───
        const writingData = [
            // opens the IELTS writing exam screen (/writing/); the other cards are Premium
            { id: 13, title: "[Demo] Test 2 - T1: Changes in car ownership in European households between 1971 and 2001", task: "Task 1", tier: "Tier 1", type: "Line Graph", pack: "Demo", plan: "Plan A", img: null, free: true, href: "/writing/" },
            { id: 1, title: "Test 9 - T2: Extreme Sports Skydiving Skiing Dangerous Should Banned", task: "Task 2", tier: "Tier 1", type: "Agree Disagree", pack: "09_02-16_02", plan: "Plan A", img: null },
            { id: 2, title: "Test 9 - T1: Europeans Different Age Groups Gym Attendance 1990-2010 Chart", task: "Task 1", tier: "Tier 1", type: "Line Graph", pack: "09_02-16_02", plan: "Plan A", img: "https://static-image.ieltsx.com/focus-writing/09_02-16_02/09_02-16_02-t9.png" },
            { id: 3, title: "Test 8 - T2: Internet Most Important Invention Human History", task: "Task 2", tier: "Tier 1", type: "Agree Disagree", pack: "09_02-16_02", plan: "Plan A", img: null },
            { id: 4, title: "Test 8 - T1: Money Given Developing Countries Five Organisations 2008-2011 Chart", task: "Task 1", tier: "Tier 1", type: "Bar Chart", pack: "09_02-16_02", plan: "Plan A", img: "https://static-image.ieltsx.com/focus-writing/09_02-16_02/09_02-16_02-t8.png" },
            { id: 5, title: "Test 7 - T2: Working People Insufficient Free Time Family Friends Reasons", task: "Task 2", tier: "Tier 1", type: "Two Part", pack: "09_02-16_02", plan: "Plan A", img: null },
            { id: 6, title: "Test 7 - T1: Household Composition North America 1970-2003 Table", task: "Task 1", tier: "Tier 1", type: "Table", pack: "09_02-16_02", plan: "Plan A", img: "https://static-image.ieltsx.com/focus-writing/09_02-16_02/09_02-16_02-t7.png" },
            { id: 7, title: "Test 6 - T2: Horizontal City vs Vertical City Living Preference", task: "Task 2", tier: "Tier 1", type: "Discussion", pack: "09_02-16_02", plan: "Plan A", img: null },
            { id: 8, title: "Test 6 - T1: Males Watching vs Participating Sports Country Bar Chart", task: "Task 1", tier: "Tier 1", type: "Bar Chart", pack: "09_02-16_02", plan: "Plan A", img: "https://static-image.ieltsx.com/focus-writing/09_02-16_02/09_02-16_02-t6.png" },
            { id: 9, title: "Test 5 - T2: Historical Objects Museums Returned Countries of Origin", task: "Task 2", tier: "Tier 1", type: "Agree Disagree", pack: "09_02-16_02", plan: "Plan A", img: null },
            { id: 10, title: "Test 5 - T1: Male Female Workers Percentage Country A Country B Chart", task: "Task 1", tier: "Tier 1", type: "Pie Chart", pack: "09_02-16_02", plan: "Plan A", img: "https://static-image.ieltsx.com/focus-writing/09_02-16_02/09_02-16_02-t5.png" },
            { id: 11, title: "Test 4 - T2: Employers Dress Code Quality Work Matters", task: "Task 2", tier: "Tier 1", type: "Agree Disagree", pack: "09_02-16_02", plan: "Plan A", img: null },
            { id: 12, title: "Test 4 - Task 1: Task 1", task: "Task 1", tier: "Tier 1", type: "Map", pack: "09_02-16_02", plan: "Plan A", img: "https://static-image.ieltsx.com/focus-writing/09_02-16_02/09_02-16_02-t4.png" }
        ];
        if (!window.IELTSX_SHOW_BUILTIN_CARDS) writingData.length = 0;   // only the cards made in the admin panel

        // ─── Render ───
        let currentPage = 1;
        const perPage = 6;

        let filterBar = null;

        function getFilteredData() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            return writingData.filter(item => {
                if (!(search === '' || item.title.toLowerCase().includes(search))) return false;
                if (!filterBar) return true;
                return filterBar.matches('task', [item.task]) &&
                    filterBar.matches('status', [IELTSX.completionKey('writing:' + item.id)]) &&
                    filterBar.matches('type', IELTSX.canonicalWritingTypes(item.type)) &&
                    filterBar.matches('plan', [IELTSX.cardPlanKey ? IELTSX.cardPlanKey(item, IELTSX.isFreeItem(item)) : (IELTSX.isFreeItem(item) ? 'demo' : 'max')]) &&
                    filterBar.matches('pack', [item.pack]);
            });
        }

        function renderCards() {
            const filtered = getFilteredData();
            const total = filtered.length;
            const totalPages = Math.ceil(total / perPage) || 1;
            if (currentPage > totalPages) currentPage = totalPages;
            const start = (currentPage - 1) * perPage;
            const pageItems = filtered.slice(start, start + perPage);

            const grid = document.getElementById('cardsGrid');
            grid.innerHTML = pageItems.map(item => `
                <div class="h-full">
                    <div class="rounded-xl bg-card text-card-foreground shadow group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border h-full flex flex-col">
                        <div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                            ${item.img ? `<img loading="lazy" decoding="async" src="${item.img}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>` :
                            `<div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/80 via-indigo-500/70 to-violet-600/80 dark:from-blue-600/60 dark:via-indigo-600/50 dark:to-violet-700/60">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil w-8 h-8 text-white/90">
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                                <span class="mt-2 text-white/90 font-medium text-sm text-center px-4 line-clamp-2">${item.pack}</span>
                            </div>`}
                            <div class="absolute top-3 left-3 z-10">
                                <span class="inline-flex items-center justify-center rounded-md font-medium border px-2.5 py-0.5 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50">${item.tier}</span>
                            </div>
                            <div class="absolute top-3 right-3 z-10">
                                <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-black/60 dark:bg-black/80 backdrop-blur-sm text-white border-white/20 dark:border-white/30 text-xs font-medium shadow-md hover:bg-black/70 dark:hover:bg-black/90 transition-colors">${item.task}</div>
                            </div>
                        </div>
                        <div class="p-4 flex flex-col flex-1 gap-3">
                            <div class="flex flex-col gap-3 flex-1">
                                <h3 class="font-semibold text-base leading-6 break-words text-foreground group-hover:text-primary transition-colors">${item.title}</h3>
                                <div class="text-xs text-muted-foreground">
                                    <span class="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-3.5 h-3.5 flex-shrink-0">
                                            <path d="M12 7v14" />
                                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                                        </svg>
                                        <span class="truncate">${item.pack}</span>
                                    </span>
                                </div>
                                <div class="flex flex-wrap gap-1">
                                    <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs">${item.type}</div>
                                </div>
                            </div>
                            <div class="flex gap-2 pt-1">
                                ${item.href ? `<a href="${item.href}" class="inline-flex items-center justify-center gap-2 whitespace-nowrap h-8 rounded-md px-3 text-xs font-semibold w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all" style="text-decoration:none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 mr-1"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>Start test
                                </a>` : `<button type="button" data-get-access class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-8 rounded-md px-3 text-xs bg-gradient-to-r text-white border-0 shadow-lg hover:shadow-xl font-semibold transition-all from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:via-rose-700 hover:to-orange-700 w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown w-3.5 h-3.5 mr-1">
                                        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                                        <path d="M5 21h14" />
                                    </svg>Get Access
                                </button>`}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            document.getElementById('resultCount').textContent = `Showing ${pageItems.length} of ${total} tests`;
            document.getElementById('pageIndicator').textContent = `Page ${currentPage} of ${totalPages}`;
            document.getElementById('prevPageBtn').disabled = (currentPage === 1);
            document.getElementById('nextPageBtn').disabled = (currentPage === totalPages);
        }

        // ─── Pagination ───
        document.getElementById('prevPageBtn').addEventListener('click', function() {
            if (currentPage > 1) { currentPage--; renderCards(); }
        });
        document.getElementById('nextPageBtn').addEventListener('click', function() {
            const filtered = getFilteredData();
            const totalPages = Math.ceil(filtered.length / perPage);
            if (currentPage < totalPages) { currentPage++; renderCards(); }
        });

        // ─── Filters ───
        (function () {
            filterBar = IELTSX.createFilterBar({
                specs: IELTSX.filterSpecs('writing', ['09_02-16_02', 'Jan-August', 'Sep-Dec']),
                badges: null,
                onChange: function () { currentPage = 1; renderCards(); }
            });
        })();
        document.getElementById('searchInput').addEventListener('input', IELTSX.debounce(function() { currentPage = 1; renderCards(); }, 150));
        document.getElementById('searchBtn').addEventListener('click', function() { currentPage = 1; renderCards(); });

        // ─── Sidebar Toggle ───
        (function() {
            const sidebarContainer = document.getElementById('sidebarContainer');
            const sidebarRoot = document.getElementById('main-sidebar-root');
            const toggleBtn = document.getElementById('sidebar-toggle-btn');
            const overlay = document.getElementById('sidebarOverlay');
            const railBtn = document.querySelector('[data-sidebar="rail"]');

            function setDesktopSidebarState(collapsed) {
                const state = collapsed ? 'icon' : '';
                const dataState = collapsed ? 'collapsed' : 'expanded';

                sidebarContainer.setAttribute('data-collapsible', state);
                sidebarContainer.setAttribute('data-state', dataState);

                if (sidebarRoot) {
                    sidebarRoot.setAttribute('data-collapsible', state);
                    sidebarRoot.setAttribute('data-state', dataState);
                }

                /* Keep the layout dimensions synchronized with the visual state. */
                sidebarContainer.style.width = collapsed
                    ? 'var(--sidebar-width-icon)'
                    : 'var(--sidebar-width)';
                sidebarContainer.style.minWidth = collapsed
                    ? 'var(--sidebar-width-icon)'
                    : 'var(--sidebar-width)';

                /* Force a single clean reflow after changing the state. */
                void sidebarContainer.offsetWidth;
            }

            function toggleSidebar() {
                const isMobile = window.innerWidth < 768;

                if (isMobile) {
                    const open = !sidebarContainer.classList.contains('mobile-open');
                    sidebarContainer.classList.toggle('mobile-open', open);
                    overlay.classList.toggle('active', open);
                    return;
                }

                const collapsed =
                    sidebarContainer.getAttribute('data-collapsible') === 'icon';

                setDesktopSidebarState(!collapsed);
            }

            if (toggleBtn) toggleBtn.addEventListener('click', function(e) { e.preventDefault(); toggleSidebar(); });
            if (railBtn) railBtn.addEventListener('click', function(e) { e.preventDefault(); toggleSidebar(); });
            if (overlay) overlay.addEventListener('click', function() {
                sidebarContainer.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    sidebarContainer.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
                }
            });
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768) {
                    sidebarContainer.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');

                    const collapsed =
                        sidebarContainer.getAttribute('data-collapsible') === 'icon';
                    setDesktopSidebarState(collapsed);
                }
            });
            if (sidebarRoot) {
                const collapsed = sidebarContainer.getAttribute('data-collapsible') === 'icon';
                setDesktopSidebarState(collapsed);
            }
        })();

        // ─── Init ───
        /* Writing tasks made in the admin panel become cards at the START of the grid (newest first). */
        window.IELTSX_ADMIN_CARDS_READY = (function () {
            if (!window.fetch) return Promise.resolve();
            var ctl = window.AbortController ? new AbortController() : null;
            var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 4000);
            return fetch('/api/materials?type=writing&mode=part', { credentials: 'same-origin', signal: ctl ? ctl.signal : undefined })
                .then(function (r) { return r.ok ? r.json() : { items: [] }; })
                .catch(function () { return { items: [] }; })
                .then(function (d) {
                    clearTimeout(timer);
                    var items = d.items || [];
                    // writing sets open in the IELTS writing exam screen (/writing/?id=…)
                    var hrefOf = function (m) { return m.href || ('/writing/?id=' + encodeURIComponent(m.id)); };
                    window.IELTSX_ADMIN_CARDS = items.map(function (m) { return { href: hrefOf(m), title: m.title, locked: !!m.locked, premium: !!m.premium, plan: m.plan || 'standard' }; });
                    // text typed in the admin panel goes into the card HTML: escape it
                    var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
                    var made = items.map(function (m, n) {
                        return { id: 1000 + n, title: esc(m.title), task: esc(m.taskLabel || 'Task 1'), tier: esc(m.tier || 'Tier 1'), type: esc((m.types || [])[0] || 'Writing task'), pack: esc(m.pack || 'Practice'), plan: 'Plan A', img: m.coverUrl ? esc(m.coverUrl) : null, href: esc(hrefOf(m)), admin: true };
                    });
                    Array.prototype.unshift.apply(writingData, made);
                    if (made.length) { currentPage = 1; renderCards(); }
                });
        })();
        renderCards();
    
  };

  // Sidebar (desktop collapse, mobile slide-in) and avatar menu of the Articles shell.
  // The Articles list and every article page (collections/article*.html) share this shell.
  function articlesShell() {
        const sidebarContainer = document.getElementById('mainSidebarContainer');
        const sidebarRoot = document.getElementById('main-sidebar-root');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const overlay = document.getElementById('sidebarOverlay');
        const railBtn = document.querySelector('[data-sidebar="rail"]');
        if (!sidebarContainer) return;

        // ----- SIDEBAR TOGGLE (core fix) -----
        function toggleSidebar() {
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Mobile: slide in/out
                sidebarContainer.classList.toggle('mobile-open');
                if (sidebarContainer.classList.contains('mobile-open')) {
                    overlay.classList.add('active');
                } else {
                    overlay.classList.remove('active');
                }
            } else {
                // Desktop: toggle icon mode
                const currentState = sidebarContainer.getAttribute('data-collapsible');
                const isIcon = currentState === 'icon';
                const newState = isIcon ? '' : 'icon';
                const newDataState = isIcon ? 'expanded' : 'collapsed';

                // Update the outer container
                sidebarContainer.setAttribute('data-collapsible', newState);
                sidebarContainer.setAttribute('data-state', newDataState);

                // Update the sidebar root (the element with the 'group' class)
                if (sidebarRoot) {
                    sidebarRoot.setAttribute('data-collapsible', newState);
                    sidebarRoot.setAttribute('data-state', newDataState);
                }

                // Force reflow for smooth transition
                void sidebarContainer.offsetWidth;
            }
        }

        // Toggle button (hamburger)
        toggleBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });

        // Rail button (the vertical bar on the sidebar edge)
        railBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });

        // Overlay closes mobile sidebar
        overlay?.addEventListener('click', function() {
            sidebarContainer.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });

        // Escape key closes mobile sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                sidebarContainer.classList.remove('mobile-open');
                overlay.classList.remove('active');
            }
        });

        // Resize: reset mobile state on desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                sidebarContainer.classList.remove('mobile-open');
                overlay.classList.remove('active');
            }
        });

        // Avatar dropdown
        const avatarTrigger = document.getElementById('avatar-dropdown-trigger');
        const userDropdown = document.getElementById('user-dropdown');
        let isOpen = false;

        function closeDropdown() { userDropdown?.classList.add('hidden');
            isOpen = false; }

        function openDropdown() { userDropdown?.classList.remove('hidden');
            isOpen = true; }
        if (avatarTrigger && userDropdown) {
            avatarTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                isOpen ? closeDropdown() : openDropdown();
            });
            document.addEventListener('click', (e) => {
                if (!avatarTrigger.contains(e.target) && !userDropdown.contains(e.target)) closeDropdown();
            });
            document.getElementById('dropdown-account')?.addEventListener('click', closeDropdown);
            document.getElementById('dropdown-logout')?.addEventListener('click', () => {
                if (window.IELTSXAuth && window.IELTSXAuth.logout) { window.IELTSXAuth.logout(); return; }
                closeDropdown();
            });
        }

        // Ensure sidebar root initial state matches container
        if (sidebarRoot) {
            const containerState = sidebarContainer.getAttribute('data-collapsible');
            const containerDataState = sidebarContainer.getAttribute('data-state');
            if (containerState !== sidebarRoot.getAttribute('data-collapsible')) {
                sidebarRoot.setAttribute('data-collapsible', containerState);
            }
            if (containerDataState !== sidebarRoot.getAttribute('data-state')) {
                sidebarRoot.setAttribute('data-state', containerDataState);
            }
        }
  }

  pages['article'] = function () {
      // the reading area itself is assets/js/article.js
      articlesShell();
  };

  pages['articles'] = function () {
      // ---- articles.js ----
        // ----- DISABLE CONTEXT MENU -----
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        articlesShell();

        // ----- THEME: handled by IELTSX.theme (light / dark / system) -----
        document.addEventListener('ieltsx:themechange', function() {
            renderArticles();
            renderLiveFeed();
        });

        // ----- ARTICLES DATA -----
        // every article is made in the admin panel (admin#articles) and comes from /api/materials?type=article below
        const articlesData = [];

        function renderArticles() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const passageVal = document.getElementById('passageSelect').value;
            const topicVal = document.getElementById('topicSelect').value;
            const sortVal = document.getElementById('sortSelect').value;
            let filtered = articlesData.filter(art =>
                (passageVal === 'all' || art.passage === passageVal) &&
                (topicVal === 'all' || art.topic === topicVal) &&
                (art.title.toLowerCase().includes(searchTerm) || art.description.toLowerCase().includes(
                searchTerm))
            );
            if (sortVal === 'newest') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            else filtered.sort((a, b) => b.id - a.id);
            const container = document.getElementById('articlesGrid');
            if (!container) return;
            if (!filtered.length) { container.innerHTML = '<div style="grid-column:1/-1;padding:48px 16px;text-align:center;color:var(--text-secondary)">' + (articlesData.length ? 'No articles match your search.' : 'New articles are coming soon.') + '</div>'; return; }
            container.innerHTML = filtered.map(art =>
                `
                    <a href="${art.locked ? art.lockHref : String(art.href || '#').replace(/\.html(?=$|[?#])/i, '')}" class="group rounded-xl border text-card-foreground flex h-full min-h-[390px] cursor-pointer flex-col overflow-hidden border-border/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg" style="text-decoration: none; color: inherit; background: var(--bg-card); border-color: var(--border-color);">
                        <div class="relative h-52 overflow-hidden">
                            <img loading="lazy" decoding="async" src="${art.image}" alt="${String(art.title).replace(/"/g, '&quot;')}" onerror="this.style.visibility='hidden'" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"></div>
                            <div class="flex flex-wrap gap-2 absolute left-4 top-4">
                                <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow border-white/30 bg-white/90 text-slate-900" style="background: var(--bg-card); color: var(--text-primary);">${art.passage}</span>
                                <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow border-white/20 bg-slate-950/55 text-white backdrop-blur">${art.topic}</span>
                            </div>
                        </div>
                        <div class="flex flex-col p-6 pb-3"><div class="font-semibold line-clamp-2 text-xl leading-snug" style="color: var(--text-primary);">${art.title}</div></div>
                        <div class="p-6 pt-0 pb-4"><div class="text-muted-foreground line-clamp-3 text-base leading-7" style="color: var(--text-secondary);">${art.description}</div></div>
                        <div class="flex items-center p-6 mt-auto px-6 pb-5 pt-0"><span class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-800">${art.locked ? '🔒 Get Access · ' + art.planLabel : 'Read article'}<svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span></div>
                    </a>
                `
            ).join('');
        }

        function renderLiveFeed() {
            const feedDiv = document.getElementById('liveFeedContent');
            if (feedDiv) {
                feedDiv.innerHTML = [
                    { source: "BBC Future", title: "Why reading fiction boosts empathy", date: "2025-05-16" },
                    { source: "The Guardian", title: "AI and language exams: new era", date: "2025-05-15" },
                    { source: "IELTS Official", title: "Latest test updates 2025", date: "2025-05-14" }
                ].map(f =>
                    `
                        <div class="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md" style="background: var(--bg-card); border-color: var(--border-color); color: var(--text-primary);">
                            <div class="text-xs" style="color: var(--text-secondary);">${f.source} · ${f.date}</div>
                            <h4 class="font-semibold mt-1" style="color: var(--text-primary);">${f.title}</h4>
                            <a href="#" class="text-indigo-600 text-sm mt-3 inline-block font-medium">Read full →</a>
                        </div>
                    `
                ).join('');
            }
        }

        // TABS
        const passagesPanel = document.getElementById('passagesPanel');
        const feedPanel = document.getElementById('feedPanel');
        const tabPassages = document.getElementById('tabPassages');
        const tabFeed = document.getElementById('tabFeed');

        function activateTab(tabName) {
            if (tabName === 'passages') {
                passagesPanel.classList.remove('hidden');
                feedPanel.classList.add('hidden');
                tabPassages.classList.add('bg-white', 'shadow', 'text-gray-900');
                tabFeed.classList.remove('bg-white', 'shadow', 'text-gray-900');
                renderArticles();
            } else {
                passagesPanel.classList.add('hidden');
                feedPanel.classList.remove('hidden');
                tabFeed.classList.add('bg-white', 'shadow', 'text-gray-900');
                tabPassages.classList.remove('bg-white', 'shadow', 'text-gray-900');
                renderLiveFeed();
            }
        }
        tabPassages.addEventListener('click', () => activateTab('passages'));
        tabFeed.addEventListener('click', () => activateTab('feed'));

        // Filter listeners
        document.getElementById('searchInput').addEventListener('input', IELTSX.debounce(renderArticles, 150));
        document.getElementById('searchBtn').addEventListener('click', renderArticles);
        document.getElementById('passageSelect').addEventListener('change', renderArticles);
        document.getElementById('topicSelect').addEventListener('change', renderArticles);
        document.getElementById('sortSelect').addEventListener('change', renderArticles);

        // Initial renders
        renderArticles();
        renderLiveFeed();
        activateTab('passages');

        // Articles added in the admin panel (they open in /collections/article?id=...)
        fetch('/api/materials?type=article', { credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : { items: [] }; })
            .then(function (d) {
                const items = d.items || [];
                const esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
                const cap = function (s) { s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'General'; };
                items.forEach(function (m, i) {
                    // older admin articles kept the cover in coverUrl and the level in passageLabel
                    articlesData.push({
                        id: 1000 + items.length - i, title: esc(m.title), passage: esc(m.level || m.passageLabel || 'Passage 1'), topic: esc(cap(m.topic)),
                        date: m.date || m.createdAt, image: esc(m.imageUrl || m.coverUrl || ''), description: esc(m.description || m.lead || m.source || ''),
                        href: '/collections/article?id=' + encodeURIComponent(m.id), locked: !!m.locked,
                        // a locked article goes to the Price page of the plan it needs (like the locked test cards)
                        lockHref: '/Price?premium=required&plan=' + encodeURIComponent(m.plan || 'standard') + '&next=' + encodeURIComponent('/collections/article?id=' + m.id),
                        planLabel: ({ standard: 'Standard', max: 'Max', ultra: 'Ultra' })[m.plan] || 'Premium'
                    });
                });
                if (items.length) renderArticles();
            })
            .catch(function () { /* the saved articles still show */ });

  };

  pages['pdf_materials'] = function () {
      // ---- pdf_materials.js ----
    (function() {
        const sidebarContainer = document.querySelector('#main-sidebar-root');
        const toggleButtons = document.querySelectorAll('[data-sidebar="trigger"], [data-sidebar="rail"]');
        function updateSidebarState() {
            if (!sidebarContainer) return;
            const isCollapsed = sidebarContainer.getAttribute('data-collapsible') === 'icon';
            if (isCollapsed) {
                sidebarContainer.setAttribute('data-collapsible', '');
                sidebarContainer.setAttribute('data-state', 'expanded');
            } else {
                sidebarContainer.setAttribute('data-collapsible', 'icon');
                sidebarContainer.setAttribute('data-state', 'collapsed');
            }
        }
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                updateSidebarState();
            });
        });
        IELTSX.startCountdown((2 * 86400) + (0 * 3600) + (21 * 60) + 55, ['daysLeft', 'hoursLeft', 'minutesLeft', 'secondsLeft']);
    })();

    function downloadPDF(type) {
        if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
            alert("PDF library is still loading. Please try again in a moment.");
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        let title = "", content = "";
        switch(type) {
            case 'reading':
                title = "IELTS_Reading_Practice_Pack";
                content = "This PDF includes 10 academic reading passages with authentic question types: Matching Headings, True/False/Not Given, Sentence Completion, Summary, and Multiple Choice. Detailed answer keys, time management tips, and skimming/scanning techniques to boost your band score. Suitable for both Academic and General Training candidates.";
                break;
            case 'listening':
                title = "IELTS_Listening_Masterclass";
                content = "Contains 4 complete listening tests (Sections 1-4) with answer keys, transcripts, and strategic guidance. Topics include social contexts, monologues, educational conversations, and lectures. Includes map labelling, form completion, MCQ, and note-taking exercises. QR code (simulated) for audio access instructions inside.";
                break;
            case 'writing':
                title = "IELTS_Writing_Power_Pack";
                content = "Band 9 sample essays for Task 1 (graphs, charts, maps, processes) and Task 2 (opinion, discussion, problem-solution, double question). Includes sentence connectors, advanced vocabulary, grammar structures, and step-by-step essay planning templates. Examiner insights and common mistakes to avoid.";
                break;
            case 'speaking':
                title = "IELTS_Speaking_Success_Kit";
                content = "Latest cue cards (2025-2026) with model answers for Part 2, plus Part 3 discussion frameworks. Fluency phrases, idiomatic language, pronunciation tips, and topic-specific vocabulary for travel, technology, environment, work, and education. Includes self-assessment checklist.";
                break;
            default:
                title = "IELTSX_Magazine_May_2026";
                content = "Featured articles: Global warming solutions, AI in education, cultural heritage. Academic word list exercises, reading comprehension tasks, writing prompts, student model answers, exam calendar updates, and insider tips from IELTS examiners. Perfect for integrated skill improvement.";
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(title.replace(/_/g, ' '), 20, 20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 35);
        doc.setFontSize(10);
        doc.text("© IELTSX — Official Preparation Platform. All rights reserved.", 20, 270);
        doc.text("Downloaded from IELTSX PDF Library", 20, 280);
        doc.save(`${title}.pdf`);
    }

      // inline onclick="downloadPDF(...)" in the HTML needs a global
      window.downloadPDF = downloadPDF;
  };

  pages['performance'] = function () {
      // ---- performance.js ----
        (function () {
            // ─── Dark / Light / System: handled by IELTSX.theme ───

            // ─── Sidebar Toggle ───
            const sidebarContainer = document.getElementById('main-sidebar-root');
            const toggleButtons = document.querySelectorAll('[data-sidebar="trigger"], [data-sidebar="rail"]');

            function updateSidebarState() {
                if (!sidebarContainer) return;
                const isCollapsed = sidebarContainer.getAttribute('data-collapsible') === 'icon';
                if (isCollapsed) {
                    sidebarContainer.setAttribute('data-collapsible', '');
                    sidebarContainer.setAttribute('data-state', 'expanded');
                } else {
                    sidebarContainer.setAttribute('data-collapsible', 'icon');
                    sidebarContainer.setAttribute('data-state', 'collapsed');
                }
            }

            toggleButtons.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    updateSidebarState();
                });
            });

            // ─── Countdown Timer ───
            IELTSX.startCountdown((2 * 86400) + (23 * 3600) + (24 * 60) + 53, ['daysLeft', 'hoursLeft', 'minutesLeft', 'secondsLeft']);
        })();
    
  };

  /* ======
   * 3) PAGE ROUTER — runs only the module that belongs to this page
   * ====== */
  function detectPage() {
    var file = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '').toLowerCase();
    if (file === '') file = 'index';
    if (pages[file]) return file;

    var $ = function (s) { return document.querySelector(s); };
    if ($('#article-content')) return 'article';
    if ($('#main-sidebar-root') && $('#avatar-container')) return 'index';
    if ($('#partFilter')) return 'speaking';
    if ($('#taskFilter')) return 'writing';
    if ($('#articlesGrid')) return 'articles';
    if ($('#mockResultsContainer')) return 'performance';
    if ($('#daysLeft')) return 'pdf_materials';
    if ($('#card-grid')) return $('.filter-trigger[data-filter="passage"]') ? 'reading' : 'listening';
    return null;
  }

  var current = detectPage();
  window.IELTSX.page = current;
  if (current) pages[current]();
})();


