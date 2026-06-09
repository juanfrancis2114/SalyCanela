// src/routes/producto.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/producto.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/roles.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  idParamRule,
  crearProductoRules,
  actualizarProductoRules,
} from '../validators/producto.validators.js';

const router = Router();

// Públicos
router.get('/', ctrl.listar);
router.get('/:id', idParamRule, validate, ctrl.obtener);

// Protegidos (solo admin)
router.post('/', requireAuth, requireAdmin, crearProductoRules, validate, ctrl.crear);
router.put('/:id', requireAuth, requireAdmin, actualizarProductoRules, validate, ctrl.actualizar);
router.delete('/:id', requireAuth, requireAdmin, idParamRule, validate, ctrl.eliminar);

export default router;
