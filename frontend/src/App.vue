<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.restoreAuth();
});
</script>

<style>
/* 引入设计系统 */
@import './styles/design-system.css';

/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-page);
}

body {
  font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #e8e8e8;
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
</style>
