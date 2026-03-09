const db = require('../db');

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const ensureStatsRow = async userId => {
  await run(
    `INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)`,
    [userId]
  );
};

const ensureDailyRow = async (userId, date) => {
  await run(
    `INSERT OR IGNORE INTO user_daily_stats (user_id, date) VALUES (?, ?)`,
    [userId, date]
  );
};

const incrementStat = async (userId, field, amount = 1) => {
  await ensureStatsRow(userId);
  await run(
    `UPDATE user_stats SET ${field} = ${field} + ?, updated_at = datetime('now') WHERE user_id = ?`,
    [amount, userId]
  );
};

const incrementDailyStat = async (userId, field, amount = 1, date = todayStr()) => {
  await ensureDailyRow(userId, date);
  await run(
    `UPDATE user_daily_stats SET ${field} = ${field} + ?, updated_at = datetime('now') WHERE user_id = ? AND date = ?`,
    [amount, userId, date]
  );
};

const recordAction = async (userId, type) => {
  const fieldMap = {
    feed: 'feed_count',
    play: 'play_count',
    train: 'train_count',
    clean: 'clean_count',
    purchase: 'purchase_count',
    login: 'login_count'
  };
  const field = fieldMap[type];
  if (!field) return;

  await incrementStat(userId, field, 1);
  await incrementDailyStat(userId, field, 1);

  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    await incrementStat(userId, 'night_actions', 1);
  }
};

const getStats = async userId => {
  await ensureStatsRow(userId);
  return get(`SELECT * FROM user_stats WHERE user_id = ?`, [userId]);
};

const getDailyStats = async (userId, date = todayStr()) => {
  await ensureDailyRow(userId, date);
  return get(`SELECT * FROM user_daily_stats WHERE user_id = ? AND date = ?`, [userId, date]);
};

module.exports = {
  todayStr,
  ensureStatsRow,
  ensureDailyRow,
  incrementStat,
  incrementDailyStat,
  recordAction,
  getStats,
  getDailyStats
};
