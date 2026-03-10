<template>
  <div class="community-container">
    <!-- 头部 -->
    <div class="community-header">
      <span class="title">宠物社区</span>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        :style="activeTab === tab.id ? { background: tab.color } : {}"
        @click="switchTab(tab.id)"
      >
        <span class="tab-name">{{ tab.name }}</span>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list">
      <!-- 发布按钮 -->
      <div class="create-post" @click="showCreatePost">
        <span class="avatar">👤</span>
        <span class="input-hint">分享你的萌宠日常...</span>
      </div>

      <!-- 帖子卡片 -->
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
      >
        <div class="post-header">
          <span class="post-avatar">{{ post.avatar }}</span>
          <div class="post-user">
            <span class="username">{{ post.username }}</span>
            <span class="post-time">{{ post.time }}</span>
          </div>
        </div>

        <div class="post-content">
          <span class="post-text">{{ post.content }}</span>
        </div>

        <!-- 互动 -->
        <div class="post-actions">
          <div class="action-item" @click="likePost(post)">
            <span>{{ post.liked ? '❤️' : '🤍' }}</span>
            <span class="action-count">{{ post.likes }}</span>
          </div>
          <div class="action-item">
            <span>💬</span>
            <span class="action-count">{{ post.comments }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = [
  { id: 'all', name: '全部', color: '#FEF3C7' },
  { id: 'follow', name: '关注', color: '#DBEAFE' },
  { id: 'hot', name: '热门', color: '#FCE7F3' },
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
  background: var(--bg-page);
  padding-bottom: 80px;
}

/* 头部 */
.community-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 50px 16px 24px;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

/* 分类 */
.category-tabs {
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
.posts-list {
  padding: 0 16px;
}

/* 发帖框 */
.create-post {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.create-post:active {
  transform: scale(0.98);
}

.avatar {
  font-size: 32px;
  margin-right: 12px;
}

.input-hint {
  color: var(--text-muted);
  font-size: 14px;
}

/* 帖子卡片 */
.post-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-avatar {
  font-size: 32px;
  margin-right: 10px;
  flex-shrink: 0;
}

.post-user {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.post-time {
  font-size: 12px;
  color: var(--text-muted);
}

.post-content {
  margin-bottom: 10px;
}

.post-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  word-wrap: break-word;
  word-break: break-all;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.action-count {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
