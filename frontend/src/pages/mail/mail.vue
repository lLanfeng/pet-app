<template>
  <view class="mail-container">
    <!-- 头部 -->
    <view class="mail-header">
      <text class="title">消息中心</text>
    </view>

    <!-- 标签 -->
    <view class="mail-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <text class="tab-name">{{ tab.name }}</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="mail-list" scroll-y="true">
      <view 
        v-for="mail in currentMails" 
        :key="mail.id"
        class="mail-item"
        :class="{ unread: !mail.read }"
      >
        <view class="mail-icon">
          {{ mail.icon }}
        </view>
        <view class="mail-content">
          <view class="mail-header-info">
            <text class="mail-title">{{ mail.title }}</text>
            <text class="mail-time">{{ mail.time }}</text>
          </view>
          <text class="mail-desc">{{ mail.content }}</text>
        </view>
        <view class="unread-dot" v-if="!mail.read"></view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="currentMails.length === 0">
        <text class="empty-text">暂无消息</text>
      </view>
    </scroll-view>
  </view>
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
  padding-bottom: 40px;
}

/* 头部 */
.mail-header {
  background: var(--primary);
  padding: 50px 16px 20px;
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
  background: var(--bg-card);
  padding: 12px 16px;
  gap: 8px;
  margin: 12px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.tab {
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.tab.active {
  background: var(--primary);
  color: #fff;
}

/* 列表 */
.mail-list {
  padding: 0 16px;
}

.mail-item {
  display: flex;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid var(--border);
}

.mail-item.unread {
  background: #F0FDF4;
  border-color: var(--success);
}

.mail-icon {
  width: 40px;
  height: 40px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 10px;
}

.mail-content {
  flex: 1;
}

.mail-header-info {
  display: flex;
  justify-content: space-between;
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
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: var(--error);
  border-radius: 50%;
  position: absolute;
  top: 12px;
  right: 12px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
