const path = require('path');
const fs = require('fs');

let pgPool = null;
let sqliteDb = null;
let activeEngine = 'sqlite'; // 'postgres' or 'sqlite'

/**
 * Initializes the database connection.
 * Attempts PostgreSQL if configured, otherwise falls back gracefully to SQLite.
 */
async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  const usePostgres = Boolean(connectionString || process.env.PGHOST);

  if (usePostgres) {
    try {
      const { Pool } = require('pg');
      pgPool = new Pool({
        connectionString: connectionString || undefined,
        host: process.env.PGHOST,
        port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      // Test connection
      await pgPool.query('SELECT 1');
      activeEngine = 'postgres';
      console.log('✅ Connected to PostgreSQL Database');
      await createTablesPostgres();
      return;
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed or unavailable, falling back to SQLite:', err.message);
    }
  }

  // SQLite fallback
  const sqlite3 = require('sqlite3').verbose();
  const dbDir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'pet_cafe.db');

  return new Promise((resolve, reject) => {
    sqliteDb = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('❌ Failed to initialize SQLite database:', err);
        return reject(err);
      }
      activeEngine = 'sqlite';
      console.log(`✅ Connected to SQLite database at: ${dbPath}`);
      try {
        await createTablesSqlite();
        resolve();
      } catch (tableErr) {
        reject(tableErr);
      }
    });
  });
}

/**
 * Execute a query with parameters.
 * Automatically translates query parameter placeholders if needed ($1 -> ? for SQLite).
 */
async function query(sqlText, params = []) {
  if (activeEngine === 'postgres') {
    const res = await pgPool.query(sqlText, params);
    return res.rows;
  } else {
    return new Promise((resolve, reject) => {
      // Convert $1, $2, $3 to ? for SQLite
      let normalizedSql = sqlText.replace(/\$(\d+)/g, '?');

      // Determine query type
      const trimmed = normalizedSql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH') || trimmed.includes('RETURNING')) {
        sqliteDb.all(normalizedSql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      } else {
        sqliteDb.run(normalizedSql, params, function (err) {
          if (err) return reject(err);
          resolve({
            lastID: this.lastID,
            changes: this.changes,
            rows: []
          });
        });
      }
    });
  }
}

/**
 * Fetch a single row
 */
async function getOne(sqlText, params = []) {
  const rows = await query(sqlText, params);
  return rows && rows.length > 0 ? rows[0] : null;
}

/**
 * PostgreSQL Schema Definition
 */
async function createTablesPostgres() {
  const schema = `
    CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(50),
      password_hash VARCHAR(255) NOT NULL,
      role_id VARCHAR(64) REFERENCES roles(id),
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pets (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      species VARCHAR(50) NOT NULL,
      breed VARCHAR(100) NOT NULL,
      age INTEGER NOT NULL,
      description TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'Available',
      care_notes TEXT,
      restrictions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      image_url TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'Available',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id),
      date VARCHAR(20) NOT NULL,
      start_time VARCHAR(20) NOT NULL,
      party_size INTEGER NOT NULL,
      status VARCHAR(30) DEFAULT 'Pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id),
      reservation_id VARCHAR(64) REFERENCES reservations(id),
      total_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(30) DEFAULT 'Pending',
      order_type VARCHAR(30) DEFAULT 'Dine-In',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
      menu_item_id VARCHAR(64) REFERENCES menu_items(id),
      quantity INTEGER NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL,
      subtotal NUMERIC(10, 2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(64) PRIMARY KEY,
      order_id VARCHAR(64) REFERENCES orders(id),
      reservation_id VARCHAR(64) REFERENCES reservations(id),
      amount NUMERIC(10, 2) NOT NULL,
      method VARCHAR(50) NOT NULL,
      status VARCHAR(30) DEFAULT 'Completed',
      transaction_ref VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id),
      reservation_id VARCHAR(64) REFERENCES reservations(id),
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'Approved',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id VARCHAR(64),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pgPool.query(schema);
}

/**
 * SQLite Schema Definition
 */
function createTablesSqlite() {
  const schema = `
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role_id TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT NOT NULL,
      age INTEGER NOT NULL,
      description TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      status TEXT DEFAULT 'Available',
      care_notes TEXT,
      restrictions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT NOT NULL,
      status TEXT DEFAULT 'Available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      reservation_id TEXT,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      order_type TEXT DEFAULT 'Dine-In',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      menu_item_id TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      reservation_id TEXT,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT DEFAULT 'Completed',
      transaction_ref TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      reservation_id TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      status TEXT DEFAULT 'Approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  return new Promise((resolve, reject) => {
    sqliteDb.exec(schema, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  initDb,
  query,
  getOne,
  getActiveEngine: () => activeEngine
};
