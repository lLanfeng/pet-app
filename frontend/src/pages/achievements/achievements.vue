<template>
  <view class="achievements-container">
    <!-- 头部 -->
    <view class="achievements-header">
      <text class="title">🎖️ 成就系统</text>
      <text class="subtitle">完成成就获得丰厚奖励</text>
      <view class="achievement-progress">
        <text class="progress-text">已完成 {{ completedCount }}/{{ totalCount }} 个成就</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </view>
    </view>

    <!-- 成就分类 -->
    <view class="category-tabs">
      <view 
        v-for="cat in categories" 
        :key="cat.id"
        class="tab"
        :class="{ active: activeCategory === cat.id }"
        @click="switchCategory(cat.id)"
      >
        <text class="tab-icon">{{ cat.icon }}</text>
        <text class="tab-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 成就列表 -->
    <scroll-view class="achievements-list" scroll-y="true">
      <!-- 里程碑成就 -->
      <view class="category-section" v-if="activeCategory === 'all' || activeCategory === 'milestone'">
        <view class="category-title" v-if="activeCategory === 'all'">🏆 里程碑成就</view>
        <view 
          v-for="achievement in milestoneAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ completed: achievement.completed }"
        >
          <view class="achievement-icon">
            {{ achievement.completed ? achievement.icon : '🔒' }}
          </view>
          <view class="achievement-content">
            <text class="achievement-name">{{ achievement.name }}</text>
            <text class="achievement-desc">{{ achievement.description }}</text>
            <view class="achievement-progress-info">
              <view class="progress-mini">
                <view class="progress-fill-mini" :style="{ width: achievement.progress + '%' }"></view>
              </view>
              <text class="progress-text-mini">{{ achievement.current }}/{{ achievement.target }}</text>
            </view>
          </view>
          <view class="achievement-reward">
            <text class="reward-icon">🎁</text>
            <text class="reward-value">{{ formatReward(achievement.reward) }}</text>
            <button
              v-if="achievement.completed && !achievement.claimed"
              class="claim-btn"
              @click="claimAchievement(achievement)"
            >
              领取
            </button>
            <text v-else-if="achievement.claimed" class="claimed-text">已领取</text>
          </view>
          <view class="completed-badge" v-if="achievement.completed">✓</view>
        </view>
      </view>

      <!-- 互动成就 -->
      <view class="category-section" v-if="activeCategory === 'all' || activeCategory === 'interaction'">
        <view class="category-title" v-if="activeCategory === 'all'">💬 互动成就</view>
        <view 
          v-for="achievement in interactionAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ completed: achievement.completed }"
        >
          <view class="achievement-icon">
            {{ achievement.completed ? achievement.icon : '🔒' }}
          </view>
          <view class="achievement-content">
            <text class="achievement-name">{{ achievement.name }}</text>
            <text class="achievement-desc">{{ achievement.description }}</text>
            <view class="achievement-progress-info">
              <view class="progress-mini">
                <view class="progress-fill-mini" :style="{ width: achievement.progress + '%' }"></view>
              </view>
              <text class="progress-text-mini">{{ achievement.current }}/{{ achievement.target }}</text>
            </view>
          </view>
          <view class="achievement-reward">
            <text class="reward-icon">🎁</text>
            <text class="reward-value">{{ formatReward(achievement.reward) }}</text>
            <button
              v-if="achievement.completed && !achievement.claimed"
              class="claim-btn"
              @click="claimAchievement(achievement)"
            >
              领取
            </button>
            <text v-else-if="achievement.claimed" class="claimed-text">已领取</text>
          </view>
          <view class="completed-badge" v-if="achievement.completed">✓</view>
        </view>
      </view>

      <!-- 社交成就 -->
      <view class="category-section" v-if="activeCategory === 'all' || activeCategory === 'social'">
        <view class="category-title" v-if="activeCategory === 'all'">👥 社交成就</view>
        <view 
          v-for="achievement in socialAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ completed: achievement.completed }"
        >
          <view class="achievement-icon">
            {{ achievement.completed ? achievement.icon : '🔒' }}
          </view>
          <view class="achievement-content">
            <text class="achievement-name">{{ achievement.name }}</text>
            <text class="achievement-desc">{{ achievement.description }}</text>
            <view class="achievement-progress-info">
              <view class="progress-mini">
                <view class="progress-fill-mini" :style="{ width: achievement.progress + '%' }"></view>
              </view>
              <text class="progress-text-mini">{{ achievement.current }}/{{ achievement.target }}</text>
            </view>
          </view>
          <view class="achievement-reward">
            <text class="reward-icon">🎁</text>
            <text class="reward-value">{{ formatReward(achievement.reward) }}</text>
            <button
              v-if="achievement.completed && !achievement.claimed"
              class="claim-btn"
              @click="claimAchievement(achievement)"
            >
              领取
            </button>
            <text v-else-if="achievement.claimed" class="claimed-text">已领取</text>
          </view>
          <view class="completed-badge" v-if="achievement.completed">✓</view>
        </view>
      </view>

      <!-- 隐藏成就 -->
      <view class="category-section" v-if="activeCategory === 'all' || activeCategory === 'secret'">
        <view class="category-title" v-if="activeCategory === 'all'">🤫 隐藏成就</view>
        <view 
          v-for="achievement in secretAchievements" 
          :key="achievement.id"
          class="achievement-card secret"
          :class="{ completed: achievement.completed }"
        >
          <view class="achievement-icon">
            {{ achievement.completed ? achievement.icon : '❓' }}
          </view>
          <view class="achievement-content">
            <text class="achievement-name">{{ achievement.completed ? achievement.name : '???' }}</text>
            <text class="achievement-desc">{{ achievement.completed ? achievement.description : '完成特殊条件解锁' }}</text>
          </view>
          <view class="achievement-reward" v-if="achievement.completed">
            <text class="reward-icon">🎁</text>
            <text class="reward-value">{{ formatReward(achievement.reward) }}</text>
            <button
              v-if="achievement.completed && !achievement.claimed"
              class="claim-btn"
              @click="claimAchievement(achievement)"
            >
              领取
            </button>
            <text v-else-if="achievement.claimed" class="claimed-text">已领取</text>
          </view>
          <view class="completed-badge" v-if="achievement.completed">✓</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { achievementsAPI } from '@/services/api'

