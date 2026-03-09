<template>
  <view class="rankings-container">
    <!-- 排行榜头部 -->
    <view class="rankings-header">
      <text class="rankings-title">宠物排行榜</text>
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
      </view>
    </view>

    <!-- 排行榜列表 -->
    <scroll-view class="rankings-list" scroll-y="true">
      <view
        v-for="(item, index) in rankings"
        :key="item.id"
        class="ranking-item"
        :class="{ 'top-three': index < 3 }"
      >
        <view class="rank-position">
          <text v-if="index < 3" class="medal">{{ ['🥇', '🥈', '🥉'][index] }}</text>
          <text v-else class="rank-num">{{ index + 1 }}</text>
        </view>

        <view class="pet-info">
          <text class="pet-emoji">{{ item.emoji }}</text>
          <view class="pet-details">
            <text class="pet-name">{{ item.name }}</text>
            <text class="pet-owner">{{ item.owner }}</text>
          </view>
        </view>

        <view class="pet-stats">
          <text class="pet-level">Lv.{{ item.level }}</text>
          <text class="pet-score">{{ item.score }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const rankingTypes = [
  { id: 'level', name: '等级', icon: '⭐' },
  { id: 'experience', name: '经验', icon: '📚' },
  { id: 'happiness', name: '快乐', icon: '😊' },
  { id: 'overall', name: '综合', icon: '🏆' }
]

const authStore = useAuthStore()
const activeType = ref('level')
const myRank = ref(5)
const myScore = ref(1250)

const rankings = ref([
  { id: 1, name: '超级汪', owner: '小明', emoji: '🐕', level: 15, score: 2850 },
  { id: 2, name: '快乐喵', owner: '小红', emoji: '🐱', level: 14, score: 2650 },
  { id: 3, name: '小松鼠', owner: '小刚', emoji: '🐿️', level: 13, score: 2450 },
  { id: 4, name: '小兔子', owner: '小丽', emoji: '🐰', level: 12, score: 2250 },
  { id: 5, name: '我的宠物', owner: '我', emoji: '🐶', level: 11, score: 1250 },
  { id: 6, name: '小鸡仔', owner: '小王', emoji: '🐔', level: 10, score: 1150 },
])

const switchType = (typeId: string) => {
  activeType.value = typeId
}

import { useAuthStore } from '@/stores/auth'
</script>

<style scoped>
.rankings-container {
  min-height: 100vh;
  background: #f8fafc;
}

.rankings-header {
  background: #fff;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.rankings-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.ranking-types {
  display: flex;
  padding: 12px 16px;
  gap: 8px;
  overflow-x: auto;
  background: #fff;
}

.ranking-type {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  white-space: nowrap;
}

.ranking-type.active {
  background: #22c55e;
  color: #fff;
}

.type-icon {
  font-size: 14px;
  margin-right: 4px;
}

.type-name {
  font-size: 12px;
  font-weight: 500;
}

.my-ranking {
  padding: 12px 16px;
}

.my-rank-card {
  background: #fff;
  padding: 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.rank-badge {
  width: 44px;
  height: 44px;
  background: #fef3c7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.rank-number {
  color: #92400e;
  font-size: 14px;
  font-weight: 600;
}

.my-info {
  flex: 1;
}

.my-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.my-score {
  font-size: 13px;
  color: #64748b;
}

.rankings-list {
  height: calc(100vh - 280px);
  padding: 0 16px;
}

.ranking-item {
  display: flex;
  align-items: center;
  background: #fff;
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.ranking-item.top-three {
  background: #fefce8;
}

.rank-position {
  width: 36px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
}

.medal {
  font-size: 20px;
}

.rank-num {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.pet-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.pet-emoji {
  font-size: 28px;
  margin-right: 10px;
}

.pet-details {
  flex: 1;
}

.pet-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.pet-owner {
  font-size: 12px;
  color: #64748b;
}

.pet-stats {
  text-align: right;
}

.pet-level {
  font-size: 12px;
  font-weight: 600;
  color: #22c55e;
  display: block;
}

.pet-score {
  font-size: 11px;
  color: #64748b;
}
</style>
