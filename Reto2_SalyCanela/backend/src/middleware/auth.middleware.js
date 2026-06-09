// src/middleware/auth.middleware.js
// Verifica el JWT enviado en  Authorization: Bearer <token>.
import { verificarToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ ok: false, error: 'Token no proporcionado.' });
  }

  try {
    const payload = verificarToken(token);
    // Adjuntamos los datos mínimos del usuario a la request.
    req.user = { id: payload.sub, role: payload.role, username: payload.username };
    next();
  } catch (err) {
    logger.warn('JWT inválido:', err.message);
    return res.status(401).json({ ok: false, error: 'Token inválido o expirado.' });
  }
};
