<template>
  <view class="tasks-container">
    <!-- 任务头部 -->
    <view class="tasks-header">
      <view class="header-content">
        <text class="tasks-title">📅 每日任务</text>
        <text class="tasks-subtitle">完成任务获得丰厚奖励！</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
          <text class="progress-text">{{ completedTasks }}/{{ totalTasks }}</text>
        </view>
      </view>
      <view class="reward-preview">
        <text class="reward-icon">🎁</text>
        <text class="reward-text">今日奖励</text>
      </view>
    </view>

    <!-- 任务列表 -->
    <scroll-view class="tasks-list" scroll-y="true">
      <view
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.completed, claimed: task.claimed }"
      >
        <view class="task-icon">
          <text class="icon-emoji">{{ task.emoji }}</text>
        </view>

        <view class="task-content">
          <text class="task-title">{{ task.title }}</text>
          <text class="task-desc">{{ task.description }}</text>
          <view class="task-progress">
            <view class="progress-bg">
              <view class="progress-fill" :style="{ width: task.progressPercent + '%' }"></view>
            </view>
            <text class="progress-text">{{ task.current }}/{{ task.target }}</text>
          </view>
        </view>

        <view class="task-reward">
          <view class="reward-item">
            <text class="reward-icon-small">💰</text>
            <text class="reward-amount">{{ task.reward.coins }}</text>
          </view>
          <view v-if="task.reward.exp" class="reward-item">
            <text class="reward-icon-small">⭐</text>
            <text class="reward-amount">{{ task.reward.exp }}</text>
          </view>
        </view>

        <view class="task-action">
          <button
            v-if="!task.completed"
            class="action-btn disabled"
            disabled
          >
            进行中
          </button>
          <button
            v-else-if="!task.claimed"
            class="action-btn claim"
            @click="claimReward(task)"
          >
            领取
          </button>
          <button
            v-else
            class="action-btn claimed"
            disabled
          >
            已领取
          </button>
        </view>
      </view>
    </scroll-view>

    <!-- 每日奖励弹窗 -->
    <view v-if="showRewardModal" class="reward-modal" @click="closeRewardModal">
      <view class="reward-content" @click.stop>
        <view class="reward-header">
          <text class="reward-title">🎉 奖励领取成功！</text>
          <view class="close-btn" @click="closeRewardModal">✕</view>
        </view>

        <view class="reward-items">
          <view class="reward-item-large">
            <text class="reward-emoji">💰</text>
            <text class="reward-amount-large">{{ currentReward?.coins || 0 }}</text>
            <text class="reward-desc">金币</text>
          </view>
          <view v-if="currentReward?.exp" class="reward-item-large">
            <text class="reward-emoji">⭐</text>
            <text class="reward-amount-large">{{ currentReward.exp }}</text>
            <text class="reward-desc">经验</text>
          </view>
        </view>

        <view class="reward-total">
          <text class="total-text">今日总奖励: 💰{{ todayTotalCoins }} 金币</text>
        </view>

        <button class="continue-btn" @click="closeRewardModal">继续任务</button>
      </view>
    </view>

    <!-- 任务提示 -->
    <view class="task-tips">
      <text class="tips-title">💡 小贴士</text>
      <text class="tips-content">每天完成任务可以获得大量金币和经验！金币可以在商店购买宠物用品，经验可以提升宠物等级。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { tasksAPI } from '@/services/api'

const tasks = ref<any[]>([])
const authStore = useAuthStore()
const showRewardModal = ref(false)
const currentReward = ref<any>(null)
const todayTotalCoins = ref(0)

// 计算属性
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)
const progressPercent = computed(() => totalTasks.value ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0)

// 方法
const claimReward = async (task: any) => {
  if (!task.completed || task.claimed) return

  try {
    const userId = authStore.userId || 1
    const res = await tasksAPI.claim(task.id, userId)
    task.claimed = true
    currentReward.value = res.reward
    todayTotalCoins.value += res.reward?.coins || 0
    authStore.updateCoins(res.reward?.coins || 0)

    showRewardModal.value = true

    uni.showToast({
      title: '奖励领取成功！',
      icon: 'success',
      duration: 2000
    })
  } catch (err: any) {
    uni.showToast({ title: err?.error || '领取失败', icon: 'error' })
  }

  
}

