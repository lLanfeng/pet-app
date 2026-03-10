const express = require('express');
const router = express.Router();
const petModel = require('../models/pet');

// 获取可领养的宠物类型
router.get('/types', async (req, res) => {
  try {
    const types = petModel.getPetTypes();
    res.json(types);
  } catch (err) {
    return res.status(500).json({ error: '获取宠物类型失败' });
  }
});

// 创建宠物
router.post('/', async (req, res) => {
  const { userId, name, type } = req.body;

  if (!userId || !name || !type) {
    return res.status(400).json({ error: '请填写所有字段' });
  }

  try {
    const id = await petModel.createPet(userId, name, type);
    const pet = await petModel.getPetById(id);
    res.json(pet);
  } catch (err) {
    return res.status(500).json({ error: '创建宠物失败' });
  }
});

// 获取用户的所有宠物
router.get('/user/:userId', async (req, res) => {
  try {
    const pets = await petModel.listPetsByUser(req.params.userId);
    res.json(pets || []);
  } catch (err) {
    return res.status(500).json({ error: '获取宠物列表失败' });
  }
});

// 获取单个宠物信息
router.get('/:id', async (req, res) => {
  try {
    const pet = await petModel.getPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: '宠物不存在' });
    }
    res.json(pet);
  } catch (err) {
    return res.status(500).json({ error: '获取宠物信息失败' });
  }
});

// 更新宠物信息
router.put('/:id', async (req, res) => {
  const { name, level, experience, hunger, happiness, energy } = req.body;

  try {
    const pet = await petModel.getPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: '宠物不存在' });
    }

    const updateData = {
      name: name !== undefined ? name : pet.name,
      level: level !== undefined ? level : pet.level,
      experience: experience !== undefined ? experience : pet.experience,
      hunger: hunger !== undefined ? hunger : pet.hunger,
      happiness: happiness !== undefined ? happiness : pet.happiness,
      energy: energy !== undefined ? energy : pet.energy
    };

    await petModel.updatePet(req.params.id, updateData);
    const updatedPet = await petModel.getPetById(req.params.id);
    res.json(updatedPet);
  } catch (err) {
    return res.status(500).json({ error: '更新失败' });
  }
});

// 宠物互动操作
router.post('/:id/action', async (req, res) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({ error: '请指定操作类型' });
  }

  try {
    const result = await petModel.petAction(req.params.id, action);
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 删除宠物
router.delete('/:id', async (req, res) => {
  try {
    const pet = await petModel.getPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: '宠物不存在' });
    }

    await petModel.deletePet(req.params.id);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    return res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
