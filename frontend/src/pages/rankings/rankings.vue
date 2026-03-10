<template>
  <div class="rankings-container">
    <!-- 排行榜头部 -->
    <div class="rankings-header">
      <span class="rankings-title">宠物排行榜</span>
    </div>

    <!-- 排行榜类型切换 -->
    <div class="ranking-types">
      <div
        v-for="type in rankingTypes"
        :key="type.id"
        class="ranking-type"
        :class="{ active: activeType === type.id }"
        @click="switchType(type.id)"
      >
        <span class="type-icon">{{ type.icon }}</span>
        <span class="type-name">{{ type.name }}</span>
      </div>
    </div>

    <!-- 我的排名 -->
    <div class="my-ranking">
      <div class="my-rank-card">
        <div class="rank-badge">
          <span class="rank-number">#{{ myRank }}</span>
        </div>
        <div class="my-info">
          <span class="my-name">我的排名</span>
          <span class="my-score">{{ myScore }} 分</span>
        </div>
      </div>
    </div>

    <!-- 排行榜列表 -->
    <div class="rankings-list">
      <div
        v-for="(item, index) in rankings"
        :key="item.id"
        class="ranking-item"
        :class="{ 'top-three': index < 3 }"
      >
        <div class="rank-position">
          <span v-if="index < 3" class="medal">{{ ['🥇', '🥈', '🥉'][index] }}</span>
          <span v-else class="rank-num">{{ index + 1 }}</span>
        </div>

        <div class="pet-info">
          <span class="pet-emoji">{{ item.emoji }}</span>
          <div class="pet-details">
            <span class="pet-name">{{ item.name }}</span>
            <span class="pet-owner">{{ item.owner }}</span>
          </div>
        </div>

        <div class="pet-stats">
          <span class="pet-level">Lv.{{ item.level }}</span>
          <span class="pet-score">{{ item.score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

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
</script>

<style scoped>
.rankings-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 40px;
}

/* 头部 */
.rankings-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 50px 16px 24px;
  text-align: center;
}

.rankings-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
}

/* 类型切换 */
.ranking-types {
  display: flex;
  padding: 16px;
  gap: 10px;
  overflow-x: auto;
  background: var(--bg-page);
}

.ranking-type {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition: all 0.3s ease;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.ranking-type:hover {
  transform: translateY(-2px);
}

.ranking-type.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  border-color: transparent;
  transform: scale(1.05);
}

.type-icon {
  font-size: 14px;
  margin-right: 4px;
}

.type-name {
  font-size: 13px;
  font-weight: 500;
}

/* 我的排名 */
.my-ranking {
  padding: 0 16px 12px;
}

.my-rank-card {
  background: var(--bg-card);
  padding: 16px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.rank-badge {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
}

.rank-number {
  color: #D97706;
  font-size: 16px;
  font-weight: 700;
}

.my-info {
  flex: 1;
}

.my-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.my-score {
  font-size: 14px;
  color: var(--accent);
  font-weight: 600;
}

/* 列表 */
.rankings-list {
  padding: 0 16px;
}

.ranking-item {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  margin-bottom: 10px;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.ranking-item:active {
  transform: scale(0.98);
}

.ranking-item.top-three {
  background: linear-gradient(135deg, #FEFCE8, #FEF9C3);
  border-color: #FCD34D;
  box-shadow: 0 4px 16px rgba(252, 211, 77, 0.3);
}

.rank-position {
  width: 36px;
  display: flex;
  justify-content: center;
  margin-right: 8px;
}

.medal {
  font-size: 24px;
}

.rank-num {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.pet-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.pet-emoji {
  font-size: 32px;
  margin-right: 10px;
}

.pet-details {
  flex: 1;
}

.pet-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.pet-owner {
  font-size: 12px;
  color: var(--text-muted);
}

.pet-stats {
  text-align: right;
}

.pet-level {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  display: block;
}

.pet-score {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
