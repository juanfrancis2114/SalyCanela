// src/views/components/ProtectedRoute.jsx
// Protege rutas: exige sesión y, opcionalmente, rol admin.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../controllers/AuthContext.jsx';

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { estaAutenticado, esAdmin, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="loader">
        <div className="spinner" aria-label="Cargando" />
      </div>
    );
  }

  if (!estaAutenticado) {
    // Redirige al login recordando a dónde quería ir.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
