<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="header">
      <div class="user-section">
        <div class="avatar" @click="goToProfile">
          <span>{{ userAvatar }}</span>
        </div>
        <div class="user-info">
          <span class="greeting">{{ timeOfDay }}，{{ userNickname }}</span>
          <span class="user-title">Lv.{{ userLevel }} · {{ userTitleText }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="coin-pill" @click="goToShop">
          <span>💰</span>
          <span>{{ coins }}</span>
        </div>
        <div class="sign-pill" :class="{ signed: todaySigned }" @click="handleSign">
          <span>{{ todaySigned ? '✓' : '+' }}</span>
        </div>
      </div>
    </div>

    <!-- 横幅轮播 -->
    <div class="banner-wrap">
      <div class="swiper" ref="swiperRef">
        <div class="swiper-wrapper">
          <div
            v-for="item in banners"
            :key="item.id"
            class="swiper-slide"
            @click="onBannerClick(item)"
          >
            <div class="banner-content">
              <img :src="item.image" class="banner-img" />
              <div class="banner-info">
                <span class="banner-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-grid">
      <div class="quick-item" v-for="(item, index) in quickActions" :key="index" @click="item.action">
        <div class="quick-icon">{{ item.icon }}</div>
        <span class="quick-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 扭蛋卡片 -->
    <div class="gacha-card" @click="openGacha">
      <div class="gacha-left">
        <span class="gacha-icon">🎰</span>
        <div class="gacha-info">
          <span class="gacha-title">幸运扭蛋</span>
          <span class="gacha-desc">100金币抽取稀有宠物</span>
        </div>
      </div>
      <span class="gacha-arrow">›</span>
    </div>

    <!-- 我的宠物 -->
    <div class="section">
      <div class="section-head">
        <span class="section-title">我的萌宠</span>
        <span class="section-more" @click="goToPets">查看全部 ›</span>
      </div>
      <div class="pets-row">
        <div
          v-for="pet in myPets"
          :key="pet.id"
          class="pet-chip"
          @click="goToPetDetail(pet.id)"
        >
          <span class="pet-emoji">{{ pet.emoji }}</span>
          <span class="pet-name">{{ pet.name }}</span>
          <span class="pet-level">Lv.{{ pet.level }}</span>
        </div>
        <div class="pet-add" @click="goToAddPet">
          <span class="add-icon">+</span>
        </div>
      </div>
    </div>

    <!-- 今日任务 -->
    <div class="section">
      <div class="section-head">
        <span class="section-title">今日任务</span>
        <span class="section-more" @click="goToTasks">更多 ›</span>
      </div>
      <div class="task-card">
        <div class="task-header">
          <span class="task-label">任务进度</span>
          <span class="task-count">{{ completedTasks }}/{{ totalTasks }}</span>
        </div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: taskProgress + '%' }"></div>
        </div>
        <div class="task-list">
          <div v-for="task in taskPreview" :key="task.id" class="task-item">
            <span class="task-emoji">{{ task.emoji }}</span>
            <span class="task-name">{{ task.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { petAPI, tasksAPI, userAPI } from '@/services/api';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const router = useRouter();
const authStore = useAuthStore();
const swiperRef = ref<HTMLElement | null>(null);
let swiperInstance: Swiper | null = null;

const userNickname = ref('主人');
const userLevel = ref(1);
const userAvatar = ref('👤');
const coins = ref(0);
const todaySigned = ref(false);

const timeOfDay = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

const userTitles = ['萌新', '达人', '高手', '大师', '王者'];
const userTitleText = computed(() => userTitles[Math.min(Math.floor(userLevel.value / 5), userTitles.length - 1)]);

const banners = ref([
  { id: 1, image: 'https://place.dog/750/300', title: '新宠物来袭', link: '/pets' },
  { id: 2, image: 'https://place.dog/750/301', title: '签到送好礼', link: '/tasks' },
  { id: 3, image: 'https://place.dog/750/302', title: '商店特惠', link: '/shop' },
]);

const quickActions = [
  { icon: '🐾', label: '宠物', action: () => router.push('/pets') },
  { icon: '🛒', label: '商店', action: () => router.push('/shop') },
  { icon: '📋', label: '任务', action: () => router.push('/tasks') },
  { icon: '🏆', label: '排行', action: () => router.push('/rankings') },
  { icon: '💬', label: '社区', action: () => router.push('/community') },
  { icon: '🎖️', label: '成就', action: () => router.push('/achievements') },
  { icon: '📮', label: '邮件', action: () => router.push('/mail') },
  { icon: '👤', label: '我的', action: () => router.push('/profile') },
];

const myPets = ref<any[]>([]);
const totalTasks = ref(0);
const completedTasks = ref(0);
const taskProgress = computed(() => totalTasks.value ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0);
const taskPreview = ref<any[]>([]);

const handleSign = async () => {
  if (todaySigned.value) return;
  const userId = authStore.userId || 1;
  try {
    const res = await userAPI.signIn(userId);
    if (res.alreadySigned) {
      todaySigned.value = true;
      uni.showToast({ title: '今日已签到', icon: 'none' });
      return;
    }
    todaySigned.value = true;
    const reward = res.reward || 0;
    coins.value += reward;
    authStore.updateCoins(reward);
    uni.showToast({ title: `签到成功！${reward}金币`, icon: 'success' });
  } catch (err: any) {
    uni.showToast({ title: err?.error || '签到失败', icon: 'error' });
  }
};

const onBannerClick = (item: any) => {
  if (item.link) router.push(item.link);
};

const goToPets = () => router.push('/pets');
const goToShop = () => router.push('/shop');
const goToTasks = () => router.push('/tasks');
const goToProfile = () => router.push('/profile');
const goToAddPet = () => router.push('/pets/add');
const goToPetDetail = (id: number) => router.push(`/pets/detail?id=${id}`);

const openGacha = () => {
  if (coins.value < 100) {
    uni.showToast({ title: '金币不足', icon: 'none' });
    return;
  }
  coins.value -= 100;
  authStore.updateCoins(-100);
  const results = ['🐶', '🐱', '🐰', '🐹', '🦜', '🐠'];
  const result = results[Math.floor(Math.random() * results.length)];
  uni.showModal({
    title: '🎰 扭蛋结果',
    content: `恭喜获得 ${result} 宠物一只！`,
    showCancel: false
  });
};

onMounted(() => {
  authStore.restoreAuth();

  // Initialize Swiper
  if (swiperRef.value) {
    swiperInstance = new Swiper(swiperRef.value, {
      modules: [Pagination, Autoplay],
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    });
  }

  const loadDashboard = async () => {
    const userId = authStore.userId || 1;

    try {
      const info = await userAPI.getById(userId);
      userNickname.value = info.nickname || '主人';
      userLevel.value = info.level || 1;
      userAvatar.value = info.avatar || '👤';
      coins.value = info.coins || 0;
    } catch {
      if (authStore.userInfo) {
        userNickname.value = authStore.userInfo.nickname || '主人';
        userLevel.value = authStore.userInfo.level || 1;
        userAvatar.value = authStore.userInfo.avatar || '👤';
        coins.value = authStore.userInfo.coins || 0;
      }
    }

    try {
      const pets = await petAPI.listPetsByUser(userId);
      const emojiMap: any = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', parrot: '🦜', fish: '🐠' };
      myPets.value = (pets || []).slice(0, 4).map((p: any) => ({
        id: p.id,
        name: p.name,
        emoji: emojiMap[p.type] || '🐾',
        level: p.level
      }));
    } catch {
      myPets.value = [];
    }

    try {
      const tasks = await tasksAPI.list(userId);
      totalTasks.value = tasks.length;
      completedTasks.value = tasks.filter((t: any) => t.completed).length;
      taskPreview.value = tasks.slice(0, 4).map((t: any) => ({
        id: t.id,
        name: t.title?.substring(0, 4) || '任务',
        emoji: t.emoji
      }));
    } catch {
      totalTasks.value = 0;
      completedTasks.value = 0;
      taskPreview.value = [];
    }
  };

  loadDashboard();
});

onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy();
  }
});
</script>

