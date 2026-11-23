// Client for the Sentiscope FastAPI backend (see /backend).
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'sentiscope_tokens';

export class ApiError extends Error {
  constructor(type, message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.type = type;      // INVALID_URL | COMMENTS_DISABLED | EMAIL_TAKEN | UNAUTHORIZED | ...
    this.status = status;
  }
}

// ─── Token storage ───────────────────────────────────────────────────────────
// Stored in localStorage (simple; readable by any script on the page, so keep the site free of XSS).
export const tokens = {
  get() {
    try { return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null; } catch { return null; }
  },
  set(pair) {
    try { localStorage.setItem(TOKEN_KEY, JSON.stringify({ access: pair.access_token, refresh: pair.refresh_token })); } catch { /* ignore */ }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  },
};

// AuthContext registers this so a dead session logs the user out everywhere in the UI.
let onSessionExpired = () => {};
export const setSessionExpiredHandler = (fn) => { onSessionExpired = fn; };

// ─── Core request ────────────────────────────────────────────────────────────
async function rawFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const t = tokens.get();
  if (auth && t?.access) headers.Authorization = `Bearer ${t.access}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError('SERVER_UNREACHABLE', `Server not connected — can't reach ${BASE}. Start the backend and try again.`);
  }

  let data = null;
  try { data = await res.json(); } catch { /* empty / non-JSON body */ }

  if (!res.ok) {
    const detail = data?.detail;
    if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
      throw new ApiError(detail.type || 'API_ERROR', detail.message || 'Request failed', res.status);
    }
    if (Array.isArray(detail)) {   // FastAPI validation error (422)
      throw new ApiError('VALIDATION', detail.map((d) => d.msg).join('; '), res.status);
    }
    throw new ApiError('API_ERROR', typeof detail === 'string' ? detail : `Request failed (${res.status})`, res.status);
  }
  return data;
}

let refreshing = null;   // one refresh at a time, shared by concurrent requests

async function refreshSession() {
  const t = tokens.get();
  if (!t?.refresh) throw new ApiError('UNAUTHORIZED', 'Please sign in again.', 401);
  if (!refreshing) {
    refreshing = rawFetch('/api/v1/auth/refresh', { method: 'POST', body: { refresh_token: t.refresh }, auth: false })
      .then((session) => { tokens.set(session); return session; })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

async function request(path, options = {}) {
  try {
    return await rawFetch(path, options);
  } catch (err) {
    const canRefresh = options.auth !== false && err.status === 401 && err.type === 'TOKEN_EXPIRED';
    if (!canRefresh) {
      if (options.auth !== false && err.status === 401 && err.type === 'UNAUTHORIZED') onSessionExpired();
      throw err;
    }
    try {
      await refreshSession();
    } catch (refreshErr) {
      tokens.clear();
      onSessionExpired();
      throw refreshErr;
    }
    return rawFetch(path, options);        // retry once with the new access token
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────
const saveSession = (session) => { tokens.set(session); return session.user; };

export const auth = {
  register: async (name, email, password) =>
    saveSession(await request('/api/v1/auth/register', { method: 'POST', body: { name, email, password }, auth: false })),
  login: async (email, password) =>
    saveSession(await request('/api/v1/auth/login', { method: 'POST', body: { email, password }, auth: false })),
  google: async (credential) =>
    saveSession(await request('/api/v1/auth/google', { method: 'POST', body: { credential }, auth: false })),
  me: () => request('/api/v1/auth/me'),
  updateName: (name) => request('/api/v1/auth/me', { method: 'PATCH', body: { name } }),
  changePassword: async (current_password, new_password) =>
    saveSession(await request('/api/v1/auth/change-password', { method: 'POST', body: { current_password, new_password } })),
  logoutAll: () => request('/api/v1/auth/logout-all', { method: 'POST' }),
  hasTokens: () => !!tokens.get()?.access,
};

// ─── Public ──────────────────────────────────────────────────────────────────
export const getConfig = () => request('/api/v1/config', { auth: false });
export const sendContact = (name, email, message) =>
  request('/api/v1/contact', { method: 'POST', body: { name, email, message } });   // sends the token if signed in

// ─── Signed-in features ──────────────────────────────────────────────────────
export const getSavedReport = (videoId) => request(`/api/v1/history/${encodeURIComponent(videoId)}`);
export const getHistory = () => request('/api/v1/videos').then((r) => r.videos);
export const deleteFromHistory = (videoId) => request(`/api/v1/videos/${encodeURIComponent(videoId)}`, { method: 'DELETE' });
export const clearHistory = () => request('/api/v1/videos', { method: 'DELETE' });

export const startAnalysis = (url, options = {}) =>
  request('/api/v1/analyze-url', { method: 'POST', body: { url, ...options } });
export const getJobStatus = (jobId) => request(`/api/v1/status/${encodeURIComponent(jobId)}`);
export const getReport = (videoId, comments = 50) =>
  request(`/api/v1/report/${encodeURIComponent(videoId)}?comments=${comments}`);
export const getComments = (videoId, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/v1/comments/${encodeURIComponent(videoId)}${qs ? `?${qs}` : ''}`);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls the job until it finishes. Resolves with the final status, throws ApiError on failure. */
export async function waitForJob(jobId, { onProgress, intervalMs = 1500, timeoutMs = 10 * 60 * 1000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let networkErrors = 0;

  while (Date.now() < deadline) {
    let status;
    try {
      status = await getJobStatus(jobId);
      networkErrors = 0;
    } catch (err) {
      if (err.type === 'SERVER_UNREACHABLE' && ++networkErrors < 4) {   // brief blip while the server is busy
        await sleep(intervalMs);
        continue;
      }
      throw err;
    }

    onProgress?.(status);

    if (status.status === 'COMPLETED') return status;
    if (status.status === 'FAILED') {
      throw new ApiError(status.error_type || 'INTERNAL', status.error_message || 'The analysis failed.');
    }
    await sleep(intervalMs);
  }
  throw new ApiError('TIMEOUT', 'The analysis is taking longer than expected. Please try again.');
}

// ─── Inline errors ───────────────────────────────────────────────────────────
const FRIENDLY = {
  INVALID_URL: "That doesn't look like a valid YouTube link. Use a URL like https://www.youtube.com/watch?v=… or https://youtu.be/…",
  COMMENTS_DISABLED: 'Comments are turned off for this video, so there is nothing to analyze.',
  NO_COMMENTS: 'This video has no public comments to analyze yet.',
  VIDEO_NOT_FOUND: 'That video was not found. It may be private or removed.',
  RATE_LIMIT: 'YouTube is limiting requests right now. Please try again in a few minutes.',
  TIMEOUT: 'The analysis is taking longer than expected. Please try again.',
};

/** Maps any error to { type, message } — the short text shown under the Analyze button. */
export function toErrorState(err) {
  const type = err?.type || 'INTERNAL';
  return { type, message: FRIENDLY[type] || err?.message || 'Something went wrong. Please try again.' };
}
