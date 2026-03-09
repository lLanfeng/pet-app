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
  background: #f8fafc;
}

.mail-header {
  background: #fff;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.mail-tabs {
  display: flex;
  background: #fff;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.tab {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
}

.tab.active {
  background: #22c55e;
  color: #fff;
}

.mail-list {
  padding: 12px 16px;
  height: calc(100vh - 120px);
}

.mail-item {
  display: flex;
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid #e2e8f0;
}

.mail-item.unread {
  background: #f0fdf4;
}

.mail-icon {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
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
  color: #1e293b;
}

.mail-time {
  font-size: 12px;
  color: #94a3b8;
}

.mail-desc {
  font-size: 13px;
  color: #64748b;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  position: absolute;
  top: 14px;
  right: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
}

.empty-text {
  font-size: 14px;
  color: #94a3b8;
}
</style>
