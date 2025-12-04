/* Auth service
 * - Default base URL is read from NEXT_PUBLIC_API_BASE (client-side env)
 * - Provides register/login/me helpers that call /api/auth/* on the configured base
 * - Sends cookies using `credentials: 'include'` so server-set cookies are preserved
 */

import { request as httpRequest, get as httpGet, post as httpPost, put as httpPut, del as httpDel, setBaseUrl as setHttpBaseUrl } from './http'

let _authToken = null;

export function setBaseUrl(url) {
  setHttpBaseUrl(url)
}

export function setAuthToken(token) {
  _authToken = token;
}

export function clearAuthToken() {
  _authToken = null;
}

function authHeaders() {
  return _authToken ? { Authorization: `Bearer ${_authToken}` } : undefined
}

async function post(path, body = null, { baseUrl } = {}) {
  return httpPost(path, body, { baseUrl, headers: authHeaders() })
}

async function get(path, opts = {}) {
  const { baseUrl } = opts || {}
  return httpGet(path, { baseUrl, headers: authHeaders() })
}

async function put(path, body = null, opts = {}) {
  const { baseUrl } = opts || {}
  return httpPut(path, body, { baseUrl, headers: authHeaders() })
}

async function del(path, opts = {}) {
  const { baseUrl } = opts || {}
  return httpDel(path, { baseUrl, headers: authHeaders() })
}

export async function register(payload, opts = {}) {
  return post('/api/auth/register', payload, opts);
}

export async function login(payload, opts = {}) {
  return post('/api/auth/login', payload, opts);
}

export async function me(opts = {}) {
  return get('/api/auth/me', opts);
}

export async function logout(opts = {}) {
  try {
    await post('/api/auth/logout', null, opts);
  } finally {
    // Clear local token regardless of server response
    clearAuthToken();
    // If running in the browser, redirect to login page so user is sent to auth flow.
    if (typeof window !== 'undefined') {
      try {
        window.location.href = '/login'
      } catch (e) {
        // ignore
      }
    }
  }
}

export default { setAuthToken, setBaseUrl, clearAuthToken, register, login, me };
