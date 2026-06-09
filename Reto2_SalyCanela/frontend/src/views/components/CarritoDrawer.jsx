// src/views/components/CarritoDrawer.jsx
// Carrito lateral deslizante. Permite ajustar cantidades, quitar ítems
// y avanzar al checkout (exige login).
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../controllers/CarritoContext.jsx';
import { useAuth } from '../../controllers/AuthContext.jsx';
import { useToast } from '../../controllers/ToastContext.jsx';

const fmt = (n) => `$${Number(n).toFixed(2)}`;

export default function CarritoDrawer({ abierto, onCerrar }) {
  const { items, totales, cambiarCantidad, eliminar } = useCarrito();
  const { estaAutenticado } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCerrar();
    if (abierto) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const irCheckout = () => {
    if (!estaAutenticado) {
      // 5.3 — Login obligatorio para comprar.
      mostrar('Inicia sesión para confirmar tu pedido', 'error');
      onCerrar();
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    onCerrar();
    navigate('/checkout');
  };

  return (
    <div className="drawer-backdrop" onMouseDown={onCerrar}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <h2>Tu carrito</h2>
          <button className="icon-btn" onClick={onCerrar} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        <div className="drawer-items">
          {items.length === 0 ? (
            <p className="vacio">Tu carrito está vacío.<br />¡Agrega algo rico! 🍰</p>
          ) : (
            items.map((it) => (
              <div className="cart-line" key={it.id}>
                <img src={it.imagen} alt="" aria-hidden="true" />
                <div className="info">
                  <h4>{it.nombre}</h4>
                  <span className="precio" style={{ fontSize: '1rem' }}>
                    {fmt(it.precio)}
                  </span>
                  <div className="qty">
                    <button
                      onClick={() => cambiarCantidad(it.id, it.cantidad - 1)}
                      aria-label={`Disminuir cantidad de ${it.nombre}`}
                    >
                      −
                    </button>
                    <span aria-label="Cantidad">{it.cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(it.id, it.cantidad + 1)}
                      aria-label={`Aumentar cantidad de ${it.nombre}`}
                    >
                      +
                    </button>
                    <button
                      className="link-del"
                      onClick={() => eliminar(it.id)}
                      style={{ marginLeft: '0.6rem' }}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="totales-row">
              <span>Subtotal</span>
              <span>{fmt(totales.subtotal)}</span>
            </div>
            <div className="totales-row">
              <span>IVA (15%)</span>
              <span>{fmt(totales.iva)}</span>
            </div>
            <div className="totales-row total">
              <span>Total</span>
              <span>{fmt(totales.total)}</span>
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={irCheckout}>
              Confirmar pedido →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