const closeRewardModal = () => {
  showRewardModal.value = false
  currentReward.value = null
}

onMounted(() => {
  const loadTasks = async () => {
    try {
      const userId = authStore.userId || 1
      const data = await tasksAPI.list(userId)
      tasks.value = (data || []).map((t: any) => ({
        ...t,
        progressPercent: t.progressPercent ?? Math.min(100, Math.round((t.current / t.target) * 100))
      }))
      todayTotalCoins.value = tasks.value
        .filter(t => t.claimed)
        .reduce((sum, t) => sum + (t.reward?.coins || 0), 0)
    } catch (err) {
      uni.showToast({ title: '加载任务失败', icon: 'error' })
    }
  }

  loadTasks()
})
</script>

<style scoped>
.tasks-container {
  min-height: 100vh;
  background: radial-gradient(900px 400px at 0% 0%, rgba(63, 193, 201, 0.25), transparent 60%),
              radial-gradient(700px 400px at 100% 10%, rgba(255, 209, 102, 0.25), transparent 60%),
              var(--bg-base);
  padding-bottom: 20px;
}

.tasks-header {
  background: rgba(255, 255, 255, 0.92);
  padding: 25px 20px;
  border-radius: 0 0 25px 25px;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  flex: 1;
}

.tasks-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  display: block;
  margin-bottom: 5px;
}

.tasks-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 15px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, var(--accent-mint), #6bd6b7);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: bold;
  color: #333;
}

.reward-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(45deg, var(--accent-sun), var(--accent-coral));
  padding: 12px 16px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.reward-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.reward-text {
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.tasks-list {
  height: calc(100vh - 250px);
  padding: 15px;
}

.task-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 6px 18px rgba(31, 41, 55, 0.08);
  border: 2px solid var(--stroke);
  transition: all 0.3s ease;
}

.task-card.completed {
  background: linear-gradient(45deg, rgba(63, 193, 201, 0.1), rgba(255, 209, 102, 0.12));
  border: 1px solid rgba(63, 193, 201, 0.4);
}

.task-card.claimed {
  opacity: 0.7;
}

.task-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ff9a8b, #ff6b6b);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.icon-emoji {
  font-size: 24px;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bg {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, var(--accent-mint), #6bd6b7);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 10px;
  color: #666;
  min-width: 35px;
  text-align: right;
}

.task-reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  gap: 4px;
}

.reward-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 10px;
}

.reward-icon-small {
  font-size: 12px;
  margin-right: 2px;
}

.reward-amount {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.task-action {
  min-width: 70px;
}

.action-btn {
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  min-width: 60px;
}

.action-btn.disabled {
  background: #f0f0f0;
  color: #999;
}

.action-btn.claim {
  background: linear-gradient(45deg, var(--accent-sun), var(--accent-coral));
  color: white;
}

.action-btn.claimed {
  background: var(--accent-mint);
  color: white;
}

/* 奖励弹窗 */
.reward-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.reward-content {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 2px solid var(--stroke);
}

.reward-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reward-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.close-btn {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.reward-items {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.reward-item-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(45deg, var(--accent-sun), var(--accent-coral));
  padding: 15px;
  border-radius: 15px;
  min-width: 80px;
}

.reward-emoji {
  font-size: 24px;
  margin-bottom: 5px;
}

.reward-amount-large {
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
}

.reward-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.reward-total {
  margin-bottom: 20px;
}

.total-text {
  font-size: 14px;
  color: #666;
}

.continue-btn {
  background: linear-gradient(45deg, var(--accent-mint), #3aafa9);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: bold;
  width: 100%;
}

.task-tips {
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.95);
  margin: 15px;
  border-radius: 15px;
  box-shadow: 0 6px 18px rgba(31, 41, 55, 0.08);
}

.tips-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.tips-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
