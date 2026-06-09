// src/validators/producto.validators.js
import { body, param } from 'express-validator';

export const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido.').toInt(),
];

export const crearProductoRules = [
  body('nombre').trim().escape().isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres.'),
  body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0.').toFloat(),
  body('stock').isInt({ min: 0 }).withMessage('El stock no puede ser negativo.').toInt(),
  body('categoria').optional().trim().escape().isLength({ max: 40 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
  body('imagen').optional().trim().isLength({ max: 300 }),
  body('tag').optional().trim().escape().isLength({ max: 40 }),
  body('destacado').optional().isBoolean().toBoolean(),
  body('ingredientes').optional().isArray().withMessage('Ingredientes debe ser un arreglo.'),
];

// En update todos los campos son opcionales pero validados si vienen.
export const actualizarProductoRules = [
  ...idParamRule,
  body('nombre').optional().trim().escape().isLength({ min: 2, max: 80 }),
  body('precio').optional().isFloat({ gt: 0 }).toFloat(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
  body('categoria').optional().trim().escape().isLength({ max: 40 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
  body('imagen').optional().trim().isLength({ max: 300 }),
  body('tag').optional().trim().escape().isLength({ max: 40 }),
  body('destacado').optional().isBoolean().toBoolean(),
  body('disponible').optional().isBoolean().toBoolean(),
  body('ingredientes').optional().isArray(),
];
