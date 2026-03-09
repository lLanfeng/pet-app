<template>
  <view class="pets-container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">我的宠物</text>
      <button class="btn-add" @click="goToAddPet">+ 添加</button>
    </view>

    <!-- 宠物列表 -->
    <view v-if="pets.length === 0" class="empty-state">
      <text class="empty-icon">🐾</text>
      <text class="empty-title">还没有宠物</text>
      <text class="empty-desc">快来领养你的第一只宠物吧！</text>
      <button class="btn-create" @click="goToAddPet">领养宠物</button>
    </view>

    <view v-else class="pets-grid">
      <view 
        v-for="pet in pets"
        :key="pet.id"
        class="pet-card"
        :style="{ background: getPetGradient(pet.type) }"
        @click="goPetDetail(pet.id)"
      >
        <view class="pet-avatar">{{ getPetEmoji(pet.type) }}</view>
        <view class="pet-info">
          <text class="pet-name">{{ pet.name }}</text>
          <text class="pet-type">{{ pet.type }}</text>
        </view>
        <view class="pet-level">
          <text class="level-badge">Lv.{{ pet.level }}</text>
        </view>
        <view class="pet-stats">
          <view class="stat-row">
            <text class="stat-label">饱食</text>
            <view class="stat-bar">
              <view class="stat-fill hunger" :style="{ width: pet.hunger + '%' }"></view>
            </view>
          </view>
          <view class="stat-row">
            <text class="stat-label">快乐</text>
            <view class="stat-bar">
              <view class="stat-fill happiness" :style="{ width: pet.happiness + '%' }"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { petAPI } from '@/services/api';

const authStore = useAuthStore();
const pets = ref<any[]>([]);

const petEmojis: Record<string, string> = {
  'dog': '🐶', 'cat': '🐱', 'rabbit': '🐰', 'hamster': '🐹', 'parrot': '🦜', 'fish': '🐠'
};

const petGradients: Record<string, string> = {
  'dog': 'linear-gradient(135deg, #667eea, #764ba2)',
  'cat': 'linear-gradient(135deg, #f093fb, #f5576c)',
  'rabbit': 'linear-gradient(135deg, #4ecdc4, #44a08d)',
  'hamster': 'linear-gradient(135deg, #ffd93d, #ff6b6b)',
  'parrot': 'linear-gradient(135deg, #a8edea, #fed6e3)',
  'fish': 'linear-gradient(135deg, #89f7fe, #66a6ff)'
};

const getPetEmoji = (type: string) => petEmojis[type] || '🐾';
const getPetGradient = (type: string) => petGradients[type] || 'linear-gradient(135deg, #667eea, #764ba2)';

const loadPets = async () => {
  try {
    const userId = authStore.userId || 1;
    const res = await petAPI.listPetsByUser(userId);
    pets.value = res || [];
  } catch (err) {
    // 使用演示数据
    pets.value = [
      { id: 1, name: '小球球', type: 'dog', level: 8, hunger: 85, happiness: 90 },
      { id: 2, name: '咪咪', type: 'cat', level: 5, hunger: 60, happiness: 75 }
    ];
  }
};

const goToAddPet = () => uni.navigateTo({ url: '/pages/pets/add' });
const goPetDetail = (id: number) => uni.navigateTo({ url: `/pages/pets/detail?id=${id}` });

onMounted(() => {
  loadPets();
});
</script>

<style scoped>
.pets-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding-bottom: 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.btn-add {
  background: white;
  color: #667eea;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.empty-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 40px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  border: none;
}

.pets-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.pet-card {
  border-radius: 22px;
  padding: 20px;
  color: white;
  box-shadow: 0 10px 0 rgba(0,0,0,0.08), 0 18px 30px rgba(0,0,0,0.12);
  border: 2px solid rgba(255,255,255,0.4);
}

.pet-avatar {
  font-size: 48px;
  text-align: center;
  margin-bottom: 12px;
}

.pet-info {
  text-align: center;
  margin-bottom: 10px;
}

.pet-name {
  display: block;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.pet-type {
  display: block;
  font-size: 12px;
  opacity: 0.85;
}

.pet-level {
  text-align: center;
  margin-bottom: 12px;
}

.level-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.pet-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 11px;
  width: 28px;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 3px;
}

.stat-fill.hunger { background: #4ecdc4; }
.stat-fill.happiness { background: #ff69b4; }
</style>
