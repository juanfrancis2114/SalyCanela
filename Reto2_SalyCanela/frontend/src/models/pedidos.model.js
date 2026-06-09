// src/models/pedidos.model.js — Acceso a pedidos.
import { api } from './api.js';

export const PedidosModel = {
  // items: [{ productoId, cantidad }]
  crear(items) {
    return api.post('/pedidos', { items }, true).then((r) => r.data);
  },
  misPedidos() {
    return api.get('/pedidos/mis-pedidos', true).then((r) => r.data);
  },
  todos() {
    return api.get('/pedidos', true).then((r) => r.data);
  },
};
