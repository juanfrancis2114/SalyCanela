// src/config/env.js — Carga y valida variables de entorno.
import dotenv from 'dotenv';
dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌  Faltan variables de entorno: ${missing.join(', ')}`);
  console.error('   Copia .env.example a .env y complétalo.');
  process.exit(1);
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  isProd: process.env.NODE_ENV === 'production',
};
