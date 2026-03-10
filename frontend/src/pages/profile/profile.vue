<template>
  <div class="page-profile">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click="$router.back()">
        <span class="material-icons">arrow_back</span>
      </button>
      <h1 class="title">个人中心</h1>
      <button class="icon-btn">
        <span class="material-icons">settings</span>
      </button>
    </header>

    <!-- Profile Info -->
    <section class="profile-section">
      <div class="profile-info">
        <div class="avatar-large">
          <span class="avatar-img">👤</span>
        </div>
        <div class="profile-detail">
          <h2 class="nickname">马库斯</h2>
          <p class="location">
            <span class="material-icons">location_on</span>
            宠物爱好者 | 上海
          </p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats-section">
      <div class="stat-card">
        <span class="stat-num">128</span>
        <span class="stat-label">发布</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">2.5k</span>
        <span class="stat-label">粉丝</span>
      </div>
      <div class="stat-card">
        <span class="stat-num">350</span>
        <span class="stat-label">关注</span>
      </div>
    </section>

    <!-- My Pets -->
    <section class="pets-section">
      <div class="section-header">
        <h3>我的宠物</h3>
        <button class="add-btn">
          <span class="material-icons">add_circle</span>
          添加
        </button>
      </div>
      <div class="pets-scroll">
        <div class="pet-item">
          <div class="pet-avatar" style="background-image: url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100')"></div>
          <span class="pet-name">库伯</span>
        </div>
        <div class="pet-item">
          <div class="pet-avatar" style="background-image: url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100')"></div>
          <span class="pet-name">露娜</span>
        </div>
        <div class="pet-item add">
          <div class="pet-avatar-placeholder">
            <span class="material-icons">pets</span>
          </div>
          <span class="pet-name">待添加</span>
        </div>
      </div>
    </section>

    <!-- Content Tabs -->
    <section class="content-section">
      <div class="tabs">
        <button class="tab-item active">
          <span class="material-icons">grid_view</span>
          照片
        </button>
        <button class="tab-item">
          <span class="material-icons">movie</span>
          视频
        </button>
        <button class="tab-item">
          <span class="material-icons">sell</span>
          标记
        </button>
      </div>
      <div class="content-grid">
        <div
          v-for="i in 6"
          :key="i"
          class="grid-item"
          :style="{ backgroundImage: `url(https://source.unsplash.com/pet${i})` }"
        ></div>
      </div>
    </section>

    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-profile {
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
  background: var(--bg-page);
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
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
  color: var(--text-primary);
}

.icon-btn:hover {
  background: var(--primary-10);
}

.title {
  font-size: 18px;
  font-weight: 700;
}

/* Profile Section */
.profile-section {
  padding: 24px;
  display: flex;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-large {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 4px solid var(--primary-20);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.avatar-img {
  font-size: 56px;
}

.profile-detail {
  text-align: center;
}

.nickname {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.location {
  font-size: 14px;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.location .material-icons {
  font-size: 16px;
}

/* Stats */
.stats-section {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-num {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Pets Section */
.pets-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.add-btn .material-icons {
  font-size: 20px;
}

.pets-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.pets-scroll::-webkit-scrollbar {
  display: none;
}

.pet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.pet-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--primary);
  background-size: cover;
  background-position: center;
}

.pet-avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px dashed var(--border);
  background: var(--bg-gray);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-avatar-placeholder .material-icons {
  font-size: 32px;
  color: var(--text-muted);
}

.pet-name {
  font-size: 14px;
  font-weight: 600;
}

/* Content Section */
.content-section {
  padding: 0 16px;
}

.tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 12px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  background: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}

.tab-item.active {
  background: var(--primary);
  color: white;
}

.tab-item .material-icons {
  font-size: 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.grid-item {
  aspect-ratio: 1;
  background: var(--bg-gray);
  background-size: cover;
  background-position: center;
}

.bottom-spacer {
  height: 100px;
}
</style>
