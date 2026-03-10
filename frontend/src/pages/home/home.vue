<template>
  <div class="page-home">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="avatar">
          <span class="material-icons">pets</span>
        </div>
        <h1 class="title">萌宠家园</h1>
      </div>
      <div class="header-right">
        <button class="icon-btn" @click="$router.push('/explore')">
          <span class="material-icons">search</span>
        </button>
        <button class="icon-btn">
          <span class="material-icons">notifications</span>
        </button>
      </div>
    </header>

    <!-- Categories -->
    <div class="categories">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        <span class="material-icons">{{ cat.icon }}</span>
        <span class="category-label">{{ cat.name }}</span>
      </div>
    </div>

    <!-- Featured Story -->
    <section class="featured-section">
      <div class="featured-card" @click="handleStoryClick">
        <div class="featured-img" :style="{ backgroundImage: `url(${featuredStory.image})` }">
          <div class="featured-overlay">
            <span class="featured-tag">本周故事</span>
            <h3 class="featured-title">{{ featuredStory.title }}</h3>
            <p class="featured-desc">{{ featuredStory.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Posts Section -->
    <section class="posts-section">
      <div class="section-header">
        <h2>宠友圈动态</h2>
        <a href="#" class="see-all">查看全部</a>
      </div>
      <div class="posts-grid">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="handlePostClick(post)"
        >
          <div class="post-img" :style="{ backgroundImage: `url(${post.image})` }">
            <button class="like-btn" @click.stop="toggleLike(post)">
              <span class="material-icons">{{ post.liked ? 'favorite' : 'favorite_border' }}</span>
            </button>
          </div>
          <div class="post-info">
            <p class="post-text">{{ post.text }}</p>
            <div class="post-meta">
              <div class="post-author">
                <div class="author-avatar">{{ post.author.avatar }}</div>
                <span class="author-name">{{ post.author.name }}</span>
              </div>
              <span class="post-likes">{{ post.likes }} 赞</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Floating Action Button -->
    <button class="fab" @click="$router.push('/create-post')">
      <span class="material-icons">add</span>
    </button>

    <!-- Spacer for bottom nav -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeCategory = ref('dogs');

const categories = [
  { id: 'dogs', name: '狗狗', icon: 'pets' },
  { id: 'cats', name: '猫咪', icon: 'pets' },
  { id: 'small', name: '小宠', icon: 'pets' },
  { id: 'adopt', name: '领养', icon: 'volunteer_activism' },
  { id: 'nearby', name: '同城', icon: 'location_on' },
  { id: 'medical', name: '医疗', icon: 'medical_services' },
];

const featuredStory = ref({
  image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
  title: '寻回声音的流浪犬：阿福的治愈之路',
  desc: '记录一只被遗弃的小黄狗如何重新信任人类...',
});

const posts = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    text: '我家主子今天心情不错，竟然主动求抱抱了~',
    likes: 128,
    liked: false,
    author: { avatar: '🐱', name: '喵星人妈妈' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    text: '周末带大金毛去公园撒欢，接球接得可准了！',
    likes: 356,
    liked: true,
    author: { avatar: '🐕', name: '金毛奶爸' },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
    text: '两只小奶狗睡觉的样子真的太治愈了，心都化了~',
    likes: 892,
    liked: false,
    author: { avatar: '👨', name: '铲屎官小李' },
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
    text: '新来的兔兔成员，这长耳朵真的太软萌了吧！',
    likes: 214,
    liked: false,
    author: { avatar: '🐰', name: '垂耳兔控' },
  },
]);

const toggleLike = (post: any) => {
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
};

const handleStoryClick = () => {
  console.log('Story clicked');
};

const handlePostClick = (post: any) => {
  console.log('Post clicked:', post.id);
};
</script>

<style scoped>
.page-home {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 80px;
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

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-20);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary);
}

.avatar .material-icons {
  font-size: 20px;
  color: var(--primary);
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.header-right {
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
  transition: background 0.2s;
}

.icon-btn:hover {
  background: var(--primary-10);
  color: var(--primary);
}

/* Categories */
.categories {
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow-x: auto;
  background: white;
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
}

.categories::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 64px;
  cursor: pointer;
}

.category-item .material-icons {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--primary-20);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.2s;
}

.category-item.active .material-icons,
.category-item:hover .material-icons {
  background: var(--primary);
  color: white;
}

.category-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.category-item.active .category-label {
  color: var(--primary);
  font-weight: 600;
}

/* Featured Section */
.featured-section {
  padding: 16px;
}

.featured-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.featured-img {
  width: 100%;
  aspect-ratio: 16/9;
  background-size: cover;
  background-position: center;
  position: relative;
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
}

.featured-tag {
  display: inline-block;
  width: fit-content;
  padding: 4px 10px;
  background: var(--primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  margin-bottom: 8px;
}

.featured-title {
  color: white;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 4px;
}

.featured-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

/* Posts Section */
.posts-section {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 700;
}

.see-all {
  color: var(--primary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.post-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-img {
  width: 100%;
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  position: relative;
}

.like-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.like-btn .material-icons {
  font-size: 18px;
  color: white;
}

.post-info {
  padding: 12px;
}

.post-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.author-name {
  font-size: 10px;
  color: var(--text-muted);
}

.post-likes {
  font-size: 10px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 2px;
}

.post-likes .material-icons {
  font-size: 12px;
}

/* FAB */
.fab {
  position: fixed;
  right: 20px;
  bottom: 100px;
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
  transition: transform 0.2s;
}

.fab:hover {
  transform: scale(1.05);
}

.fab .material-icons {
  font-size: 28px;
  color: white;
}

.bottom-spacer {
  height: 20px;
}
</style>
