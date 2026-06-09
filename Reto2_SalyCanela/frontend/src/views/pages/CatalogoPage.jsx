// src/views/pages/CatalogoPage.jsx
import { useMemo, useState } from 'react';
import { useProductos } from '../../controllers/useProductos.js';
import { useCarrito } from '../../controllers/CarritoContext.jsx';
import { useToast } from '../../controllers/ToastContext.jsx';
import ProductoCard from '../components/ProductoCard.jsx';

const CATEGORIAS = [
  'Todos',
  'Desayunos',
  'Entradas',
  'Almuerzos',
  'Postres',
  'Bocaditos',
  'Bebidas Calientes',
  'Bebidas Frías',
];

export default function CatalogoPage() {
  const { productos, cargando, error, setFiltro } = useProductos({ categoria: 'Todos' });
  const { agregar } = useCarrito();
  const { mostrar } = useToast();
  const [cat, setCat] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const cambiarCat = (c) => {
    setCat(c);
    setFiltro({ categoria: c });
  };

  // Filtro de búsqueda en cliente (sobre lo ya cargado).
  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => p.nombre.toLowerCase().includes(q));
  }, [productos, busqueda]);

  const onAgregar = (p) => {
    agregar(p);
    mostrar(`"${p.nombre}" agregado al carrito`, 'ok');
  };

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>
            Sabores artesanales <span className="acento">con alma</span>
          </h1>
          <p>
            Desayunos, almuerzos y postres recién hechos. Arma tu pedido y lo confirmas en
            segundos.
          </p>
        </div>
      </section>

      <main id="contenido" className="wrap">
        <div className="filtros" role="group" aria-label="Filtrar por categoría">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              className={`chip ${cat === c ? 'activo' : ''}`}
              aria-pressed={cat === c}
              onClick={() => cambiarCat(c)}
            >
              {c}
            </button>
          ))}
          <div className="buscador">
            <span aria-hidden="true">🔎</span>
            <input
              type="search"
              placeholder="Buscar plato..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar plato por nombre"
            />
          </div>
        </div>

        {cargando ? (
          <div className="loader">
            <div className="spinner" aria-label="Cargando catálogo" />
          </div>
        ) : error ? (
          <div className="alert alert-error" role="alert">
            {error} — ¿Está corriendo el backend en el puerto 4000?
          </div>
        ) : visibles.length === 0 ? (
          <p className="center-msg">No hay productos que coincidan con tu búsqueda.</p>
        ) : (
          <div className="grid">
            {visibles.map((p) => (
              <ProductoCard key={p.id} producto={p} onAgregar={onAgregar} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
