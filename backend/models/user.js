const db = require('../db');
const statsModel = require('./stats');

async function createUser(phone, nickname, password) {
  const sql = `INSERT INTO users (phone, nickname, password_hash, coins, diamonds, level) VALUES (?,?,?,?,?,?)`;
  const result = await db.run(sql, [phone, nickname, password, 100, 0, 1]);
  const userId = result.insertId;
  await statsModel.ensureStatsRow(userId);
  return userId;
}

async function getUserById(id) {
  return await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
}

async function getUserByPhone(phone) {
  return await db.get(`SELECT * FROM users WHERE phone = ?`, [phone]);
}

async function verifyUserPassword(phone, password) {
  const row = await db.get(`SELECT * FROM users WHERE phone = ?`, [phone]);
  if (!row) return null;
  if (password === row.password_hash) {
    const { password_hash, ...userWithoutPassword } = row;
    return userWithoutPassword;
  }
  return null;
}

async function updateUserCoins(userId, coins) {
  const result = await db.run(`UPDATE users SET coins = coins + ? WHERE id = ?`, [coins, userId]);
  return result.affectedRows;
}

async function updateUserDiamonds(userId, diamonds) {
  const result = await db.run(`UPDATE users SET diamonds = diamonds + ? WHERE id = ?`, [diamonds, userId]);
  return result.affectedRows;
}

async function updateUserLevel(userId, level) {
  const result = await db.run(`UPDATE users SET level = ? WHERE id = ?`, [level, userId]);
  return result.affectedRows;
}

async function updateUserInfo(userId, data) {
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
    return 0;
  }

  values.push(userId);
  const result = await db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
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
