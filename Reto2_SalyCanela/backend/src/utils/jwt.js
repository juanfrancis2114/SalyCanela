// src/utils/jwt.js — Generación y verificación de JSON Web Tokens.
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const firmarToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

export const verificarToken = (token) => jwt.verify(token, env.JWT_SECRET);
