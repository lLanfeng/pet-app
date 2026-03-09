<template>
  <view class="mail-container">
    <!-- 头部 -->
    <view class="mail-header">
      <view class="header-left">
        <text class="title">📮 消息中心</text>
      </view>
      <view class="header-right">
        <text class="mark-all" @click="markAllRead">全部已读</text>
      </view>
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
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-name">{{ tab.name }}</text>
        <view class="tab-badge" v-if="tab.badge > 0">{{ tab.badge }}</view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="mail-list" scroll-y="true">
      <!-- 系统通知 -->
      <view v-if="activeTab === 'system' || activeTab === 'all'">
        <view class="section-title" v-if="activeTab === 'all'">📢 系统通知</view>
        <view 
          v-for="mail in systemMails" 
          :key="mail.id"
          class="mail-item"
          :class="{ unread: !mail.read }"
          @click="viewMail(mail)"
        >
          <view class="mail-icon" :class="mail.type">
            {{ mail.icon }}
          </view>
          <view class="mail-content">
            <view class="mail-header-info">
              <text class="mail-title">{{ mail.title }}</text>
              <text class="mail-time">{{ mail.time }}</text>
            </view>
            <text class="mail-desc">{{ mail.content }}</text>
            <view class="mail-reward" v-if="mail.reward">
              <text class="reward-text">{{ mail.reward }}</text>
              <view class="claim-btn" v-if="!mail.claimed" @click.stop="claimReward(mail)">领取</view>
              <view class="claimed-btn" v-else>已领取</view>
            </view>
          </view>
          <view class="unread-dot" v-if="!mail.read"></view>
        </view>
      </view>

      <!-- 互动消息 -->
      <view v-if="activeTab === '互动' || activeTab === 'all'">
        <view class="section-title" v-if="activeTab === 'all'">💬 互动消息</view>
        <view 
          v-for="mail in interactionMails" 
          :key="mail.id"
          class="mail-item"
          :class="{ unread: !mail.read }"
          @click="viewMail(mail)"
        >
          <view class="mail-icon interactive">
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
      </view>

      <!-- 公告 -->
      <view v-if="activeTab === '公告' || activeTab === 'all'">
        <view class="section-title" v-if="activeTab === 'all'">📢 公告</view>
        <view 
          v-for="mail in announcementMails" 
          :key="mail.id"
          class="mail-item announcement"
          :class="{ unread: !mail.read }"
          @click="viewMail(mail)"
        >
          <view class="mail-icon announcement">
            📢
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
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="currentMails.length === 0">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无消息</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 标签
const tabs = ref([
  { id: 'all', name: '全部', icon: '📨', badge: 5 },
  { id: 'system', name: '系统', icon: '⚙️', badge: 3 },
  { id: '互动', name: '互动', icon: '💬', badge: 1 },
  { id: '公告', name: '公告', icon: '📢', badge: 1 },
])

const activeTab = ref('all')

// 系统消息
const systemMails = ref([
  {
    id: 1,
    type: 'reward',
    icon: '🎁',
    title: '签到奖励',
    content: '恭喜获得今日签到奖励！',
    reward: '💰 10金币',
    time: '刚刚',
    read: false,
    claimed: false
  },
  {
    id: 2,
    type: 'level',
    icon: '⭐',
    title: '升级提醒',
    content: '你的宠物"小球球"即将升级！',
    reward: null,
    time: '1小时前',
    read: false,
    claimed: false
  },
  {
    id: 3,
    type: 'task',
    icon: '📋',
    title: '任务完成',
    content: '已完成"喂食5次"任务',
    reward: '💰 50金币',
    time: '昨天',
    read: true,
    claimed: true
  },
  {
    id: 4,
    type: 'system',
    icon: '⚙️',
    title: '系统通知',
    content: '欢迎来到萌宠世界！开始你的养宠之旅吧～',
    reward: null,
    time: '3天前',
    read: true,
    claimed: false
  }
])

