<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="header">
      <div class="user-section">
        <div class="avatar" @click="goToProfile">
          <span>{{ userAvatar }}</span>
          <span class="level-tag">Lv.{{ userLevel }}</span>
        </div>
        <div class="user-info">
          <span class="greeting">{{ timeOfDay }}，{{ userNickname }}</span>
          <span class="user-title">{{ userTitleText }}</span>
        </div>
      </div>

      <div class="header-right">
        <div class="coin-pill" @click="goToShop">
          <span class="coin-icon">💰</span>
          <span class="coin-value">{{ coins }}</span>
        </div>
        <div class="gem-pill" @click="goToShop">
          <span class="gem-icon">💎</span>
          <span class="gem-value">{{ gems }}</span>
        </div>
      </div>
    </div>

    <!-- 签到 -->
    <div class="sign-pill" :class="{ signed: todaySigned }" @click="handleSign">
      <span v-if="!todaySigned" class="sign-plus">+</span>
      <span class="sign-text">{{ todaySigned ? '已签到' : '签到' }}</span>
    </div>

    <!-- 横幅 -->
    <div class="banner-wrap">
      <swiper
        class="banner"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="600"
        :circular="true"
        indicator-color="rgba(255,255,255,0.4)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="item in banners" :key="item.id">
          <div class="banner-content" @click="onBannerClick(item)">
            <img :src="item.image" mode="aspectFill" class="banner-img" />
            <div class="banner-info">
              <span class="banner-title">{{ item.title }}</span>
              <span class="banner-desc">{{ item.desc }}</span>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-grid">
      <div class="quick-item" v-for="(item, index) in quickActions" :key="index" @click="item.action">
        <div class="quick-icon">{{ item.icon }}</div>
        <span class="quick-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 扭蛋 -->
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
        <span class="section-more" @click="goToPets">查看全部</span>
      </div>
      <div class="pets-row">
        <div
          v-for="pet in myPets"
          :key="pet.id"
          class="pet-chip"
          :style="{ background: pet.bgColor }"
          @click="goToPetDetail(pet.id)"
        >
          <span class="pet-emoji">{{ pet.emoji }}</span>
          <div class="pet-meta">
            <span class="pet-name">{{ pet.name }}</span>
            <span class="pet-level">Lv.{{ pet.level }}</span>
          </div>
          <div class="pet-bars">
            <div class="pet-bar-item">
              <span class="bar-label">饱</span>
              <div class="pet-bar">
                <div class="pet-bar-fill" :style="{ width: pet.hunger + '%', background: '#22C55E' }"></div>
              </div>
            </div>
            <div class="pet-bar-item">
              <span class="bar-label">乐</span>
              <div class="pet-bar">
                <div class="pet-bar-fill" :style="{ width: pet.happiness + '%', background: '#F59E0B' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pet-add" @click="goToAddPet">
          <span class="add-icon">+</span>
          <span class="add-label">添加</span>
        </div>
      </div>
    </div>

    <!-- 今日任务 -->
    <div class="section">
      <div class="section-head">
        <span class="section-title">今日任务</span>
        <span class="section-more" @click="goToTasks">更多</span>
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
          <div v-for="task in taskPreview" :key="task.id" class="task-item" :class="{ done: task.completed }">
            <span class="task-emoji">{{ task.emoji }}</span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-status">{{ task.completed ? '✓' : `${task.current}/${task.target}` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-fake"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { petAPI, tasksAPI, userAPI } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const userNickname = ref('主人');
const userLevel = ref(1);
const userAvatar = ref('👤');
const coins = ref(0);
const gems = ref(0);
const todaySigned = ref(false);

const timeOfDay = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

const userTitles = ['萌新铲屎官', '初级达人', '中级达人', '高级达人', '资深达人', '宠物大师', '宠物之王'];
const userTitleText = computed(() => userTitles[Math.min(Math.floor(userLevel.value / 5), userTitles.length - 1)]);

const banners = ref([
  { id: 1, image: 'https://place.dog/750/320', title: '🐕 新宠物来袭', desc: '领养可爱小狗狗', link: '/pets' },
  { id: 2, image: 'https://place.dog/750/321', title: '🎁 登录送好礼', desc: '连续签到得奖励', link: '/tasks' },
  { id: 3, image: 'https://place.dog/750/322', title: '🛒 商店特惠', desc: '限时折扣等你', link: '/shop' },
]);

