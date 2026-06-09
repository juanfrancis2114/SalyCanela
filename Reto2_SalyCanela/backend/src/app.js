// src/app.js — Configuración de la aplicación Express.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './utils/logger.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

const app = express();

// 1. Cabeceras de seguridad HTTP (Helmet).
app.use(helmet());

// 2. CORS seguro: SOLO el origen real del frontend. Nunca "*" en producción.
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Parseo de JSON con límite de tamaño (evita payloads gigantes).
app.use(express.json({ limit: '100kb' }));

// 4. Logger de peticiones.
app.use(requestLogger);

// 5. Rutas de la API.
app.use('/api', apiRoutes);

// 6. 404 y manejador de errores centralizado (siempre al final).
app.use(notFound);
app.use(errorHandler);

export default app;
