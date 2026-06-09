// src/models/auth.model.js — Operaciones de autenticación contra la API.
import { api, tokenStore } from './api.js';

export const AuthModel = {
  async login(identificador, password) {
    const r = await api.post('/auth/login', { identificador, password });
    if (r?.token) tokenStore.set(r.token);
    return r.usuario;
  },

  async register({ nombre, username, email, password }) {
    const r = await api.post('/auth/register', { nombre, username, email, password });
    if (r?.token) tokenStore.set(r.token);
    return r.usuario;
  },

  // Rehidrata la sesión usando el token guardado.
  async me() {
    const r = await api.get('/auth/me', true);
    return r.usuario;
  },

  logout() {
    tokenStore.clear();
  },

  hayToken: () => !!tokenStore.get(),
};
