<template>
  <div class="tasks-container">
    <!-- 任务头部 -->
    <div class="tasks-header">
      <div class="header-content">
        <span class="tasks-title">每日任务</span>
        <span class="tasks-subtitle">完成任务获得奖励</span>
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="progress-text">{{ completedTasks }}/{{ totalTasks }}</span>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="{ completed: task.completed }"
      >
        <div class="task-icon">
          <span class="icon-emoji">{{ task.emoji }}</span>
        </div>

        <div class="task-content">
          <span class="task-title">{{ task.title }}</span>
          <div class="task-progress">
            <div class="progress-bg">
              <div class="progress-fill" :style="{ width: task.progressPercent + '%' }"></div>
            </div>
            <span class="progress-text">{{ task.current }}/{{ task.target }}</span>
          </div>
        </div>

        <div class="task-reward">
          <span class="reward-amount">💰 {{ task.reward?.coins || 0 }}</span>
        </div>

        <div class="task-action">
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
        </div>
      </div>
    </div>

    <!-- 任务提示 -->
    <div class="task-tips">
      <span class="tips-title">💡 小贴士</span>
      <span class="tips-content">每天完成任务可以获得金币和经验！</span>
    </div>
  </div>
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
  padding-bottom: 80px;
}

/* 头部 */
.tasks-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 50px 16px 24px;
}

.header-content {
  display: block;
}

.tasks-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 4px;
}

.tasks-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  display: block;
  margin-bottom: 16px;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fff, rgba(255,255,255,0.8));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

/* 列表 */
.tasks-list {
  padding: 16px;
}

.task-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
  flex-shrink: 0;
}

.task-card.completed .task-icon {
  background: #D1FAE5;
}

.icon-emoji {
  font-size: 22px;
}

.task-content {
  flex: 1;
  min-width: 0;
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
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
}

.task-progress .progress-text {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 36px;
}

.task-reward {
  margin: 0 10px;
  flex-shrink: 0;
}

.reward-amount {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.task-action {
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.action-btn.disabled {
  background: var(--bg-gray);
  color: var(--text-muted);
}

.action-btn.claim {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
}

.action-btn.claim:active {
  opacity: 0.9;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
