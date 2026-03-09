import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/register/register.vue')
  },
  {
    path: '/pets',
    name: 'Pets',
    component: () => import('@/pages/pets/pets.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pets/add',
    name: 'AddPet',
    component: () => import('@/pages/pets/add.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pets/detail',
    name: 'PetDetail',
    component: () => import('@/pages/pets/detail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/pages/shop/shop.vue')
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/pages/tasks/tasks.vue')
  },
  {
    path: '/rankings',
    name: 'Rankings',
    component: () => import('@/pages/rankings/rankings.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/settings/settings.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/profile/profile.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/pages/community/community.vue')
  },
  {
    path: '/mail',
    name: 'Mail',
    component: () => import('@/pages/mail/mail.vue')
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('@/pages/achievements/achievements.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 移除登录拦截，让用户可以自由浏览
// 如需开启登录拦截，只需添加以下代码：
/*
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});
*/

export default router;
