(function (window) {
  'use strict';

  const RESULTS_KEY = 'ieltsx_results_v1';
  const LEGACY_RESULTS_KEYS = ['ieltsx_results', 'ieltsx_test_results'];

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '');
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function titleCase(value) {
    const text = String(value || '').trim().toLowerCase();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  function average(values) {
    const numbers = values.map(Number).filter(Number.isFinite);
    return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
  }

  function sectionName(value) {
    const text = titleCase(value);
    return ['Listening', 'Reading', 'Writing', 'Speaking'].includes(text) ? text : text || 'Practice';
  }

  function bucketName(value) {
    return String(value || '').trim().toLowerCase() === 'mock' ? 'Mock' : 'Practice';
  }

  function normalizeResult(result) {
    const raw = result && typeof result === 'object' ? result : {};
    const total = Number(raw.scoreTotal ?? raw.total ?? raw.questions ?? 0);
    const correct = Number(raw.scoreCorrect ?? raw.correct ?? raw.score ?? 0);
    const calculatedBand = total > 0 ? Math.max(0, Math.min(9, (correct / total) * 9)) : 0;
    const date = new Date(raw.createdAt || raw.date || Date.now());

    return {
      id: String(raw.id || `${date.getTime()}-${Math.random().toString(36).slice(2, 8)}`),
      userEmail: String(raw.userEmail || raw.email || '').trim().toLowerCase(),
      section: sectionName(raw.section || raw.skill || raw.type),
      bucket: bucketName(raw.bucket || raw.testType || raw.category),
      pageLabel: String(raw.pageLabel || raw.testName || raw.title || 'Practice test'),
      scoreCorrect: Number.isFinite(correct) ? correct : 0,
      scoreTotal: Number.isFinite(total) ? total : 0,
      band: Number.isFinite(Number(raw.band)) ? Number(raw.band) : calculatedBand,
      createdAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
    };
  }

  function getResults() {
    const current = readJson(RESULTS_KEY, []);
    const legacy = LEGACY_RESULTS_KEYS.flatMap((key) => readJson(key, []));
    return [...(Array.isArray(current) ? current : []), ...(Array.isArray(legacy) ? legacy : [])]
      .map(normalizeResult)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  function getCurrentUser() {
    const stored = readJson('ieltsx_current_user_v1', null) || readJson('ieltsx_current_user', null);
    const email = String((stored && stored.email) || localStorage.getItem('ieltsx_logged_in_email') || localStorage.getItem('userEmail') || '').trim().toLowerCase();
    return stored && typeof stored === 'object' ? { ...stored, email: stored.email || email } : (email ? { email } : null);
  }

  function getCurrentUserResults() {
    const user = getCurrentUser();
    const email = String(user && user.email || '').toLowerCase();
    return email ? getResults().filter((result) => result.userEmail === email) : [];
  }

  function getSectionResults(results, section) {
    return (Array.isArray(results) ? results : []).filter((result) => result.section === sectionName(section));
  }

  function getBucketResults(results, bucket) {
    return (Array.isArray(results) ? results : []).filter((result) => result.bucket === bucketName(bucket));
  }

  function getAverageBand(results, section) {
    const scoped = section ? getSectionResults(results, section) : (Array.isArray(results) ? results : []);
    return average(scoped.map((result) => result.band));
  }

  function formatBand(value) {
    return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '—';
  }

  function getActivity(results) {
    const days = [];
    const counts = new Map();
    (Array.isArray(results) ? results : []).forEach((result) => {
      const key = String(result.createdAt || '').slice(0, 10);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 363);
    for (let offset = 0; offset < 364; offset += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const key = date.toISOString().slice(0, 10);
      days.push({ date: key, dayOfWeek: date.getDay(), count: counts.get(key) || 0 });
    }
    return days;
  }

  function getSummary(results) {
    const list = Array.isArray(results) ? results : [];
    return {
      totalTests: list.length,
      activeDays: new Set(list.map((result) => String(result.createdAt || '').slice(0, 10)).filter(Boolean)).size
    };
  }

  function saveResult(result) {
    const saved = readJson(RESULTS_KEY, []);
    const entry = normalizeResult({ ...result, userEmail: result && result.userEmail || getCurrentUser()?.email || '' });
    localStorage.setItem(RESULTS_KEY, JSON.stringify([entry, ...(Array.isArray(saved) ? saved : [])]));
    window.dispatchEvent(new CustomEvent('ieltsx:results-changed', { detail: { result: entry } }));
    return entry;
  }

  window.IELTSXData = {
    average,
    formatBand,
    getActivity,
    getAverageBand,
    getBucketResults,
    getCurrentUser,
    getCurrentUserResults,
    getResults,
    getSectionResults,
    getSummary,
    saveResult,
    titleCase
  };
})(window);
