// src/views/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../controllers/AuthContext.jsx';
import { useToast } from '../../controllers/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from || '/';

  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const u = await login(identificador, password);
      mostrar(`¡Bienvenido, ${u.nombre.split(' ')[0]}!`, 'ok');
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page-narrow">
      <div className="panel">
        <div className="panel-head">
          <div className="brand">
            Sal <span>y</span> Canela
          </div>
          <p>Inicia sesión para continuar</p>
        </div>
        <div className="panel-body">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="ident">Usuario o correo</label>
              <input
                id="ident"
                type="text"
                autoComplete="username"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="pass">Contraseña</label>
              <input
                id="pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-block btn-lg" disabled={enviando}>
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
          <p className="switch-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
          <p className="switch-link" style={{ fontSize: '0.78rem', opacity: 0.8 }}>
            Demo admin: <strong>admin / Admin1234</strong> · Demo cliente:{' '}
            <strong>cliente / Cliente1234</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
