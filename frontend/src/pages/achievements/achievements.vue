<template>
  <div class="achievements-container">
    <!-- 头部 -->
    <div class="achievements-header">
      <span class="title">成就系统</span>
      <span class="subtitle">已完成 {{ completedCount }}/{{ totalCount }} 个成就</span>
    </div>

    <!-- 成就列表 -->
    <scroll-view class="achievements-list" scroll-y="true">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-card"
        :class="{ completed: achievement.completed }"
      >
        <div class="achievement-icon">
          {{ achievement.completed ? achievement.icon : '🔒' }}
        </div>
        <div class="achievement-content">
          <span class="achievement-name">{{ achievement.name }}</span>
          <span class="achievement-desc">{{ achievement.description }}</span>
          <div class="achievement-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: achievement.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ achievement.current }}/{{ achievement.target }}</span>
          </div>
        </div>
        <div class="achievement-reward" v-if="achievement.completed && !achievement.claimed" @click="claimReward(achievement)">
          <span class="reward-text">领取</span>
        </div>
        <div class="achievement-reward" v-else-if="achievement.claimed">
          <span class="reward-text claimed">已领取</span>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { achievementsAPI } from '@/services/api'

const achievements = ref<any[]>([])
const authStore = useAuthStore()

const completedCount = computed(() => achievements.value.filter(a => a.completed).length)
const totalCount = computed(() => achievements.value.length)

const loadAchievements = async () => {
  try {
    const userId = authStore.userId || 1
    const data = await achievementsAPI.list(userId)
    achievements.value = data || []
  } catch (err) {
    console.error('加载成就失败:', err)
  }
}

const claimReward = async (achievement: any) => {
  if (!achievement.completed || achievement.claimed) return
  try {
    const userId = authStore.userId || 1
    await achievementsAPI.claim(achievement.id, userId)
    achievement.claimed = true
    uni.showToast({ title: '奖励领取成功！', icon: 'success' })
  } catch (err: any) {
    uni.showToast({ title: err?.error || '领取失败', icon: 'error' })
  }
}

onMounted(() => {
  loadAchievements()
})
</script>

<style scoped>
.achievements-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 40px;
}

/* 头部 */
.achievements-header {
  background: var(--primary);
  padding: 50px 16px 20px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

/* 列表 */
.achievements-list {
  padding: 12px 16px;
}

.achievement-card {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid var(--border);
}

.achievement-card.completed {
  border-color: var(--success);
  background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
}

.achievement-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.achievement-card.completed .achievement-icon {
  background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 8px;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: var(--radius-full);
}

.progress-text {
  font-size: 11px;
  color: var(--text-muted);
  width: 36px;
  text-align: right;
}

.achievement-reward {
  margin-left: 10px;
}

.reward-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: var(--radius-full);
}

.reward-text.claimed {
  color: var(--text-muted);
  background: var(--bg-gray);
}
</style>
