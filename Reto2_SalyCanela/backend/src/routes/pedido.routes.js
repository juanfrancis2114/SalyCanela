// src/routes/pedido.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/pedido.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/roles.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { crearPedidoRules } from '../validators/pedido.validators.js';

const router = Router();

// user o admin: crear y ver sus propios pedidos
router.post('/', requireAuth, crearPedidoRules, validate, ctrl.crear);
router.get('/mis-pedidos', requireAuth, ctrl.misPedidos);

// solo admin: ver todos los pedidos
router.get('/', requireAuth, requireAdmin, ctrl.todos);

export default router;
