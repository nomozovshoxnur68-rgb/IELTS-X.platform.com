'use strict';
/* ====
   ai-provider.js -- the AI service behind the admin panel's AI Test Generator (ai-generator.js) and the students' AI check of Writing and Speaking (ai-examiner.js).

   One small interface, so another provider can be added later without touching the generator:
     configured()                              -> { ok, provider, model, problem }
     generateJson({ system, parts, schema })   -> the parsed JSON answer (parts: { text }, { file: handle } or { inline: { mimeType, data: base64 } })
     uploadFile({ data, mimeType, name })      -> handle (an audio / PDF file the model can read)
     deleteFile(handle)                        -> removes it again (temporary files are not kept)

   Settings (server environment only; the key is never sent to a browser):
     AI_PROVIDER     openai (default) | gemini | mock (no key needed: placeholder questions, for trying the panel and for tests)
     OPENAI_API_KEY  the key from https://platform.openai.com/api-keys
     GEMINI_API_KEY  the key from https://aistudio.google.com/apikey (AI_PROVIDER=gemini)
     AI_MODEL        the model that writes the answers. Unset = gpt-6-luna, then gpt-5.6-luna if the key has no access to it
                     (with Gemini: gemini-3.8-flash, gemini-flash-latest, gemini-3.6-flash). A model set here is used alone.
     AI_AUDIO_MODEL  OpenAI: the model that hears a spoken answer and notes its pronunciation and fluency (default gpt-audio-1.5)
     AI_TRANSCRIBE_MODEL  OpenAI: the model that writes down a spoken answer (default gpt-transcribe)
     AI_THINKING     how much the model reasons before answering: low (default: fast enough for one serverless call), medium, high
     AI_TIMEOUT_MS   how long one AI call may take (default 50 s on Vercel, 120 s elsewhere)
     OPENAI_API_BASE, GEMINI_API_BASE  only for the self-test (a local stand-in for the API)

   The REST APIs are used directly, because the project has no npm packages:
     OpenAI (https://developers.openai.com/api/docs): /v1/responses for JSON answers, /v1/chat/completions for hearing audio
     (the Responses API takes no audio), /v1/audio/transcriptions for writing it down.
     Gemini (https://ai.google.dev/api/generate-content): v1beta generateContent + the Files API.
   ==== */

class AiError extends Error {
  constructor(status, message, code) { super(message); this.status = status; this.code = code || 'ai'; }
}

const env = (k, d) => String(process.env[k] == null || process.env[k] === '' ? d : process.env[k]).trim();
const OPENAI_KEY = () => env('OPENAI_API_KEY', '');
// GEMINI_API_KEY; GOOGLE_API_KEY (the other name Google's own libraries read) is taken when it is the only one
const KEY = () => env('GEMINI_API_KEY', '') || env('GOOGLE_API_KEY', '');
const PROVIDER = () => {
  const set = env('AI_PROVIDER', '').toLowerCase();
  if (set && !(set === 'gemini' && !KEY() && OPENAI_KEY())) return set;   // an old AI_PROVIDER=gemini with only an OpenAI key on the server: the key decides
  return KEY() && !OPENAI_KEY() ? 'gemini' : 'openai';
};
/* the models tried, in order: the one set in AI_MODEL, or the provider's recommended efficient models */
const DEFAULT_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.6-flash'];
const OPENAI_MODELS = ['gpt-6-luna', 'gpt-5.6-luna'];
let workingModel = '';                                    // the first model that answered (no more "not found" detours)
let openaiWorking = '';
const MODELS = () => (env('AI_MODEL', '') ? [env('AI_MODEL', '')] : DEFAULT_MODELS);
const OPENAI_SET = () => { const m = env('AI_MODEL', ''); return /^gemini/i.test(m) ? '' : m; };   // a Gemini name left in AI_MODEL means nothing to OpenAI
const MODEL = () => {
  const p = PROVIDER();
  if (p === 'mock') return 'mock';
  if (p === 'openai') return OPENAI_SET() || openaiWorking || OPENAI_MODELS[0];
  return env('AI_MODEL', '') || workingModel || DEFAULT_MODELS[0];
};
const THINKING = () => { const t = env('AI_THINKING', 'low').toLowerCase(); return ['minimal', 'low', 'medium', 'high'].includes(t) ? t : 'low'; };
let thinkingParamOk = true;                               // false once the API said it does not know thinkingLevel
const BASE = () => env('GEMINI_API_BASE', 'https://generativelanguage.googleapis.com').replace(/\/+$/, '');
/* why the key is not seen: the deployment environment and the NAMES (never the values) of look-alike variables */
function keyHint(name, alike) {
  const where = process.env.VERCEL_ENV ? ` This server is the Vercel "${process.env.VERCEL_ENV}" deployment: the variable must be enabled for that environment, and a new deployment is needed after adding it.` : '';
  if (process.env[name] != null && !String(process.env[name]).trim()) return ` ${name} exists but is empty.` + where;
  const similar = Object.keys(process.env).filter((k) => k !== name && alike.test(k)).slice(0, 5);
  return (similar.length ? ` Variables with a similar name were found: ${similar.join(', ')} — the name must be exactly ${name}.` : '') + where;
}
const TIMEOUT = () => Math.max(1000, Number(env('AI_TIMEOUT_MS', process.env.VERCEL ? 50000 : 120000)) || 50000);

