// src/models/productos.model.js — Acceso al catálogo y CRUD (admin).
import { api } from './api.js';

export const ProductosModel = {
  listar({ categoria, q } = {}) {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'Todos') params.set('categoria', categoria);
    if (q) params.set('q', q);
    const qs = params.toString();
    return api.get(`/productos${qs ? `?${qs}` : ''}`).then((r) => r.data);
  },
  obtener(id) {
    return api.get(`/productos/${id}`).then((r) => r.data);
  },
  crear(producto) {
    return api.post('/productos', producto, true).then((r) => r.data);
  },
  actualizar(id, cambios) {
    return api.put(`/productos/${id}`, cambios, true).then((r) => r.data);
  },
  eliminar(id) {
    return api.del(`/productos/${id}`, true);
  },
};
