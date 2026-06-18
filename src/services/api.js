import { API_BASE } from '@/lib/constants'

function getToken() {
  return localStorage.getItem('waka_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let payload
    try { payload = await res.json() } catch { payload = {} }
    const message = payload.error || payload.message || `Erreur ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.code   = payload.code ?? null
    throw err
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