function configured() {
  const provider = PROVIDER(), model = MODEL();
  if (provider === 'mock') return { ok: true, provider, model, mock: true };
  if (provider !== 'gemini' && provider !== 'openai') return { ok: false, provider, model, problem: `AI_PROVIDER "${provider}" is not supported. Use "openai".` };
  if (provider === 'openai' && !OPENAI_KEY()) return { ok: false, provider, model, problem: 'The AI is not set up yet: the server does not see OPENAI_API_KEY (from https://platform.openai.com/api-keys). On Vercel: Settings → Environment Variables, then redeploy.' + keyHint('OPENAI_API_KEY', /openai|open_ai|chatgpt/i) };
  if (provider === 'gemini' && !KEY()) return { ok: false, provider, model, problem: 'The AI is not set up yet: the server does not see GEMINI_API_KEY (from https://aistudio.google.com/apikey). On Vercel: Settings → Environment Variables, then redeploy.' + keyHint('GEMINI_API_KEY', /gemini|genai|google_?ai|google_?api_?key/i) };
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
    contents: [{ role: 'user', parts: parts.map((p) => (p.file ? { file_data: { mime_type: p.file.mimeType, file_uri: p.file.uri } } : p.inline ? { inline_data: { mime_type: p.inline.mimeType, data: p.inline.data } } : { text: p.text })) }],
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

/* ───────── OpenAI (REST, no packages) ───────── */
const OPENAI_BASE = () => env('OPENAI_API_BASE', 'https://api.openai.com').replace(/\/+$/, '');
const AUDIO_MODEL = () => env('AI_AUDIO_MODEL', 'gpt-audio-1.5');
const TRANSCRIBE_MODEL = () => env('AI_TRANSCRIBE_MODEL', 'gpt-transcribe');
const TIMED_MODEL = 'whisper-1';                          // the only model with timestamps in OpenAI's docs (Nov 2026); it shuts down on 26 Feb 2027, gpt-transcribe (no times) is the fallback
const MAX_SPEECH_BYTES = 25 * 1024 * 1024;                // the limit of the transcriptions endpoint
const SPEECH_FILE_EXT = { 'audio/mp3': 'mp3', 'audio/mpeg': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav', 'audio/m4a': 'm4a', 'audio/mp4': 'm4a', 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/flac': 'flac' };
const HEARD_FORMAT = { 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav', 'audio/mp3': 'mp3', 'audio/mpeg': 'mp3' };   // what input_audio takes
const SPEECH_PROMPT = 'An answer in an English speaking test. Write exactly what the speaker says, including mistakes, repetitions and false starts such as er and um. Do not correct anything.';
const noReasoningParam = new Set();                       // models whose API said it does not know the reasoning setting
const isAudio = (mime) => /^audio\//i.test(String(mime || ''));
const openaiHeaders = (extra) => ({ Authorization: 'Bearer ' + OPENAI_KEY(), ...(extra || {}) });
const dropNulls = (v) => (Array.isArray(v) ? v.map(dropNulls) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null).map(([k, x]) => [k, dropNulls(x)])) : v);

