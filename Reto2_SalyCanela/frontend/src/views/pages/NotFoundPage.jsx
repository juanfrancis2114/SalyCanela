// src/views/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="wrap seccion">
      <div className="center-msg">
        <h1 style={{ fontSize: '3rem' }}>404</h1>
        <p>Esta página no existe.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}
