// src/controllers/useProductos.js
// Hook controlador del catálogo: carga productos, maneja filtros,
// estados de carga y error.
import { useEffect, useState, useCallback } from 'react';
import { ProductosModel } from '../models/productos.model.js';

export function useProductos(filtroInicial = {}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState(filtroInicial);

  const cargar = useCallback(async (f = filtro) => {
    setCargando(true);
    setError(null);
    try {
      const data = await ProductosModel.listar(f);
      setProductos(data);
    } catch (e) {
      setError(e.message || 'No se pudo cargar el catálogo.');
    } finally {
      setCargando(false);
    }
  }, [filtro]);

  useEffect(() => {
    cargar(filtro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  return { productos, cargando, error, filtro, setFiltro, recargar: () => cargar(filtro) };
}