/* an OpenAI error -> a message an admin can act on (OpenAI repeats part of a wrong key in its message: never passed on) */
function openaiFail(status, text, model) {
  let j = {}; try { j = JSON.parse(text || '{}'); } catch (e) { /* not JSON */ }
  const e = (j && j.error) || {};
  const msg = String(e.message || '').replace(/sk-[\w*.\-]+/g, 'sk-…').slice(0, 300); const code = String(e.code || ''); const type = String(e.type || '');
  if (status === 401) return new AiError(503, 'OpenAI refused the API key. Check OPENAI_API_KEY in the server environment (a key from https://platform.openai.com/api-keys).', 'key');
  if (status === 404 || code === 'model_not_found' || (status === 403 && /\bmodel\b/i.test(msg))) return new AiError(503, `The AI model "${model || MODEL()}" is not available for this API key${msg ? ' (' + msg.slice(0, 120) + ')' : ''}. Set AI_MODEL to a current OpenAI model (for example ${OPENAI_MODELS[0]}) and redeploy.`, 'model');
  if (status === 403) return new AiError(503, 'OpenAI refused the request' + (msg ? ' (' + msg + ')' : '') + '. Check that this API key and its project may use the API.', 'key');
  if (status === 429 && (code === 'insufficient_quota' || type === 'insufficient_quota')) return new AiError(503, 'The OpenAI account has no credit left. A ChatGPT subscription does not include the API: add credit at https://platform.openai.com/settings/organization/billing and try again.', 'billing');
  if (status === 429) return new AiError(429, 'The OpenAI rate limit was reached. Wait a minute and try again, or check the limits of the API key.', 'quota');
  if (status === 413) return new AiError(413, 'The file or text is too large for the AI. Use a shorter text, or one section of the recording.', 'size');
  if (status >= 500) return new AiError(502, 'OpenAI is busy or had an error (' + status + '). Please try again in a moment.', 'busy');
  return new AiError(502, 'OpenAI could not process the request: ' + (msg || 'error ' + status), 'bad-request');
}
const openaiFailFrom = async (r, model) => openaiFail(r.status, await r.text().catch(() => ''), model);

/* strict structured outputs: every object closed, every key required, a key that may be left out becomes nullable (dropNulls takes it away again) */
function strictSchema(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return s;
  const o = { ...s };
  if (s.items) o.items = strictSchema(s.items);
  if (s.properties) {
    const need = new Set(s.required || []);
    o.properties = Object.fromEntries(Object.entries(s.properties).map(([k, v]) => {
      const p = strictSchema(v);
      return [k, need.has(k) ? p : { ...p, type: [p.type, 'null'], ...(p.enum ? { enum: [...p.enum, null] } : {}) }];
    }));
    o.required = Object.keys(s.properties);
    o.additionalProperties = false;
  }
  return o;
}

/* text, a picture or a PDF as a part of a Responses API request */
function responsesPart(p) {
  if (p.text !== undefined) return { type: 'input_text', text: p.text };
  const f = p.file ? { mimeType: p.file.mimeType, name: p.file.name, data: Buffer.from(p.file.data).toString('base64') } : p.inline;
  const url = `data:${f.mimeType};base64,${f.data}`;
  return /^image\//i.test(f.mimeType) ? { type: 'input_image', image_url: url } : { type: 'input_file', filename: f.name || 'document.pdf', file_data: url };
}
async function responsesWith(model, { system, parts, schema, maxOutputTokens }, ms) {
  const body = { model, instructions: system, input: [{ role: 'user', content: parts.map(responsesPart) }], store: false, max_output_tokens: maxOutputTokens || 16384,
    text: { format: { type: 'json_schema', name: 'ieltsx_answer', schema: strictSchema(schema), strict: true } } };
  if (!noReasoningParam.has(model)) body.reasoning = { effort: THINKING() === 'minimal' ? 'low' : THINKING() };
  const until = Date.now() + ms; const left = () => Math.max(1000, until - Date.now());
  const post = () => call(`${OPENAI_BASE()}/v1/responses`, { method: 'POST', headers: openaiHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }, left());
  let r = await post();
  if (r.status === 400 && body.reasoning) {      // a model set in AI_MODEL that does not reason: once more without it
    const txt = await r.text().catch(() => '');
    if (!/reasoning/i.test(txt)) throw openaiFail(400, txt, model);
    noReasoningParam.add(model); delete body.reasoning; r = await post();
  }
  // one more try after a short wait when OpenAI is momentarily busy (never for errors that would only repeat)
  if ((r.status === 503 || r.status === 500) && until - Date.now() > 4000) { await new Promise((ok) => setTimeout(ok, 1500)); r = await post(); }
  if (!r.ok) throw await openaiFailFrom(r, model);
  return r;
}
/* the text of a Responses API answer; whatever kept it from being complete becomes a clear message */
function responsesText(j) {
  if (j.status === 'failed') throw new AiError(502, 'OpenAI had an error while answering. Please try again in a moment.', 'busy');
  if (j.incomplete_details && j.incomplete_details.reason === 'content_filter') throw new AiError(422, 'OpenAI declined this material.', 'blocked');
  if (j.status === 'incomplete') throw new AiError(422, 'The AI answer was too long and was cut off. Ask for fewer questions, or one passage / section at a time.', 'too-long');
  const parts = (j.output || []).filter((x) => x && x.type === 'message').flatMap((x) => x.content || []);   // "reasoning" items are the model's thinking, not the answer
  if (parts.some((p) => p.type === 'refusal')) throw new AiError(422, 'OpenAI declined this material.', 'blocked');
  return parts.filter((p) => p.type === 'output_text').map((p) => p.text || '').join('');
}

