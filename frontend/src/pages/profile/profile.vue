<template>
  <div class="profile-page">
    <!-- 头部 -->
    <div class="profile-header">
      <div class="user-box">
        <div class="avatar">{{ userAvatar }}</div>
        <div class="user-info">
          <span class="nickname">{{ nickname }}</span>
          <span class="user-id">ID {{ userId }}</span>
        </div>
      </div>
    </div>

    <!-- 资产 -->
    <div class="assets-card">
      <div class="asset-cell">
        <span class="asset-num">{{ coins }}</span>
        <span class="asset-label">金币</span>
      </div>
      <div class="asset-divider"></div>
      <div class="asset-cell">
        <span class="asset-num">{{ diamonds }}</span>
        <span class="asset-label">钻石</span>
      </div>
      <div class="asset-divider"></div>
      <div class="asset-cell">
        <span class="asset-num">{{ level }}</span>
        <span class="asset-label">等级</span>
      </div>
    </div>

    <!-- 统计 -->
    <div class="stats-card">
      <div class="stat-cell">
        <span class="stat-num">{{ petCount }}</span>
        <span class="stat-label">宠物</span>
      </div>
      <div class="stat-cell">
        <span class="stat-num">{{ taskCount }}</span>
        <span class="stat-label">任务</span>
      </div>
      <div class="stat-cell">
        <span class="stat-num">#{{ ranking }}</span>
        <span class="stat-label">排名</span>
      </div>
      <div class="stat-cell">
        <span class="stat-num">{{ loginDays }}</span>
        <span class="stat-label">天数</span>
      </div>
    </div>

    <!-- 菜单 -->
    <div class="menu-card">
      <div class="menu-cell" @click="go('/pets')">
        <span class="menu-icon">🐾</span>
        <span class="menu-text">我的宠物</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/shop')">
        <span class="menu-icon">🛒</span>
        <span class="menu-text">宠物商店</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/tasks')">
        <span class="menu-icon">📋</span>
        <span class="menu-text">任务中心</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/rankings')">
        <span class="menu-icon">🏆</span>
        <span class="menu-text">排行榜</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/community')">
        <span class="menu-icon">💬</span>
        <span class="menu-text">社区</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/achievements')">
        <span class="menu-icon">🎖️</span>
        <span class="menu-text">成就</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/mail')">
        <span class="menu-icon">📮</span>
        <span class="menu-text">消息</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-cell" @click="go('/settings')">
        <span class="menu-icon">⚙️</span>
        <span class="menu-text">设置</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <!-- 退出 -->
    <div class="logout-btn" @click="logout">
      退出登录
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const nickname = ref('萌宠主人');
const userId = ref('10086');
const userAvatar = ref('👤');
const coins = ref(1250);
const diamonds = ref(50);
const level = ref(8);
const petCount = ref(2);
const taskCount = ref(45);
const ranking = ref(88);
const loginDays = ref(28);

const go = (url) => uni.navigateTo({ url });

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录？',
    success: (res) => {
      if (res.confirm) {
        authStore.logout();
        uni.reLaunch({ url: '/pages/login/login' });
      }
    }
  });
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 32px;
}

/* 头部 */
.profile-header {
  background: var(--primary);
  padding: 50px 16px 20px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.user-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

/* 资产 */
.assets-card {
  background: var(--bg-card);
  margin: 12px 16px;
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  justify-content: space-around;
  border: 1px solid var(--border);
}

.asset-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-num {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.asset-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.asset-divider {
  width: 1px;
  background: var(--border);
}

/* 统计 */
.stats-card {
  background: var(--bg-card);
  margin: 0 16px 12px;
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  justify-content: space-around;
  border: 1px solid var(--border);
}

.stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* 菜单 */
.menu-card {
  background: var(--bg-card);
  margin: 0 16px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
}

.menu-cell {
  display: flex;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid var(--border-light);
}

.menu-cell:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.menu-arrow {
  color: var(--text-muted);
  font-size: 18px;
}

/* 退出 */
.logout-btn {
  background: var(--bg-card);
  margin: 16px;
  padding: 14px;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--error);
  border: 1px solid var(--error);
}
</style>
