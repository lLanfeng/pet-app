const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const statsModel = require('../models/stats');
const db = require('../db');

// 注册
router.post('/register', (req, res) => {
  const { phone, nickname, password } = req.body;
  
  if (!phone || !nickname || !password) {
    return res.status(400).json({ error: '请填写所有字段' });
  }

  userModel.createUser(phone, nickname, password, (err, id) => {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '手机号已注册' });
      }
      return res.status(500).json({ error: '注册失败' });
    }

    // 生成简单的token
    const token = `token_${id}_${Date.now()}`;
    
    res.json({ 
      id, 
      phone, 
      nickname,
      token,
      level: 1,
      coins: 100,
      diamonds: 0,
      message: '注册成功'
    });
  });
});

// 登录
router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(400).json({ error: '请填写用户名和密码' });
  }

  userModel.verifyUserPassword(phone, password, (err, user) => {
    if (err) {
      return res.status(500).json({ error: '登录失败' });
    }
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成简单的token
    const token = `token_${user.id}_${Date.now()}`;
    
    statsModel.recordAction(user.id, 'login').catch(() => {});
    res.json({ 
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar || '👤',
      level: user.level || 1,
      coins: user.coins || 100,
      diamonds: user.diamonds || 0,
      token,
      message: '登录成功'
    });
  });
});

// 获取用户信息
router.get('/:id', (req, res) => {
  userModel.getUserById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).json({ error: '获取用户信息失败' });
    }
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
});

// 更新用户信息
router.put('/:id', (req, res) => {
  const { nickname, avatar, coins, diamonds, level } = req.body;
  const userId = req.params.id;
  
  const updateData = {};
  if (nickname) updateData.nickname = nickname;
  if (avatar) updateData.avatar = avatar;
  
  if (Object.keys(updateData).length > 0) {
    userModel.updateUserInfo(userId, updateData, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: '更新失败' });
      }
    });
  }
  
  // 更新金币
  if (coins !== undefined) {
    userModel.updateUserCoins(userId, coins, (err) => {
      if (err) console.error('更新金币失败:', err);
    });
  }
  
  // 更新钻石
  if (diamonds !== undefined) {
    userModel.updateUserDiamonds(userId, diamonds, (err) => {
      if (err) console.error('更新钻石失败:', err);
    });
  }
  
  // 更新等级
  if (level !== undefined) {
    userModel.updateUserLevel(userId, level, (err) => {
      if (err) console.error('更新等级失败:', err);
    });
  }
  
  // 返回更新后的用户信息
  userModel.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: '获取用户信息失败' });
    }
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
});

// 签到
router.post('/:id/sign', (req, res) => {
  userModel.getUserById(req.params.id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const today = statsModel.todayStr();
    if (user.last_sign_date === today) {
      return res.json({
        success: true,
        reward: 0,
        alreadySigned: true,
        message: '今日已签到'
      });
    }

    // 签到奖励10金币
    userModel.updateUserCoins(req.params.id, 10, (err) => {
      if (err) {
        return res.status(500).json({ error: '签到失败' });
      }
      db.run(`UPDATE users SET last_sign_date = ? WHERE id = ?`, [today, req.params.id], updateErr => {
        if (updateErr) {
          return res.status(500).json({ error: '签到失败' });
        }
        statsModel.recordAction(req.params.id, 'login').catch(() => {});
        res.json({ 
          success: true, 
          reward: 10,
          message: '签到成功！获得10金币'
        });
      });
    });
  });
});

// 获取用户资产
router.get('/:id/assets', (req, res) => {
  userModel.getUserById(req.params.id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({
      coins: user.coins || 0,
      diamonds: user.diamonds || 0,
      level: user.level || 1
    });
  });
});

module.exports = router;
