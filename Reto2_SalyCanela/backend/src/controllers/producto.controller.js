// src/controllers/producto.controller.js
import { ProductoModel } from '../models/producto.model.js';
import { asyncHandler, AppError } from '../middleware/error.middleware.js';

// Convierte Decimal de Prisma a número plano para el JSON.
const serial = (p) => ({ ...p, precio: Number(p.precio) });

export const listar = asyncHandler(async (req, res) => {
  const { categoria, q } = req.query;
  const productos = await ProductoModel.findAll({ categoria, q });
  res.json({ ok: true, data: productos.map(serial) });
});

export const obtener = asyncHandler(async (req, res) => {
  const producto = await ProductoModel.findById(req.params.id);
  if (!producto) throw new AppError('Producto no encontrado.', 404);
  res.json({ ok: true, data: serial(producto) });
});

export const crear = asyncHandler(async (req, res) => {
  const { nombre, precio, stock, categoria, descripcion, imagen, tag, destacado, ingredientes } =
    req.body;
  const producto = await ProductoModel.create({
    nombre,
    precio,
    stock,
    categoria: categoria || 'General',
    descripcion: descripcion || '',
    imagen: imagen || '',
    tag: tag || '',
    destacado: !!destacado,
    disponible: stock > 0,
    ingredientes: Array.isArray(ingredientes) ? ingredientes : [],
  });
  res.status(201).json({ ok: true, data: serial(producto) });
});

export const actualizar = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  delete data.id;
  // Si se actualiza el stock, recalculamos disponibilidad.
  if (typeof data.stock === 'number') data.disponible = data.stock > 0;
  const producto = await ProductoModel.update(req.params.id, data);
  res.json({ ok: true, data: serial(producto) });
});

export const eliminar = asyncHandler(async (req, res) => {
  await ProductoModel.remove(req.params.id);
  res.json({ ok: true, mensaje: 'Producto eliminado.' });
});
