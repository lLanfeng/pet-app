<template>
  <view class="community-container">
    <!-- 头部 -->
    <view class="community-header">
      <text class="title">🌟 宠物社区</text>
      <text class="subtitle">分享萌宠日常，结交好友</text>
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
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-name">{{ tab.name }}</text>
      </view>
    </view>

    <!-- 热门话题 -->
    <view class="hot-topics" v-if="activeTab === 'all'">
      <view class="section-header">
        <text class="section-title">🔥 热门话题</text>
      </view>
      <scroll-view class="topics-scroll" scroll-x="true">
        <view 
          v-for="topic in hotTopics" 
          :key="topic.id" 
          class="topic-tag"
          :style="{ background: topic.color }"
        >
          <text class="topic-name">{{ topic.name }}</text>
          <text class="topic-count">{{ topic.count }}条</text>
        </view>
      </scroll-view>
    </view>

    <!-- 帖子列表 -->
    <scroll-view class="posts-list" scroll-y="true">
      <!-- 发布按钮 -->
      <view class="create-post" @click="showCreatePost">
        <view class="avatar">👤</view>
        <view class="input-hint">
          <text>分享你的萌宠日常...</text>
        </view>
        <view class="post-btn">
          <text>发布</text>
        </view>
      </view>

      <!-- 帖子卡片 -->
      <view 
        v-for="post in posts" 
        :key="post.id" 
        class="post-card"
        @click="viewPost(post)"
      >
        <view class="post-header">
          <view class="user-info">
            <view class="post-avatar">{{ post.avatar }}</view>
            <view class="post-user">
              <text class="username">{{ post.username }}</text>
              <text class="post-time">{{ post.time }}</text>
            </view>
          </view>
          <view class="follow-btn" v-if="!post.isFollowing">
            <text>+ 关注</text>
          </view>
        </view>

        <view class="post-content">
          <text class="post-text">{{ post.content }}</text>
        </view>

        <!-- 图片 -->
        <view class="post-images" v-if="post.images && post.images.length > 0">
          <image 
            v-for="(img, idx) in post.images" 
            :key="idx"
            :src="img" 
            mode="aspectFill"
            class="post-img"
            :class="{ 'single-img': post.images.length === 1 }"
          />
        </view>

        <!-- 标签 -->
        <view class="post-tags" v-if="post.tags">
          <text 
            v-for="tag in post.tags" 
            :key="tag" 
            class="tag"
          >#{{ tag }}</text>
        </view>

        <!-- 互动 -->
        <view class="post-actions">
          <view class="action-item" @click.stop="likePost(post)">
            <text class="action-icon">{{ post.liked ? '❤️' : '🤍' }}</text>
            <text class="action-count">{{ post.likes }}</text>
          </view>
          <view class="action-item" @click.stop="commentPost(post)">
            <text class="action-icon">💬</text>
            <text class="action-count">{{ post.comments }}</text>
          </view>
          <view class="action-item" @click.stop="sharePost(post)">
            <text class="action-icon">🔗</text>
            <text class="action-count">分享</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 发布弹窗 -->
    <view v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <view class="create-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">发布帖子</text>
          <text class="close-btn" @click="closeCreateModal">✕</text>
        </view>
        <textarea 
          v-model="newPostContent" 
          placeholder="分享你的萌宠日常..."
          class="post-input"
          maxlength="500"
        />
        <view class="upload-images">
          <view class="upload-btn">
            <text>+</text>
          </view>
        </view>
        <view class="select-tags">
          <text class="tags-label">添加话题：</text>
          <view class="tag-options">
            <text class="tag-option" @click="addTag('晒宠')">#晒宠</text>
            <text class="tag-option" @click="addTag('日常')">#日常</text>
            <text class="tag-option" @click="addTag('问答')">#问答</text>
          </view>
        </view>
        <button class="submit-btn" @click="submitPost">发布</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 分类标签
const tabs = [
  { id: 'all', name: '全部', icon: '📱' },
  { id: 'follow', name: '关注', icon: '👥' },
  { id: 'hot', name: '热门', icon: '🔥' },
  { id: 'help', name: '问答', icon: '❓' },
]

const activeTab = ref('all')

// 热门话题
const hotTopics = ref([
  { id: 1, name: '#萌宠大赛', count: 1234, color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 2, name: '#晒宠日常', count: 856, color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 3, name: '#宠物问答', count: 542, color: 'linear-gradient(135deg, #4ecdc4, #44a08d)' },
  { id: 4, name: '#养宠知识', count: 321, color: 'linear-gradient(135deg, #ffd93d, #ff6b6b)' },
  { id: 5, name: '#萌宠瞬间', count: 215, color: 'linear-gradient(135deg, #a8edea, #fed6e3)' },
])

