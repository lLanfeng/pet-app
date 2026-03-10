import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home/home.vue')
  },
  {
    path: '/encyclopedia',
    name: 'Encyclopedia',
    component: () => import('@/pages/encyclopedia/encyclopedia.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/pages/community/community.vue')
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/pages/messages/messages.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/profile/profile.vue')
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('@/pages/explore/explore.vue')
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: () => import('@/pages/create-post/create-post.vue')
  },
  {
    path: '/pet-detail',
    name: 'PetDetail',
    component: () => import('@/pages/pet-detail/pet-detail.vue')
  },
  // 保留旧路由兼容
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
    component: () => import('@/pages/pets/pets.vue')
  },
  {
    path: '/pets/add',
    name: 'AddPet',
    component: () => import('@/pages/pets/add.vue')
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
    path: '/achievements',
    name: 'Achievements',
    component: () => import('@/pages/achievements/achievements.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
