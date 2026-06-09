// src/views/components/ProductoCard.jsx
// Tarjeta de producto reutilizable. Recibe el producto y un callback
// para agregar al carrito.
const fmt = (n) => `$${Number(n).toFixed(2)}`;

export default function ProductoCard({ producto, onAgregar }) {
  const agotado = !producto.disponible || producto.stock <= 0;

  return (
    <article className="card">
      <div className="card-img">
        <img
          src={producto.imagen || '/img/placeholder.jpg'}
          alt={producto.nombre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
        {producto.tag && <span className="card-tag">{producto.tag}</span>}
      </div>
      <div className="card-body">
        <span className="card-cat">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p className="card-desc">{producto.descripcion}</p>
        <div className="card-foot">
          <span className="precio">
            {fmt(producto.precio)} <small>IVA inc.</small>
          </span>
          {agotado ? (
            <span className="agotado">Agotado</span>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onAgregar(producto)}
              aria-label={`Agregar ${producto.nombre} al carrito`}
            >
              + Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
