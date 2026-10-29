'use strict';
/* ====
   ai-provider.js -- the AI service behind the admin panel's AI Test Generator (ai-generator.js).

   One small interface, so another provider can be added later without touching the generator:
     configured()                              -> { ok, provider, model, problem }
     generateJson({ system, parts, schema })   -> the parsed JSON answer (parts: { text } or { file: handle })
     uploadFile({ data, mimeType, name })      -> handle (an audio / PDF file the model can read)
     deleteFile(handle)                        -> removes it again (temporary files are not kept)

   Settings (server environment only; the key is never sent to a browser):
     AI_PROVIDER     gemini (default) | mock (no key needed: placeholder questions, for trying the panel and for tests)
     GEMINI_API_KEY  the key from https://aistudio.google.com/apikey
     AI_MODEL        a Gemini model. Unset = gemini-3.8-flash (Google's recommended Flash model, Oct 2026); if the key has
                     no access to it, gemini-flash-latest and gemini-3.6-flash are tried. A model set here is used alone.
     AI_THINKING     thinking level of Gemini 3 models: low (default: fast enough for one serverless call), medium, high
     AI_TIMEOUT_MS   how long one AI call may take (default 50 s on Vercel, 120 s elsewhere)
     GEMINI_API_BASE only for the self-test (a local stand-in for the Gemini API)

   The REST API of https://ai.google.dev/api/generate-content (v1beta generateContent + the Files API) is used directly:
   the project has no npm packages, and the official SDK (@google/genai) calls the same endpoints.
   ==== */

class AiError extends Error {
  constructor(status, message, code) { super(message); this.status = status; this.code = code || 'ai'; }
}

const env = (k, d) => String(process.env[k] == null || process.env[k] === '' ? d : process.env[k]).trim();
const PROVIDER = () => env('AI_PROVIDER', 'gemini').toLowerCase();
/* the models tried, in order: the one set in AI_MODEL, or Google's recommended Flash models */
const DEFAULT_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.6-flash'];
let workingModel = '';                                    // the first model that answered (no more "not found" detours)
const MODELS = () => (env('AI_MODEL', '') ? [env('AI_MODEL', '')] : DEFAULT_MODELS);
const MODEL = () => (PROVIDER() === 'mock' ? 'mock' : env('AI_MODEL', '') || workingModel || DEFAULT_MODELS[0]);
const THINKING = () => { const t = env('AI_THINKING', 'low').toLowerCase(); return ['minimal', 'low', 'medium', 'high'].includes(t) ? t : 'low'; };
let thinkingParamOk = true;                               // false once the API said it does not know thinkingLevel
const BASE = () => env('GEMINI_API_BASE', 'https://generativelanguage.googleapis.com').replace(/\/+$/, '');
// GEMINI_API_KEY; GOOGLE_API_KEY (the other name Google's own libraries read) is taken when it is the only one
const KEY = () => env('GEMINI_API_KEY', '') || env('GOOGLE_API_KEY', '');
/* why the key is not seen: the deployment environment and the NAMES (never the values) of look-alike variables */
function keyHint() {
  const where = process.env.VERCEL_ENV ? ` This server is the Vercel "${process.env.VERCEL_ENV}" deployment: the variable must be enabled for that environment, and a new deployment is needed after adding it.` : '';
  if (process.env.GEMINI_API_KEY != null && !String(process.env.GEMINI_API_KEY).trim()) return ' GEMINI_API_KEY exists but is empty.' + where;
  const similar = Object.keys(process.env).filter((k) => k !== 'GEMINI_API_KEY' && /gemini|genai|google_?ai|google_?api_?key/i.test(k)).slice(0, 5);
  return (similar.length ? ` Variables with a similar name were found: ${similar.join(', ')} — the name must be exactly GEMINI_API_KEY.` : '') + where;
}
const TIMEOUT = () => Math.max(1000, Number(env('AI_TIMEOUT_MS', process.env.VERCEL ? 50000 : 120000)) || 50000);

function configured() {
  const provider = PROVIDER(), model = MODEL();
  if (provider === 'mock') return { ok: true, provider, model, mock: true };
  if (provider !== 'gemini') return { ok: false, provider, model, problem: `AI_PROVIDER "${provider}" is not supported. Use "gemini".` };
  if (!KEY()) return { ok: false, provider, model, problem: 'The AI is not set up yet: the server does not see GEMINI_API_KEY (from https://aistudio.google.com/apikey). On Vercel: Settings → Environment Variables, then redeploy.' + keyHint() };
  if (!/^[a-z0-9][a-z0-9.\-_]*$/i.test(model)) return { ok: false, provider, model, problem: 'AI_MODEL has an invalid name.' };
  return { ok: true, provider, model };
}

