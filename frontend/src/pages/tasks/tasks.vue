<template>
  <view class="tasks-container">
    <!-- 任务头部 -->
    <view class="tasks-header">
      <view class="header-content">
        <text class="tasks-title">每日任务</text>
        <text class="tasks-subtitle">完成任务获得奖励</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
          <text class="progress-text">{{ completedTasks }}/{{ totalTasks }}</text>
        </view>
      </view>
    </view>

    <!-- 任务列表 -->
    <scroll-view class="tasks-list" scroll-y="true">
      <view
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.completed }"
      >
        <view class="task-icon">
          <text class="icon-emoji">{{ task.emoji }}</text>
        </view>

        <view class="task-content">
          <text class="task-title">{{ task.title }}</text>
          <view class="task-progress">
            <view class="progress-bg">
              <view class="progress-fill" :style="{ width: task.progressPercent + '%' }"></view>
            </view>
            <text class="progress-text">{{ task.current }}/{{ task.target }}</text>
          </view>
        </view>

        <view class="task-reward">
          <text class="reward-amount">💰 {{ task.reward?.coins || 0 }}</text>
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

    <!-- 任务提示 -->
    <view class="task-tips">
      <text class="tips-title">💡 小贴士</text>
      <text class="tips-content">每天完成任务可以获得金币和经验！</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { tasksAPI } from '@/services/api'

const tasks = ref<any[]>([])
const authStore = useAuthStore()

const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)
const progressPercent = computed(() => totalTasks.value ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0)

const claimReward = async (task: any) => {
  if (!task.completed || task.claimed) return
  try {
    const userId = authStore.userId || 1
    const res = await tasksAPI.claim(task.id, userId)
    task.claimed = true
    authStore.updateCoins(res.reward?.coins || 0)
    uni.showToast({ title: '奖励领取成功！', icon: 'success' })
  } catch (err: any) {
    uni.showToast({ title: err?.error || '领取失败', icon: 'error' })
  }
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
  background: var(--bg-page);
  padding-bottom: 40px;
}

/* 头部 */
.tasks-header {
  background: var(--primary);
  padding: 50px 16px 20px;
}

.header-content {
  display: block;
}

.tasks-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 4px;
}

.tasks-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  display: block;
  margin-bottom: 14px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-full);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #fff;
  border-radius: var(--radius-full);
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 600;
  color: #fff;
}

/* 列表 */
.tasks-list {
  padding: 12px 16px;
}

.task-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
}

.task-card.completed {
  border-color: var(--success);
}

.task-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.task-card.completed .task-icon {
  background: #D1FAE5;
}

.icon-emoji {
  font-size: 22px;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  margin-bottom: 6px;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bg {
  flex: 1;
  height: 6px;
  background: var(--bg-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.task-progress .progress-fill {
  background: var(--primary);
}

.task-progress .progress-text {
  position: static;
  transform: none;
  font-size: 11px;
  color: var(--text-muted);
}

.task-reward {
  margin: 0 12px;
}

.reward-amount {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.task-action {
  min-width: 64px;
}

.action-btn {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  border: none;
}

.action-btn.disabled {
  background: var(--bg-gray);
  color: var(--text-muted);
}

.action-btn.claim {
  background: var(--primary);
  color: #fff;
}

.action-btn.claimed {
  background: #D1FAE5;
  color: var(--primary-dark);
}

/* 提示 */
.task-tips {
  margin: 0 16px;
  padding: 14px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.tips-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.tips-content {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
