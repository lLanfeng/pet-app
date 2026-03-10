<template>
  <div class="page-community">
    <!-- Header -->
    <header class="header">
      <h1 class="title">宠友社区</h1>
      <div class="header-actions">
        <button class="icon-btn">
          <span class="material-icons">search</span>
        </button>
        <button class="icon-btn">
          <span class="material-icons">notifications</span>
        </button>
      </div>
    </header>

    <!-- Topics -->
    <div class="topics">
      <div
        v-for="topic in topics"
        :key="topic.id"
        class="topic-tag"
        :class="{ active: activeTopic === topic.id }"
        @click="activeTopic = topic.id"
      >
        # {{ topic.name }}
      </div>
    </div>

    <!-- Posts Feed -->
    <main class="feed">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post-card"
      >
        <!-- Post Header -->
        <div class="post-header">
          <div class="author-info">
            <div class="author-avatar">{{ post.author.avatar }}</div>
            <div class="author-detail">
              <span class="author-name">@{{ post.author.name }}</span>
              <span class="post-time">{{ post.time }}</span>
            </div>
          </div>
          <button class="follow-btn" :class="{ following: post.author.following }">
            {{ post.author.following ? '已关注' : '关注' }}
          </button>
        </div>

        <!-- Post Content -->
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>

        <!-- Post Image -->
        <div class="post-image" :style="{ backgroundImage: `url(${post.image})` }"></div>

        <!-- Post Actions -->
        <div class="post-actions">
          <button class="action-btn" @click="toggleLike(post)">
            <span class="material-icons" :class="{ 'filled-icon': post.liked }">
              {{ post.liked ? 'favorite' : 'favorite_border' }}
            </span>
            <span>{{ post.likes }}</span>
          </button>
          <button class="action-btn">
            <span class="material-icons">chat_bubble</span>
            <span>{{ post.comments }}</span>
          </button>
          <button class="action-btn">
            <span class="material-icons">share</span>
            <span>分享</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Floating Button -->
    <button class="fab" @click="$router.push('/create-post')">
      <span class="material-icons">add</span>
    </button>

    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTopic = ref('goldenhusky');

const topics = [
  { id: 'goldenhusky', name: '金毛日常' },
  { id: 'catlover', name: '猫奴日常' },
  { id: 'cutepet', name: '萌宠出街' },
  { id: 'training', name: '宠物训练' },
  { id: 'food', name: '宠物美食' },
];

const posts = ref([
  {
    id: 1,
    author: { name: '狗狗爱好者', avatar: '🐕', following: false },
    time: '2小时前',
    content: '阳光下的午后，最惬意的时光莫过于和它在一起。☀️🐕',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600',
    likes: 234,
    comments: 45,
    liked: false,
  },
  {
    id: 2,
    author: { name: '猫咪私语', avatar: '🐱', following: true },
    time: '5小时前',
    content: '终于抓拍到了小懒猫睡觉的样子，心都要化了～ 🐱💤',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
    likes: 1200,
    comments: 88,
    liked: true,
  },
]);

const toggleLike = (post: any) => {
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
};
</script>

<style scoped>
.page-community {
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
  background: rgba(248, 247, 246, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
}

.icon-btn:hover {
  background: var(--primary-10);
  color: var(--primary);
}

/* Topics */
.topics {
  display: flex;
  gap: 12px;
  padding: 16px;
  overflow-x: auto;
  background: white;
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
}

.topics::-webkit-scrollbar {
  display: none;
}

.topic-tag {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  background: var(--bg-gray);
  color: var(--text-secondary);
  transition: all 0.2s;
}

.topic-tag.active,
.topic-tag:hover {
  background: var(--primary-10);
  color: var(--primary);
}

/* Feed */
.feed {
  padding: 16px;
  padding-bottom: 100px;
}

.post-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.author-detail {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
}

.post-time {
  font-size: 12px;
  color: var(--text-muted);
}

.follow-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  background: var(--primary);
  color: white;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.follow-btn.following {
  background: var(--bg-gray);
  color: var(--text-secondary);
}

.post-content {
  margin-bottom: 12px;
}

.post-content p {
  font-size: 15px;
  line-height: 1.6;
}

.post-image {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  margin-bottom: 12px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid var(--border-light);
  padding-top: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  padding: 8px 16px;
}

.action-btn .material-icons {
  font-size: 20px;
}

.action-btn:hover {
  color: var(--primary);
}

.filled-icon {
  color: var(--primary);
  font-variation-settings: 'FILL' 1;
}

/* FAB */
.fab {
  position: fixed;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  border: none;
  box-shadow: 0 4px 16px rgba(238, 140, 43, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
}

.fab .material-icons {
  font-size: 28px;
  color: white;
}

.bottom-spacer {
  height: 100px;
}
</style>
