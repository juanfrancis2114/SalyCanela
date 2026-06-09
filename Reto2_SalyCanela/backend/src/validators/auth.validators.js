// src/validators/auth.validators.js
import { body } from 'express-validator';

export const registerRules = [
  body('nombre')
    .trim()
    .escape() // sanitiza HTML
    .isLength({ min: 2, max: 60 })
    .withMessage('El nombre debe tener entre 2 y 60 caracteres.'),
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 20 })
    .withMessage('El usuario debe tener entre 3 y 20 caracteres.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El usuario solo admite letras, números y guion bajo.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Correo electrónico inválido.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 64 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/[A-Za-z]/)
    .withMessage('La contraseña debe incluir al menos una letra.')
    .matches(/\d/)
    .withMessage('La contraseña debe incluir al menos un número.'),
];

export const loginRules = [
  body('identificador') // puede ser email o username
    .trim()
    .notEmpty()
    .withMessage('Ingresa tu usuario o correo.'),
  body('password').notEmpty().withMessage('Ingresa tu contraseña.'),
];
