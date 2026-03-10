<template>
  <div class="mail-container">
    <!-- 头部 -->
    <div class="mail-header">
      <span class="title">消息中心</span>
    </div>

    <!-- 标签 -->
    <div class="mail-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <span class="tab-name">{{ tab.name }}</span>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="mail-list">
      <div
        v-for="mail in currentMails"
        :key="mail.id"
        class="mail-item"
        :class="{ unread: !mail.read }"
      >
        <div class="mail-icon">
          {{ mail.icon }}
        </div>
        <div class="mail-content">
          <div class="mail-header-info">
            <span class="mail-title">{{ mail.title }}</span>
            <span class="mail-time">{{ mail.time }}</span>
          </div>
          <span class="mail-desc">{{ mail.content }}</span>
        </div>
        <div class="unread-dot" v-if="!mail.read"></div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="currentMails.length === 0">
        <span class="empty-emoji">📭</span>
        <span class="empty-text">暂无消息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tabs = ref([
  { id: 'all', name: '全部' },
  { id: 'system', name: '系统' },
  { id: '互动', name: '互动' },
])

const activeTab = ref('all')

const mails = ref([
  { id: 1, type: 'system', icon: '🎁', title: '签到奖励', content: '恭喜获得今日签到奖励！', time: '刚刚', read: false },
  { id: 2, type: 'system', icon: '⭐', title: '升级提醒', content: '你的宠物即将升级！', time: '1小时前', read: false },
  { id: 3, type: 'system', icon: '⚙️', title: '系统通知', content: '欢迎来到萌宠世界！', time: '3天前', read: true },
  { id: 4, type: '互动', icon: '❤️', title: '点赞通知', content: '有人赞了你的帖子', time: '2小时前', read: true },
])

const currentMails = computed(() => {
  if (activeTab.value === 'all') return mails.value
  return mails.value.filter(m => m.type === activeTab.value)
})

const switchTab = (id: string) => {
  activeTab.value = id
}
</script>

<style scoped>
.mail-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 80px;
}

/* 头部 */
.mail-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 50px 16px 24px;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

/* 标签 */
.mail-tabs {
  display: flex;
  padding: 16px;
  gap: 10px;
  overflow-x: auto;
  background: var(--bg-page);
}

.tab {
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-card);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.tab:hover {
  transform: translateY(-2px);
}

.tab.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  border-color: transparent;
  transform: scale(1.05);
}

/* 列表 */
.mail-list {
  padding: 0 16px;
}

.mail-item {
  display: flex;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.mail-item:active {
  transform: scale(0.98);
}

.mail-item.unread {
  background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
  border-color: var(--success);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.mail-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-gray);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 12px;
  flex-shrink: 0;
}

.mail-item.unread .mail-icon {
  background: #BBF7D0;
}

.mail-content {
  flex: 1;
  min-width: 0;
}

.mail-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.mail-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.mail-time {
  font-size: 11px;
  color: var(--text-muted);
}

.mail-desc {
  font-size: 12px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background: var(--error);
  border-radius: 50%;
  position: absolute;
  top: 14px;
  right: 14px;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
}

.empty-emoji {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
