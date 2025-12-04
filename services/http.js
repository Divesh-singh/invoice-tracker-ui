/* Generic HTTP helpers used by API services
 * - Default base URL read from NEXT_PUBLIC_API_BASE
 * - Exports: setBaseUrl, request, get, post, put, del
 */

// Default base URL (client-side) - can be overridden with setBaseUrl()
let _baseUrl = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE)
  ? String(process.env.NEXT_PUBLIC_API_BASE).replace(/\/$/, '')
  : '';

export function setBaseUrl(url) {
  _baseUrl = url ? String(url).replace(/\/$/, '') : '';
}

async function request(method, path, body = null, { baseUrl, headers = {}, credentials = 'include' } = {}) {
  const base = (baseUrl !== undefined && baseUrl !== null && String(baseUrl) !== '')
    ? String(baseUrl).replace(/\/$/, '')
    : _baseUrl;
  const url = base + path;

  const opts = {
    method,
    headers: { ...headers },
    credentials
  };

  if (body != null && method !== 'GET' && method !== 'HEAD') {
    if (!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json';
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export async function get(path, opts = {}) {
  return request('GET', path, null, opts);
}

export async function post(path, body = null, opts = {}) {
  return request('POST', path, body, opts);
}

export async function put(path, body = null, opts = {}) {
  return request('PUT', path, body, opts);
}

export async function del(path, opts = {}) {
  return request('DELETE', path, null, opts);
}

export { request };

export default { setBaseUrl, request, get, post, put, del };
