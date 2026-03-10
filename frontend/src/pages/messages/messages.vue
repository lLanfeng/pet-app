<template>
  <div class="page-messages">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click="$router.back()">
        <span class="material-icons">arrow_back</span>
      </button>
      <h1 class="title">消息</h1>
      <button class="icon-btn">
        <span class="material-icons">settings</span>
      </button>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'notifications' }"
        @click="activeTab = 'notifications'"
      >
        通知
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'messages' }"
        @click="activeTab = 'messages'"
      >
        私信
      </div>
    </div>

    <!-- Notifications -->
    <main class="content">
      <h3 class="section-title">最近通知</h3>
      <div class="message-list">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="message-item"
        >
          <div class="message-icon" :class="notif.type">
            <span class="material-icons">{{ notif.icon }}</span>
          </div>
          <div class="message-content">
            <p class="message-text">
              <span class="sender">{{ notif.sender }}</span>
              {{ notif.action }}
            </p>
            <span class="message-time">{{ notif.time }}</span>
          </div>
          <div v-if="notif.image" class="message-image" :style="{ backgroundImage: `url(${notif.image})` }"></div>
        </div>
      </div>

      <h3 class="section-title">更早</h3>
      <div class="message-list">
        <div
          v-for="notif in olderNotifications"
          :key="notif.id"
          class="message-item"
        >
          <div class="message-icon" :class="notif.type">
            <span class="material-icons">{{ notif.icon }}</span>
          </div>
          <div class="message-content">
            <p class="message-text">
              <span class="sender">{{ notif.sender }}</span>
              {{ notif.action }}
            </p>
            <span class="message-time">{{ notif.time }}</span>
          </div>
          <div v-if="notif.image" class="message-image" :style="{ backgroundImage: `url(${notif.image})` }"></div>
        </div>
      </div>
    </main>

    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('notifications');

const notifications = ref([
  {
    id: 1,
    type: 'like',
    icon: 'favorite',
    sender: '小狗旺财',
    action: '赞了你的动态',
    time: '10分钟前',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100',
  },
  {
    id: 2,
    type: 'comment',
    icon: 'chat_bubble',
    sender: '咪咪喵',
    action: '评论了你：太可爱啦！我也想带我家猫去这里。',
    time: '1小时前',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100',
  },
  {
    id: 3,
    type: 'follow',
    icon: 'person_add',
    sender: '柯基大队长',
    action: '关注了你',
    time: '3小时前',
  },
  {
    id: 4,
    type: 'system',
    icon: 'pets',
    sender: '系统通知',
    action: '你的宠物勋章已升级！',
    time: '昨天 18:30',
  },
]);

const olderNotifications = ref([
  {
    id: 5,
    type: 'like',
    icon: 'favorite',
    sender: '哈士奇拆迁办',
    action: '赞了你的动态',
    time: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=100',
  },
]);
</script>

<style scoped>
.page-messages {
  min-height: 100vh;
  background: var(--bg-page);
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
}

.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}

.icon-btn:hover {
  background: var(--primary-10);
}

.title {
  font-size: 18px;
  font-weight: 700;
  flex: 1;
  text-align: center;
}

/* Tabs */
.tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
  position: sticky;
  top: 64px;
  z-index: 40;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 3px solid transparent;
}

.tab-item.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* Content */
.content {
  padding: 16px;
  padding-bottom: 100px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.message-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:hover {
  background: var(--bg-gray);
}

.message-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-10);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-icon.follow {
  background: var(--primary-10);
}

.message-icon.system {
  background: var(--primary-10);
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-primary);
}

.sender {
  font-weight: 700;
}

.message-time {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}

.message-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.bottom-spacer {
  height: 100px;
}
</style>
