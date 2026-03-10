const db = require('../db');
const statsModel = require('./stats');

async function createPet(userId, name, type) {
  const sql = `INSERT INTO pets (user_id, name, type, level, experience, hunger, happiness, energy) VALUES (?,?,?,1,0,50,50,100)`;
  const result = await db.run(sql, [userId, name, type]);
  return result.insertId;
}

async function listPetsByUser(userId) {
  return await db.all(`SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
}

async function getPetById(id) {
  return await db.get(`SELECT * FROM pets WHERE id = ?`, [id]);
}

async function updatePet(id, data) {
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.level !== undefined) {
    fields.push('level = ?');
    values.push(data.level);
  }
  if (data.experience !== undefined) {
    fields.push('experience = ?');
    values.push(data.experience);
  }
  if (data.hunger !== undefined) {
    fields.push('hunger = ?');
    values.push(Math.max(0, Math.min(100, data.hunger)));
  }
  if (data.happiness !== undefined) {
    fields.push('happiness = ?');
    values.push(Math.max(0, Math.min(100, data.happiness)));
  }
  if (data.energy !== undefined) {
    fields.push('energy = ?');
    values.push(Math.max(0, Math.min(100, data.energy)));
  }

  if (fields.length === 0) {
    return 0;
  }

  fields.push('updated_at = NOW()');
  values.push(id);

  const result = await db.run(`UPDATE pets SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows;
}

// 宠物互动操作
async function petAction(id, action) {
  const pet = await getPetById(id);
  if (!pet) {
    throw new Error('宠物不存在');
  }

  let updateData = { ...pet };
  let expGain = 0;

  switch(action) {
    case 'feed':
      updateData.hunger = Math.min(100, pet.hunger + 25);
      expGain = 5;
      break;
    case 'play':
      updateData.happiness = Math.min(100, pet.happiness + 15);
      updateData.energy = Math.max(0, pet.energy - 5);
      expGain = 8;
      break;
    case 'train':
      updateData.experience = pet.experience + 15;
      updateData.energy = Math.max(0, pet.energy - 10);
      expGain = 15;
      break;
    case 'clean':
      updateData.happiness = Math.min(100, pet.happiness + 10);
      expGain = 3;
      break;
    default:
      throw new Error('无效的操作');
  }

  // 检查升级
  const expNeeded = pet.level * 100;
  if (updateData.experience >= expNeeded) {
    updateData.level = pet.level + 1;
    updateData.experience = updateData.experience - expNeeded;
  }

  await updatePet(id, updateData);
  try {
    await statsModel.recordAction(pet.user_id, action);
  } catch (e) {
    console.error('Failed to record stats:', e);
  }

  return {
    success: true,
    pet: { ...pet, ...updateData },
    expGain,
    leveledUp: updateData.level > pet.level
  };
}

async function deletePet(id) {
  const result = await db.run(`DELETE FROM pets WHERE id = ?`, [id]);
  return result.affectedRows;
}

// 获取宠物类型列表
function getPetTypes() {
  const types = [
    { id: 'dog', name: '狗狗', emoji: '🐶', baseExp: 100 },
    { id: 'cat', name: '猫咪', emoji: '🐱', baseExp: 100 },
    { id: 'rabbit', name: '兔子', emoji: '🐰', baseExp: 80 },
    { id: 'hamster', name: '仓鼠', emoji: '🐹', baseExp: 80 },
    { id: 'parrot', name: '鹦鹉', emoji: '🦜', baseExp: 90 },
    { id: 'fish', name: '金鱼', emoji: '🐠', baseExp: 70 }
  ];
  return types;
}

module.exports = {
  createPet,
  listPetsByUser,
  getPetById,
  updatePet,
  petAction,
  deletePet,
  getPetTypes
};
