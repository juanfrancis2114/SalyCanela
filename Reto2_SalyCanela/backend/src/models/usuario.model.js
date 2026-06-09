// src/models/usuario.model.js
import { prisma } from './prisma.js';

const mapUsuario = (u) => {
  const data = u.usu_data || {};

  return {
    id: Number(u.usu_id),
    nombre: data.nombre || u.usu_usuario,
    username: u.usu_usuario,
    email: u.usu_email,
    passwordHash: data.passwordHash || data.password || data.password_hash,
    role: data.role || data.rol || 'user',
    createdAt: u.usu_created_at,
  };
};

export const UsuarioModel = {
  findByEmail: async (email) => {
    const usuario = await prisma.usuario.findFirst({
      where: { usu_email: email },
    });

    return usuario ? mapUsuario(usuario) : null;
  },

  findByUsername: async (username) => {
    const usuario = await prisma.usuario.findFirst({
      where: { usu_usuario: username },
    });

    return usuario ? mapUsuario(usuario) : null;
  },

  findByIdentificador: async (identificador) => {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { usu_email: identificador },
          { usu_usuario: identificador },
        ],
      },
    });

    return usuario ? mapUsuario(usuario) : null;
  },

  findById: async (id) => {
    const usuario = await prisma.usuario.findUnique({
      where: {
        usu_id: BigInt(id),
      },
    });

    return usuario ? mapUsuario(usuario) : null;
  },

  create: async ({ nombre, username, email, passwordHash, role = 'user' }) => {
    const usuario = await prisma.usuario.create({
      data: {
        usu_usuario: username,
        usu_email: email,
        usu_data: {
          nombre,
          passwordHash,
          role,
        },
      },
    });

    return mapUsuario(usuario);
  },
};
