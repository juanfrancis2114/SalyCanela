// src/models/producto.model.js
import { prisma } from './prisma.js';

const normalizarImagen = (ruta) => {
  if (!ruta) return '';

  // Si ya viene como base64 o URL completa, se deja igual.
  if (ruta.startsWith('data:image') || ruta.startsWith('http')) {
    return ruta;
  }

  // Convierte "imagenes comida/DesayunoContinental.jpg"
  // en "/img/DesayunoContinental.jpg"
  const nombreArchivo = ruta.split('/').pop();

  return `/img/${nombreArchivo}`;
};

const mapProducto = (p) => ({
  id: Number(p.plat_id),
  nombre: p.plat_nombre,
  categoria: p.plat_categoria,
  descripcion: p.plat_descripcion,
  precio: Number(p.plat_precio),
  ingredientes: p.plat_ingredientes,
  tag: p.plat_tag,
  imagen: normalizarImagen(p.plat_imagen),
  destacado: p.plat_destacado,
  disponible: p.plat_activo,
  stock: 20,
  createdAt: p.plat_created_at,
});

export const ProductoModel = {
  findAll: async ({ categoria, q } = {}) => {
    const where = {
      plat_activo: true,
    };

    if (categoria && categoria !== 'Todos') {
      where.plat_categoria = categoria;
    }

    if (q) {
      where.OR = [
        { plat_nombre: { contains: q, mode: 'insensitive' } },
        { plat_descripcion: { contains: q, mode: 'insensitive' } },
        { plat_categoria: { contains: q, mode: 'insensitive' } },
      ];
    }

    const productos = await prisma.menu_items.findMany({
      where,
      orderBy: {
        plat_id: 'asc',
      },
    });

    return productos.map(mapProducto);
  },

  findById: async (id) => {
    const producto = await prisma.menu_items.findUnique({
      where: {
        plat_id: BigInt(id),
      },
    });

    return producto ? mapProducto(producto) : null;
  },

  findManyByIds: async (ids) => {
    const idsBigInt = ids.map((id) => BigInt(id));

    const productos = await prisma.menu_items.findMany({
      where: {
        plat_id: {
          in: idsBigInt,
        },
      },
    });

    return productos.map(mapProducto);
  },

  create: async (data) => {
    const producto = await prisma.menu_items.create({
      data: {
        plat_nombre: data.nombre,
        plat_categoria: data.categoria || 'General',
        plat_descripcion: data.descripcion || '',
        plat_precio: data.precio,
        plat_ingredientes: data.ingredientes || [],
        plat_tag: data.tag || '',
        plat_imagen: data.imagen || '',
        plat_destacado: data.destacado || false,
        plat_activo: data.disponible ?? true,
      },
    });

    return mapProducto(producto);
  },

  update: async (id, data) => {
    const updateData = {};

    if (data.nombre !== undefined) updateData.plat_nombre = data.nombre;
    if (data.categoria !== undefined) updateData.plat_categoria = data.categoria;
    if (data.descripcion !== undefined) updateData.plat_descripcion = data.descripcion;
    if (data.precio !== undefined) updateData.plat_precio = data.precio;
    if (data.ingredientes !== undefined) updateData.plat_ingredientes = data.ingredientes;
    if (data.tag !== undefined) updateData.plat_tag = data.tag;
    if (data.imagen !== undefined) updateData.plat_imagen = data.imagen;
    if (data.destacado !== undefined) updateData.plat_destacado = data.destacado;
    if (data.disponible !== undefined) updateData.plat_activo = data.disponible;

    const producto = await prisma.menu_items.update({
      where: {
        plat_id: BigInt(id),
      },
      data: updateData,
    });

    return mapProducto(producto);
  },

  remove: async (id) => {
    const producto = await prisma.menu_items.update({
      where: {
        plat_id: BigInt(id),
      },
      data: {
        plat_activo: false,
      },
    });

    return mapProducto(producto);
  },
};
