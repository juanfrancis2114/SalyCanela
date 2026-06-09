// src/views/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap">
        <div className="brand">
          Sal <span>y</span> Canela
        </div>
        <p>Sabores artesanales con alma · Quito, Ecuador</p>
        <p style={{ opacity: 0.7, marginTop: '0.4rem' }}>
          © {new Date().getFullYear()} · Proyecto académico — Desarrollo de Plataformas, PUCE
        </p>
      </div>
    </footer>
  );
}
