// ============================================================
//  seed.js — Pobla la base con usuarios y los 30 productos
//  de Sal y Canela (datos migrados desde el backup original).
//  Ejecutar:  npm run prisma:seed   (o  npx prisma db seed)
// ============================================================
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const productos = JSON.parse(
  readFileSync(join(__dirname, 'productos.seed.json'), 'utf-8')
);

async function main() {
  console.log('🌱  Iniciando seed...');

  /* ───── Usuarios (contraseñas hasheadas con bcrypt) ───── */
  const usuarios = [
    {
      nombre: 'Administrador Sal y Canela',
      username: 'admin',
      email: 'admin@salycanela.ec',
      password: 'Admin1234',
      role: 'admin',
    },
    {
      nombre: 'Cliente Demo',
      username: 'cliente',
      email: 'cliente@salycanela.ec',
      password: 'Cliente1234',
      role: 'user',
    },
  ];

  for (const u of usuarios) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: { nombre: u.nombre, username: u.username, role: u.role, passwordHash },
      create: {
        nombre: u.nombre,
        username: u.username,
        email: u.email,
        role: u.role,
        passwordHash,
      },
    });
    console.log(`   👤  ${u.role.padEnd(5)} → ${u.email} (clave: ${u.password})`);
  }

  /* ───── Productos ───── */
  let creados = 0;
  for (const p of productos) {
    // Piso de stock: si venía en 0, lo dejamos en 15 para que el catálogo se vea sano
    const stock = p.stock > 0 ? p.stock : 15;
    const data = {
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      categoria: p.categoria ?? 'General',
      precio: p.precio,
      stock,
      imagen: p.imagen ?? '',
      tag: p.tag ?? '',
      ingredientes: Array.isArray(p.ingredientes) ? p.ingredientes : [],
      destacado: !!p.destacado,
      disponible: stock > 0,
    };

    if (p.codigo) {
      await prisma.producto.upsert({
        where: { codigo: p.codigo },
        update: data,
        create: { ...data, codigo: p.codigo },
      });
    } else {
      await prisma.producto.create({ data });
    }
    creados++;
  }
  console.log(`   🍽️   ${creados} productos cargados`);
  console.log('✅  Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌  Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
