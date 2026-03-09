<template>
  <view class="achievements-container">
    <!-- 头部 -->
    <view class="achievements-header">
      <text class="title">成就系统</text>
      <text class="subtitle">已完成 {{ completedCount }}/{{ totalCount }} 个成就</text>
    </view>

    <!-- 成就列表 -->
    <scroll-view class="achievements-list" scroll-y="true">
      <view 
        v-for="achievement in achievements" 
        :key="achievement.id"
        class="achievement-card"
        :class="{ completed: achievement.completed }"
      >
        <view class="achievement-icon">
          {{ achievement.completed ? achievement.icon : '🔒' }}
        </view>
        <view class="achievement<text class="achie-content">
          vement-name">{{ achievement.name }}</text>
          <text class="achievement-desc">{{ achievement.description }}</text>
          <view class="achievement-progress">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: achievement.progress + '%' }"></view>
            </view>
            <text class="progress-text">{{ achievement.current }}/{{ achievement.target }}</text>
          </view>
        </view>
        <view class="achievement-reward" v-if="achievement.completed">
          <text class="reward-text">💰 {{ achievement.reward?.coins || 0 }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const achievements = ref([
  { id: 1, icon: '🎉', name: '首次登录', description: '完成首次登录', current: 1, target: 1, completed: true, reward: { coins: 10 } },
  { id: 2, icon: '🐾', name: '养只宠物', description: '获得第一只宠物', current: 1, target: 1, completed: true, reward: { coins: 50 } },
  { id: 3, icon: '⭐', name: '升级达人', description: '宠物升到10级', current: 8, target: 10, completed: false, reward: { coins: 100 } },
  { id: 4, icon: '💰', name: '小有积蓄', description: '拥有100金币', current: 50, target: 100, completed: false, reward: { coins: 20 } },
])

const completedCount = computed(() => achievements.value.filter(a => a.completed).length)
const totalCount = computed(() => achievements.value.length)
</script>

<style scoped>
.achievements-container {
  min-height: 100vh;
  background: #f8fafc;
}

.achievements-header {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
}

.achievements-list {
  padding: 12px 16px;
  height: calc(100vh - 100px);
}

.achievement-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
}

.achievement-card.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.achievement-icon {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 12px;
}

.achievement-card.completed .achievement-icon {
  background: #fef3c7;
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 6px;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #22c55e;
  border-radius: 2px;
}

.progress-text {
  font-size: 11px;
  color: #94a3b8;
}

.achievement-reward {
  margin-left: 10px;
}

.reward-text {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
}
</style>
