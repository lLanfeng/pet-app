const db = require('../db');
const statsModel = require('./stats');

function createUser(phone, nickname, password, callback) {
  const sql = `INSERT INTO users (phone, nickname, password_hash, coins, diamonds, level, created_at) VALUES (?,?,?,?,?,?,datetime('now'))`;
  db.run(sql, [phone, nickname, password, 100, 0, 1], function(err) {
    if (err) return callback(err);
    const userId = this && this.lastID;
    statsModel.ensureStatsRow(userId).finally(() => {
      callback(null, userId);
    });
  });
}

function getUserById(id, callback) {
  db.get(`SELECT * FROM users WHERE id = ?`, [id], callback);
}

function getUserByPhone(phone, callback) {
  db.get(`SELECT * FROM users WHERE phone = ?`, [phone], callback);
}

function verifyUserPassword(phone, password, callback) {
  db.get(`SELECT * FROM users WHERE phone = ?`, [phone], (err, row) => {
    if (err) return callback(err, null);
    if (!row) return callback(null, null);
    if (password === row.password_hash) {
      const { password_hash, ...userWithoutPassword } = row;
      callback(null, userWithoutPassword);
    } else {
      callback(null, null);
    }
  });
}

function updateUserCoins(userId, coins, callback) {
  db.run(`UPDATE users SET coins = coins + ? WHERE id = ?`, [coins, userId], function(err) {
    callback(err, this && this.changes);
  });
}

function updateUserDiamonds(userId, diamonds, callback) {
  db.run(`UPDATE users SET diamonds = diamonds + ? WHERE id = ?`, [diamonds, userId], function(err) {
    callback(err, this && this.changes);
  });
}

function updateUserLevel(userId, level, callback) {
  db.run(`UPDATE users SET level = ? WHERE id = ?`, [level, userId], function(err) {
    callback(err, this && this.changes);
  });
}

function updateUserInfo(userId, data, callback) {
  const fields = [];
  const values = [];
  
  if (data.nickname) {
    fields.push('nickname = ?');
    values.push(data.nickname);
  }
  if (data.avatar) {
    fields.push('avatar = ?');
    values.push(data.avatar);
  }
  
  if (fields.length === 0) {
    return callback(null, 0);
  }
  
  values.push(userId);
  db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values, function(err) {
    callback(err, this && this.changes);
  });
}

module.exports = {
  createUser,
  getUserById,
  getUserByPhone,
  verifyUserPassword,
  updateUserCoins,
  updateUserDiamonds,
  updateUserLevel,
  updateUserInfo
};
