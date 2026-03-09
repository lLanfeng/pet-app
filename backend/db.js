const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'petapp.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });

const exec = sql =>
  new Promise((resolve, reject) => {
    db.exec(sql, err => {
      if (err) return reject(err);
      resolve();
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

const ensureColumns = async (table, columns) => {
  const info = await all(`PRAGMA table_info(${table})`);
  const existing = new Set(info.map(col => col.name));
  for (const col of columns) {
    if (!existing.has(col.name)) {
      const def = col.default !== undefined ? ` DEFAULT ${col.default}` : '';
      await run(`ALTER TABLE ${table} ADD COLUMN ${col.name} ${col.type}${def}`);
    }
  }
};

const init = async () => {
  const initSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT DEFAULT '👤',
    coins INTEGER DEFAULT 100,
    diamonds INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    last_sign_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    hunger INTEGER DEFAULT 50,
    happiness INTEGER DEFAULT 50,
    energy INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id INTEGER PRIMARY KEY,
    feed_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    train_count INTEGER DEFAULT 0,
    clean_count INTEGER DEFAULT 0,
    login_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    night_actions INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_daily_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    feed_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    train_count INTEGER DEFAULT 0,
    clean_count INTEGER DEFAULT 0,
    login_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_task_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    claim_date TEXT NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id, claim_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_achievement_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 0,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `;

  await exec(initSql);

  await ensureColumns('users', [
    { name: 'avatar', type: 'TEXT', default: "'👤'" },
    { name: 'coins', type: 'INTEGER', default: 100 },
    { name: 'diamonds', type: 'INTEGER', default: 0 },
    { name: 'level', type: 'INTEGER', default: 1 },
    { name: 'last_sign_date', type: 'TEXT' }
  ]);

  await ensureColumns('pets', [
    { name: 'energy', type: 'INTEGER', default: 100 },
    { name: 'updated_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ]);

  console.log('✅ Database tables initialized');
};

init().catch(err => {
  console.error('Failed to initialize database:', err);
});

module.exports = db;
