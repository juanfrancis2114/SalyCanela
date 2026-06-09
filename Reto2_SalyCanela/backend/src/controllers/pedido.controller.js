// src/controllers/pedido.controller.js
import { PedidoModel } from '../models/pedido.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Aplana los Decimal a número para el JSON de respuesta.
const serial = (p) => ({
  ...p,
  subtotal: Number(p.subtotal),
  iva: Number(p.iva),
  total: Number(p.total),
  detalles: p.detalles?.map((d) => ({
    ...d,
    precioUnitario: Number(d.precioUnitario),
    producto: d.producto
      ? { ...d.producto, precio: Number(d.producto.precio) }
      : undefined,
  })),
});

// POST /api/pedidos — crea el pedido con el carrito enviado por el frontend.
export const crear = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const pedido = await PedidoModel.crearDesdeCarrito(req.user.id, items);
  res.status(201).json({ ok: true, data: serial(pedido) });
});

// GET /api/pedidos/mis-pedidos
export const misPedidos = asyncHandler(async (req, res) => {
  const pedidos = await PedidoModel.findByUser(req.user.id);
  res.json({ ok: true, data: pedidos.map(serial) });
});

// GET /api/pedidos  (solo admin)
export const todos = asyncHandler(async (_req, res) => {
  const pedidos = await PedidoModel.findAll();
  res.json({ ok: true, data: pedidos.map(serial) });
});
