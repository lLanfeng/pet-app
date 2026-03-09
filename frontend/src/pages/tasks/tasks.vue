<template>
  <view class="tasks-container">
    <!--    <view class 任务头部 -->
="tasks-header">
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
  background: #f8fafc;
}

.tasks-header {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.tasks-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.tasks-subtitle {
  font-size: 13px;
  color: #64748b;
  display: block;
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #22c55e;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 600;
  color: #1e293b;
}

.tasks-list {
  height: calc(100vh - 220px);
  padding: 12px 16px;
}

.task-card {
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.task-card.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.task-icon {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.icon-emoji {
  font-size: 20px;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
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
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.task-reward {
  margin: 0 12px;
}

.reward-amount {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
}

.task-action {
  min-width: 60px;
}

.action-btn {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  border: none;
}

.action-btn.disabled {
  background: #e2e8f0;
  color: #94a3b8;
}

.action-btn.claim {
  background: #22c55e;
  color: #fff;
}

.action-btn.claimed {
  background: #bbf7d0;
  color: #16a34a;
}

.task-tips {
  padding: 16px;
  background: #fff;
  margin: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 6px;
}

.tips-content {
  font-size: 13px;
  color: #64748b;
}
</style>
