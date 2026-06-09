// src/views/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/AuthContext.jsx';
import { useCarrito } from '../../controllers/CarritoContext.jsx';

export default function Navbar({ onAbrirCarrito }) {
  const { usuario, estaAutenticado, esAdmin, logout } = useAuth();
  const { totales } = useCarrito();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" aria-label="Barra de navegación principal">
      <div className="wrap">
        <NavLink to="/" className="brand" aria-label="Sal y Canela - Inicio">
          <img src="/favicon.svg" alt="" aria-hidden="true" />
          Sal <span>y</span> Canela
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'activo' : '')} end>
            Catálogo
          </NavLink>

          {estaAutenticado && (
            <NavLink to="/mis-pedidos" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Mis pedidos
            </NavLink>
          )}

          {esAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Admin
            </NavLink>
          )}

          {estaAutenticado ? (
            <>
              <span className="user-chip">
                {usuario.nombre.split(' ')[0]}
                <span className="rol">{usuario.role}</span>
              </span>
              <button className="nav-btn" onClick={salir}>
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Ingresar
            </NavLink>
          )}

          <button
            className="cart-btn"
            onClick={onAbrirCarrito}
            aria-label={`Abrir carrito, ${totales.nItems} artículos`}
          >
            🛒 Carrito
            {totales.nItems > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {totales.nItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
