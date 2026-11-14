import mysql from 'mysql2/promise';

import { packageGroups, priceGroups } from '../src/data/prices.js';
import { honeyProducts, productSizes } from '../src/data/products.js';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3305),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'asyifa',
  waitForConnections: true,
  connectionLimit: 3,
});

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

async function ensureCatalogSchema() {
  const [[categoryColumn]] = await pool.query(
    "SELECT COUNT(*) AS total FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'services' AND COLUMN_NAME = 'category'"
  );
  if (!Number(categoryColumn.total)) {
    await pool.query('ALTER TABLE services ADD COLUMN category VARCHAR(100) NULL AFTER slug');
  }
  await pool.query('ALTER TABLE services MODIFY COLUMN name VARCHAR(500) NOT NULL');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      branch_id BIGINT UNSIGNED NULL,
      name VARCHAR(160) NOT NULL,
      slug VARCHAR(180) NOT NULL,
      description TEXT NULL,
      image_url VARCHAR(500) NULL,
      available_sizes JSON NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_products_slug (slug),
      INDEX idx_products_branch (branch_id),
      CONSTRAINT fk_products_branch
        FOREIGN KEY (branch_id) REFERENCES branches(id)
        ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB
  `);

  const [legacyKey] = await pool.query(
    "SELECT COUNT(*) AS total FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND INDEX_NAME = 'uq_products_branch_slug'"
  );
  if (Number(legacyKey[0].total)) {
    const [duplicates] = await pool.query(
      "SELECT slug, MIN(id) AS keep_id FROM products WHERE slug LIKE 'public-%' GROUP BY slug HAVING COUNT(*) > 1"
    );
    for (const duplicate of duplicates) {
      await pool.execute('DELETE FROM products WHERE slug = ? AND id <> ?', [duplicate.slug, duplicate.keep_id]);
    }
    await pool.query('ALTER TABLE products DROP INDEX uq_products_branch_slug');
    await pool.query('ALTER TABLE products ADD UNIQUE KEY uq_products_slug (slug)');
  }

  const [[sizeColumn]] = await pool.query(
    "SELECT COUNT(*) AS total FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'available_sizes'"
  );
  if (!Number(sizeColumn.total)) {
    await pool.query('ALTER TABLE products ADD COLUMN available_sizes JSON NULL AFTER image_url');
  }
}

async function syncServices() {
  let total = 0;
  for (const group of [...priceGroups, ...packageGroups]) {
    for (const [index, item] of group.items.entries()) {
      const slug = `public-${group.id}-${index + 1}-${slugify(item.name).slice(0, 120)}`;
      const duration = item.duration ? Number.parseInt(item.duration, 10) || null : null;
      await pool.execute(
        `INSERT INTO services (branch_id, name, slug, category, description, duration_minutes, price, is_active)
         VALUES (NULL, ?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name), category = VALUES(category), description = VALUES(description),
           duration_minutes = VALUES(duration_minutes), price = VALUES(price), is_active = 1`,
        [item.name, slug, group.title, group.description ?? null, duration, item.price ?? null]
      );
      total += 1;
    }
  }
  return total;
}

async function syncProducts() {
  for (const product of honeyProducts) {
    await pool.execute(
      `INSERT INTO products (branch_id, name, slug, description, image_url, available_sizes, is_active)
       VALUES (NULL, ?, ?, ?, NULL, ?, 1)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), description = VALUES(description), available_sizes = VALUES(available_sizes), is_active = 1`,
      [product.name, `public-${product.slug}`, product.note ?? null, JSON.stringify(productSizes)]
    );
  }
  return honeyProducts.length;
}

try {
  await ensureCatalogSchema();
  const services = await syncServices();
  const products = await syncProducts();
  console.log(`Katalog publik tersinkron: ${services} layanan/paket dan ${products} produk madu.`);
} finally {
  await pool.end();
}
