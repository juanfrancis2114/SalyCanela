// src/controllers/CarritoContext.jsx
// Controlador del carrito: mantiene el estado en memoria sincronizado
// con localStorage (a través de CarritoModel) y lo expone a la UI.
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { CarritoModel } from '../models/carrito.model.js';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => CarritoModel.leer());

  const agregar = useCallback((producto) => setItems(CarritoModel.agregar(producto)), []);
  const cambiarCantidad = useCallback(
    (id, cant) => setItems(CarritoModel.cambiarCantidad(id, cant)),
    []
  );
  const eliminar = useCallback((id) => setItems(CarritoModel.eliminar(id)), []);
  const vaciar = useCallback(() => setItems(CarritoModel.vaciar()), []);

  const totales = useMemo(() => CarritoModel.totales(items), [items]);

  const value = { items, totales, agregar, cambiarCantidad, eliminar, vaciar };
  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
};
