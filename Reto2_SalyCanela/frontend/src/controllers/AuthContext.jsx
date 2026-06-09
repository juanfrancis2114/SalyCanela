// src/controllers/AuthContext.jsx
// Controlador de sesión: orquesta login/registro/logout y expone el
// usuario autenticado a toda la app.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthModel } from '../models/auth.model.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, si hay token intentamos rehidratar la sesión.
  useEffect(() => {
    let activo = true;
    (async () => {
      if (AuthModel.hayToken()) {
        try {
          const u = await AuthModel.me();
          if (activo) setUsuario(u);
        } catch {
          AuthModel.logout();
        }
      }
      if (activo) setCargando(false);
    })();
    return () => {
      activo = false;
    };
  }, []);

  const login = useCallback(async (identificador, password) => {
    const u = await AuthModel.login(identificador, password);
    setUsuario(u);
    return u;
  }, []);

  const register = useCallback(async (datos) => {
    const u = await AuthModel.register(datos);
    setUsuario(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    AuthModel.logout();
    setUsuario(null);
  }, []);

  const value = {
    usuario,
    cargando,
    estaAutenticado: !!usuario,
    esAdmin: usuario?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
