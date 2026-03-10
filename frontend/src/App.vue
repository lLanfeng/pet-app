<template>
  <div id="app">
    <router-view />
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import TabBar from '@/components/TabBar.vue';

const route = useRoute();
const authStore = useAuthStore();

const showTabBar = computed(() => {
  const tabPaths = ['/home', '/encyclopedia', '/community', '/messages', '/profile'];
  return tabPaths.includes(route.path);
});

onMounted(() => {
  authStore.restoreAuth();
});
</script>

<style>
/* 引入设计系统 */
@import './styles/design-system.css';

/* 引入 Material Icons */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* 桌面端限制宽度 */
@media (min-width: 481px) {
  html, body {
    background: #e8e8e8;
  }
  #app {
    max-width: 428px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    min-height: 100vh;
  }
}

body {
  font-family: "Plus Jakarta Sans", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Material Icons 全局样式 */
.material-icons {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.filled-icon {
  font-variation-settings: 'FILL' 1;
}
</style>
