// src/models/api.js
// Cliente HTTP central. Maneja el token JWT, los encabezados y los
// estados de error (red, 401, 403, 422, 500) de forma consistente.

const BASE = import.meta.env.VITE_API_URL || ''; // vacío => usa el proxy /api de Vite

const TOKEN_KEY = 'sc_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Error tipado para que la UI pueda reaccionar según el status.
export class ApiError extends Error {
  constructor(message, status, detalles) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Falla de red / servidor caído.
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respuesta sin cuerpo JSON */
  }

  if (!res.ok) {
    // Si el token expiró o es inválido, lo limpiamos.
    if (res.status === 401) tokenStore.clear();
    throw new ApiError(
      data?.error || `Error ${res.status}`,
      res.status,
      data?.detalles
    );
  }
  return data;
}

export const api = {
  get: (path, auth = false) => request(path, { auth }),
  post: (path, body, auth = false) => request(path, { method: 'POST', body, auth }),
  put: (path, body, auth = false) => request(path, { method: 'PUT', body, auth }),
  del: (path, auth = false) => request(path, { method: 'DELETE', auth }),
};
