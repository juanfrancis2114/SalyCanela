// src/routes/index.js — Agrupa todas las rutas bajo /api.
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productoRoutes from './producto.routes.js';
import pedidoRoutes from './pedido.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true, servicio: 'Sal y Canela API', version: '2.0.0' }));

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/pedidos', pedidoRoutes);

export default router;
