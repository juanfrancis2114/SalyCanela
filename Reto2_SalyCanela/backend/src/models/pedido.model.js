// src/models/pedido.model.js
import { prisma } from './prisma.js';

const IVA = 0.15;

const mapPedido = (p) => ({
  id: Number(p.ped_id),
  userId: p.ped_id_usuario,
  estado: p.ped_estado,
  mesa: p.ped_mesa,
  fecha: p.ped_fecha,
  hora: p.ped_hora,
  items: p.ped_items,
  subtotal: Number(p.ped_subtotal || 0),
  iva: Number(p.ped_iva || 0),
  total: Number(p.ped_total || 0),
  nombreUsuario: p.ped_nombre_usuario,
  createdAt: p.ped_created_at,
});

const generarMesa = () => Math.floor(Math.random() * 12) + 1;

export const PedidoModel = {
  crearDesdeCarrito: async (userId, items) =>
    prisma.$transaction(async (tx) => {
      const ids = items.map((i) => BigInt(i.productoId));

      const productos = await tx.menu_items.findMany({
        where: {
          plat_id: {
            in: ids,
          },
          plat_activo: true,
        },
      });

      const mapa = new Map(productos.map((p) => [Number(p.plat_id), p]));

      const itemsPedido = [];
      let totalConIva = 0;

      for (const item of items) {
        const prod = mapa.get(Number(item.productoId));

        if (!prod) {
          throw Object.assign(new Error(`Producto ${item.productoId} no existe.`), {
            statusCode: 400,
          });
        }

        const precioUnitario = Number(prod.plat_precio);
        const cantidad = Number(item.cantidad);

        totalConIva += precioUnitario * cantidad;

        itemsPedido.push({
          productoId: Number(prod.plat_id),
          nombre: prod.plat_nombre,
          cantidad,
          precioUnitario,
          subtotal: Number((precioUnitario * cantidad).toFixed(2)),
        });
      }

      const iva = totalConIva * (IVA / (1 + IVA));
      const subtotal = totalConIva - iva;

      const pedido = await tx.pedido.create({
        data: {
          ped_estado: 'pendiente',
          ped_id_usuario: String(userId),
          ped_mesa: generarMesa(),
          ped_fecha: new Date().toLocaleDateString('es-EC'),
          ped_hora: new Date().toLocaleTimeString('es-EC'),
          ped_rol: 'cliente',
          ped_items: itemsPedido,
          ped_total: Number(totalConIva.toFixed(2)),
          ped_iva: Number(iva.toFixed(2)),
          ped_subtotal: Number(subtotal.toFixed(2)),
          ped_nombre_usuario: '',
        },
      });

      return mapPedido(pedido);
    }),

  findByUser: async (userId) => {
    const pedidos = await prisma.pedido.findMany({
      where: {
        ped_id_usuario: String(userId),
      },
      orderBy: {
        ped_created_at: 'desc',
      },
    });

    return pedidos.map(mapPedido);
  },

  findAll: async () => {
    const pedidos = await prisma.pedido.findMany({
      orderBy: {
        ped_created_at: 'desc',
      },
    });

    return pedidos.map(mapPedido);
  },
};