<template>
  <div class="pets-container">
    <!-- 头部 -->
    <div class="header">
      <span class="title">我的宠物</span>
      <button class="btn-add" @click="goToAddPet">+ 添加</button>
    </div>

    <!-- 宠物列表 -->
    <div v-if="pets.length === 0" class="empty-state">
      <span class="empty-icon">🐾</span>
      <span class="empty-title">还没有宠物</span>
      <span class="empty-desc">快来领养你的第一只宠物吧！</span>
      <button class="btn-create" @click="goToAddPet">领养宠物</button>
    </div>

    <div v-else class="pets-grid">
      <div 
        v-for="pet in pets"
        :key="pet.id"
        class="pet-card"
        :style="{ background: getPetColor(pet.type) }"
        @click="goPetDetail(pet.id)"
      >
        <span class="pet-avatar">{{ getPetEmoji(pet.type) }}</span>
        <div class="pet-info">
          <span class="pet-name">{{ pet.name }}</span>
          <span class="pet-type">{{ pet.type }}</span>
        </div>
        <div class="pet-level">
          <span class="level-badge">Lv.{{ pet.level }}</span>
        </div>
        <div class="pet-stats">
          <div class="stat-row">
            <span class="stat-label">饱食</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: pet.hunger + '%', background: '#22c55e' }"></div>
            </div>
          </div>
          <div class="stat-row">
            <span class="stat-label">快乐</span>
            <div class="stat-bar">
              <div class="stat-fill" :style="{ width: pet.happiness + '%', background: '#f59e0b' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  background: var(--bg-page);
  min-height: 100vh;
  padding-bottom: 32px;
}

/* 头部 */
.header {
  background: var(--primary);
  padding: 50px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.btn-add {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  border: none;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 14px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.btn-create {
  background: var(--primary);
  color: #fff;
  padding: 12px 28px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  border: none;
}

/* 宠物网格 */
.pets-grid {
  padding: 12px 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.pet-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  border: 1px solid var(--border);
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
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.pet-type {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
}

.pet-level {
  text-align: center;
  margin-bottom: 10px;
}

.level-badge {
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
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
  font-weight: 500;
  color: var(--text-muted);
  width: 22px;
}

.stat-bar {
  flex: 1;
  height: 5px;
  background: var(--bg-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: var(--radius-full);
}
</style>
