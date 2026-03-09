import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const normalizeUniUrl = (url: string) => {
  const [rawPath, query] = url.split('?');
  let path = rawPath || '';
  if (path.startsWith('/pages/')) {
    path = path.replace('/pages', '');
  }
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
    parts.pop();
  }
  const normalized = '/' + parts.join('/');
  return query ? `${normalized}?${query}` : normalized;
};

// Minimal uni.* shim for H5 to avoid runtime errors
if (typeof window !== 'undefined' && !(window as any).uni) {
  (window as any).uni = {
    showToast: ({ title }: { title: string }) => {
      console.log(`[toast] ${title}`);
    },
    showModal: ({ title, content, success }: { title?: string; content?: string; success?: (res: { confirm: boolean; cancel: boolean }) => void }) => {
      const ok = window.confirm([title, content].filter(Boolean).join('\n'));
      success && success({ confirm: ok, cancel: !ok });
    },
    navigateTo: ({ url }: { url: string }) => router.push(normalizeUniUrl(url)),
    navigateBack: () => router.back(),
    reLaunch: ({ url }: { url: string }) => router.replace(normalizeUniUrl(url)),
    switchTab: ({ url }: { url: string }) => router.push(normalizeUniUrl(url)),
    setStorageSync: (key: string, value: string) => localStorage.setItem(key, value),
    getStorageSync: (key: string) => localStorage.getItem(key)
  };
}

const app = createSSRApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
