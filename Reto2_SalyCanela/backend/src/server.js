// src/server.js — Punto de entrada: arranca el servidor HTTP.
import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './models/prisma.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀  API Sal y Canela escuchando en http://localhost:${env.PORT}`);
  logger.info(`   Entorno: ${env.NODE_ENV} · CORS permitido: ${env.CORS_ORIGIN}`);
});

// Cierre ordenado: desconecta Prisma al terminar el proceso.
const shutdown = async (signal) => {
  logger.warn(`Recibido ${signal}, cerrando...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
