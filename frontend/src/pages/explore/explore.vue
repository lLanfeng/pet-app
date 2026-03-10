<template>
  <div class="page-explore">
    <!-- Header -->
    <header class="header">
      <span class="material-icons">photo_camera</span>
      <h1 class="title">探索</h1>
      <span class="material-icons">notifications</span>
    </header>

    <!-- Search -->
    <div class="search-bar">
      <span class="material-icons">search</span>
      <input type="text" placeholder="搜索宠物品种、帖子..." />
    </div>

    <!-- Trending Topics -->
    <div class="trending-section">
      <h3>热门话题</h3>
      <div class="trending-tags">
        <span class="trending-tag active">#新手养猫指南</span>
        <span class="trending-tag">#周末带宠去哪儿</span>
        <span class="trending-tag">#狗狗训练营</span>
        <span class="trending-tag">#萌宠日常</span>
      </div>
    </div>

    <!-- Grid -->
    <main class="grid-container">
      <div class="grid-item" v-for="i in 8" :key="i">
        <div class="grid-img" :style="{ backgroundImage: `url(https://picsum.photos/400/500?random=${i})` }"></div>
        <div class="grid-info">
          <p class="grid-text">宠物趣图 {{ i }}</p>
          <div class="grid-meta">
            <span class="grid-author">用户{{ i }}</span>
            <span class="grid-likes">
              <span class="material-icons">favorite</span>
              {{ 100 + i * 10 }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- FAB -->
    <button class="fab" @click="$router.push('/create-post')">
      <span class="material-icons">add</span>
    </button>

    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-explore {
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

.header .material-icons {
  font-size: 28px;
  color: var(--text-primary);
}

.title {
  font-size: 18px;
  font-weight: 700;
}

/* Search */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 16px;
  padding: 12px 16px;
  background: var(--bg-gray);
  border-radius: 12px;
}

.search-bar .material-icons {
  font-size: 20px;
  color: var(--text-muted);
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
}

.search-bar input::placeholder {
  color: var(--text-muted);
}

/* Trending */
.trending-section {
  padding: 0 16px 16px;
}

.trending-section h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.trending-tags {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.trending-tags::-webkit-scrollbar {
  display: none;
}

.trending-tag {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  background: var(--bg-gray);
  color: var(--text-secondary);
}

.trending-tag.active {
  background: var(--primary-10);
  color: var(--primary);
  border: 1px solid var(--primary-20);
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px 100px;
}

.grid-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.grid-img {
  width: 100%;
  aspect-ratio: 3/4;
  background-size: cover;
  background-position: center;
}

.grid-info {
  padding: 12px;
}

.grid-text {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grid-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid-author {
  font-size: 11px;
  color: var(--text-muted);
}

.grid-likes {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  color: var(--text-muted);
}

.grid-likes .material-icons {
  font-size: 14px;
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
}

.fab .material-icons {
  font-size: 28px;
  color: white;
}

.bottom-spacer {
  height: 20px;
}
</style>
