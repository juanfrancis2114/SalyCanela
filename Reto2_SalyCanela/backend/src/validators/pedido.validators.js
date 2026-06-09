// src/validators/pedido.validators.js
import { body } from 'express-validator';

export const crearPedidoRules = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('El carrito debe contener al menos un producto.'),
  body('items.*.productoId')
    .isInt({ min: 1 })
    .withMessage('Cada ítem debe tener un productoId válido.')
    .toInt(),
  body('items.*.cantidad')
    .isInt({ min: 1, max: 99 })
    .withMessage('La cantidad debe estar entre 1 y 99.')
    .toInt(),
];
