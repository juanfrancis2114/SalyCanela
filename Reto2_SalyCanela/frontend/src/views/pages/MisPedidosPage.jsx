// src/views/pages/MisPedidosPage.jsx
import { useEffect, useState } from 'react';
import { PedidosModel } from '../../models/pedidos.model.js';

const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

const fecha = (d) => {
  if (!d) return 'Fecha no disponible';

  return new Date(d).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await PedidosModel.misPedidos();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'No se pudieron cargar tus pedidos.');
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  return (
    <main className="wrap seccion">
      <h1>Mis pedidos</h1>
      <p className="sub">Historial de tus órdenes confirmadas.</p>

      {cargando ? (
        <div className="loader">
          <div className="spinner" aria-label="Cargando pedidos" />
        </div>
      ) : error ? (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      ) : pedidos.length === 0 ? (
        <p className="center-msg">Todavía no has hecho ningún pedido.</p>
      ) : (
        pedidos.map((p) => {
          const items = p.items || p.ped_items || p.detalles || [];

          return (
            <article className="pedido-card" key={p.id}>
              <header>
                <h3>Pedido #{p.id}</h3>
                <span className="estado-pill">{p.estado || 'pendiente'}</span>
                <span className="fecha">{fecha(p.createdAt)}</span>
              </header>

              <ul className="pedido-items">
                {items.length === 0 ? (
                  <li>
                    <span>Sin detalle de productos</span>
                    <span>{fmt(0)}</span>
                  </li>
                ) : (
                  items.map((d, index) => (
                    <li key={d.id || d.productoId || index}>
                      <span>
                        {d.cantidad} ×{' '}
                        {d.nombre ||
                          d.producto?.nombre ||
                          `Producto ${d.productoId || ''}`}
                      </span>
                      <span>
                        {fmt(
                          d.subtotal ||
                            d.precioUnitario * d.cantidad ||
                            d.precio_unitario * d.cantidad
                        )}
                      </span>
                    </li>
                  ))
                )}
              </ul>

              <div className="pedido-total">Total: {fmt(p.total)}</div>
            </article>
          );
        })
      )}
    </main>
  );
}