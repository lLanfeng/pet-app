<template>
  <div class="page-encyclopedia">
    <!-- Header -->
    <header class="header">
      <div class="search-box">
        <span class="material-icons">search</span>
        <input type="text" placeholder="搜索宠物百科..." />
      </div>
      <button class="icon-btn">
        <span class="material-icons">notifications</span>
      </button>
    </header>

    <!-- Category Tabs -->
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </div>
    </div>

    <main class="content">
      <!-- Quick Tools -->
      <section class="tools-section">
        <div class="tools-grid">
          <div
            v-for="tool in tools"
            :key="tool.id"
            class="tool-item"
            @click="handleToolClick(tool)"
          >
            <div class="tool-icon">
              <span class="material-icons">{{ tool.icon }}</span>
            </div>
            <span class="tool-label">{{ tool.name }}</span>
          </div>
        </div>
      </section>

      <!-- Daily Care Guide -->
      <section class="articles-section">
        <div class="section-header">
          <h3>每日护理指南</h3>
          <a href="#" class="see-all">查看全部</a>
        </div>
        <div class="articles-list">
          <div
            v-for="article in articles"
            :key="article.id"
            class="article-card"
            @click="handleArticleClick(article)"
          >
            <div class="article-img" :style="{ backgroundImage: `url(${article.image})` }"></div>
            <div class="article-content">
              <h4 class="article-title">{{ article.title }}</h4>
              <p class="article-desc">{{ article.desc }}</p>
              <div class="article-meta">
                <span class="article-tag">{{ article.tag }}</span>
                <span class="article-info">{{ article.time }} · {{ article.views }} 阅读</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Breed Encyclopedia -->
      <section class="breed-section">
        <div class="breed-card">
          <h3>品种全书</h3>
          <p>收录了 300+ 常见宠物品种，点击探索每种生物的独特魅力。</p>
          <button class="breed-btn">立即探索</button>
        </div>
      </section>
    </main>

    <!-- Bottom spacer -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('dogs');

const tabs = [
  { id: 'dogs', name: '狗狗' },
  { id: 'cats', name: '猫咪' },
  { id: 'small', name: '小宠' },
  { id: 'nutrition', name: '营养' },
  { id: 'health', name: '健康' },
];

const tools = [
  { id: 'feed', name: '喂食提醒', icon: 'notifications_active' },
  { id: 'clinic', name: '附近诊所', icon: 'medical_services' },
  { id: 'diet', name: '饮食禁忌', icon: 'restaurant' },
  { id: 'guide', name: '养宠手册', icon: 'auto_stories' },
];

const articles = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
    title: '幼犬社会化：如何让你的狗狗学会与人相处',
    desc: '科学的社会化训练是让狗狗健康成长的关键第一步...',
    tag: '新手必看',
    time: '5分钟前',
    views: '1.2k',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
    title: '春季换季期，宠物的毛发护理需要注意这些',
    desc: '针对不同品种的宠物，换毛期的护理方案也各不相同...',
    tag: '健康护理',
    time: '1小时前',
    views: '850',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200',
    title: '自制猫饭全攻略：均衡营养的加餐选择',
    desc: '避开宠物禁食清单，为你的爱宠亲手制作一份美味大餐...',
    tag: '营养进阶',
    time: '2小时前',
    views: '2.1k',
  },
]);

const handleToolClick = (tool: any) => {
  console.log('Tool clicked:', tool.id);
};

const handleArticleClick = (article: any) => {
  console.log('Article clicked:', article.id);
};
</script>

<style scoped>
.page-encyclopedia {
  min-height: 100vh;
  background: var(--bg-page);
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(248, 247, 246, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.search-box .material-icons {
  font-size: 20px;
  color: var(--text-muted);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.search-box input::placeholder {
  color: var(--text-muted);
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

/* Tabs */
.tabs {
  display: flex;
  gap: 24px;
  padding: 0 16px;
  background: white;
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
  overflow-x: auto;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  padding: 14px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-item.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-item:hover {
  color: var(--primary);
}

/* Content */
.content {
  padding: 16px;
  padding-bottom: 100px;
}

/* Tools Section */
.tools-section {
  margin-bottom: 24px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.tool-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--primary-20);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(238, 140, 43, 0.15);
}

.tool-icon .material-icons {
  font-size: 28px;
}

.tool-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Articles Section */
.articles-section {
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

.see-all {
  color: var(--primary);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.article-img {
  width: 96px;
  height: 96px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-desc {
  font-size: 12px;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 4px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.article-tag {
  padding: 3px 8px;
  background: var(--primary-10);
  color: var(--primary);
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
}

.article-info {
  font-size: 10px;
  color: var(--text-muted);
}

/* Breed Section */
.breed-card {
  background: linear-gradient(135deg, var(--primary), #f5a74a);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.breed-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.breed-card p {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 16px;
}

.breed-btn {
  padding: 10px 24px;
  background: white;
  color: var(--primary);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bottom-spacer {
  height: 100px;
}
</style>
