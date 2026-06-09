// src/views/pages/AdminPage.jsx
// Panel admin: CRUD de productos + vista de todos los pedidos.
import { useEffect, useState, useCallback } from 'react';
import { ProductosModel } from '../../models/productos.model.js';
import { PedidosModel } from '../../models/pedidos.model.js';
import { useToast } from '../../controllers/ToastContext.jsx';
import Modal from '../components/Modal.jsx';

const fmt = (n) => `$${Number(n).toFixed(2)}`;
const fecha = (d) =>
  new Date(d).toLocaleString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const FORM_VACIO = {
  nombre: '',
  categoria: 'Desayunos',
  precio: '',
  stock: '',
  descripcion: '',
  imagen: '',
  tag: '',
  destacado: false,
};

export default function AdminPage() {
  const [tab, setTab] = useState('productos');
  return (
    <main className="wrap seccion">
      <h1>Administración</h1>
      <p className="sub">Gestiona el catálogo y revisa todos los pedidos.</p>

      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'productos'}
          className={`tab ${tab === 'productos' ? 'activo' : ''}`}
          onClick={() => setTab('productos')}
        >
          Productos
        </button>
        <button
          role="tab"
          aria-selected={tab === 'pedidos'}
          className={`tab ${tab === 'pedidos' ? 'activo' : ''}`}
          onClick={() => setTab('pedidos')}
        >
          Pedidos
        </button>
      </div>

      {tab === 'productos' ? <AdminProductos /> : <AdminPedidos />}
    </main>
  );
}

/* ─────────── Productos ─────────── */
function AdminProductos() {
  const { mostrar } = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(null); // { modo: 'crear'|'editar', data }
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setProductos(await ProductosModel.listar());
    } catch (e) {
      mostrar(e.message, 'error');
    } finally {
      setCargando(false);
    }
  }, [mostrar]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setModal({ modo: 'crear' });
  };
  const abrirEditar = (p) => {
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      descripcion: p.descripcion,
      imagen: p.imagen,
      tag: p.tag,
      destacado: p.destacado,
    });
    setModal({ modo: 'editar', id: p.id });
  };

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const guardar = async () => {
    setGuardando(true);
    try {
      const payload = {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio),
        stock: Number(form.stock),
        descripcion: form.descripcion,
        imagen: form.imagen,
        tag: form.tag,
        destacado: !!form.destacado,
      };
      if (modal.modo === 'crear') {
        await ProductosModel.crear(payload);
        mostrar('Producto creado', 'ok');
      } else {
        await ProductosModel.actualizar(modal.id, payload);
        mostrar('Producto actualizado', 'ok');
      }
      setModal(null);
      cargar();
    } catch (e) {
      mostrar(e.message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (p) => {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await ProductosModel.eliminar(p.id);
      mostrar('Producto eliminado', 'ok');
      cargar();
    } catch (e) {
      mostrar(e.message, 'error');
    }
  };

  if (cargando)
    return (
      <div className="loader">
        <div className="spinner" aria-label="Cargando" />
      </div>
    );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={abrirCrear}>
          + Nuevo producto
        </button>
      </div>

      <div className="tabla-wrap">
        <table>
          <caption className="sr-only">Listado de productos</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{fmt(p.precio)}</td>
                <td>{p.stock}</td>
                <td>
                  <span className="estado-pill" style={!p.disponible ? { background: '#fbe9e7', color: '#c0392b' } : {}}>
                    {p.disponible ? 'Disponible' : 'Agotado'}
                  </span>
                </td>
                <td>
                  <div className="acciones">
                    <button className="btn btn-ghost" onClick={() => abrirEditar(p)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => eliminar(p)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          titulo={modal.modo === 'crear' ? 'Nuevo producto' : 'Editar producto'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={guardar} disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="f-nombre">Nombre</label>
            <input id="f-nombre" value={form.nombre} onChange={set('nombre')} />
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="f-cat">Categoría</label>
              <select id="f-cat" value={form.categoria} onChange={set('categoria')}>
                {['Desayunos', 'Entradas', 'Almuerzos', 'Postres', 'Bocaditos', 'Bebidas Calientes', 'Bebidas Frías'].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  )
                )}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-tag">Etiqueta (tag)</label>
              <input id="f-tag" value={form.tag} onChange={set('tag')} placeholder="🍫 Favorito" />
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="f-precio">Precio (IVA inc.)</label>
              <input id="f-precio" type="number" step="0.01" min="0" value={form.precio} onChange={set('precio')} />
            </div>
            <div className="field">
              <label htmlFor="f-stock">Stock</label>
              <input id="f-stock" type="number" min="0" value={form.stock} onChange={set('stock')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-desc">Descripción</label>
            <textarea id="f-desc" rows="2" value={form.descripcion} onChange={set('descripcion')} />
          </div>
          <div className="field">
            <label htmlFor="f-img">Ruta de imagen</label>
            <input id="f-img" value={form.imagen} onChange={set('imagen')} placeholder="/img/MiPlato.jpg" />
          </div>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={form.destacado} onChange={set('destacado')} /> Destacado
          </label>
        </Modal>
      )}
    </>
  );
}

/* ─────────── Pedidos ─────────── */
function AdminPedidos() {
  const { mostrar } = useToast();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setPedidos(await PedidosModel.todos());
      } catch (e) {
        mostrar(e.message, 'error');
      } finally {
        setCargando(false);
      }
    })();
  }, [mostrar]);

  if (cargando)
    return (
      <div className="loader">
        <div className="spinner" aria-label="Cargando" />
      </div>
    );

  if (pedidos.length === 0) return <p className="center-msg">Aún no hay pedidos registrados.</p>;

  return (
    <div className="tabla-wrap">
      <table>
        <caption className="sr-only">Todos los pedidos</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Artículos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.usuario?.nombre ?? '—'}
                <br />
                <small style={{ color: 'var(--text-muted)' }}>{p.usuario?.email}</small>
              </td>
              <td>{fecha(p.createdAt)}</td>
              <td>
                {p.detalles.map((d) => (
                  <div key={d.id} style={{ fontSize: '0.82rem' }}>
                    {d.cantidad}× {d.producto?.nombre ?? d.productoId}
                  </div>
                ))}
              </td>
              <td>
                <strong>{fmt(p.total)}</strong>
              </td>
              <td>
                <span className="estado-pill">{p.estado}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
