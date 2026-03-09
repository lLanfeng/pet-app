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
  background: #f8fafc;
  padding-bottom: 32px;
}

.profile-header {
  background: #fff;
  padding: 48px 20px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 56px;
  height: 56px;
  background: #f1f5f9;
  border-radius: 14px;
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
  color: #1e293b;
}

.user-id {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

.assets-card {
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  border: 1px solid #e2e8f0;
}

.asset-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-num {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.asset-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.asset-divider {
  width: 1px;
  background: #e2e8f0;
}

.stats-card {
  background: #fff;
  margin: 0 16px 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  border: 1px solid #e2e8f0;
}

.stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.menu-card {
  background: #fff;
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.menu-cell {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
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
  font-size: 15px;
  color: #1e293b;
}

.menu-arrow {
  color: #cbd5e1;
  font-size: 18px;
}

.logout-btn {
  background: #fff;
  margin: 20px 16px 0;
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  color: #ef4444;
  border: 1px solid #e2e8f0;
}
</style>
