const express = require('express');
const router = express.Router();
const db = require('../db');
const statsModel = require('../models/stats');

// 商品数据
const products = {
  food: [
    { id: 1, name: '宠物粮', emoji: '🍖', price: 10, effect: '饱食度+30', description: '营养丰富的宠物粮', effectStats: { hunger: 30 } },
    { id: 2, name: '鱼干', emoji: '🐟', price: 15, effect: '饱食度+40,快乐度+5', description: '新鲜美味的鱼干', effectStats: { hunger: 40, happiness: 5 } },
    { id: 3, name: '牛肉干', emoji: '🥩', price: 25, effect: '饱食度+50,快乐度+10', description: '优质牛肉干', effectStats: { hunger: 50, happiness: 10 } },
    { id: 4, name: '罐头', emoji: '🥫', price: 20, effect: '饱食度+35', description: '香喷喷的罐头', effectStats: { hunger: 35 } }
  ],
  toy: [
    { id: 5, name: '球球', emoji: '⚽', price: 20, effect: '快乐度+20', description: '彩色小球', effectStats: { happiness: 20 } },
    { id: 6, name: '毛线球', emoji: '🧶', price: 15, effect: '快乐度+15', description: '毛茸茸的毛线球', effectStats: { happiness: 15 } },
    { id: 7, name: '铃铛', emoji: '🔔', price: 30, effect: '快乐度+25,经验+5', description: '叮叮当当的铃铛', effectStats: { happiness: 25, experience: 5 } },
    { id: 8, name: '飞盘', emoji: '🥏', price: 25, effect: '快乐度+30', description: '有趣的飞盘', effectStats: { happiness: 30 } }
  ],
  medicine: [
    { id: 9, name: '营养剂', emoji: '💊', price: 50, effect: '全属性+20', description: '宠物营养补充剂', effectStats: { hunger: 20, happiness: 20, energy: 20 } },
    { id: 10, name: '活力药水', emoji: '🧪', price: 40, effect: '活力+30', description: '增强宠物活力', effectStats: { energy: 30 } },
    { id: 11, name: '恢复药', emoji: '💉', price: 35, effect: '饥饿度+50', description: '快速恢复饱食度', effectStats: { hunger: 50 } }
  ],
  decoration: [
    { id: 12, name: '蝴蝶结', emoji: '🎀', price: 35, effect: '快乐度+10', description: '漂亮的蝴蝶结', effectStats: { happiness: 10 } },
    { id: 13, name: '皇冠', emoji: '👑', price: 100, effect: '快乐度+30,等级+1', description: '华丽的皇冠', effectStats: { happiness: 30, level: 1 } },
    { id: 14, name: '小窝', emoji: '🏠', price: 80, effect: '快乐度+25', description: '温馨的小窝', effectStats: { happiness: 25 } }
  ]
};

const findProduct = productId => {
  for (const [cat, list] of Object.entries(products)) {
    const found = list.find(p => p.id === productId);
    if (found) return { ...found, category: cat };
  }
  return null;
};

// 获取所有商品
router.get('/', (req, res) => {
  const { category } = req.query;
  
  if (category && products[category]) {
    return res.json(products[category].map(p => ({ ...p, category })));
  }
  
  // 返回所有商品
  const allProducts = [];
  Object.entries(products).forEach(([cat, list]) => {
    allProducts.push(...list.map(p => ({ ...p, category: cat })));
  });
  
  res.json(allProducts);
});

// 获取商品分类
router.get('/categories', (req, res) => {
  res.json([
    { id: 'food', name: '食物', icon: '🍖' },
    { id: 'toy', name: '玩具', icon: '🧸' },
    { id: 'medicine', name: '药品', icon: '💊' },
    { id: 'decoration', name: '装饰', icon: '🎀' }
  ]);
});

// 购买商品
router.post('/buy', (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ error: '缺少参数' });
  }

  const product = findProduct(productId);
  
  if (!product) {
    return res.status(404).json({ error: '商品不存在' });
  }
  
  const totalCost = product.price * quantity;

  db.get(`SELECT coins FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    if ((user.coins || 0) < totalCost) {
      return res.status(400).json({ error: '金币不足' });
    }

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      db.run(`UPDATE users SET coins = coins - ? WHERE id = ?`, [totalCost, userId]);
      db.run(
        `INSERT INTO user_inventory (user_id, product_id, quantity) 
         VALUES (?, ?, ?) 
         ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity`,
        [userId, productId, quantity]
      );
      db.run(
        `INSERT INTO purchases (user_id, product_id, price, quantity) VALUES (?, ?, ?, ?)`,
        [userId, productId, product.price, quantity]
      );
      db.run('COMMIT', async commitErr => {
        if (commitErr) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: '购买失败' });
        }
        try {
          await statsModel.recordAction(userId, 'purchase');
        } catch (e) {
          console.error('Failed to record stats:', e);
        }
        res.json({
          success: true,
          product,
          cost: totalCost,
          message: `购买成功！获得${product.name}`
        });
      });
    });
  });
});

// 获取背包
router.get('/inventory', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: '缺少 userId' });
  }
  db.all(
    `SELECT product_id, quantity FROM user_inventory WHERE user_id = ? AND quantity > 0`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: '获取背包失败' });
      const items = (rows || []).map(row => {
        const product = findProduct(row.product_id);
        return product ? { ...product, quantity: row.quantity } : null;
      }).filter(Boolean);
      res.json(items);
    }
  );
});

// 使用物品
router.post('/use', (req, res) => {
  const { userId, productId, petId } = req.body;
  if (!userId || !productId || !petId) {
    return res.status(400).json({ error: '缺少参数' });
  }

  const product = findProduct(productId);
  if (!product) {
    return res.status(404).json({ error: '商品不存在' });
  }

  db.get(`SELECT quantity FROM user_inventory WHERE user_id = ? AND product_id = ?`, [userId, productId], (err, inv) => {
    if (err) return res.status(500).json({ error: '使用失败' });
    if (!inv || inv.quantity <= 0) {
      return res.status(400).json({ error: '背包数量不足' });
    }

    db.get(`SELECT * FROM pets WHERE id = ? AND user_id = ?`, [petId, userId], (petErr, pet) => {
      if (petErr || !pet) {
        return res.status(404).json({ error: '宠物不存在' });
      }

      const effects = product.effectStats || {};
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      let hunger = pet.hunger;
      let happiness = pet.happiness;
      let energy = pet.energy || 100;
      let experience = pet.experience;
      let level = pet.level;

      if (effects.hunger) hunger = clamp(hunger + effects.hunger, 0, 100);
      if (effects.happiness) happiness = clamp(happiness + effects.happiness, 0, 100);
      if (effects.energy) energy = clamp(energy + effects.energy, 0, 100);
      if (effects.experience) experience += effects.experience;
      if (effects.level) level += effects.level;

      const expNeeded = level * 100;
      if (experience >= expNeeded) {
        level += 1;
        experience = experience - expNeeded;
      }

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.run(
          `UPDATE user_inventory SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?`,
          [userId, productId]
        );
        db.run(
          `UPDATE pets SET hunger = ?, happiness = ?, energy = ?, experience = ?, level = ?, updated_at = datetime('now') WHERE id = ?`,
          [hunger, happiness, energy, experience, level, petId]
        );
        db.run('COMMIT', commitErr => {
          if (commitErr) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: '使用失败' });
          }
          res.json({
            success: true,
            product,
            pet: { ...pet, hunger, happiness, energy, experience, level },
            message: `使用成功：${product.name}`
          });
        });
      });
    });
  });
});

module.exports = router;
