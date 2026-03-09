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
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --bg-base: #fff6fb;
  --bg-soft: #fffdf2;
  --text-primary: #3a2b3f;
  --text-muted: #7b6b83;
  --accent-coral: #ff7ab6;
  --accent-mint: #4bd1c8;
  --accent-sun: #ffd46a;
  --accent-lav: #bba3ff;
  --card: #ffffff;
  --shadow: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-hover: 0 8px 30px rgba(0,0,0,0.12);
  --stroke: rgba(58, 43, 63, 0.08);
  --max-width: 480px;
  --radius: 16px;
  --radius-lg: 24px;
}

#app {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  min-height: 100vh;
  animation: pageFade 0.4s ease;
  box-shadow: 0 0 60px rgba(0,0,0,0.15);
  background: var(--bg-base);
  position: relative;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Baloo 2", "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif;
  background: #e8e8e8;
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@keyframes pageFade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
