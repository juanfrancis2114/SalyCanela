// src/views/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../controllers/CarritoContext.jsx';
import { useAuth } from '../../controllers/AuthContext.jsx';
import { useToast } from '../../controllers/ToastContext.jsx';
import { PedidosModel } from '../../models/pedidos.model.js';

const fmt = (n) => `$${Number(n).toFixed(2)}`;

export default function CheckoutPage() {
  const { items, totales, vaciar } = useCarrito();
  const { usuario } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const confirmar = async () => {
    setError('');
    setEnviando(true);
    try {
      const payload = items.map((i) => ({ productoId: i.id, cantidad: i.cantidad }));
      const pedido = await PedidosModel.crear(payload);
      vaciar(); // 5.4 — al confirmar se vacía el carrito
      mostrar('¡Pedido confirmado! 🎉', 'ok');
      navigate('/mis-pedidos', { state: { nuevoPedido: pedido.id } });
    } catch (err) {
      setError(err.message || 'No se pudo confirmar el pedido.');
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="wrap seccion">
        <p className="center-msg">
          Tu carrito está vacío.{' '}
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            Volver al catálogo
          </button>
        </p>
      </div>
    );
  }

  return (
    <main className="wrap seccion">
      <h1>Confirmar pedido</h1>
      <p className="sub">
        Revisa tu orden, {usuario?.nombre.split(' ')[0]}. Los precios incluyen IVA.
      </p>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="pedido-card">
        <ul className="pedido-items">
          {items.map((it) => (
            <li key={it.id}>
              <span>
                {it.cantidad} × {it.nombre}
              </span>
              <span>{fmt(it.precio * it.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="totales-row" style={{ marginTop: '1rem' }}>
          <span>Subtotal</span>
          <span>{fmt(totales.subtotal)}</span>
        </div>
        <div className="totales-row">
          <span>IVA (15%)</span>
          <span>{fmt(totales.iva)}</span>
        </div>
        <div className="totales-row total">
          <span>Total a pagar</span>
          <span>{fmt(totales.total)}</span>
        </div>
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={confirmar}
          disabled={enviando}
        >
          {enviando ? 'Procesando…' : 'Confirmar y enviar pedido'}
        </button>
      </div>
    </main>
  );
}
