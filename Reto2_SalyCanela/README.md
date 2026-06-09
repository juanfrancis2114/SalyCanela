# Sal y Canela — Plataforma E-Commerce Full Stack (Reto 2)

Plataforma web tipo e-commerce para el café-restaurante **Sal y Canela**: catálogo de productos, carrito persistente, autenticación con roles, pedidos con persistencia real y panel de administración.

Desarrollada con **React (frontend MVC)** + **Node.js / Express (backend MVC)** + **PostgreSQL (Supabase) con Prisma ORM**, aplicando seguridad alineada a **OWASP** (JWT, bcrypt, CORS seguro, validación y sanitización).

> Materia: Desarrollo de Plataformas — PUCE Ecuador · Reto 2

---

## Índice

1. [Descripción del sistema](#1-descripción-del-sistema)
2. [Arquitectura MVC](#2-arquitectura-mvc)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Cómo ejecutar el proyecto](#4-cómo-ejecutar-el-proyecto)
5. [Endpoints disponibles y roles](#5-endpoints-disponibles-y-roles)
6. [Ejemplos de endpoints probados](#6-ejemplos-de-endpoints-probados)
7. [Medidas de seguridad (OWASP)](#7-medidas-de-seguridad-owasp)
8. [Accesibilidad](#8-accesibilidad)
9. [Estructura de carpetas](#9-estructura-de-carpetas)

---

## 1. Descripción del sistema

Sal y Canela es una tienda en línea donde el cliente puede:

- Explorar el **catálogo** de 30 productos (desayunos, almuerzos, postres, bebidas…) consumido desde la API.
- Filtrar por categoría y buscar por nombre.
- Agregar productos a un **carrito persistente** (sobrevive recargas, vía `localStorage`).
- **Registrarse / iniciar sesión** (login obligatorio para comprar).
- **Confirmar pedidos**, que se guardan en la base de datos relacional.
- Consultar su **historial de pedidos**.

El **administrador** además puede:

- Gestionar el catálogo (crear, editar, eliminar productos — CRUD completo).
- Ver **todos los pedidos** de todos los usuarios.

El sistema implementa dos roles: `admin` y `user`.

---

## 2. Arquitectura MVC

El proyecto separa responsabilidades en capas MVC tanto en el cliente como en el servidor.

### 2.1 Frontend MVC (React + Vite)

```
frontend/src/
├── models/         → MODELO: lógica de datos del cliente
│   ├── api.js              (cliente HTTP central + manejo de token y errores)
│   ├── auth.model.js       (login / registro / sesión)
│   ├── productos.model.js  (consumo del catálogo y CRUD)
│   ├── pedidos.model.js    (creación y consulta de pedidos)
│   └── carrito.model.js    (estado del carrito + cálculo de IVA, localStorage)
│
├── controllers/    → CONTROLADOR: orquesta eventos, flujos y estado
│   ├── AuthContext.jsx     (sesión global)
│   ├── CarritoContext.jsx  (carrito global)
│   ├── ToastContext.jsx    (notificaciones accesibles)
│   └── useProductos.js     (hook de carga/filtros del catálogo)
│
└── views/          → VISTA: renderizado de la UI
    ├── components/  (Navbar, ProductoCard, CarritoDrawer, Modal, Footer, ProtectedRoute…)
    └── pages/       (Catálogo, Login, Registro, Checkout, MisPedidos, Admin, 404)
```

La **vista** nunca llama directamente a `fetch`: siempre pasa por los **modelos** (vía los **controladores**), evitando duplicar lógica de render o de red.

### 2.2 Backend MVC (Node.js + Express)

```
backend/src/
├── routes/         → define las rutas y las conecta con controladores y middleware
├── controllers/    → CONTROLADOR: maneja la petición/respuesta HTTP
├── models/         → MODELO: capa de acceso a datos con Prisma
│   └── prisma.js   (cliente Prisma único)
├── middleware/     → JWT (auth), roles, validación, manejo de errores centralizado
├── validators/     → reglas de validación + sanitización (express-validator)
├── utils/          → logger, generación/verificación de JWT
└── config/         → carga y validación de variables de entorno

backend/prisma/
├── schema.prisma   → modelo de datos (Usuario, Producto, Pedido, PedidoDetalle)
└── seed.js         → datos iniciales (usuarios + 30 productos)
```

Flujo de una petición: **`routes` → `middleware` (auth/roles/validación) → `controllers` → `models` (Prisma) → BD**, con el *error handler* centralizado al final.

### 2.3 Modelo de datos relacional

```
Usuario (1) ───< (N) Pedido (1) ───< (N) PedidoDetalle (N) >─── (1) Producto
```

| Entidad | Campos principales |
|---|---|
| **Usuario** | id, nombre, username, email, passwordHash, role (`admin`/`user`), createdAt |
| **Producto** | id, nombre, descripcion, categoria, precio, stock, imagen, codigo, tag, ingredientes, destacado, disponible, createdAt |
| **Pedido** | id, userId, subtotal, iva, total, estado, createdAt |
| **PedidoDetalle** | id, pedidoId, productoId, cantidad, precioUnitario |

---

## 3. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express |
| ORM | Prisma |
| Base de datos | PostgreSQL (Supabase) |
| Seguridad | JWT, bcryptjs, Helmet, CORS, express-validator, express-rate-limit |

---

## 4. Cómo ejecutar el proyecto

### Requisitos previos

- Node.js 18 o superior
- Una base de datos PostgreSQL. Recomendado: un proyecto gratuito en [Supabase](https://supabase.com).

### 4.1 Backend

```bash
cd backend
npm install

# 1. Configurar variables de entorno
cp .env.example .env
#    Edita .env y pega tus cadenas de conexión de Supabase:
#      DATABASE_URL  → connection string "Transaction" (puerto 6543, ?pgbouncer=true)
#      DIRECT_URL    → connection string "Session"     (puerto 5432)
#    Genera un JWT_SECRET:
#      node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 2. Crear las tablas en la base de datos
npm run prisma:migrate     # crea la migración inicial

# 3. Cargar datos de ejemplo (usuarios + 30 productos)
npm run prisma:seed

# 4. Levantar el servidor
npm run dev                # http://localhost:4000
```

> **Nota Supabase + Prisma:** Prisma usa `DATABASE_URL` (pooler, puerto 6543) en runtime y `DIRECT_URL` (puerto 5432) para las migraciones. Ambas se obtienen en *Supabase → Project Settings → Database → Connection string*.

### 4.2 Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

El frontend usa un *proxy* de Vite: las llamadas a `/api` se redirigen automáticamente al backend en `:4000` (sin problemas de CORS en desarrollo).

### 4.3 Usuarios de prueba (creados por el seed)

| Rol | Usuario | Contraseña |
|---|---|---|
| admin | `admin` | `Admin1234` |
| user | `cliente` | `Cliente1234` |

---

## 5. Endpoints disponibles y roles

Base URL: `http://localhost:4000/api`

### Autenticación

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/register` | Público | Registra un usuario (rol `user`). Devuelve JWT. |
| POST | `/auth/login` | Público | Inicia sesión. Devuelve JWT. |
| GET | `/auth/me` | JWT | Datos del usuario autenticado. |

### Productos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/productos` | Público | Lista el catálogo (filtros `?categoria=` y `?q=`). |
| GET | `/productos/:id` | Público | Detalle de un producto. |
| POST | `/productos` | JWT + **admin** | Crea un producto. |
| PUT | `/productos/:id` | JWT + **admin** | Actualiza un producto. |
| DELETE | `/productos/:id` | JWT + **admin** | Elimina un producto. |

### Pedidos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/pedidos` | JWT (user/admin) | Crea un pedido con el carrito enviado. |
| GET | `/pedidos/mis-pedidos` | JWT (user/admin) | Pedidos del usuario autenticado. |
| GET | `/pedidos` | JWT + **admin** | Todos los pedidos del sistema. |

El JWT se envía en el encabezado: `Authorization: Bearer <token>`.

---

## 6. Ejemplos de endpoints probados

### Registro

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"María López","username":"maria","email":"maria@correo.com","password":"Maria1234"}'
```
**Respuesta (201):**
```json
{ "ok": true, "token": "eyJhbGciOiJ...", "usuario": { "id": 3, "nombre": "María López", "username": "maria", "email": "maria@correo.com", "role": "user" } }
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identificador":"admin","password":"Admin1234"}'
```

### Listar productos (público)

```bash
curl http://localhost:4000/api/productos?categoria=Postres
```

### Crear pedido (requiere token)

```bash
curl -X POST http://localhost:4000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"items":[{"productoId":15,"cantidad":2},{"productoId":24,"cantidad":1}]}'
```

### Intento sin permisos (esperado 403)

```bash
# Un usuario "user" intentando crear un producto:
curl -X POST http://localhost:4000/api/productos \
  -H "Authorization: Bearer <TOKEN_DE_USER>" -H "Content-Type: application/json" \
  -d '{"nombre":"x","precio":1,"stock":1}'
# → { "ok": false, "error": "No tienes permisos para esta acción." }
```

---

## 7. Medidas de seguridad (OWASP)

A continuación, **3 riesgos del OWASP Top 10** identificados y cómo se mitigan en este sistema:

### Riesgo 1 — A01:2021 Pérdida de Control de Acceso (Broken Access Control)
**Mitigación:**
- Autenticación con **JWT** firmado (`Authorization: Bearer <token>`), verificado en cada ruta protegida (`auth.middleware.js`).
- Autorización por **roles** (`roles.middleware.js`): los endpoints de administración (`POST/PUT/DELETE /productos`, `GET /pedidos`) exigen rol `admin`.
- El registro público **siempre** crea rol `user`; el cliente nunca puede auto-asignarse `admin`.
- En el frontend, las rutas `/admin`, `/checkout` y `/mis-pedidos` están protegidas con `ProtectedRoute`.

### Riesgo 2 — A02:2021 Fallas Criptográficas (Cryptographic Failures)
**Mitigación:**
- Las contraseñas **nunca** se guardan en texto plano: se almacenan como **hash bcrypt** (`bcryptjs`, factor de costo 10).
- El hash de contraseña **nunca** se devuelve en las respuestas de la API.
- En el login, si el usuario no existe se compara contra un hash dummy de formato válido, manteniendo un **tiempo de respuesta constante** (evita enumeración de cuentas por *timing*).
- El `JWT_SECRET` se mantiene fuera del código, en variables de entorno.

### Riesgo 3 — A03:2021 Inyección (Injection / XSS)
**Mitigación:**
- **Prisma ORM** usa consultas parametrizadas, eliminando la inyección SQL.
- **Validación y sanitización** de todas las entradas con `express-validator` (`.trim()`, `.escape()`, `.normalizeEmail()`, tipos y longitudes).
- Límite de tamaño del cuerpo JSON (`100kb`) para evitar payloads abusivos.

### Medidas adicionales aplicadas
- **CORS seguro:** solo se permite el origen real del frontend (`CORS_ORIGIN`); nunca `*` en producción.
- **Helmet:** cabeceras HTTP de seguridad.
- **Rate limiting** en `/auth/*` (mitiga fuerza bruta).
- **Manejo de errores centralizado:** respuestas consistentes que **no exponen** *stacktraces* al cliente en producción.
- **Logger** de peticiones para trazabilidad.

---

## 8. Accesibilidad

- HTML5 semántico (`header`/`nav`/`main`/`section`/`footer`).
- Navegación por teclado y **foco visible** (`:focus-visible`).
- *Skip link* "Saltar al contenido".
- Etiquetas (`label`) asociadas en todos los formularios; `aria-invalid` y mensajes `role="alert"`.
- Componentes dinámicos con ARIA: modales (`role="dialog"`, `aria-modal`, cierre con `Esc`), carrito, notificaciones (`aria-live`).
- Contraste de color adecuado sobre la paleta marrón/canela/crema.

---

## 9. Estructura de carpetas

```
Reto2_SalyCanela/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── productos.seed.json
│   └── src/
│       ├── app.js · server.js
│       ├── config/ · routes/ · controllers/ · models/
│       ├── middleware/ · validators/ · utils/
└── frontend/
    ├── package.json · vite.config.js · index.html · .env.example
    ├── public/img/   (imágenes de los productos)
    └── src/
        ├── main.jsx · App.jsx
        ├── models/ · controllers/ · views/ · styles/
```
