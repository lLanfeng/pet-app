const express = require('express');
const router = express.Router();
const petModel = require('../models/pet');

// 获取可领养的宠物类型
router.get('/types', (req, res) => {
  petModel.getPetTypes((err, types) => {
    if (err) {
      return res.status(500).json({ error: '获取宠物类型失败' });
    }
    res.json(types);
  });
});

// 创建宠物
router.post('/', (req, res) => {
  const { userId, name, type } = req.body;
  
  if (!userId || !name || !type) {
    return res.status(400).json({ error: '请填写所有字段' });
  }

  petModel.createPet(userId, name, type, (err, id) => {
    if (err) {
      return res.status(500).json({ error: '创建宠物失败' });
    }
    
    petModel.getPetById(id, (err, pet) => {
      res.json(pet);
    });
  });
});

// 获取用户的所有宠物
router.get('/user/:userId', (req, res) => {
  petModel.listPetsByUser(req.params.userId, (err, pets) => {
    if (err) {
      return res.status(500).json({ error: '获取宠物列表失败' });
    }
    res.json(pets || []);
  });
});

// 获取单个宠物信息
router.get('/:id', (req, res) => {
  petModel.getPetById(req.params.id, (err, pet) => {
    if (err) {
      return res.status(500).json({ error: '获取宠物信息失败' });
    }
    if (!pet) {
      return res.status(404).json({ error: '宠物不存在' });
    }
    res.json(pet);
  });
});

// 更新宠物信息
router.put('/:id', (req, res) => {
  const { name, level, experience, hunger, happiness, energy } = req.body;
  
  petModel.getPetById(req.params.id, (err, pet) => {
    if (err || !pet) {
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

    petModel.updatePet(req.params.id, updateData, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: '更新失败' });
      }
      
      petModel.getPetById(req.params.id, (err, updatedPet) => {
        res.json(updatedPet);
      });
    });
  });
});

// 宠物互动操作
router.post('/:id/action', (req, res) => {
  const { action } = req.body;
  
  if (!action) {
    return res.status(400).json({ error: '请指定操作类型' });
  }
  
  petModel.petAction(req.params.id, action, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// 删除宠物
router.delete('/:id', (req, res) => {
  petModel.getPetById(req.params.id, (err, pet) => {
    if (err || !pet) {
      return res.status(404).json({ error: '宠物不存在' });
    }

    petModel.deletePet(req.params.id, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: '删除失败' });
      }
      res.json({ success: true, message: '删除成功' });
    });
  });
});

module.exports = router;
