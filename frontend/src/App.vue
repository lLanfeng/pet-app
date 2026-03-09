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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap');

:root {
  --bg-base: #f8fafc;
  --text-primary: #1e293b;
  --text-muted: #64748b;
  --accent: #22c55e;
}

#app {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-base);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif;
  background: #e8e8e8;
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}
</style>