/* ───────── Gemini (REST, no packages) ───────── */
async function call(url, opt, ms) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { ...opt, signal: ctl.signal }); }
  catch (e) {
    if (e && e.name === 'AbortError') throw new AiError(504, 'The AI took too long to answer. Try a shorter text, one section / passage at a time, or try again.', 'timeout');
    throw new AiError(502, 'The AI service could not be reached (' + ((e && e.message) || 'network error') + ').', 'network');
  } finally { clearTimeout(t); }
}
/* a Gemini error -> a message an admin can act on (the key itself never appears in it) */
function fail(status, text, model) {
  let j = {}; try { j = JSON.parse(text || '{}'); } catch (e) { /* not JSON */ }
  const e = (j && j.error) || {};
  const msg = String(e.message || '').replace(/key=[^&\s]+/gi, 'key=…').slice(0, 300); const st = String(e.status || '');
  const all = msg + ' ' + st + ' ' + JSON.stringify(e.details || '');
  if (status === 400 && /api key|API_KEY_INVALID|unrestricted/i.test(all)) return new AiError(503, 'Gemini refused the API key. Check GEMINI_API_KEY in the server environment (a Gemini API key from https://aistudio.google.com/apikey; Google rejects unrestricted standard keys).', 'key');
  // a model that does not exist, or that this key may not use
  if (status === 404 || (status === 403 && /\bmodel/i.test(msg))) return new AiError(503, `The AI model "${model || MODEL()}" is not available for this API key${msg ? ' (' + msg.slice(0, 120) + ')' : ''}. Set AI_MODEL to a current Gemini Flash model (for example gemini-3.8-flash) and redeploy.`, 'model');
  if (status === 401 || status === 403) return new AiError(503, 'Gemini refused the request (' + (st || status) + '). Check that GEMINI_API_KEY is valid and that the Gemini API is enabled for its project.', 'key');
  if (status === 429) return new AiError(429, 'The Gemini rate limit or quota was reached. Wait a minute and try again, or check the quota / billing of the API key.', 'quota');
  if (status === 413) return new AiError(413, 'The file or text is too large for the AI. Use a shorter text, or one section of the recording.', 'size');
  if (status >= 500) return new AiError(502, 'Gemini is busy or had an error (' + status + '). Please try again in a moment.', 'busy');
  return new AiError(502, 'Gemini could not process the request: ' + (msg || 'error ' + status), 'bad-request');
}
const failFrom = async (r, model) => fail(r.status, await r.text().catch(() => ''), model);
const headers = (extra) => ({ 'x-goog-api-key': KEY(), ...(extra || {}) });
/* the schema as the API reference writes it (OpenAPI subset): type names in capitals, OBJECT / STRING / ARRAY … */
function apiSchema(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return s;
  const o = {};
  for (const [k, v] of Object.entries(s)) {
    if (k === 'type' && typeof v === 'string') o[k] = v.toUpperCase();
    else if (k === 'items') o[k] = apiSchema(v);
    else if (k === 'properties' && v && typeof v === 'object') o[k] = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, apiSchema(pv)]));
    else o[k] = v;
  }
  return o;
}