// 互动消息
const interactionMails = ref([
  {
    id: 5,
    icon: '❤️',
    title: '有人点赞了你的帖子',
    content: '"小球球主人"赞了你的帖子',
    time: '2小时前',
    read: false
  },
  {
    id: 6,
    icon: '💬',
    title: '新评论',
    content: '"咪咪铲屎官"评论了你的帖子',
    time: '昨天',
    read: true
  }
])

// 公告
const announcementMails = ref([
  {
    id: 7,
    title: '🏆 排行榜活动开启',
    content: '每周排行榜活动火热进行中，丰厚奖励等你来拿！',
    time: '昨天',
    read: true
  }
])

// 计算当前显示的消息
const currentMails = computed(() => {
  if (activeTab.value === 'all') {
    return [...systemMails.value, ...interactionMails.value, ...announcementMails.value]
  } else if (activeTab.value === 'system') {
    return systemMails.value
  } else if (activeTab.value === '互动') {
    return interactionMails.value
  } else if (activeTab.value === '公告') {
    return announcementMails.value
  }
  return []
})

// 方法
const switchTab = (id: string) => {
  activeTab.value = id
}

const viewMail = (mail: any) => {
  mail.read = true
}

const markAllRead = () => {
  systemMails.value.forEach(m => m.read = true)
  interactionMails.value.forEach(m => m.read = true)
  announcementMails.value.forEach(m => m.read = true)
  tabs.value.forEach(t => t.badge = 0)
  uni.showToast({ title: '全部已读', icon: 'success' })
}

const claimReward = (mail: any) => {
  mail.claimed = true
  uni.showToast({ title: '奖励已发放到背包', icon: 'success' })
}
</script>

<style scoped>
.mail-container {
  min-height: 100vh;
  background: var(--bg-base);
}

.mail-header {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  padding: 40px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: white;
}

.mark-all {
  color: white;
  font-size: 14px;
  opacity: 0.9;
}

/* 标签 */
.mail-tabs {
  display: flex;
  background: white;
  padding: 12px;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 2px solid var(--stroke);
}

.tab {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 20px;
  background: #fff;
  border: 2px solid var(--stroke);
  position: relative;
}

.tab.active {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
}

.tab-icon {
  font-size: 14px;
  margin-right: 5px;
}

.tab-name {
  font-size: 13px;
  font-weight: 500;
}

.tab-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 消息列表 */
.mail-list {
  padding: 15px;
  height: calc(100vh - 180px);
}

.section-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
  margin-top: 15px;
}

.section-title:first-child {
  margin-top: 0;
}

.mail-item {
  display: flex;
  background: white;
  border-radius: 18px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.mail-item.unread {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.mail-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 12px;
  flex-shrink: 0;
}

.mail-icon.reward { background: linear-gradient(135deg, #ffd93d, #ff6b6b); }
.mail-icon.level { background: linear-gradient(135deg, var(--accent-lav), var(--accent-coral)); }
.mail-icon.task { background: linear-gradient(135deg, #4ecdc4, #44a08d); }
.mail-icon.system { background: linear-gradient(135deg, #a8edea, #fed6e3); }
.mail-icon.interactive { background: linear-gradient(135deg, var(--accent-coral), #ff9a8b); }
.mail-icon.announcement { background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral)); }

.mail-content {
  flex: 1;
  min-width: 0;
}

.mail-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.mail-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.mail-time {
  font-size: 12px;
  color: #999;
}

.mail-desc {
  font-size: 13px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.mail-reward {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reward-text {
  background: linear-gradient(135deg, var(--accent-sun), var(--accent-coral));
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.claim-btn {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
  padding: 5px 14px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.claimed-btn {
  background: #e0e0e0;
  color: #999;
  padding: 5px 14px;
  border-radius: 15px;
  font-size: 12px;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background: #ff6b6b;
  border-radius: 50%;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
  color: #999;
}
</style>
