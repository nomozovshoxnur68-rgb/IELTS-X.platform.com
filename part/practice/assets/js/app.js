/*
 * IELTSX — single JavaScript bundle (assets/js/app.js)
 * 1) shared constants & helpers  2) page modules (original code, unchanged)  3) router
 */
(function () {
  /* =====================================================================
   * 1) SHARED CONSTANTS & HELPERS (new) — window.IELTSX
   *    Names inside this block are kept exactly as in the original bundle.
   * ===================================================================== */
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


  /* =====================================================================
   * 1b) THEME (light / dark / system), PROGRESS, QUESTION-TYPE HELPERS and
   *     the reusable FILTER BAR (single list + checkbox panel)
   * ===================================================================== */

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
  var PLAN_OPTIONS = [opt('demo', 'Demo (Free)'), opt('max', 'Max')];
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

    function triggerOf(k) { return document.querySelector('.filter-trigger[data-filter="' + k + '"]'); }
    function dropdownOf(k) { return document.querySelector('.filter-dropdown[data-filter="' + k + '"]'); }
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

  window.IELTSX.theme = IELTSXTheme;
  window.IELTSX.progress = IELTSXProgress;
  window.IELTSX.canonicalQuestionTypes = canonicalQuestionTypes;
  window.IELTSX.canonicalWritingTypes = canonicalWritingTypes;
  window.IELTSX.filterSpecs = filterSpecs;
  window.IELTSX.createFilterBar = createFilterBar;
  window.IELTSX.completionKey = completionKey;
  window.IELTSX.isFreeItem = isFreeItem;

  /* =====================================================================
   * 2) PAGE MODULES — original page scripts, copied verbatim
   * ===================================================================== */
  var pages = {};

  pages['index'] = function () {
      // ---- index.js ----
        (function () {
            const sidebarMount = document.getElementById('sidebar-mount-point');
            if (!sidebarMount) return;

            // ─── NEW MODERN SIDEBAR ──────────────────────────────────────
            const fallbackSidebar = `
                <div class="group peer hidden md:block text-sidebar-foreground" data-state="expanded" data-collapsible="" data-variant="sidebar" data-side="left" id="main-sidebar-root">
                    <div class="duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-[--sidebar-width-icon] sidebar-outer"></div>
                    <div class="duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l overflow-hidden sidebar-outer">
                        <div data-sidebar="sidebar" class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">
                            <div class="flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground border-r sidebar-inner">

                                <!-- HEADER: Brand -->
                                <div data-sidebar="header" class="flex flex-col gap-2 p-2">
                                    <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                        <li data-sidebar="menu-item" class="group/menu-item relative">
                                            <a data-sidebar="menu-button" data-size="lg" data-active="false" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:!p-0 md:h-8 md:p-0" href="index.html">
                                                <div class="flex aspect-square size-8 items-center justify-center rounded-lg p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" class="size-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                                </div>
                                                <div class="grid flex-1 text-left text-sm leading-tight sidebar-text-hidden">
                                                    <span class="truncate font-semibold">IELTSX</span>
                                                    <span class="truncate text-xs capitalize">DEMO</span>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <!-- CONTENT: Menu groups -->
                                <div data-sidebar="content" class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden">

                                    <!-- Full Tests -->
                                    <div data-sidebar="group" class="relative flex w-full min-w-0 flex-col p-2">
                                        <div data-sidebar="group-label" class="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">Full Tests</div>
                                        <div data-sidebar="group-content" class="w-full text-sm">
                                            <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="full listening.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg><span class="flex-1">Listening</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="full reading.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg><span class="flex-1">Reading</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="full writing.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg><span class="flex-1">Writing</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="full speaking.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg><span class="flex-1">Speaking</span></a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Part Practice -->
                                    <div data-sidebar="group" class="relative flex w-full min-w-0 flex-col p-2">
                                        <div data-sidebar="group-label" class="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">Part Practice</div>
                                        <div data-sidebar="group-content" class="w-full text-sm">
                                            <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/part/practice/listening.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg><span class="flex-1">Listening Sections</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/part/practice/reading.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg><span class="flex-1">Reading Passages</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/part/practice/writing.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg><span class="flex-1">Writing Tasks</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/part/practice/speaking.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="flex-1">Speaking Topics</span></a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Collections -->
                                    <div data-sidebar="group" class="relative flex w-full min-w-0 flex-col p-2">
                                        <div data-sidebar="group-label" class="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">Collections</div>
                                        <div data-sidebar="group-content" class="w-full text-sm">
                                            <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="Predictions.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg><span class="flex-1">Predictions</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown size-4"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="Mock tests.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg><span class="flex-1">Mock Tests</span></a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Study Tools -->
                                    <div data-sidebar="group" class="relative flex w-full min-w-0 flex-col p-2">
                                        <div data-sidebar="group-label" class="duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">Study Tools</div>
                                        <div data-sidebar="group-content" class="w-full text-sm">
                                            <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/study/tools/Performance.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-line"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg><span class="flex-1">Performance</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown size-4"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/study/tools/Pdf materials.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg><span class="flex-1">Courses</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown size-4"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/index.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-a"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="m8 13 4-7 4 7"/><path d="M9.1 11h5.7"/></svg><span class="flex-1">Vocabularies</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown size-4"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex w-full items-center gap-2" data-sidebar="menu-button" data-size="default" data-active="false" href="/study/tools/Articles.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg><span class="flex-1">Articles</span></a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Footer links (Pricing, Telegram, Support) -->
                                    <div data-sidebar="group" class="relative flex w-full min-w-0 flex-col p-2 mt-auto">
                                        <div data-sidebar="group-content" class="w-full text-sm">
                                            <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-7 text-xs flex w-full items-center gap-2" data-sidebar="menu-button" data-size="sm" data-active="false" href="pricing.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg><span class="flex-1">Pricing</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a href="https://telegram.me/ieltsxuz" target="_blank" rel="noopener noreferrer" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-7 text-xs flex w-full items-center gap-2" data-sidebar="menu-button" data-size="sm" data-active="false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg><span class="flex-1">Telegram Channel</span></a></li>
                                                <li data-sidebar="menu-item" class="group/menu-item relative"><a class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-7 text-xs flex w-full items-center gap-2" data-sidebar="menu-button" data-size="sm" data-active="false" href="support.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-life-buoy"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg><span class="flex-1">Support</span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <!-- FOOTER: User profile -->
                                <div data-sidebar="footer" class="flex flex-col gap-2 p-2">
                                    <ul data-sidebar="menu" class="flex w-full min-w-0 flex-col gap-1">
                                        <li data-sidebar="menu-item" class="group/menu-item relative">
                                            <button data-sidebar="menu-button" data-size="lg" data-active="false" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:!p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" type="button" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                                                <span class="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg">
                                                    <span class="flex h-full w-full items-center justify-center rounded-lg bg-background">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                    </span>
                                                </span>
                                                <div class="grid flex-1 text-left text-sm leading-tight">
                                                    <span class="truncate font-semibold">Shoxnur</span>
                                                    <span class="truncate text-xs">+998904607595</span>
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down ml-auto size-4"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <!-- RAIL (resize / toggle handle) -->
                                <button data-sidebar="rail" aria-label="Toggle Sidebar" tabindex="-1" title="Toggle Sidebar" class="absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex [[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2"></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // ─── RENDER ──────────────────────────────────────────────────
            function renderSidebar(html) {
                sidebarMount.innerHTML = html;

                const sidebarContainer = sidebarMount.querySelector('#main-sidebar-root');
                const toggleButtons = document.querySelectorAll('[data-sidebar="trigger"], [data-sidebar="rail"]');

                function toggleSidebar(e) {
                    if (e) e.preventDefault();
                    if (!sidebarContainer) return;

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

                // also attach to the rail if it exists inside the sidebar
                const railInside = sidebarMount.querySelector('[data-sidebar="rail"]');
                if (railInside) {
                    railInside.addEventListener('click', toggleSidebar);
                }
            }

            // ─── FETCH OR FALLBACK ──────────────────────────────────────
            fetch('sidebar.html', { cache: 'no-store' })
                .then(function (response) {
                    if (!response.ok) throw new Error('sidebar.html not found');
                    return response.text();
                })
                .then(renderSidebar)
                .catch(function () {
                    renderSidebar(fallbackSidebar);
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
                    alert('Logged out (demo)');
                    closeDropdown();
                });
            }
        })();
    
      // ---- index-3.js ----
(function(){var e=localStorage.getItem('ieltsx_logged_in_email')||localStorage.getItem('userEmail');var el=document.getElementById('ieltsx-account-status');if(e){el.textContent=e;el.style.display='block'}})();
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
        function extractCardData() {
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
                    pack: pack,
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
                    filterBar.matches('plan', [card.freeCard ? 'demo' : 'max']) &&
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
                    alert('Logged out (demo)');
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

            // Sidebar toggle button (extra)
            const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
            if (sidebarToggleBtn) {
                sidebarToggleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const container = document.getElementById('main-sidebar-root');
                    if (container) {
                        const isCollapsed = container.getAttribute('data-collapsible') === 'icon';
                        if (isCollapsed) {
                            container.setAttribute('data-collapsible', '');
                            container.setAttribute('data-state', 'expanded');
                        } else {
                            container.setAttribute('data-collapsible', 'icon');
                            container.setAttribute('data-state', 'collapsed');
                        }
                    }
                });
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
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
            href: 'pessage6.html',
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
            href: 'pessage5.html',
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
            href: 'pessage4.html',
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
            href: 'pessage14.html',
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
            href: 'pessage16.html',
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
            href: 'pessage17.html',
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
            href: 'pessage18.html',
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
            href: 'pessage19.html',
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
            href: 'pessage20.html',
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
            href: 'pessage21.html',
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
            href: 'pessage22.html',
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
            href: 'pessage23.html',
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
            href: 'pessage24.html',
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
            href: 'pessage25.html',
            img: 'pessages.png',
            desc: 'Free Sample | Starter Pack',
            badge: 'FREE'
        }];

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
                    filterBar.matches('plan', [card.freeCard ? 'demo' : 'max']) &&
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
                                    <img src="${card.img || 'https://picsum.photos/seed/'+card.id+'/400/300'}" alt="${card.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://picsum.photos/seed/${card.id}/400/300'">
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
                                        <a href="${card.href || '#'}" class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-8 rounded-md px-3 text-xs font-semibold shadow-lg hover:shadow-xl transition-all w-full">
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
                    alert('Logged out (demo)');
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

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
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
                    filterBar.matches('plan', [IELTSX.isFreeItem(item) ? 'demo' : 'max']) &&
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
                                        <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-8 rounded-md px-3 text-xs bg-gradient-to-r text-white border-0 shadow-lg hover:shadow-xl font-semibold transition-all from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:via-rose-700 hover:to-orange-700 w-full">
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
        document.getElementById('searchInput').addEventListener('input', function() { currentPage = 1; renderCards(); });
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
                    filterBar.matches('plan', [IELTSX.isFreeItem(item) ? 'demo' : 'max']) &&
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
                            ${item.img ? `<img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-8 rounded-md px-3 text-xs bg-gradient-to-r text-white border-0 shadow-lg hover:shadow-xl font-semibold transition-all from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:via-rose-700 hover:to-orange-700 w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown w-3.5 h-3.5 mr-1">
                                        <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                                        <path d="M5 21h14" />
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
        document.getElementById('searchInput').addEventListener('input', function() { currentPage = 1; renderCards(); });
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
        renderCards();
    
  };

  pages['articles'] = function () {
      // ---- articles.js ----
        // ----- DISABLE CONTEXT MENU -----
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // ----- DOM refs -----
        const sidebarContainer = document.getElementById('mainSidebarContainer');
        const sidebarRoot = document.getElementById('main-sidebar-root');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const overlay = document.getElementById('sidebarOverlay');
        const railBtn = document.querySelector('[data-sidebar="rail"]');

        // ----- THEME: handled by IELTSX.theme (light / dark / system) -----
        document.addEventListener('ieltsx:themechange', function() {
            renderArticles();
            renderLiveFeed();
        });

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

        // ----- ARTICLES DATA -----
        const articlesData = [
            { id: 1, title: "The Spinning Jenny", passage: "Passage 1", topic: "History", date: "2025-04-10",
                image: "https://static-image.ieltsx.com/articles/spinning-jenny-original.avif",
                description: "An account of how James Hargreaves' invention of the spinning jenny transformed the textile industry and catalyzed the shift from home-based cottage industries to factory-based production.",
                href: "article1.html" },
            { id: 2, title: "How to clean a beach", passage: "Passage 1", topic: "History",
                date: "2025-04-01", image: "/article/images/how to clean a beach.jpg",
                description: "As oil-spill specialists continue to tackle the Prestige slick, they are drawing on",
                href: "/collections/article-1.html" },
            { id: 3, title: "Great Apes and the Push for Legal Rights", passage: "Passage 1", topic: "History",
                date: "2025-04-15", image: "/article/images/Great Apes and the Push for Legal Rights.jpg",
                description: "Calls to grant basic legal rights to great apes have grown louder in recent decades.",
                href: "/collections/article-2.html" },
            { id: 4, title: "Climate Change and Rising Seas", passage: "Passage 3", topic: "Environment",
                date: "2025-04-12", image: "article4.png",
                description: "Analysis of melting ice caps and the potential impact on coastal megacities worldwide.",
                href: "article4.html" },
            { id: 5, title: "The Future of Renewable Energy", passage: "Passage 2", topic: "Science",
                date: "2025-03-28", image: "article5.png",
                description: "Solar, wind, and battery technologies driving the green transition.",
                href: "article5.html" },
            { id: 6, title: "Lake Bosumtwi – the secrets of a crater lake", passage: "Passage 3", topic: "History",
                date: "2025-03-20", image: "article6.jpg",
                description: "A major scientific project led by Earth Sciences professor Christopher Scholz represents the first large-scale investigation of Lake Bosumtwi in Ghana",
                href: "article6.html" },
            { id: 7, title: "Halley VI Research Station, Antarctica", passage: "Passage 2", topic: "Science", date: "2026-05-17",
                image: "/article/images/Halley VI Research Station, Antarctica.jpg",
                description: "The British Antarctic Survey’s new research station at Halley Bay is a portable pod structure that uses scent, colour and curves to take the edge off the world’s longest winter.",
                href: "/collections/article-5.html" },
            { id: 8, title: "Lever Brothers’ Sunlight Soap", passage: "Passage 1", topic: "History", date: "2026-05-17",
                image: "/article/images/Lever Brothers’ Sunlight Soap.jpg",
                description: "The history of Sunlight Soap and its influence on hygiene, industrial production, marketing, public health, social responsibility, and global consumer culture.",
                href: "/collections/article-3.html" },
            { id: 9, title: "Catch of the Day (GM Fish)", passage: "Passage 2", topic: "Technology",
                date: "2026-05-17", image: "article9.jpg",
                description: "As the global population grows, the amount of fish consumed by people worldwide has increased steadily.",
                href: "article9.html" },
            { id: 10, title: "Leo Burnett: Sultan Of Sell", passage: "Passage 1", topic: "History",
                date: "2026-05-17", image: "/article/images/Leo Burnett Sultan Of Sell.jpg",
                description: "How the Chicago adman who created the Marlboro Man, the Jolly Green Giant and Tony the Tiger reshaped modern advertising through the power of visual imagery.",
                href: "/collections/article-6.html" },
            { id: 11, title: "Strange symbols may rewrite history", passage: "Passage 2", topic: "Science",
                date: "2026-05-17", image: "article11.png",
                description: "STONE Age people 40,000 years ago used a simple form of writing comparable in complexity to the earliest stages of the world's",
                href: "article11.html" },
            { id: 12, title: "Brain Preservation & CryonicsHuge leap for brain preservation", passage: "Passage 3",
                topic: "Science", date: "2026-05-17", image: "article12.png",
                description: "AN ENTIRE mammalian brain has been successfully preserved using a technique that will now be offered",
                href: "article12.html" },
            { id: 13, title: " History of the SS Yongala", passage: "Passage 1", topic: "History",
                date: "2026-05-17", image: "/article/images/History of the SS Yongala.jpg",
                description: "The final voyage of the luxury steamliner SS Yongala, its mysterious disappearance, the long search for answers, and its transformation into one of Australia’s greatest dive sites.",
                href: "/collections/article-4.html" },
        ];

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
            container.innerHTML = filtered.map(art =>
                `
                    <a href="${art.href || '#'}" class="group rounded-xl border text-card-foreground flex h-full min-h-[390px] cursor-pointer flex-col overflow-hidden border-border/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg" style="text-decoration: none; color: inherit; background: var(--bg-card); border-color: var(--border-color);">
                        <div class="relative h-52 overflow-hidden">
                            <img src="${art.image}" alt="${art.title}" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"></div>
                            <div class="flex flex-wrap gap-2 absolute left-4 top-4">
                                <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow border-white/30 bg-white/90 text-slate-900" style="background: var(--bg-card); color: var(--text-primary);">${art.passage}</span>
                                <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow border-white/20 bg-slate-950/55 text-white backdrop-blur">${art.topic}</span>
                            </div>
                        </div>
                        <div class="flex flex-col p-6 pb-3"><div class="font-semibold line-clamp-2 text-xl leading-snug" style="color: var(--text-primary);">${art.title}</div></div>
                        <div class="p-6 pt-0 pb-4"><div class="text-muted-foreground line-clamp-3 text-base leading-7" style="color: var(--text-secondary);">${art.description}</div></div>
                        <div class="flex items-center p-6 mt-auto px-6 pb-5 pt-0"><span class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-800">Read article<svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span></div>
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
        document.getElementById('searchInput').addEventListener('input', renderArticles);
        document.getElementById('searchBtn').addEventListener('click', renderArticles);
        document.getElementById('passageSelect').addEventListener('change', renderArticles);
        document.getElementById('topicSelect').addEventListener('change', renderArticles);
        document.getElementById('sortSelect').addEventListener('change', renderArticles);

        // Initial renders
        renderArticles();
        renderLiveFeed();
        activateTab('passages');

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
                alert('Logged out (demo)');
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
        let totalSeconds = (2 * 86400) + (0 * 3600) + (21 * 60) + 55;
        const daysSpan = document.getElementById('daysLeft');
        const hoursSpan = document.getElementById('hoursLeft');
        const minutesSpan = document.getElementById('minutesLeft');
        const secondsSpan = document.getElementById('secondsLeft');
        function updateCountdown() {
            if (!daysSpan) return;
            let remaining = totalSeconds;
            if (remaining < 0) remaining = 0;
            const days = Math.floor(remaining / 86400);
            const hours = Math.floor((remaining % 86400) / 3600);
            const mins = Math.floor((remaining % 3600) / 60);
            const secs = remaining % 60;
            daysSpan.innerText = String(days).padStart(2, '0');
            hoursSpan.innerText = String(hours).padStart(2, '0');
            minutesSpan.innerText = String(mins).padStart(2, '0');
            secondsSpan.innerText = String(secs).padStart(2, '0');
            if (remaining > 0) totalSeconds--;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
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
            let totalSeconds = (2 * 86400) + (23 * 3600) + (24 * 60) + 53;
            const daysSpan = document.getElementById('daysLeft');
            const hoursSpan = document.getElementById('hoursLeft');
            const minutesSpan = document.getElementById('minutesLeft');
            const secondsSpan = document.getElementById('secondsLeft');

            function updateCountdown() {
                if (!daysSpan) return;
                let remaining = totalSeconds;
                if (remaining < 0) remaining = 0;
                const days = Math.floor(remaining / 86400);
                const hours = Math.floor((remaining % 86400) / 3600);
                const mins = Math.floor((remaining % 3600) / 60);
                const secs = remaining % 60;
                daysSpan.innerText = String(days).padStart(2, '0');
                hoursSpan.innerText = String(hours).padStart(2, '0');
                minutesSpan.innerText = String(mins).padStart(2, '0');
                secondsSpan.innerText = String(secs).padStart(2, '0');
                if (remaining > 0) totalSeconds--;
            }

            updateCountdown();
            setInterval(updateCountdown, 1000);
        })();
    
  };

  /* =====================================================================
   * 3) PAGE ROUTER — runs only the module that belongs to this page
   * ===================================================================== */
  function detectPage() {
    var file = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '').toLowerCase();
    if (file === '') file = 'index';
    if (pages[file]) return file;

    var $ = function (s) { return document.querySelector(s); };
    if ($('#sidebar-mount-point')) return 'index';
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