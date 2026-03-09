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
        :style="{ background: getPetColor(pet.type) }"
        @click="goPetDetail(pet.id)"
      >
        <text class="pet-avatar">{{ getPetEmoji(pet.type) }}</text>
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
              <view class="stat-fill" :style="{ width: pet.hunger + '%', background: '#22c55e' }"></view>
            </view>
          </view>
          <view class="stat-row">
            <text class="stat-label">快乐</text>
            <view class="stat-bar">
              <view class="stat-fill" :style="{ width: pet.happiness + '%', background: '#f59e0b' }"></view>
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

const petColors: Record<string, string> = {
  'dog': '#f1f5f9',
  'cat': '#f0fdf4',
  'rabbit': '#fef3c7',
  'hamster': '#fdf2f8',
  'parrot': '#f0f9ff',
  'fish': '#eff6ff'
};

const getPetEmoji = (type: string) => petEmojis[type] || '🐾';
const getPetColor = (type: string) => petColors[type] || '#f1f5f9';

const loadPets = async () => {
  try {
    const userId = authStore.userId || 1;
    const res = await petAPI.listPetsByUser(userId);
    pets.value = res || [];
  } catch (err) {
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
  background: #f8fafc;
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 48px 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.btn-add {
  background: #22c55e;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  border: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.btn-create {
  background: #22c55e;
  color: #fff;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
}

.pets-grid {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.pet-card {
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.pet-avatar {
  font-size: 40px;
  display: block;
  text-align: center;
  margin-bottom: 10px;
}

.pet-info {
  text-align: center;
  margin-bottom: 8px;
}

.pet-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.pet-type {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.pet-level {
  text-align: center;
  margin-bottom: 10px;
}

.level-badge {
  background: #e2e8f0;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #475569;
}

.pet-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-label {
  font-size: 10px;
  color: #64748b;
  width: 24px;
}

.stat-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 2px;
}
</style>
