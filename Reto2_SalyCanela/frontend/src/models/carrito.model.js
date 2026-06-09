// src/models/carrito.model.js
// Lógica del carrito del lado del cliente. Persiste en localStorage
// (requisito de la rúbrica) y calcula subtotal / IVA / total.

const KEY = 'sc_carrito';
const IVA = 0.15; // Ecuador — los precios YA incluyen IVA.

export const CarritoModel = {
  leer() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? [];
    } catch {
      return [];
    }
  },

  guardar(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    return items;
  },

  agregar(producto) {
    const items = CarritoModel.leer();
    const i = items.findIndex((x) => x.id === producto.id);
    if (i >= 0) {
      items[i].cantidad += 1;
    } else {
      items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagen: producto.imagen,
        cantidad: 1,
      });
    }
    return CarritoModel.guardar(items);
  },

  cambiarCantidad(id, cantidad) {
    let items = CarritoModel.leer();
    if (cantidad <= 0) {
      items = items.filter((x) => x.id !== id);
    } else {
      const i = items.findIndex((x) => x.id === id);
      if (i >= 0) items[i].cantidad = cantidad;
    }
    return CarritoModel.guardar(items);
  },

  eliminar(id) {
    return CarritoModel.guardar(CarritoModel.leer().filter((x) => x.id !== id));
  },

  vaciar() {
    return CarritoModel.guardar([]);
  },

  totales(items) {
    const total = items.reduce((s, x) => s + x.precio * x.cantidad, 0);
    const iva = total * (IVA / (1 + IVA));
    const subtotal = total - iva;
    const nItems = items.reduce((s, x) => s + x.cantidad, 0);
    return { subtotal, iva, total, nItems };
  },
};
