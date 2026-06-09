// src/views/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/AuthContext.jsx';
import { useToast } from '../../controllers/ToastContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const { mostrar } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', username: '', email: '', password: '', password2: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Validación del lado del cliente (la API también valida en el servidor).
  const validar = () => {
    const e = {};
    if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres.';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      e.username = '3-20 caracteres: letras, números o guion bajo.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email)) e.email = 'Correo inválido.';
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      e.password = 'Mínimo 8 caracteres, con letras y números.';
    if (form.password !== form.password2) e.password2 = 'Las contraseñas no coinciden.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;
    setEnviando(true);
    try {
      const u = await register({
        nombre: form.nombre.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      mostrar(`Cuenta creada. ¡Hola, ${u.nombre.split(' ')[0]}!`, 'ok');
      navigate('/', { replace: true });
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo crear la cuenta.');
    } finally {
      setEnviando(false);
    }
  };

  const campo = (id, label, type, key, autocomplete) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autocomplete}
        value={form[key]}
        onChange={set(key)}
        aria-invalid={!!errores[key]}
        aria-describedby={errores[key] ? `${id}-err` : undefined}
      />
      {errores[key] && (
        <span className="err" id={`${id}-err`} role="alert">
          {errores[key]}
        </span>
      )}
    </div>
  );

  return (
    <div className="page-narrow">
      <div className="panel">
        <div className="panel-head">
          <div className="brand">
            Sal <span>y</span> Canela
          </div>
          <p>Crea tu cuenta</p>
        </div>
        <div className="panel-body">
          {errorGeneral && (
            <div className="alert alert-error" role="alert">
              {errorGeneral}
            </div>
          )}
          <form onSubmit={onSubmit} noValidate>
            {campo('reg-nombre', 'Nombre completo', 'text', 'nombre', 'name')}
            {campo('reg-user', 'Usuario', 'text', 'username', 'username')}
            {campo('reg-email', 'Correo electrónico', 'email', 'email', 'email')}
            <div className="row-2">
              {campo('reg-pass', 'Contraseña', 'password', 'password', 'new-password')}
              {campo('reg-pass2', 'Confirmar', 'password', 'password2', 'new-password')}
            </div>
            <button className="btn btn-primary btn-block btn-lg" disabled={enviando}>
              {enviando ? 'Creando…' : 'Crear cuenta'}
            </button>
          </form>
          <p className="switch-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
