// src/utils/logger.js — Logger básico con niveles y timestamp.
const ts = () => new Date().toISOString();
const color = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  http: '\x1b[32m',
  reset: '\x1b[0m',
};

const log = (level, ...args) => {
  const c = color[level] || '';
  console.log(`${c}[${ts()}] ${level.toUpperCase()}${color.reset}`, ...args);
};

export const logger = {
  info: (...a) => log('info', ...a),
  warn: (...a) => log('warn', ...a),
  error: (...a) => log('error', ...a),
  http: (...a) => log('http', ...a),
};

// Middleware de logging de peticiones HTTP.
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.http(
      `${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`
    );
  });
  next();
};
