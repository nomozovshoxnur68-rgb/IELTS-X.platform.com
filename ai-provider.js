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
     AI_MODEL        a Gemini model, default gemini-flash-latest (Google's alias for its current Flash model)
     AI_TIMEOUT_MS   how long one AI call may take (default 50 s on Vercel, 120 s elsewhere)
     GEMINI_API_BASE only for the self-test (a local stand-in for the Gemini API)
   ==== */

class AiError extends Error {
  constructor(status, message, code) { super(message); this.status = status; this.code = code || 'ai'; }
}

const env = (k, d) => String(process.env[k] == null || process.env[k] === '' ? d : process.env[k]).trim();
const PROVIDER = () => env('AI_PROVIDER', 'gemini').toLowerCase();
const MODEL = () => env('AI_MODEL', PROVIDER() === 'mock' ? 'mock' : 'gemini-flash-latest');
const BASE = () => env('GEMINI_API_BASE', 'https://generativelanguage.googleapis.com').replace(/\/+$/, '');
const KEY = () => env('GEMINI_API_KEY', '');
const TIMEOUT = () => Math.max(1000, Number(env('AI_TIMEOUT_MS', process.env.VERCEL ? 50000 : 120000)) || 50000);

function configured() {
  const provider = PROVIDER(), model = MODEL();
  if (provider === 'mock') return { ok: true, provider, model, mock: true };
  if (provider !== 'gemini') return { ok: false, provider, model, problem: `AI_PROVIDER "${provider}" is not supported. Use "gemini".` };
  if (!KEY()) return { ok: false, provider, model, problem: 'The AI is not set up yet: add GEMINI_API_KEY (from https://aistudio.google.com/apikey) to the server environment — on Vercel: Settings → Environment Variables — then redeploy.' };
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
async function fail(r) {
  const j = await r.json().catch(() => ({})); const e = (j && j.error) || {};
  const msg = String(e.message || '').replace(/key=[^&\s]+/gi, 'key=…').slice(0, 300); const st = String(e.status || '');
  if (r.status === 400 && /api key|API_KEY_INVALID/i.test(msg + st + JSON.stringify(e.details || ''))) return new AiError(503, 'Gemini refused the API key. Check GEMINI_API_KEY in the server environment (it must be a Gemini API key from https://aistudio.google.com/apikey).', 'key');
  if (r.status === 401 || r.status === 403) return new AiError(503, 'Gemini refused the request (' + (st || r.status) + '). Check that GEMINI_API_KEY is valid and that the Gemini API is enabled for its project.', 'key');
  if (r.status === 404) return new AiError(503, `The AI model "${MODEL()}" was not found. Set AI_MODEL to a current Gemini Flash model (for example gemini-2.5-flash) and redeploy.`, 'model');
  if (r.status === 429) return new AiError(429, 'The Gemini rate limit or quota was reached. Wait a minute and try again, or check the quota / billing of the API key.', 'quota');
  if (r.status === 413) return new AiError(413, 'The file or text is too large for the AI. Use a shorter text, or one section of the recording.', 'size');
  if (r.status >= 500) return new AiError(502, 'Gemini is busy or had an error (' + r.status + '). Please try again in a moment.', 'busy');
  return new AiError(502, 'Gemini could not process the request: ' + (msg || 'error ' + r.status), 'bad-request');
}
const headers = (extra) => ({ 'x-goog-api-key': KEY(), ...(extra || {}) });

async function geminiGenerate({ system, parts, schema, maxOutputTokens, timeoutMs }) {
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: parts.map((p) => (p.file ? { file_data: { mime_type: p.file.mimeType, file_uri: p.file.uri } } : { text: p.text })) }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.2, maxOutputTokens: maxOutputTokens || 16384 }
  };
  const url = `${BASE()}/v1beta/models/${encodeURIComponent(MODEL())}:generateContent`;
  let r = await call(url, { method: 'POST', headers: headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }, timeoutMs || TIMEOUT());
  // one more try after a short wait when Gemini is momentarily busy (never for errors that would only repeat)
  if (r.status === 503 || r.status === 500) { await new Promise((ok) => setTimeout(ok, 1500)); r = await call(url, { method: 'POST', headers: headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }, timeoutMs || TIMEOUT()); }
  if (!r.ok) throw await fail(r);
  const j = await r.json().catch(() => null);
  if (!j) throw new AiError(502, 'Gemini sent an answer that could not be read.', 'malformed');
  if (j.promptFeedback && j.promptFeedback.blockReason) throw new AiError(422, 'Gemini declined this material (' + j.promptFeedback.blockReason + ').', 'blocked');
  const c = (j.candidates || [])[0] || {};
  const reason = String(c.finishReason || '');
  if (reason === 'RECITATION') throw new AiError(422, 'Gemini stopped because the answer would copy long parts of a published text. The passage is kept from your PDF; ask for fewer questions, or one passage at a time.', 'recitation');
  if (reason === 'SAFETY' || reason === 'PROHIBITED_CONTENT' || reason === 'BLOCKLIST') throw new AiError(422, 'Gemini declined this material (' + reason + ').', 'blocked');
  const text = ((c.content && c.content.parts) || []).map((p) => p.text || '').join('');
  if (reason === 'MAX_TOKENS') throw new AiError(422, 'The AI answer was too long and was cut off. Ask for fewer questions, or one passage / section at a time.', 'too-long');
  return { json: parseJson(text), usage: j.usageMetadata || null };
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
  if (!start.ok) throw await fail(start);
  const upUrl = start.headers.get('x-goog-upload-url'); if (!upUrl) throw new AiError(502, 'Gemini did not accept the file upload.', 'upload');
  const up = await call(upUrl, { method: 'POST', headers: { 'Content-Length': String(data.length), 'X-Goog-Upload-Offset': '0', 'X-Goog-Upload-Command': 'upload, finalize' }, body: data }, ms);
  if (!up.ok) throw await fail(up);
  let file = ((await up.json().catch(() => ({}))) || {}).file;
  if (!file || !file.uri || !file.name) throw new AiError(502, 'Gemini did not return the uploaded file.', 'upload');
  // audio is processed before it can be used: wait for it (a few seconds), within the time we have
  const until = Date.now() + Math.min(ms, 30000);
  while (file.state === 'PROCESSING' && Date.now() < until) {
    await new Promise((ok) => setTimeout(ok, 1500));
    const g = await call(`${BASE()}/v1beta/${file.name}`, { headers: headers() }, 10000);
    if (!g.ok) throw await fail(g);
    file = await g.json();
  }
  if (file.state === 'FAILED') throw new AiError(422, 'Gemini could not read this file. Use an MP3 or WAV recording (or a PDF for documents).', 'file');
  if (file.state === 'PROCESSING') throw new AiError(504, 'Gemini is still preparing the file. Try again in a minute.', 'timeout');
  return { name: file.name, uri: file.uri, mimeType: file.mimeType || mimeType };
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
