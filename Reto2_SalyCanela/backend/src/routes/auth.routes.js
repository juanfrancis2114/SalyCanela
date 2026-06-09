// src/routes/auth.routes.js
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authCtrl from '../controllers/auth.controller.js';
import { registerRules, loginRules } from '../validators/auth.validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Limita intentos de login/registro (mitiga fuerza bruta).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiados intentos. Intenta más tarde.' },
});

router.post('/register', authLimiter, registerRules, validate, authCtrl.register);
router.post('/login', authLimiter, loginRules, validate, authCtrl.login);
router.get('/me', requireAuth, authCtrl.me);

export default router;
