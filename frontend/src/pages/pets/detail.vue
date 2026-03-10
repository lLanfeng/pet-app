<template>
  <div class="detail-page">
    <!-- 头部 -->
    <div class="detail-header">
      <span class="pet-avatar">{{ petEmoji }}</span>
      <div class="pet-info">
        <span class="pet-name">{{ petName }}</span>
        <div class="pet-tags">
          <span class="pet-tag">{{ petType }}</span>
          <span class="pet-tag">Lv.{{ petLevel }}</span>
        </div>
      </div>
    </div>

    <!-- 经验 -->
    <div class="detail-card">
      <div class="exp-row">
        <span class="exp-label">经验值</span>
        <span class="exp-value">{{ experience }}/{{ expNeed }}</span>
      </div>
      <div class="exp-bar">
        <div class="exp-fill" :style="{width: expPercent + '%'}"></div>
      </div>
    </div>

    <!-- 属性 -->
    <div class="detail-card">
      <div class="stat-item">
        <span class="stat-icon">🍖</span>
        <span class="stat-name">饱食</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{width: hunger + '%', background: '#10B981'}"></div>
        </div>
        <span class="stat-num">{{ hunger }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">😊</span>
        <span class="stat-name">快乐</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{width: happiness + '%', background: '#F59E0B'}"></div>
        </div>
        <span class="stat-num">{{ happiness }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⚡</span>
        <span class="stat-name">活力</span>
        <div class="stat-bar">
          <div class="stat-fill" :style="{width: energy + '%', background: '#3B82F6'}"></div>
        </div>
        <span class="stat-num">{{ energy }}%</span>
      </div>
    </div>

    <!-- 互动 -->
    <div class="detail-card">
      <span class="card-title">互动</span>
      <div class="action-grid">
        <div class="action-btn" @click="action('feed')">
          <span class="action-icon">🍖</span>
          <span class="action-name">喂食</span>
        </div>
        <div class="action-btn" @click="action('play')">
          <span class="action-icon">🎾</span>
          <span class="action-name">玩耍</span>
        </div>
        <div class="action-btn" @click="action('train')">
          <span class="action-icon">📚</span>
          <span class="action-name">训练</span>
        </div>
        <div class="action-btn" @click="action('clean')">
          <span class="action-icon">🛁</span>
          <span class="action-name">清洁</span>
        </div>
      </div>
    </div>

    <!-- 记录 -->
    <div class="detail-card">
      <span class="card-title">记录</span>
      <div class="record-list">
        <div class="record-item" v-for="(r, i) in records" :key="i">
          <span class="record-icon">{{ r.icon }}</span>
          <span class="record-text">{{ r.text }}</span>
          <span class="record-time">{{ r.time }}</span>
        </div>
      </div>
    </div>

    <!-- 删除 -->
    <div class="delete-btn" @click="remove">
      删除宠物
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { petAPI } from '@/services/api';

const route = useRoute();
const authStore = useAuthStore();

const petId = ref(Number(route.query.id) || 0);
const petEmoji = ref('🐶');
const petName = ref('小球球');
const petType = ref('狗狗');
const petLevel = ref(8);
const experience = ref(75);
const hunger = ref(65);
const happiness = ref(80);
const energy = ref(90);

const expNeed = computed(() => petLevel.value * 100);
const expPercent = computed(() => Math.round(experience.value / expNeed.value * 100));

const records = ref([
  { icon: '🎮', text: '和主人玩耍', time: '2小时前' },
  { icon: '🍖', text: '吃了狗粮', time: '5小时前' },
  { icon: '⭐', text: '升级到Lv.8', time: '昨天' }
]);

const emojiMap: Record<string, string> = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', parrot: '🦜', fish: '🐠' };
const typeMap: Record<string, string> = { dog: '狗狗', cat: '猫咪', rabbit: '兔子', hamster: '仓鼠', parrot: '鹦鹉', fish: '鱼' };

const loadPet = async () => {
  if (!petId.value) return;
  try {
    const pet = await petAPI.getPetById(petId.value);
    petName.value = pet.name;
    petEmoji.value = emojiMap[pet.type] || '🐾';
    petType.value = typeMap[pet.type] || pet.type;
    petLevel.value = pet.level;
    experience.value = pet.experience;
    hunger.value = pet.hunger;
    happiness.value = pet.happiness;
    energy.value = pet.energy || 100;
  } catch (err) {
    console.error('加载宠物失败:', err);
  }
};

const action = async (type: string) => {
  if (!petId.value) {
    switch(type) {
      case 'feed':
        hunger.value = Math.min(100, hunger.value + 25);
        uni.showToast({ title: '喂食成功 +25', icon: 'none' });
        break;
      case 'play':
        happiness.value = Math.min(100, happiness.value + 15);
        uni.showToast({ title: '玩耍愉快 +15', icon: 'none' });
        break;
      case 'train':
        experience.value += 15;
        if (experience.value >= expNeed.value) {
          petLevel.value++;
          experience.value = 0;
          uni.showToast({ title: '升级了！', icon: 'none' });
        } else {
          uni.showToast({ title: '训练完成 +15经验', icon: 'none' });
        }
        break;
      case 'clean':
        happiness.value = Math.min(100, happiness.value + 10);
        uni.showToast({ title: '清洁完成 +10', icon: 'none' });
        break;
    }
    return;
  }

  try {
    const res = await petAPI.action(petId.value, type);
    if (res.success) {
      hunger.value = res.pet.hunger;
      happiness.value = res.pet.happiness;
      experience.value = res.pet.experience;
      petLevel.value = res.pet.level;
      uni.showToast({ title: res.message || '操作成功', icon: 'none' });
    }
  } catch (err: any) {
    uni.showToast({ title: err?.error || '操作失败', icon: 'error' });
  }
};

const remove = async () => {
  uni.showModal({
    title: '提示',
    content: '确定删除 ' + petName.value + ' 吗？',
    success: async (res: any) => {
      if (res.confirm && petId.value) {
        try {
          await petAPI.deletePet(petId.value);
          uni.showToast({ title: '已删除', icon: 'none' });
          setTimeout(() => uni.navigateBack(), 1000);
        } catch (err) {
          uni.showToast({ title: '删除失败', icon: 'error' });
        }
      }
    }
  });
};

onMounted(() => {
  loadPet();
});
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 40px;
}

/* 头部 */
.detail-header {
  background: var(--primary);
  padding: 50px 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.pet-avatar {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.25);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.pet-info {
  flex: 1;
}

.pet-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 6px;
}

.pet-tags {
  display: flex;
  gap: 6px;
}

.pet-tag {
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(255,255,255,0.2);
  border-radius: var(--radius-full);
  color: #fff;
}

/* 通用卡片 */
.detail-card {
  background: var(--bg-card);
  margin: 12px 16px 0;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 12px;
}

/* 经验 */
.exp-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.exp-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.exp-value {
  font-size: 13px;
  color: var(--primary);
  font-weight: 500;
}

.exp-bar {
  height: 8px;
  background: var(--bg-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-full);
}

/* 属性 */
.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-icon {
  font-size: 16px;
  width: 28px;
  text-align: center;
}

.stat-name {
  font-size: 13px;
  color: var(--text-secondary);
  width: 36px;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 0 10px;
}

.stat-fill {
  height: 100%;
  border-radius: var(--radius-full);
}

.stat-num {
  font-size: 12px;
  color: var(--text-muted);
  width: 40px;
  text-align: right;
}

/* 互动 */
.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 6px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
}

.action-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.action-name {
  font-size: 11px;
  color: var(--text-secondary);
}

/* 记录 */
.record-list {
  display: flex;
  flex-direction: column;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.record-item:last-child {
  border-bottom: none;
}

.record-icon {
  font-size: 14px;
  margin-right: 8px;
}

.record-text {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
}

.record-time {
  font-size: 11px;
  color: var(--text-muted);
}

/* 删除按钮 */
.delete-btn {
  background: var(--bg-card);
  margin: 16px;
  padding: 14px;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 14px;
  color: var(--error);
  border: 1px solid var(--error);
}
</style>