// 帖子数据
const posts = ref([
  {
    id: 1,
    avatar: '🐶',
    username: '小球球主人',
    time: '2小时前',
    content: '今天带小球球去公园玩，它超级开心！还交到了新朋友～ 🐕',
    images: ['https://place.dog/400/300'],
    tags: ['晒宠', '日常'],
    likes: 128,
    comments: 15,
    liked: false,
    isFollowing: false
  },
  {
    id: 2,
    avatar: '🐱',
    username: '咪咪铲屎官',
    time: '5小时前',
    content: '咪咪今天居然主动来蹭我了，感动！平时高冷的主子终于开窍了 🥹',
    images: ['https://place.dog/400/301'],
    tags: ['晒宠'],
    likes: 256,
    comments: 32,
    liked: true,
    isFollowing: true
  },
  {
    id: 3,
    avatar: '🐰',
    username: '小白养成记',
    time: '昨天',
    content: '新手养兔兔有什么需要注意的吗？求各位大神指导！',
    tags: ['问答', '养宠知识'],
    likes: 45,
    comments: 28,
    liked: false,
    isFollowing: false
  },
  {
    id: 4,
    avatar: '🦊',
    username: '小狐狸',
    time: '昨天',
    content: '，分享一下给宠物拍照的小技巧～光线要好，背景要简洁最重要！',
    images: ['https://place.dog/400/302', 'https://place.dog/400/303'],
    tags: ['养宠知识'],
    likes: 189,
    comments: 22,
    liked: false,
    isFollowing: true
  }
])

// 发布相关
const showCreateModal = ref(false)
const newPostContent = ref('')
const selectedTags = ref<string[]>([])

const switchTab = (id: string) => {
  activeTab.value = id
}

const showCreatePost = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newPostContent.value = ''
  selectedTags.value = []
}

const addTag = (tag: string) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
}

const submitPost = () => {
  if (!newPostContent.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  posts.value.unshift({
    id: Date.now(),
    avatar: '👤',
    username: '我',
    time: '刚刚',
    content: newPostContent.value,
    images: [],
    tags: selectedTags.value,
    likes: 0,
    comments: 0,
    liked: false,
    isFollowing: false
  })
  
  uni.showToast({ title: '发布成功', icon: 'success' })
  closeCreateModal()
}

const viewPost = (post: any) => {
  uni.showToast({ title: '帖子详情即将开放', icon: 'none' })
}

const likePost = (post: any) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
}

const commentPost = (post: any) => {
  uni.showToast({ title: '评论功能即将开放', icon: 'none' })
}

const sharePost = (post: any) => {
  uni.showToast({ title: '分享功能即将开放', icon: 'none' })
}
</script>

<style scoped>
.community-container {
  min-height: 100vh;
  background: var(--bg-base);
  padding-bottom: 20px;
}

.community-header {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  padding: 30px 20px;
  color: white;
}

.title {
  font-size: 24px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.85;
}

/* 分类 */
.category-tabs {
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
  padding: 8px 16px;
  border-radius: 20px;
  background: #fff;
  border: 2px solid var(--stroke);
  white-space: nowrap;
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

/* 热门话题 */
.hot-topics {
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.topics-scroll {
  white-space: nowrap;
}

.topic-tag {
  display: inline-flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 12px;
  margin-right: 10px;
  color: white;
}

.topic-name {
  font-size: 14px;
  font-weight: bold;
}

.topic-count {
  font-size: 11px;
  opacity: 0.85;
}

/* 帖子列表 */
.posts-list {
  padding: 0 15px;
  height: calc(100vh - 280px);
}

/* 发布框 */
.create-post {
  background: white;
  border-radius: 18px;
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.avatar {
  font-size: 36px;
  margin-right: 12px;
}

.input-hint {
  flex: 1;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 20px;
}

.input-hint text {
  color: #999;
  font-size: 14px;
}

.post-btn {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  margin-left: 10px;
  font-size: 13px;
  font-weight: bold;
}

/* 帖子卡片 */
.post-card {
  background: white;
  border-radius: 18px;
  padding: 15px;
  margin-bottom: 12px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.post-avatar {
  font-size: 36px;
  margin-right: 10px;
}

.post-user {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.follow-btn {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
}

.post-content {
  margin-bottom: 10px;
}

.post-text {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
}

.post-images {
  display: grid;
  gap: 5px;
  margin-bottom: 10px;
}

.post-img {
  width: 100%;
  height: 150px;
  border-radius: 8px;
}

.post-img.single-img {
  height: 200px;
}

.post-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  color: var(--accent-coral);
  font-size: 13px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-icon {
  font-size: 18px;
}

.action-count {
  font-size: 13px;
  color: #666;
}

/* 发布弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.create-modal {
  background: white;
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
}

.close-btn {
  font-size: 24px;
  color: #999;
}

.post-input {
  width: 100%;
  height: 120px;
  border: 2px solid var(--stroke);
  border-radius: 16px;
  padding: 12px;
  font-size: 15px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.upload-images {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #999;
}

.select-tags {
  margin-bottom: 15px;
}

.tags-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.tag-options {
  display: flex;
  gap: 8px;
}

.tag-option {
  background: #fff;
  border: 2px solid var(--stroke);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  color: var(--accent-coral);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: var(--shadow);
}
</style>
