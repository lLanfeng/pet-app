const express = require('express');
const router = express.Router();
const db = require('../db');
const statsModel = require('../models/stats');

const TASKS = [
  { id: 1, key: 'feed', title: '喂食宠物', description: '给宠物喂食 5 次', emoji: '🍖', target: 5, reward: { coins: 50, exp: 10 } },
  { id: 2, key: 'play', title: '快乐时光', description: '和宠物玩耍 3 次', emoji: '🎮', target: 3, reward: { coins: 30, exp: 5 } },
  { id: 3, key: 'train', title: '学习达人', description: '训练宠物 2 次', emoji: '📚', target: 2, reward: { coins: 40, exp: 15 } },
  { id: 4, key: 'login', title: '每日登录', description: '今天登录应用', emoji: '📱', target: 1, reward: { coins: 20 } },
  { id: 5, key: 'purchase', title: '商店购物', description: '在商店购买 1 个商品', emoji: '🛒', target: 1, reward: { coins: 25 } },
  { id: 6, key: 'pet_level', title: '宠物大师', description: '宠物达到等级 10', emoji: '⭐', target: 10, reward: { coins: 100, exp: 50 } }
];

const getMaxPetLevel = userId =>
  new Promise((resolve, reject) => {
    db.get(`SELECT MAX(level) as maxLevel FROM pets WHERE user_id = ?`, [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row?.maxLevel || 0);
    });
  });

const isClaimed = (userId, taskId, date) =>
  new Promise((resolve, reject) => {
    db.get(
      `SELECT id FROM user_task_claims WHERE user_id = ? AND task_id = ? AND claim_date = ?`,
      [userId, taskId, date],
      (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      }
    );
  });

const claimTask = (userId, taskId, date) =>
  new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO user_task_claims (user_id, task_id, claim_date) VALUES (?, ?, ?)`,
      [userId, taskId, date],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });

const addCoins = (userId, coins) =>
  new Promise((resolve, reject) => {
    db.run(`UPDATE users SET coins = coins + ? WHERE id = ?`, [coins, userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });

const addExpToTopPet = (userId, exp) =>
  new Promise((resolve, reject) => {
    db.get(
      `SELECT id, level, experience FROM pets WHERE user_id = ? ORDER BY level DESC, experience DESC LIMIT 1`,
      [userId],
      (err, pet) => {
        if (err) return reject(err);
        if (!pet) return resolve(null);
        const expNeeded = pet.level * 100;
        let newLevel = pet.level;
        let newExp = pet.experience + exp;
        if (newExp >= expNeeded) {
          newLevel += 1;
          newExp = newExp - expNeeded;
        }
        db.run(
          `UPDATE pets SET level = ?, experience = ?, updated_at = datetime('now') WHERE id = ?`,
          [newLevel, newExp, pet.id],
          err2 => {
            if (err2) return reject(err2);
            resolve({ id: pet.id, level: newLevel, experience: newExp });
          }
        );
      }
    );
  });

const buildTasks = async userId => {
  const today = statsModel.todayStr();
  const daily = await statsModel.getDailyStats(userId, today);
  const maxLevel = await getMaxPetLevel(userId);

  const taskList = [];
  for (const t of TASKS) {
    let current = 0;
    if (t.key === 'feed') current = daily.feed_count || 0;
    if (t.key === 'play') current = daily.play_count || 0;
    if (t.key === 'train') current = daily.train_count || 0;
    if (t.key === 'login') current = daily.login_count || 0;
    if (t.key === 'purchase') current = daily.purchase_count || 0;
    if (t.key === 'pet_level') current = maxLevel || 0;

    const completed = current >= t.target;
    const claimed = await isClaimed(userId, t.id, today);
    const progressPercent = Math.min(100, Math.round((current / t.target) * 100));
    taskList.push({
      ...t,
      current,
      completed,
      claimed,
      progressPercent
    });
  }

  return taskList;
};

// 获取所有任务
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }
  try {
    const tasks = await buildTasks(userId);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '获取任务失败' });
  }
});

// 获取今日任务
router.get('/daily', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }
  try {
    const tasks = await buildTasks(userId);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '获取任务失败' });
  }
});

// 领取任务奖励
router.post('/:id/claim', async (req, res) => {
  const { userId } = req.body;
  const taskId = parseInt(req.params.id);
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }
  const task = TASKS.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  try {
    const tasks = await buildTasks(userId);
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask || !targetTask.completed) {
      return res.status(400).json({ error: '任务未完成' });
    }
    if (targetTask.claimed) {
      return res.status(400).json({ error: '奖励已领取' });
    }

    const today = statsModel.todayStr();
    await claimTask(userId, taskId, today);
    if (task.reward?.coins) {
      await addCoins(userId, task.reward.coins);
    }
    if (task.reward?.exp) {
      await addExpToTopPet(userId, task.reward.exp);
    }

    res.json({
      success: true,
      reward: task.reward,
      message: `获得${task.reward.coins || 0}金币`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '领取失败' });
  }
});

module.exports = router;
