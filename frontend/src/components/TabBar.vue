<template>
  <nav class="tab-bar">
    <div class="tab-bar-inner">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tab-item"
        :class="{ active: isActive(tab.path) }"
      >
        <span class="material-icons" :class="{ 'filled-icon': isActive(tab.path) }">
          {{ tab.icon }}
        </span>
        <span class="tab-label">{{ tab.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const tabs = [
  { path: '/home', icon: 'home', label: '首页' },
  { path: '/encyclopedia', icon: 'menu_book', label: '百科' },
  { path: '/community', icon: 'groups', label: '社区' },
  { path: '/messages', icon: 'chat_bubble', label: '消息' },
  { path: '/profile', icon: 'person', label: '我的' },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid rgba(238, 140, 43, 0.1);
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 100;
}

.tab-bar-inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 480px;
  margin: 0 auto;
  height: 64px;
  padding: 0 8px;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  text-decoration: none;
  color: #9CA3AF;
  transition: color 0.2s;
}

.tab-item.active {
  color: #ee8c2b;
}

.tab-item .material-icons {
  font-size: 24px;
}

.filled-icon {
  font-variation-settings: 'FILL' 1;
}

.tab-label {
  font-size: 10px;
  font-weight: 600;
}
</style>
