// src/middleware/validate.middleware.js
// Recoge el resultado de express-validator y responde 422 si hay errores.
import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({
      ok: false,
      error: 'Datos de entrada inválidos.',
      detalles: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};
