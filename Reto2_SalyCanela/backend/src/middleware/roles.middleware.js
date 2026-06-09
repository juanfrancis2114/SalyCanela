// src/middleware/roles.middleware.js
// Autorización basada en roles. Se usa SIEMPRE después de requireAuth.

export const requireRole =
  (...rolesPermitidos) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'No autenticado.' });
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ ok: false, error: 'No tienes permisos para esta acción.' });
    }
    next();
  };

export const requireAdmin = requireRole('admin');