const categories = ref<any[]>([])
const activeCategory = ref('all')
const allAchievements = ref<any[]>([])
const authStore = useAuthStore()

const milestoneAchievements = computed(() => allAchievements.value.filter(a => a.category === 'milestone'))
const interactionAchievements = computed(() => allAchievements.value.filter(a => a.category === 'interaction'))
const socialAchievements = computed(() => allAchievements.value.filter(a => a.category === 'social'))
const secretAchievements = computed(() => allAchievements.value.filter(a => a.category === 'secret'))

// 计算属性
const totalCount = computed(() =>
  milestoneAchievements.value.length +
  interactionAchievements.value.length +
  socialAchievements.value.length +
  secretAchievements.value.length
)

const completedCount = computed(() =>
  [...milestoneAchievements.value, ...interactionAchievements.value, ...socialAchievements.value, ...secretAchievements.value]
    .filter(a => a.completed).length
)

const progressPercent = computed(() => Math.round((completedCount.value / totalCount.value) * 100))

// 方法
const switchCategory = (id: string) => {
  activeCategory.value = id
}

const formatReward = (reward: any) => {
  if (!reward) return ''
  if (reward.coins) return `💰 ${reward.coins}`
  if (reward.diamonds) return `💎 ${reward.diamonds}`
  return ''
}

const claimAchievement = async (achievement: any) => {
  if (!achievement.completed || achievement.claimed) return
  try {
    const userId = authStore.userId || 1
    const res = await achievementsAPI.claim(achievement.id, userId)
    achievement.claimed = true
    if (res.reward?.coins) authStore.updateCoins(res.reward.coins)
    if (res.reward?.diamonds) authStore.updateDiamonds(res.reward.diamonds)
    uni.showToast({ title: '奖励领取成功！', icon: 'success' })
  } catch (err: any) {
    uni.showToast({ title: err?.error || '领取失败', icon: 'error' })
  }
}

const loadAchievements = async () => {
  const userId = authStore.userId || 1
  const data = await achievementsAPI.list(userId)
  allAchievements.value = data || []
}

const loadCategories = async () => {
  const data = await achievementsAPI.categories()
  categories.value = data || []
}

onMounted(async () => {
  try {
    await loadCategories()
    await loadAchievements()
  } catch (err) {
    uni.showToast({ title: '加载成就失败', icon: 'error' })
  }
})
</script>

<style scoped>
.achievements-container {
  min-height: 100vh;
  background: radial-gradient(900px 500px at 0% 0%, rgba(255, 209, 102, 0.25), transparent 60%),
              radial-gradient(700px 500px at 100% 10%, rgba(63, 193, 201, 0.2), transparent 60%),
              var(--bg-base);
}

.achievements-header {
  background: linear-gradient(135deg, var(--accent-sun) 0%, var(--accent-coral) 100%);
  padding: 40px 20px 25px;
  color: white;
}

.title {
  font-size: 24px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  display: block;
  margin-bottom: 20px;
}

.achievement-progress {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px 15px;
}

.progress-text {
  font-size: 13px;
  display: block;
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s;
}

/* 分类 */
.category-tabs {
  display: flex;
  background: white;
  padding: 12px;
  gap: 8px;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 20px;
  background: #f5f5f5;
  white-space: nowrap;
}

.tab.active {
  background: linear-gradient(135deg, var(--accent-sun), var(--accent-coral));
  color: white;
}

.tab-icon {
  font-size: 14px;
  margin-right: 5px;
}

.tab-name {
  font-size: 13px;
  font-weight: 500;
}

/* 成就列表 */
.achievements-list {
  padding: 15px;
  height: calc(100vh - 230px);
}

.category-section {
  margin-bottom: 20px;
}

.category-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.achievement-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.achievement-card.completed {
  background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%);
}

.achievement-card.secret {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.achievement-card.secret .achievement-name,
.achievement-card.secret .achievement-desc {
  color: #fff;
}

.achievement-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--accent-mint) 0%, #3aafa9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.achievement-card.completed .achievement-icon {
  background: linear-gradient(135deg, var(--accent-sun) 0%, var(--accent-coral) 100%);
}

.achievement-content {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 3px;
}

.achievement-desc {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 6px;
}

.achievement-progress-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-mini {
  flex: 1;
  height: 5px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-mini {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-mint), #3aafa9);
  border-radius: 3px;
}

.achievement-card.completed .progress-fill-mini {
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
}

.progress-text-mini {
  font-size: 11px;
  color: #999;
}

.achievement-reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
  gap: 6px;
}

.reward-icon {
  font-size: 18px;
}

.reward-value {
  font-size: 12px;
  color: var(--accent-coral);
  font-weight: bold;
}

.claim-btn {
  border: none;
  padding: 6px 10px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-mint), #3aafa9);
  color: white;
  font-size: 11px;
  font-weight: 600;
}

.claimed-text {
  font-size: 11px;
  color: var(--text-muted);
}

.completed-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: #4ecdc4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
</style>
