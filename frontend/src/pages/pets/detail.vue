<template>
  <view class="detail-page">
    <!-- 头部 -->
    <view class="detail-header">
      <text class="pet-avatar">{{ petEmoji }}</text>
      <view class="pet-info">
        <text class="pet-name">{{ petName }}</text>
        <view class="pet-tags">
          <text class="pet-tag">{{ petType }}</text>
          <text class="pet-tag">Lv.{{ petLevel }}</text>
        </view>
      </view>
    </view>

    <!-- 经验 -->
    <view class="exp-card">
      <view class="exp-row">
        <text class="exp-label">经验</text>
        <text class="exp-value">{{ experience }}/{{ expNeed }}</text>
      </view>
      <view class="exp-bar">
        <view class="exp-fill" :style="{width: expPercent + '%'}"></view>
      </view>
    </view>

    <!-- 属性 -->
    <view class="stat-card">
      <view class="stat-item">
        <text class="stat-icon">🍖</text>
        <text class="stat-name">饱食</text>
        <view class="stat-bar">
          <view class="stat-fill" :style="{width: hunger + '%', background: '#22c55e'}"></view>
        </view>
        <text class="stat-num">{{ hunger }}%</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">😊</text>
        <text class="stat-name">快乐</text>
        <view class="stat-bar">
          <view class="stat-fill" :style="{width: happiness + '%', background: '#f59e0b'}"></view>
        </view>
        <text class="stat-num">{{ happiness }}%</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">⚡</text>
        <text class="stat-name">活力</text>
        <view class="stat-bar">
          <view class="stat-fill" :style="{width: energy + '%', background: '#3b82f6'}"></view>
        </view>
        <text class="stat-num">{{ energy }}%</text>
      </view>
    </view>

    <!-- 互动 -->
    <view class="action-card">
      <view class="action-title">互动</view>
      <view class="action-grid">
        <view class="action-btn" @click="action('feed')">
          <text class="action-icon">🍖</text>
          <text class="action-name">喂食</text>
        </view>
        <view class="action-btn" @click="action('play')">
          <text class="action-icon">🎾</text>
          <text class="action-name">玩耍</text>
        </view>
        <view class="action-btn" @click="action('train')">
          <text class="action-icon">📚</text>
          <text class="action-name">训练</text>
        </view>
        <view class="action-btn" @click="action('clean')">
          <text class="action-icon">🛁</text>
          <text class="action-name">清洁</text>
        </view>
      </view>
    </view>

    <!-- 记录 -->
    <view class="record-card">
      <view class="record-title">记录</view>
      <view class="record-list">
        <view class="record-item" v-for="(r, i) in records" :key="i">
          <text class="record-icon">{{ r.icon }}</text>
          <text class="record-text">{{ r.text }}</text>
          <text class="record-time">{{ r.time }}</text>
        </view>
      </view>
    </view>

    <!-- 删除 -->
    <view class="delete-btn" @click="remove">
      删除宠物
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

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

const action = (type) => {
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
};

const remove = () => {
  uni.showModal({
    title: '提示',
    content: '确定删除 ' + petName.value + ' 吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已删除', icon: 'none' });
        setTimeout(() => uni.navigateBack(), 1000);
      }
    }
  });
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f8fafc;
}

.detail-header {
  background: #fff;
  padding: 48px 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #e2e8f0;
}

.pet-avatar {
  width: 72px;
  height: 72px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.pet-info {
  flex: 1;
}

.pet-name {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 6px;
}

.pet-tags {
  display: flex;
  gap: 6px;
}

.pet-tag {
  font-size: 12px;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #475569;
}

.exp-card {
  background: #fff;
  margin: 12px 16px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.exp-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.exp-label {
  font-size: 13px;
  color: #475569;
}

.exp-value {
  font-size: 13px;
  color: #22c55e;
  font-weight: 500;
}

.exp-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: #22c55e;
  border-radius: 3px;
}

.stat-card {
  background: #fff;
  margin: 0 16px 12px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

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
}

.stat-name {
  font-size: 13px;
  color: #475569;
  width: 36px;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 10px;
}

.stat-fill {
  height: 100%;
  border-radius: 3px;
}

.stat-num {
  font-size: 12px;
  color: #64748b;
  width: 36px;
  text-align: right;
}

.action-card {
  background: #fff;
  margin: 0 16px 12px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.action-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

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
  background: #f8fafc;
  border-radius: 8px;
}

.action-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.action-name {
  font-size: 11px;
  color: #475569;
}

.record-card {
  background: #fff;
  margin: 0 16px 12px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.record-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.record-list {
  display: flex;
  flex-direction: column;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
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
  color: #334155;
}

.record-time {
  font-size: 11px;
  color: #94a3b8;
}

.delete-btn {
  background: #fff;
  margin: 20px 16px 0;
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  color: #ef4444;
  border: 1px solid #ef4444;
}
</style>