/* writes a recording down (/v1/audio/transcriptions); timed = with the second each segment starts at */
async function speechToText(audio, { model, prompt, timed }, ms) {
  const ext = SPEECH_FILE_EXT[String(audio.mimeType || '').split(';')[0].trim().toLowerCase()];
  if (!ext) throw new AiError(415, 'OpenAI cannot read this recording format. Use an MP3 or WAV recording.', 'file');
  if (audio.data.length > MAX_SPEECH_BYTES) throw new AiError(413, 'OpenAI takes recordings of up to 25 MB. Use a shorter recording, or one section of it.', 'size');
  const form = new FormData();
  form.append('file', new Blob([audio.data], { type: audio.mimeType }), 'recording.' + ext);   // OpenAI reads the format from the name of the file
  form.append('model', model);
  if (/^gpt-transcribe/i.test(model)) form.append('languages[]', 'en'); else form.append('language', 'en');
  if (prompt) form.append('prompt', prompt);
  if (timed) { form.append('response_format', 'verbose_json'); form.append('timestamp_granularities[]', 'segment'); }
  const r = await call(`${OPENAI_BASE()}/v1/audio/transcriptions`, { method: 'POST', headers: openaiHeaders(), body: form }, ms);
  if (!r.ok) throw await openaiFailFrom(r, model);
  const j = await r.json().catch(() => null);
  if (!j || typeof j.text !== 'string') throw new AiError(502, 'OpenAI sent a transcript that could not be read.', 'malformed');
  return j;
}
/* a long recording (the Listening of the Test Generator): the model that answers cannot hear, so it works from a transcript with times */
async function timedTranscript(file, ms) {
  const audio = { data: Buffer.from(file.data), mimeType: file.mimeType };
  let j;
  try { j = await speechToText(audio, { model: TIMED_MODEL, timed: true }, ms); }
  catch (e) { if (e.code !== 'model') throw e; j = await speechToText(audio, { model: TRANSCRIBE_MODEL() }, ms); }
  const segs = Array.isArray(j.segments) ? j.segments.filter((s) => s && s.text) : [];
  if (!segs.length && !j.text.trim()) throw new AiError(422, 'The AI found no speech in this recording.', 'empty');
  const head = 'THE RECORDING, written down word for word by a speech-to-text model. You cannot hear it: work only from these words and do not change them.';
  return segs.length ? `${head} Each line starts with the second of the recording it begins at.\n${segs.map((s) => `[${Math.round(Number(s.start) || 0)}] ${String(s.text).trim()}`).join('\n')}`
    : `${head} The times are not known, so use 0 for every start.\n${j.text.trim()}`;
}

/* a short spoken answer: a model that really hears it gives the notes on the delivery (/v1/chat/completions: the Responses API takes no audio) */
async function hearSpeech(o, inline, ms) {
  const format = HEARD_FORMAT[inline.mimeType];
  if (!format) throw new AiError(415, 'The audio model takes only WAV or MP3.', 'file');
  const model = AUDIO_MODEL();
  const content = o.parts.map((p) => (p.inline ? { type: 'input_audio', input_audio: { data: inline.data, format } } : { type: 'text', text: p.text }));
  const body = { model, modalities: ['text'], store: false, max_completion_tokens: o.maxOutputTokens || 4000,
    messages: [{ role: 'system', content: `${o.system}\n\nAnswer with one JSON object only and no other text. It follows this JSON schema: ${JSON.stringify(o.schema)}` }, { role: 'user', content }] };
  const r = await call(`${OPENAI_BASE()}/v1/chat/completions`, { method: 'POST', headers: openaiHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) }, ms);
  if (!r.ok) throw await openaiFailFrom(r, model);
  const j = await r.json().catch(() => null);
  const m = j && j.choices && j.choices[0] && j.choices[0].message;
  if (!m) throw new AiError(502, 'OpenAI sent an answer that could not be read.', 'malformed');
  if (m.refusal) throw new AiError(422, 'OpenAI declined this material.', 'blocked');
  return dropNulls(parseJson(typeof m.content === 'string' ? m.content : (m.content || []).map((x) => (x && x.text) || '').join('')));
}
/* the words from the model made for writing speech down, the notes from the model that hears. Either one alone is still an answer:
   without the audio model the notes stay empty (nothing is made up), and the examiner then leaves pronunciation unmarked. */
