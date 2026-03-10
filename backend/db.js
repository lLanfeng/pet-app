const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'petapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log('✅ MySQL connection pool created');
  }
  return pool;
};

const run = async (sql, params = []) => {
  const p = getPool();
  const [result] = await p.execute(sql, params);
  return result;
};

const exec = async (sql) => {
  const p = getPool();
  const statements = sql.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    if (stmt.trim()) {
      try {
        await p.execute(stmt + ';');
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Error:', err.message);
        }
      }
    }
  }
};

const all = async (sql, params = []) => {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
};

const get = async (sql, params = []) => {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows[0];
};

const init = async () => {
  // First connect without database to create it if needed
  const tempConfig = { ...dbConfig, database: undefined };
  let tempPool;
  try {
    tempPool = mysql.createPool(tempConfig);
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Database created or already exists');
    await tempPool.end();
  } catch (err) {
    console.error('Failed to create database:', err.message);
    throw err;
  }

  // Now use the database and create tables
  const p = getPool();

  const initSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(50) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '👤',
    coins INT DEFAULT 100,
    diamonds INT DEFAULT 0,
    level INT DEFAULT 1,
    last_sign_date VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS pets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    hunger INT DEFAULT 50,
    happiness INT DEFAULT 50,
    energy INT DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id INT PRIMARY KEY,
    feed_count INT DEFAULT 0,
    play_count INT DEFAULT 0,
    train_count INT DEFAULT 0,
    clean_count INT DEFAULT 0,
    login_count INT DEFAULT 0,
    purchase_count INT DEFAULT 0,
    night_actions INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS user_daily_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date VARCHAR(20) NOT NULL,
    feed_count INT DEFAULT 0,
    play_count INT DEFAULT 0,
    train_count INT DEFAULT 0,
    clean_count INT DEFAULT 0,
    login_count INT DEFAULT 0,
    purchase_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_date (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS user_task_claims (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    claim_date VARCHAR(20) NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_task_claim (user_id, task_id, claim_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS user_achievement_claims (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_achievement (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS user_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 0,
    UNIQUE KEY unique_inventory (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    price INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const statements = initSql.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    if (stmt.trim()) {
      try {
        await p.execute(stmt);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Error creating table:', err.message);
        }
      }
    }
  }

  console.log('✅ MySQL database tables initialized');
};

// Test connection and initialize
getPool().getConnection()
  .then(async (connection) => {
    console.log('✅ Connected to MySQL database');
    connection.release();
    await init();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
  });

module.exports = {
  run,
  exec,
  all,
  get,
  getPool
};
