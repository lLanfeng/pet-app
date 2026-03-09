<template>
  <view class="community-container">
    <!-- 头部 -->
    <view class="community-header">
      <text class="title">宠物社区</text>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
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

    <!-- 帖子列表 -->
    <scroll-view class="posts-list" scroll-y="true">
      <!-- 发布按钮 -->
      <view class="create-post" @click="showCreatePost">
        <text class="avatar">👤</text>
        <text class="input-hint">分享你的萌宠日常...</text>
      </view>

      <!-- 帖子卡片 -->
      <view 
        v-for="post in posts" 
        :key="post.id" 
        class="post-card"
      >
        <view class="post-header">
          <text class="post-avatar">{{ post.avatar }}</text>
          <view class="post-user">
            <text class="username">{{ post.username }}</text>
            <text class="post-time">{{ post.time }}</text>
          </view>
        </view>

        <view class="post-content">
          <text class="post-text">{{ post.content }}</text>
        </view>

        <!-- 互动 -->
        <view class="post-actions">
          <view class="action-item" @click="likePost(post)">
            <text>{{ post.liked ? '❤️' : '🤍' }}</text>
            <text class="action-count">{{ post.likes }}</text>
          </view>
          <view class="action-item">
            <text>💬</text>
            <text class="action-count">{{ post.comments }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'follow', name: '关注' },
  { id: 'hot', name: '热门' },
]

const activeTab = ref('all')

const posts = ref([
  {
    id: 1,
    avatar: '🐶',
    username: '小球球主人',
    time: '2小时前',
    content: '今天带小球球去公园玩，它超级开心！',
    likes: 128,
    comments: 15,
    liked: false
  },
  {
    id: 2,
    avatar: '🐱',
    username: '咪咪铲屎官',
    time: '5小时前',
    content: '咪咪今天居然主动来蹭我了，感动！',
    likes: 256,
    comments: 32,
    liked: true
  },
])

const switchTab = (id: string) => {
  activeTab.value = id
}

const showCreatePost = () => {
  uni.showToast({ title: '发布功能即将开放', icon: 'none' })
}

const likePost = (post: any) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
}
</script>

<style scoped>
.community-container {
  min-height: 100vh;
  background: #f8fafc;
}

.community-header {
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

.category-tabs {
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

.posts-list {
  padding: 12px 16px;
  height: calc(100vh - 120px);
}

.create-post {
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
}

.avatar {
  font-size: 28px;
  margin-right: 10px;
}

.input-hint {
  color: #94a3b8;
  font-size: 14px;
}

.post-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-avatar {
  font-size: 32px;
  margin-right: 10px;
}

.post-user {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.post-time {
  font-size: 12px;
  color: #94a3b8;
}

.post-content {
  margin-bottom: 10px;
}

.post-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-count {
  font-size: 13px;
  color: #64748b;
}
</style>