async function openaiSpeech(o, inline, ms) {
  const [heard, words] = await Promise.allSettled([
    hearSpeech(o, inline, ms),
    speechToText({ data: Buffer.from(inline.data, 'base64'), mimeType: inline.mimeType }, { model: TRANSCRIBE_MODEL(), prompt: SPEECH_PROMPT }, ms)
  ]);
  if (heard.status === 'rejected' && words.status === 'rejected') throw words.reason;
  const blank = () => Object.fromEntries(Object.entries(o.schema.properties || {}).map(([k, v]) => [k, v.type === 'array' ? [] : v.type === 'boolean' ? false : '']));
  const json = heard.status === 'fulfilled' ? heard.value : blank();
  if (heard.status === 'rejected') console.error('AI: the audio model did not answer, so this recording has no notes on the delivery:', heard.reason.message);
  if (words.status === 'fulfilled' && words.value.text.trim()) json.transcript = words.value.text.trim();
  if (heard.status === 'rejected') json.noSpeech = !json.transcript;
  return { json, usage: null, model: heard.status === 'fulfilled' ? AUDIO_MODEL() : TRANSCRIBE_MODEL() };
}

async function openaiGenerate(o) {
  const ms = o.timeoutMs || TIMEOUT(); const until = Date.now() + ms;
  const spoken = o.parts.find((p) => p.inline && isAudio(p.inline.mimeType));
  if (spoken) return openaiSpeech(o, spoken.inline, ms);
  // a recording becomes its transcript; a picture or a PDF goes to the model as it is
  const parts = await Promise.all(o.parts.map(async (p) => (p.file && isAudio(p.file.mimeType) ? { text: await timedTranscript(p.file, until - Date.now()) } : p)));
  const fixed = OPENAI_SET();
  const models = fixed ? [fixed] : [openaiWorking].concat(OPENAI_MODELS).filter((m, i, a) => m && a.indexOf(m) === i);
  let r = null, last = null, used = '';
  for (const model of models) {
    if (until - Date.now() < 1500) break;
    try { r = await responsesWith(model, { ...o, parts }, until - Date.now()); used = model; if (!fixed) openaiWorking = model; break; }
    catch (e) { if (e.code === 'model' && !fixed) { last = e; continue; } throw e; }   // not available for this key: the next recommended model
  }
  if (!r) throw last || new AiError(504, 'The AI took too long to answer. Please try again.', 'timeout');
  const j = await r.json().catch(() => null);
  if (!j) throw new AiError(502, 'OpenAI sent an answer that could not be read.', 'malformed');
  return { json: dropNulls(parseJson(responsesText(j))), usage: j.usage || null, model: used };
}

/* ───────── mock: no AI at all, placeholder output with the right shape (trying the panel, self-test) ───────── */
async function mockGenerate({ parts, mock }) {
  if (typeof mock === 'function') return { json: mock(parts.map((p) => p.text || '').join('\n')), usage: null };
  throw new AiError(501, 'The mock AI provider has no answer for this request.', 'mock');
}

async function generateJson(o) {
  const c = configured(); if (!c.ok) throw new AiError(503, c.problem, 'config');
  return c.mock ? mockGenerate(o) : c.provider === 'openai' ? openaiGenerate(o) : geminiGenerate(o);
}
async function uploadFile(o) {
  const c = configured(); if (!c.ok) throw new AiError(503, c.problem, 'config');
  if (c.mock) return { name: 'files/mock', uri: 'mock://file', mimeType: o.mimeType };
  if (c.provider === 'openai') return { name: String(o.name || 'upload').slice(0, 100), mimeType: o.mimeType, data: o.data };   // the bytes go in the request itself: no copy to delete at OpenAI
  return geminiUpload(o);
}
async function deleteFile(h) { const c = configured(); if (c.mock || c.provider === 'openai') return; return geminiDelete(h); }

module.exports = { configured, generateJson, uploadFile, deleteFile, parseJson, AiError };