/* one generateContent call with one model; Gemini 3 models get a low thinking level (fast enough for one serverless call) */
async function generateWith(model, { system, parts, schema, maxOutputTokens }, ms) {
  const gc = { responseMimeType: 'application/json', responseSchema: apiSchema(schema), temperature: 0.2, maxOutputTokens: maxOutputTokens || 16384 };
  if (/^gemini-3/i.test(model) && thinkingParamOk) gc.thinkingConfig = { thinkingLevel: THINKING() };
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: parts.map((p) => (p.file ? { file_data: { mime_type: p.file.mimeType, file_uri: p.file.uri } } : { text: p.text })) }],
    generationConfig: gc
  };
  const url = `${BASE()}/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const until = Date.now() + ms; const left = () => Math.max(1000, until - Date.now());
  const post = () => call(url, { method: 'POST', headers: headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }, left());
  let r = await post();
  if (r.status === 400 && gc.thinkingConfig) {   // an API version that does not know thinkingLevel: once more without it
    const txt = await r.text().catch(() => '');
    if (!/thinking/i.test(txt)) throw fail(400, txt, model);
    thinkingParamOk = false; delete gc.thinkingConfig; r = await post();
  }
  // one more try after a short wait when Gemini is momentarily busy (never for errors that would only repeat)
  if ((r.status === 503 || r.status === 500) && until - Date.now() > 4000) { await new Promise((ok) => setTimeout(ok, 1500)); r = await post(); }
  if (!r.ok) throw await failFrom(r, model);
  return r;
}
async function geminiGenerate(o) {
  const ms = o.timeoutMs || TIMEOUT(); const until = Date.now() + ms;
  const fixed = !!env('AI_MODEL', '');
  const models = fixed ? MODELS() : [workingModel].concat(DEFAULT_MODELS).filter((m, i, a) => m && a.indexOf(m) === i);
  let r = null, last = null, used = '';
  for (const model of models) {
    if (until - Date.now() < 1500) break;
    try { r = await generateWith(model, o, until - Date.now()); used = model; if (!fixed) workingModel = model; break; }
    catch (e) { if (e.code === 'model' && !fixed) { last = e; continue; } throw e; }   // not available for this key: the next recommended model
  }
  if (!r) throw last || new AiError(504, 'The AI took too long to answer. Please try again.', 'timeout');
  const j = await r.json().catch(() => null);
  if (!j) throw new AiError(502, 'Gemini sent an answer that could not be read.', 'malformed');
  if (j.promptFeedback && j.promptFeedback.blockReason) throw new AiError(422, 'Gemini declined this material (' + j.promptFeedback.blockReason + ').', 'blocked');
  const c = (j.candidates || [])[0] || {};
  const reason = String(c.finishReason || '');
  if (reason === 'RECITATION') throw new AiError(422, 'Gemini stopped because the answer would copy long parts of a published text. The passage is kept from your PDF; ask for fewer questions, or one passage at a time.', 'recitation');
  if (reason === 'SAFETY' || reason === 'PROHIBITED_CONTENT' || reason === 'BLOCKLIST') throw new AiError(422, 'Gemini declined this material (' + reason + ').', 'blocked');
  const text = ((c.content && c.content.parts) || []).filter((p) => !p.thought).map((p) => p.text || '').join('');   // "thought" parts are the model's reasoning, not the answer
  if (reason === 'MAX_TOKENS') throw new AiError(422, 'The AI answer was too long and was cut off. Ask for fewer questions, or one passage / section at a time.', 'too-long');
  return { json: parseJson(text), usage: j.usageMetadata || null, model: used };
}
/* the model answers JSON; anything else is reported, not guessed at */
function parseJson(text) {
  const t = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { const v = JSON.parse(t); if (v && typeof v === 'object') return v; } catch (e) { /* below */ }
  throw new AiError(502, 'The AI answer was not valid JSON, so nothing was changed. Please press Generate again.', 'malformed');
}

async function geminiUpload({ data, mimeType, name, timeoutMs }) {
  const ms = timeoutMs || TIMEOUT();
  const start = await call(`${BASE()}/upload/v1beta/files`, { method: 'POST', headers: headers({ 'X-Goog-Upload-Protocol': 'resumable', 'X-Goog-Upload-Command': 'start', 'X-Goog-Upload-Header-Content-Length': String(data.length), 'X-Goog-Upload-Header-Content-Type': mimeType, 'Content-Type': 'application/json' }), body: JSON.stringify({ file: { display_name: String(name || 'ieltsx-upload').slice(0, 100) } }) }, ms);
  if (!start.ok) throw await failFrom(start);
  const upUrl = start.headers.get('x-goog-upload-url'); if (!upUrl) throw new AiError(502, 'Gemini did not accept the file upload.', 'upload');
  const up = await call(upUrl, { method: 'POST', headers: { 'Content-Length': String(data.length), 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' }, body: data }, ms);
  if (!up.ok) throw await failFrom(up);
  let file = ((await up.json().catch(() => ({}))) || {}).file;
  if (!file || !file.uri || !file.name) throw new AiError(502, 'Gemini did not return the uploaded file.', 'upload');
  // audio is processed before it can be used: wait for it (a few seconds), within the time we have
  const until = Date.now() + Math.min(ms, 30000);
  while (file.state === 'PROCESSING' && Date.now() < until) {
    await new Promise((ok) => setTimeout(ok, 1500));
    const g = await call(`${BASE()}/v1beta/${file.name}`, { headers: headers() }, 10000);
    if (!g.ok) throw await failFrom(g);
    file = await g.json();
  }
  if (file.state === 'FAILED') throw new AiError(422, 'Gemini could not read this file. Use an MP3 or WAV recording (or a PDF for documents).', 'file');
  if (file.state === 'PROCESSING') throw new AiError(504, 'Gemini is still preparing the file. Try again in a minute.', 'timeout');
  return { name: file.name, uri: file.uri, mimeType: file.mimeType || file.mime_type || mimeType };
}
async function geminiDelete(h) {
  if (!h || !h.name) return;
  try { await call(`${BASE()}/v1beta/${h.name}`, { method: 'DELETE', headers: headers() }, 8000); } catch (e) { /* Gemini deletes files after 48 hours anyway */ }
}

/* ───────── mock: no AI at all, placeholder output with the right shape (trying the panel, self-test) ───────── */
async function mockGenerate({ parts, mock }) {
  if (typeof mock === 'function') return { json: mock(parts.map((p) => p.text || '').join('\n')), usage: null };
  throw new AiError(501, 'The mock AI provider has no answer for this request.', 'mock');
}

async function generateJson(o) {
  const c = configured(); if (!c.ok) throw new AiError(503, c.problem, 'config');
  return c.mock ? mockGenerate(o) : geminiGenerate(o);
}
async function uploadFile(o) {
  const c = configured(); if (!c.ok) throw new AiError(503, c.problem, 'config');
  return c.mock ? { name: 'files/mock', uri: 'mock://file', mimeType: o.mimeType } : geminiUpload(o);
}
async function deleteFile(h) { if (configured().mock) return; return geminiDelete(h); }

module.exports = { configured, generateJson, uploadFile, deleteFile, parseJson, AiError };
