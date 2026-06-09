// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import { UsuarioModel } from '../models/usuario.model.js';
import { firmarToken } from '../utils/jwt.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

// Nunca devolvemos el hash de contraseña al cliente.
const publico = (u) => ({
  id: u.id,
  nombre: u.nombre,
  username: u.username,
  email: u.email,
  role: u.role,
});

export const register = asyncHandler(async (req, res) => {
  const { nombre, username, email, password } = req.body;

  if (await UsuarioModel.findByEmail(email))
    throw new AppError('Ya existe una cuenta con ese correo.', 409);
  if (await UsuarioModel.findByUsername(username))
    throw new AppError('Ese nombre de usuario ya está en uso.', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  // Registro público SIEMPRE crea rol "user" (nunca admin desde el cliente).
  const usuario = await UsuarioModel.create({
    nombre,
    username,
    email,
    passwordHash,
    role: 'user',
  });

  const token = firmarToken({ sub: usuario.id, role: usuario.role, username: usuario.username });
  res.status(201).json({ ok: true, token, usuario: publico(usuario) });
});

export const login = asyncHandler(async (req, res) => {
  const { identificador, password } = req.body;

  const usuario = await UsuarioModel.findByIdentificador(identificador);
  // Comparación de hash incluso si el usuario no existe → evita filtrar
  // qué cuentas existen y mitiga ataques de enumeración / timing.
  // Hash dummy (formato bcrypt válido) usado cuando el usuario no existe,
  // para que el tiempo de respuesta sea constante y no filtre qué cuentas existen.
  const hash =
    usuario?.passwordHash ??
    '$2a$10$ynRSlyaMHMEtKstDAo9hJeHnQz/uRN5NTVznViC5MviENuxtPvJGu';
  const valido = await bcrypt.compare(password, hash);

  if (!usuario || !valido)
    throw new AppError('Usuario o contraseña incorrectos.', 401);

  const token = firmarToken({ sub: usuario.id, role: usuario.role, username: usuario.username });
  res.json({ ok: true, token, usuario: publico(usuario) });
});

// Datos del usuario autenticado (útil para rehidratar sesión en el frontend).
export const me = asyncHandler(async (req, res) => {
  const usuario = await UsuarioModel.findById(req.user.id);
  if (!usuario) throw new AppError('Usuario no encontrado.', 404);
  res.json({ ok: true, usuario: publico(usuario) });
});