<style scoped>
.home-container {
  background: var(--bg-page);
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Header */
.header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 50px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.25);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.user-title {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coin-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}

.sign-pill {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
}

.sign-pill.signed {
  background: var(--bg-gray);
  color: var(--text-muted);
}

/* Banner */
.banner-wrap {
  padding: 12px 16px;
}

.banner-wrap .swiper {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.banner-content {
  position: relative;
  width: 100%;
  height: 140px;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 12px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
}

.banner-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* Quick Grid */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  margin: 0 16px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  background: var(--bg-card);
  cursor: pointer;
}

.quick-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.quick-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Gacha Card */
.gacha-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, var(--accent-purple), #A78BFA);
  margin: 16px;
  padding: 14px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.gacha-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gacha-icon {
  font-size: 28px;
}

.gacha-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  display: block;
}

.gacha-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.8);
}

.gacha-arrow {
  font-size: 22px;
  color: #fff;
}

/* Section */
.section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-more {
  font-size: 13px;
  color: var(--text-muted);
}

/* Pets Row */
.pets-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.pets-row::-webkit-scrollbar {
  display: none;
}

.pet-chip {
  min-width: 90px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border);
  cursor: pointer;
}

.pet-emoji {
  font-size: 32px;
  margin-bottom: 6px;
}

.pet-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.pet-level {
  font-size: 11px;
  color: var(--primary);
}

.pet-add {
  min-width: 70px;
  background: var(--bg-gray);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-icon {
  font-size: 24px;
  color: var(--text-muted);
}

/* Task Card */
.task-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 14px;
  border: 1px solid var(--border);
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.task-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.task-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}

.task-list {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.task-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
}

.task-emoji {
  font-size: 16px;
  margin-bottom: 4px;
}

.task-name {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
