<template>
  <div class="page-pet-detail">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click="$router.back()">
        <span class="material-icons">arrow_back</span>
      </button>
      <h1 class="title">宠物详情</h1>
      <button class="icon-btn">
        <span class="material-icons">more_horiz</span>
      </button>
    </header>

    <main class="content">
      <!-- Profile -->
      <section class="profile-section">
        <div class="pet-avatar">
          <div class="avatar-img" style="background-image: url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200')"></div>
          <div class="verified-badge">
            <span class="material-icons">verified_user</span>
          </div>
        </div>
        <h2 class="pet-name">小金</h2>
        <p class="pet-breed">金毛寻回犬</p>

        <div class="action-buttons">
          <button class="btn-edit">编辑资料</button>
          <button class="btn-share">分享名片</button>
        </div>
      </section>

      <!-- Stats -->
      <section class="stats-section">
        <div class="stat-item">
          <span class="stat-label">年龄</span>
          <span class="stat-value">2岁</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">性别</span>
          <span class="stat-value">公 (弟弟)</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">体重</span>
          <span class="stat-value">28.5kg</span>
        </div>
      </section>

      <!-- Health Status -->
      <section class="health-section">
        <div class="health-card">
          <div class="health-icon">
            <span class="material-icons">health_and_safety</span>
          </div>
          <div class="health-info">
            <h4>健康状态</h4>
            <p>已接种疫苗 · 已驱虫</p>
          </div>
          <span class="material-icons">chevron_right</span>
        </div>
      </section>

      <!-- Growth Chart -->
      <section class="growth-section">
        <div class="section-header">
          <h3>成长曲线</h3>
          <button class="see-more">查看周报</button>
        </div>
        <div class="chart-container">
          <div class="chart-bars">
            <div class="bar" style="height: 40%"></div>
            <div class="bar" style="height: 55%"></div>
            <div class="bar" style="height: 65%"></div>
            <div class="bar" style="height: 75%"></div>
            <div class="bar" style="height: 82%"></div>
            <div class="bar active" style="height: 90%"></div>
            <div class="bar" style="height: 95%"></div>
          </div>
          <div class="chart-labels">
            <span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span><span>7月</span>
          </div>
        </div>
      </section>

      <!-- Album -->
      <section class="album-section">
        <div class="section-header">
          <h3>生活相册</h3>
          <button class="see-more">上传照片</button>
        </div>
        <div class="album-grid">
          <div
            v-for="i in 3"
            :key="i"
            class="album-item"
            :style="{ backgroundImage: `url(https://picsum.photos/200/200?random=${i+20})` }"
          ></div>
        </div>
      </section>

      <!-- Timeline -->
      <section class="timeline-section">
        <h3>成长足迹</h3>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-icon">
              <span class="material-icons">cake</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-date">2024年3月15日</span>
              <h4>2岁生日派对</h4>
              <p>今天小金2岁啦！吃到了特制的狗狗蛋糕，特别开心。</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon gray">
              <span class="material-icons">vaccines</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-date">2023年11月20日</span>
              <h4>年度疫苗接种</h4>
              <p>完成了今年的狂犬疫苗和联苗接种，医生说非常健康。</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-pet-detail {
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
}

.title {
  font-size: 18px;
  font-weight: 700;
}

/* Content */
.content {
  padding: 24px 16px;
}

/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.pet-avatar {
  position: relative;
  margin-bottom: 16px;
}

.avatar-img {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-size: cover;
  background-position: center;
}

.verified-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.verified-badge .material-icons {
  font-size: 18px;
  color: white;
}

.pet-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.pet-breed {
  color: var(--primary);
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-edit,
.btn-share {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-edit {
  background: var(--primary-10);
  color: var(--primary);
}

.btn-share {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(238, 140, 43, 0.3);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  background: white;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
}

/* Health Section */
.health-section {
  margin-bottom: 24px;
}

.health-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--primary-10);
  border-radius: 16px;
}

.health-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-20);
  display: flex;
  align-items: center;
  justify-content: center;
}

.health-icon .material-icons {
  color: var(--primary);
  font-size: 24px;
}

.health-info {
  flex: 1;
}

.health-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.health-info p {
  font-size: 13px;
  color: var(--text-muted);
}

.health-card > .material-icons {
  color: var(--text-muted);
}

/* Growth Section */
.growth-section {
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

.see-more {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.chart-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  gap: 8px;
}

.bar {
  flex: 1;
  background: var(--primary-20);
  border-radius: 6px 6px 0 0;
}

.bar.active {
  background: var(--primary);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 10px;
  color: var(--text-muted);
}

/* Album Section */
.album-section {
  margin-bottom: 24px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.album-item {
  aspect-ratio: 1;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: var(--bg-gray);
}

/* Timeline Section */
.timeline-section {
  margin-bottom: 24px;
}

.timeline-section h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.timeline {
  position: relative;
  padding-left: 48px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: var(--primary-20);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-icon {
  position: absolute;
  left: -48px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-20);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-icon .material-icons {
  font-size: 20px;
  color: var(--primary);
}

.timeline-icon.gray {
  background: var(--bg-gray);
}

.timeline-icon.gray .material-icons {
  color: var(--text-muted);
}

.timeline-date {
  font-size: 12px;
  color: var(--text-muted);
}

.timeline-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 4px 0;
}

.timeline-content p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.bottom-spacer {
  height: 40px;
}
</style>
