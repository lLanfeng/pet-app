<template>
  <view class="detail-page">
    <!-- 头部 -->
    <view class="detail-header">
      <view class="pet-avatar">{{ petEmoji }}</view>
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
          <view class="stat-fill" :style="{width: hunger + '%', background: '#4cd964'}"></view>
        </view>
        <text class="stat-num">{{ hunger }}%</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">😊</text>
        <text class="stat-name">快乐</text>
        <view class="stat-bar">
          <view class="stat-fill" :style="{width: happiness + '%', background: '#ff9500'}"></view>
        </view>
        <text class="stat-num">{{ happiness }}%</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">⚡</text>
        <text class="stat-name">活力</text>
        <view class="stat-bar">
          <view class="stat-fill" :style="{width: energy + '%', background: '#007aff'}"></view>
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
        uni.showToast({ title: '🎉 升级了！', icon: 'none' });
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
  background: var(--bg-base);
  padding-bottom: 40px;
}

.detail-header {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  padding: 60px 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.pet-avatar {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.25);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  border: 2px solid rgba(255,255,255,0.5);
}

.pet-info {
  flex: 1;
}

.pet-name {
  font-size: 24px;
  font-weight: 600;
  color: white;
  display: block;
  margin-bottom: 8px;
}

.pet-tags {
  display: flex;
  gap: 8px;
}

.pet-tag {
  font-size: 12px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.25);
  border-radius: 12px;
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
}

.exp-card {
  background: #fff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.exp-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.exp-label {
  font-size: 14px;
  color: #333;
}

.exp-value {
  font-size: 14px;
  color: #07c160;
  font-weight: 500;
}

.exp-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #07c160, #06ad56);
  border-radius: 3px;
}

.stat-card {
  background: #fff;
  margin: 0 16px 12px;
  padding: 16px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.stat-item {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-icon {
  font-size: 16px;
  width: 28px;
}

.stat-name {
  font-size: 14px;
  color: #333;
  width: 40px;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 12px;
}

.stat-fill {
  height: 100%;
  border-radius: 3px;
}

.stat-num {
  font-size: 13px;
  color: #666;
  width: 40px;
  text-align: right;
}

.action-card {
  background: #fff;
  margin: 0 16px 12px;
  padding: 16px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 14px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #fff;
  border-radius: 14px;
  border: 2px solid var(--stroke);
}

.action-icon {
  font-size: 22px;
  margin-bottom: 6px;
}

.action-name {
  font-size: 12px;
  color: #333;
}

.record-card {
  background: #fff;
  margin: 0 16px 12px;
  padding: 16px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.record-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.record-list {
  display: flex;
  flex-direction: column;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-icon {
  font-size: 16px;
  margin-right: 10px;
}

.record-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.delete-btn {
  background: #fff;
  margin: 24px 16px 0;
  padding: 14px;
  border-radius: 999px;
  text-align: center;
  font-size: 15px;
  color: #ff2d55;
  border: 2px solid #ff2d55;
  box-shadow: var(--shadow);
}
</style>
