const express = require('express');
const router = express.Router();
const db = require('../db');
const statsModel = require('../models/stats');

const ACHIEVEMENTS = {
  milestone: [
    { id: 1, icon: '🌱', name: '萌新铲屎官', description: '添加你的第一只宠物', target: 1, reward: { coins: 50 }, category: 'milestone', source: 'pets_count' },
    { id: 2, icon: '⭐', name: '宠物养成家', description: '将宠物培养到10级', target: 10, reward: { coins: 200 }, category: 'milestone', source: 'max_pet_level' },
    { id: 3, icon: '👑', name: '宠物之王', description: '将宠物培养到满级', target: 100, reward: { diamonds: 50 }, category: 'milestone', source: 'max_pet_level' }
  ],
  interaction: [
    { id: 4, icon: '🍖', name: '饲养员', description: '累计喂食100次', target: 100, reward: { coins: 100 }, category: 'interaction', source: 'feed_count' },
    { id: 5, icon: '🎮', name: '玩耍达人', description: '累计玩耍50次', target: 50, reward: { coins: 80 }, category: 'interaction', source: 'play_count' },
    { id: 6, icon: '📚', name: '训练师', description: '完成训练任务20次', target: 20, reward: { coins: 150 }, category: 'interaction', source: 'train_count' }
  ],
  social: [
    { id: 7, icon: '👥', name: '社交达人', description: '添加5位好友', target: 5, reward: { coins: 100 }, category: 'social', source: 'friends_count' },
    { id: 8, icon: '💬', name: '社区活跃', description: '发布10条帖子', target: 10, reward: { coins: 80 }, category: 'social', source: 'posts_count' }
  ],
  secret: [
    { id: 9, icon: '🌙', name: '夜猫子', description: '在凌晨时段进行游戏', target: 1, reward: { diamonds: 10 }, category: 'secret', source: 'night_actions' },
    { id: 10, icon: '💰', name: '百万富翁', description: '累计拥有10000金币', target: 10000, reward: { diamonds: 30 }, category: 'secret', source: 'coins' }
  ]
};

const getPetsCount = async (userId) => {
  const row = await db.get(`SELECT COUNT(1) as cnt FROM pets WHERE user_id = ?`, [userId]);
  return row?.cnt || 0;
};

const getMaxPetLevel = async (userId) => {
  const row = await db.get(`SELECT MAX(level) as maxLevel FROM pets WHERE user_id = ?`, [userId]);
  return row?.maxLevel || 0;
};

const getUserCoins = async (userId) => {
  const row = await db.get(`SELECT coins FROM users WHERE id = ?`, [userId]);
  return row?.coins || 0;
};

const isClaimed = async (userId, achievementId) => {
  const row = await db.get(
    `SELECT id FROM user_achievement_claims WHERE user_id = ? AND achievement_id = ?`,
    [userId, achievementId]
  );
  return !!row;
};

const claimAchievement = async (userId, achievementId) => {
  const result = await db.run(
    `INSERT INTO user_achievement_claims (user_id, achievement_id) VALUES (?, ?)`,
    [userId, achievementId]
  );
  return result.insertId;
};

// 获取所有成就
router.get('/', async (req, res) => {
  const { userId, category } = req.query;
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }
  try {
    const stats = await statsModel.getStats(userId);
    const petsCount = await getPetsCount(userId);
    const maxLevel = await getMaxPetLevel(userId);
    const coins = await getUserCoins(userId);

    let list = [];
    if (category && ACHIEVEMENTS[category]) {
      list = ACHIEVEMENTS[category];
    } else {
      Object.values(ACHIEVEMENTS).forEach(items => list.push(...items));
    }

    const result = [];
    for (const a of list) {
      let current = 0;
      if (a.source === 'feed_count') current = stats.feed_count || 0;
      if (a.source === 'play_count') current = stats.play_count || 0;
      if (a.source === 'train_count') current = stats.train_count || 0;
      if (a.source === 'night_actions') current = stats.night_actions || 0;
      if (a.source === 'pets_count') current = petsCount;
      if (a.source === 'max_pet_level') current = maxLevel;
      if (a.source === 'coins') current = coins;
      if (a.source === 'friends_count') current = 0;
      if (a.source === 'posts_count') current = 0;

      const completed = current >= a.target;
      const claimed = await isClaimed(userId, a.id);
      const progress = Math.min(100, Math.round((current / a.target) * 100));

      result.push({
        ...a,
        current,
        progress,
        completed,
        claimed
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '获取成就失败' });
  }
});

// 获取成就分类
router.get('/categories', (req, res) => {
  res.json([
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'milestone', name: '里程碑', icon: '🏆' },
    { id: 'interaction', name: '互动', icon: '💬' },
    { id: 'social', name: '社交', icon: '👥' },
    { id: 'secret', name: '隐藏', icon: '🤫' }
  ]);
});

// 领取成就奖励
router.post('/:id/claim', async (req, res) => {
  const { userId } = req.body;
  const achievementId = parseInt(req.params.id);
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }

  let achievement = null;
  for (const list of Object.values(ACHIEVEMENTS)) {
    const found = list.find(a => a.id === achievementId);
    if (found) {
      achievement = found;
      break;
    }
  }

  if (!achievement) {
    return res.status(404).json({ error: '成就不存在' });
  }

  try {
    const list = await statsModel.getStats(userId);
    const petsCount = await getPetsCount(userId);
    const maxLevel = await getMaxPetLevel(userId);
    const coins = await getUserCoins(userId);

    let current = 0;
    if (achievement.source === 'feed_count') current = list.feed_count || 0;
    if (achievement.source === 'play_count') current = list.play_count || 0;
    if (achievement.source === 'train_count') current = list.train_count || 0;
    if (achievement.source === 'night_actions') current = list.night_actions || 0;
    if (achievement.source === 'pets_count') current = petsCount;
    if (achievement.source === 'max_pet_level') current = maxLevel;
    if (achievement.source === 'coins') current = coins;
    if (achievement.source === 'friends_count') current = 0;
    if (achievement.source === 'posts_count') current = 0;

    if (current < achievement.target) {
      return res.status(400).json({ error: '成就未完成' });
    }
    const claimed = await isClaimed(userId, achievementId);
    if (claimed) {
      return res.status(400).json({ error: '奖励已领取' });
    }

    await claimAchievement(userId, achievementId);

    if (achievement.reward?.coins) {
      await db.run(`UPDATE users SET coins = coins + ? WHERE id = ?`, [achievement.reward.coins, userId]);
    }
    if (achievement.reward?.diamonds) {
      await db.run(`UPDATE users SET diamonds = diamonds + ? WHERE id = ?`, [achievement.reward.diamonds, userId]);
    }

    res.json({
      success: true,
      reward: achievement.reward,
      message: `成就解锁！获得${achievement.reward.coins || achievement.reward.diamonds}${achievement.reward.coins ? '金币' : '钻石'}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '领取失败' });
  }
});

module.exports = router;
