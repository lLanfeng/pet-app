<template>
  <view class="rankings-container">
    <!-- 排行榜头部 -->
    <view class="rankings-header">
      <text class="rankings-title">🏆 宠物排行榜</text>
      <text class="rankings-subtitle">看看谁的宠物最厉害！</text>
    </view>

    <!-- 排行榜类型切换 -->
    <view class="ranking-types">
      <view
        v-for="type in rankingTypes"
        :key="type.id"
        class="ranking-type"
        :class="{ active: activeType === type.id }"
        @click="switchType(type.id)"
      >
        <text class="type-icon">{{ type.icon }}</text>
        <text class="type-name">{{ type.name }}</text>
      </view>
    </view>

    <!-- 我的排名 -->
    <view class="my-ranking">
      <view class="my-rank-card">
        <view class="rank-badge">
          <text class="rank-number">#{{ myRank }}</text>
        </view>
        <view class="my-info">
          <text class="my-name">我的排名</text>
          <text class="my-score">{{ myScore }} 分</text>
        </view>
        <view class="rank-trend">
          <text class="trend-icon" :class="{ up: trend > 0, down: trend < 0 }">
            {{ trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️' }}
          </text>
          <text class="trend-text">{{ Math.abs(trend) }}</text>
        </view>
      </view>
    </view>

    <!-- 排行榜列表 -->
    <scroll-view class="rankings-list" scroll-y="true">
      <view
        v-for="(item, index) in rankings"
        :key="item.id"
        class="ranking-item"
        :class="{ 'top-three': index < 3, 'my-rank': item.isMe }"
      >
        <!-- 排名徽章 -->
        <view class="rank-position">
          <view v-if="index < 3" class="medal">
            <text class="medal-icon">{{ ['🥇', '🥈', '🥉'][index] }}</text>
          </view>
          <view v-else class="rank-number">
            <text>{{ index + 1 }}</text>
          </view>
        </view>

        <!-- 宠物信息 -->
        <view class="pet-info">
          <view class="pet-avatar">
            <text class="pet-emoji">{{ item.emoji }}</text>
          </view>
          <view class="pet-details">
            <text class="pet-name">{{ item.name }}</text>
            <text class="pet-owner">{{ item.owner }}</text>
          </view>
        </view>

        <!-- 分数和等级 -->
        <view class="pet-stats">
          <text class="pet-level">Lv.{{ item.level }}</text>
          <text class="pet-score">{{ item.score }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 奖励说明 -->
    <view class="rewards-info">
      <text class="rewards-title">🎁 排行榜奖励</text>
      <view class="reward-item">
        <text class="reward-rank">🥇 第1名</text>
        <text class="reward-desc">金币 +500，皇冠装饰</text>
      </view>
      <view class="reward-item">
        <text class="reward-rank">🥈 第2名</text>
        <text class="reward-desc">金币 +300，高级玩具</text>
      </view>
      <view class="reward-item">
        <text class="reward-rank">🥉 第3名</text>
        <text class="reward-desc">金币 +200，营养剂</text>
      </view>
      <view class="reward-item">
        <text class="reward-rank">🏅 前10名</text>
        <text class="reward-desc">金币 +50，经验 +10</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// 排行榜类型
const rankingTypes = [
  { id: 'level', name: '等级榜', icon: '⭐' },
  { id: 'experience', name: '经验榜', icon: '📚' },
  { id: 'happiness', name: '快乐榜', icon: '😊' },
  { id: 'overall', name: '综合榜', icon: '🏆' }
]

// 状态管理
const authStore = useAuthStore()
const activeType = ref('level')
const myRank = ref(5)
const myScore = ref(1250)
const trend = ref(2) // 排名变化

// 模拟排行榜数据
const rankings = ref([
  { id: 1, name: '超级汪', owner: '小明', emoji: '🐕', level: 15, score: 2850, isMe: false },
  { id: 2, name: '快乐喵', owner: '小红', emoji: '🐱', level: 14, score: 2650, isMe: false },
  { id: 3, name: '小松鼠', owner: '小刚', emoji: '🐿️', level: 13, score: 2450, isMe: false },
  { id: 4, name: '小兔子', owner: '小丽', emoji: '🐰', level: 12, score: 2250, isMe: false },
  { id: 5, name: '我的宠物', owner: '我', emoji: '🐶', level: 11, score: 1250, isMe: true },
  { id: 6, name: '小鸡仔', owner: '小王', emoji: '🐔', level: 10, score: 1150, isMe: false },
  { id: 7, name: '小熊猫', owner: '小赵', emoji: '🐼', level: 9, score: 1050, isMe: false },
  { id: 8, name: '小老虎', owner: '小孙', emoji: '🐯', level: 8, score: 950, isMe: false },
  { id: 9, name: '小狮子', owner: '小周', emoji: '🦁', level: 7, score: 850, isMe: false },
  { id: 10, name: '小猴子', owner: '小吴', emoji: '🐵', level: 6, score: 750, isMe: false }
])

// 方法
const switchType = (typeId: string) => {
  activeType.value = typeId
  // 这里可以根据类型重新排序排行榜
  updateRankings(typeId)
}

const updateRankings = (type: string) => {
  // 模拟不同类型的排行榜数据
  if (type === 'experience') {
    rankings.value = [
      { id: 1, name: '超级汪', owner: '小明', emoji: '🐕', level: 15, score: 3200, isMe: false },
      { id: 2, name: '快乐喵', owner: '小红', emoji: '🐱', level: 14, score: 3100, isMe: false },
      { id: 3, name: '小松鼠', owner: '小刚', emoji: '🐿️', level: 13, score: 2900, isMe: false },
      { id: 4, name: '我的宠物', owner: '我', emoji: '🐶', level: 11, score: 1800, isMe: true },
      { id: 5, name: '小兔子', owner: '小丽', emoji: '🐰', level: 12, score: 2750, isMe: false },
      // ... 其他数据
    ].slice(0, 10)
  } else if (type === 'happiness') {
    rankings.value = [
      { id: 1, name: '快乐喵', owner: '小红', emoji: '🐱', level: 14, score: 95, isMe: false },
      { id: 2, name: '小兔子', owner: '小丽', emoji: '🐰', level: 12, score: 92, isMe: false },
      { id: 3, name: '我的宠物', owner: '我', emoji: '🐶', level: 11, score: 88, isMe: true },
      // ... 其他数据
    ].slice(0, 10)
  }
  // 重新计算我的排名
  const myIndex = rankings.value.findIndex(item => item.isMe)
  myRank.value = myIndex + 1
  myScore.value = rankings.value[myIndex]?.score || 0
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.rankings-container {
  min-height: 100vh;
  background: var(--bg-base);
  padding-bottom: 20px;
}

.rankings-header {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  padding: 30px 20px 20px;
  text-align: center;
  border-radius: 0 0 25px 25px;
  box-shadow: var(--shadow);
}

.rankings-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 5px;
}

.rankings-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
}

.ranking-types {
  display: flex;
  padding: 20px 15px 10px;
  gap: 8px;
  overflow-x: auto;
}

.ranking-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  min-width: 60px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
  transition: all 0.3s ease;
}

.ranking-type.active {
  background: linear-gradient(45deg, var(--accent-sun), var(--accent-coral));
  color: white;
  transform: scale(1.05);
}

.type-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.type-name {
  font-size: 11px;
  font-weight: 500;
}

.my-ranking {
  padding: 0 15px 15px;
}

.my-rank-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.rank-badge {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, var(--accent-lav), var(--accent-coral));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.rank-number {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.my-info {
  flex: 1;
}

.my-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.my-score {
  font-size: 14px;
  color: #666;
}

.rank-trend {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.trend-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.trend-icon.up {
  color: #4ecdc4;
}

.trend-icon.down {
  color: #ff6b6b;
}

.trend-text {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.rankings-list {
  height: calc(100vh - 350px);
  padding: 0 15px;
}

.ranking-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  padding: 12px 15px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
  transition: all 0.3s ease;
}

.ranking-item.top-three {
  background: linear-gradient(45deg, var(--accent-sun), var(--accent-coral));
  color: white;
}

.ranking-item.my-rank {
  border: 2px solid var(--accent-lav);
  background: rgba(187, 163, 255, 0.15);
}

.rank-position {
  width: 40px;
  display: flex;
  justify-content: center;
  margin-right: 12px;
}

.medal {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medal-icon {
  font-size: 20px;
}

.rank-number {
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-number text {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}

.pet-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.pet-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(45deg, #f093fb, #f5576c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.pet-emoji {
  font-size: 22px;
}

.pet-details {
  flex: 1;
}

.pet-name {
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: 2px;
}

.pet-owner {
  font-size: 12px;
  color: #666;
}

.pet-stats {
  text-align: right;
}

.pet-level {
  font-size: 14px;
  font-weight: bold;
  color: #667eea;
  display: block;
  margin-bottom: 2px;
}

.pet-score {
  font-size: 12px;
  color: #666;
}

.rewards-info {
  padding: 20px 15px;
  background: rgba(255, 255, 255, 0.9);
  margin: 15px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.rewards-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15px;
  text-align: center;
}

.reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reward-item:last-child {
  border-bottom: none;
}

.reward-rank {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.reward-desc {
  font-size: 12px;
  color: #666;
}
</style>
