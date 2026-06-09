// src/App.jsx — Ensambla providers, layout y rutas.
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './controllers/AuthContext.jsx';
import { CarritoProvider } from './controllers/CarritoContext.jsx';
import { ToastProvider } from './controllers/ToastContext.jsx';

import Navbar from './views/components/Navbar.jsx';
import Footer from './views/components/Footer.jsx';
import CarritoDrawer from './views/components/CarritoDrawer.jsx';
import ProtectedRoute from './views/components/ProtectedRoute.jsx';

import CatalogoPage from './views/pages/CatalogoPage.jsx';
import LoginPage from './views/pages/LoginPage.jsx';
import RegisterPage from './views/pages/RegisterPage.jsx';
import CheckoutPage from './views/pages/CheckoutPage.jsx';
import MisPedidosPage from './views/pages/MisPedidosPage.jsx';
import AdminPage from './views/pages/AdminPage.jsx';
import NotFoundPage from './views/pages/NotFoundPage.jsx';

export default function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <AuthProvider>
      <CarritoProvider>
        <ToastProvider>
          <div className="app-shell">
            <a href="#contenido" className="skip-link">
              Saltar al contenido
            </a>
            <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />

            <Routes>
              <Route path="/" element={<CatalogoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-pedidos"
                element={
                  <ProtectedRoute>
                    <MisPedidosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute soloAdmin>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <Footer />
            <CarritoDrawer abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />
          </div>
        </ToastProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}
