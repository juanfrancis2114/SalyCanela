// src/middleware/error.middleware.js
// Manejo de errores centralizado: nunca exponemos stacktraces al cliente.
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

// Error operacional con código de estado controlado.
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Envuelve controladores async para no repetir try/catch en cada uno.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 404 — ruta no encontrada.
export const notFound = (req, res) => {
  res.status(404).json({ ok: false, error: `Ruta no encontrada: ${req.originalUrl}` });
};

// Handler de errores final (4 argumentos = Express lo reconoce como error handler).
export const errorHandler = (err, req, res, _next) => {
  let status = err.statusCode || 500;
  let mensaje = err.message || 'Error interno del servidor.';

  // Errores conocidos de Prisma → mensajes amigables.
  if (err.code === 'P2002') {
    status = 409;
    mensaje = 'Ya existe un registro con ese valor único.';
  } else if (err.code === 'P2025') {
    status = 404;
    mensaje = 'Registro no encontrado.';
  }

  // Loguear SIEMPRE el detalle real en el servidor (no al cliente).
  if (status >= 500) logger.error(err);
  else logger.warn(`${status} — ${mensaje}`);

  res.status(status).json({
    ok: false,
    error: mensaje,
    // El stack solo se incluye en desarrollo, jamás en producción.
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};
