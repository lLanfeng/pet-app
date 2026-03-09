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
  background: var(--bg-base);
  padding-bottom: 40px;
}

.profile-header {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  padding: 60px 20px 24px;
  border-bottom: 2px solid rgba(255,255,255,0.35);
}

.user-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--accent-lav), #8aa7ff);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 22px;
  font-weight: 600;
  color: white;
}

.user-id {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin-top: 2px;
}

.assets-card {
  background: #fff;
  margin: 16px 20px;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  justify-content: space-around;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.asset-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-num {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
}

.asset-label {
  font-size: 13px;
  color: #86868b;
  margin-top: 4px;
}

.asset-divider {
  width: 1px;
  background: #e5e5ea;
}

.stats-card {
  background: #fff;
  margin: 0 20px 16px;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
}

.stat-label {
  font-size: 13px;
  color: #86868b;
  margin-top: 4px;
}

.menu-card {
  background: #fff;
  margin: 0 20px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.menu-cell {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.menu-cell:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 14px;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #1d1d1f;
}

.menu-arrow {
  color: #c7c7cc;
  font-size: 20px;
}

.logout-btn {
  background: #fff;
  margin: 24px 20px 0;
  padding: 16px;
  border-radius: 14px;
  text-align: center;
  font-size: 16px;
  color: #ff3b30;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}
</style>