const quickActions = [
  { icon: '🐾', label: '我的宠物', action: () => router.push('/pets') },
  { icon: '🛒', label: '宠物商店', action: () => router.push('/shop') },
  { icon: '📋', label: '每日任务', action: () => router.push('/tasks') },
  { icon: '🏆', label: '排行榜', action: () => router.push('/rankings') },
  { icon: '💬', label: '社区', action: () => router.push('/community') },
  { icon: '🎖️', label: '成就', action: () => router.push('/achievements') },
  { icon: '👥', label: '好友', action: () => uni.showToast({ title: '即将上线', icon: 'none' }) },
  { icon: '📮', label: '邮件', action: () => router.push('/mail') },
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
    uni.showToast({ title: '金币不足', icon: 'error' });
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

  const loadDashboard = async () => {
    const userId = authStore.userId || 1;

    try {
      const info = await userAPI.getById(userId);
      userNickname.value = info.nickname || '主人';
      userLevel.value = info.level || 1;
      userAvatar.value = info.avatar || '👤';
      coins.value = info.coins || 0;
      gems.value = info.diamonds || 0;
    } catch {
      if (authStore.userInfo) {
        userNickname.value = authStore.userInfo.nickname || '主人';
        userLevel.value = authStore.userInfo.level || 1;
        userAvatar.value = authStore.userInfo.avatar || '👤';
        coins.value = authStore.userInfo.coins || 0;
        gems.value = authStore.userInfo.diamonds || 0;
      }
    }

    try {
      const pets = await petAPI.listPetsByUser(userId);
      const colors = ['#F0FDF4', '#FEFCE8', '#FEF3C7', '#FDF4FF', '#F0F9FF'];
      const emojiMap: any = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', parrot: '🦜', fish: '🐠' };
      myPets.value = (pets || []).slice(0, 4).map((p: any, idx: number) => ({
        id: p.id,
        name: p.name,
        emoji: emojiMap[p.type] || '🐾',
        level: p.level,
        hunger: p.hunger,
        happiness: p.happiness,
        bgColor: colors[idx % colors.length]
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
        name: t.title?.replace('宠物', '').replace('每日', '') || t.title,
        emoji: t.emoji,
        current: t.current,
        target: t.target,
        completed: t.completed
      }));
    } catch {
      totalTasks.value = 0;
      completedTasks.value = 0;
      taskPreview.value = [];
    }
  };

  loadDashboard();
});
</script>

<style scoped>
.home-container {
  background: var(--bg-page);
  min-height: 100vh;
  padding-bottom: 100px;
}

/* Header */
.header {
  background: var(--bg-card);
  padding: 52px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  position: relative;
  width: 48px;
  height: 48px;
  background: var(--bg-muted);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.level-tag {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--primary);
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-title {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.header-right {
  display: flex;
  gap: 8px;
}

.coin-pill,
.gem-pill {
  display: flex;
  align-items: center;
  background: var(--bg-muted);
  padding: 6px 10px;
  border-radius: var(--radius-full);
  gap: 4px;
}

.coin-icon,
.gem-icon {
  font-size: 12px;
}

.coin-value,
.gem-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Sign Pill */
.sign-pill {
  position: absolute;
  right: 16px;
  top: 58px;
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--primary);
  color: #fff;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.sign-pill.signed {
  background: var(--bg-muted);
  color: var(--text-muted);
}

.sign-plus {
  font-size: 14px;
  font-weight: 600;
}

/* Banner */
.banner-wrap {
  padding: 16px;
}

.banner {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.banner-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.banner-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 14px 14px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
}

.banner-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  display: block;
}

.banner-desc {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
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
}

.quick-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.quick-label {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Gacha Card */
.gacha-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  margin: 16px;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.gacha-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gacha-icon {
  font-size: 26px;
}

.gacha-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.gacha-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.gacha-arrow {
  font-size: 20px;
  color: var(--border);
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
  font-size: 12px;
  color: var(--text-muted);
}

/* Pets Row */
.pets-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pets-row::-webkit-scrollbar {
  display: none;
}

.pet-chip {
  min-width: 140px;
  border-radius: var(--radius-lg);
  padding: 12px;
  border: 1px solid var(--border);
}

.pet-emoji {
  font-size: 28px;
  display: block;
  text-align: center;
  margin-bottom: 8px;
}

.pet-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pet-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.pet-level {
  font-size: 11px;
  color: var(--text-muted);
}

.pet-bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pet-bar-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bar-label {
  font-size: 9px;
  color: var(--text-muted);
  width: 12px;
}

.pet-bar {
  flex: 1;
  height: 4px;
  background: rgba(0,0,0,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.pet-bar-fill {
  height: 100%;
  border-radius: 2px;
}

.pet-add {
  min-width: 80px;
  border-radius: var(--radius-lg);
  padding: 12px;
  background: var(--bg-muted);
  border: 1px dashed var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 20px;
  color: var(--text-muted);
}

.add-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
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

.progress {
  height: 6px;
  background: var(--bg-muted);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 14px;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
}

.task-list {
  display: flex;
  gap: 8px;
}

.task-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  background: var(--bg-muted);
  border-radius: var(--radius-md);
}

.task-item.done {
  background: var(--primary-light);
}

.task-emoji {
  font-size: 16px;
  margin-bottom: 4px;
}

.task-name {
  font-size: 10px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.task-status {
  font-size: 10px;
  color: var(--text-muted);
}

.bottom-fake {
  height: 20px;
}
</style>
