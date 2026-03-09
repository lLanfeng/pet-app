<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="header">
      <div class="user-section">
        <div class="avatar-wrapper" @click="goToProfile">
          <span class="avatar">{{ userAvatar }}</span>
          <span class="level-badge">Lv.{{ userLevel }}</span>
        </div>
        <div class="user-info">
          <span class="greeting">{{ timeOfDay }}，{{ userNickname }}</span>
          <span class="user-tag">{{ userTitleText }}</span>
        </div>
      </div>

      <div class="header-actions">
        <div class="coin-balance" @click="goToShop">
          <span class="coin-icon">💰</span>
          <span class="coin-amount">{{ coins }}</span>
        </div>
        <div class="gem-balance" @click="goToShop">
          <span class="gem-icon">💎</span>
          <span class="gem-amount">{{ gems }}</span>
        </div>
      </div>
    </div>

    <!-- 签到按钮 -->
    <div class="sign-section">
      <div class="sign-btn" :class="{ signed: todaySigned }" @click="handleSign">
        <span v-if="!todaySigned" class="sign-plus">+</span>
        <span class="sign-text">{{ todaySigned ? '已签到' : '签到' }}</span>
      </div>
    </div>

    <!-- 宠物轮播 -->
    <div class="banner">
      <swiper
        class="pet-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="600"
        :circular="true"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="bannerItem in banners" :key="bannerItem.id">
          <div class="banner-item" @click="onBannerClick(bannerItem)">
            <img :src="bannerItem.image" mode="aspectFill" class="banner-image" />
            <div class="banner-overlay">
              <span class="banner-title">{{ bannerItem.title }}</span>
              <span class="banner-desc">{{ bannerItem.desc }}</span>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>

    <!-- 快捷功能 -->
    <div class="quick-actions">
      <div class="action-item" @click="goToPets">
        <span class="action-icon">🐾</span>
        <span class="action-text">我的宠物</span>
      </div>
      <div class="action-item" @click="goToShop">
        <span class="action-icon">🛒</span>
        <span class="action-text">宠物商店</span>
      </div>
      <div class="action-item" @click="goToTasks">
        <span class="action-icon">📋</span>
        <span class="action-text">每日任务</span>
      </div>
      <div class="action-item" @click="goToRankings">
        <span class="action-icon">🏆</span>
        <span class="action-text">排行榜</span>
      </div>
      <div class="action-item" @click="goToCommunity">
        <span class="action-icon">💬</span>
        <span class="action-text">社区</span>
      </div>
      <div class="action-item" @click="goToAchievements">
        <span class="action-icon">🎖️</span>
        <span class="action-text">成就</span>
      </div>
      <div class="action-item" @click="goToFriends">
        <span class="action-icon">👥</span>
        <span class="action-text">好友</span>
      </div>
      <div class="action-item" @click="goToMail">
        <span class="action-icon">📮</span>
        <span class="action-text">邮件</span>
      </div>
    </div>

    <!-- 扭蛋机入口 -->
    <div class="gacha-section" @click="openGacha">
      <div class="gacha-content">
        <span class="gacha-icon">🎰</span>
        <div class="gacha-text">
          <span class="gacha-title">幸运扭蛋</span>
          <span class="gacha-desc">花费 100 金币抽取稀有宠物</span>
        </div>
      </div>
      <span class="gacha-arrow">›</span>
    </div>

    <!-- 我的宠物预览 -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">我的萌宠</span>
        <span class="section-more" @click="goToPets">查看全部</span>
      </div>
      <div class="pets-scroll">
        <div
          v-for="pet in myPets"
          :key="pet.id"
          class="pet-mini-card"
          :style="{ background: pet.bgColor }"
          @click="goToPetDetail(pet.id)"
        >
          <span class="pet-mini-avatar">{{ pet.emoji }}</span>
          <div class="pet-mini-info">
            <span class="pet-mini-name">{{ pet.name }}</span>
            <span class="pet-mini-level">Lv.{{ pet.level }}</span>
          </div>
          <div class="pet-status">
            <div class="status-item">
              <span class="status-label">饱</span>
              <div class="status-bar">
                <div class="status-fill" :style="{ width: pet.hunger + '%', background: '#22c55e' }"></div>
              </div>
            </div>
            <div class="status-item">
              <span class="status-label">乐</span>
              <div class="status-bar">
                <div class="status-fill" :style="{ width: pet.happiness + '%', background: '#f59e0b' }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pet-add-card" @click="goToAddPet">
          <span class="add-icon">+</span>
          <span class="add-text">添加宠物</span>
        </div>
      </div>
    </div>

    <!-- 今日任务进度 -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">今日任务</span>
        <span class="section-more" @click="goToTasks">更多</span>
      </div>
      <div class="tasks-progress-card">
        <div class="progress-header">
          <span class="progress-label">任务进度</span>
          <span class="progress-count">{{ completedTasks }}/{{ totalTasks }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: taskProgress + '%' }"></div>
        </div>
        <div class="tasks-preview">
          <div
            v-for="task in taskPreview"
            :key="task.id"
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <span class="task-emoji">{{ task.emoji }}</span>
            <span class="task-name">{{ task.name }}</span>
            <span class="task-status">{{ task.completed ? '✓' : `${task.current}/${task.target}` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-space"></div>
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
  { id: 1, image: 'https://place.dog/750/320', title: '🐕 新宠物来袭', desc: '领养一只可爱的小狗狗', link: '/pets' },
  { id: 2, image: 'https://place.dog/750/321', title: '🎁 登录送好礼', desc: '连续签到获得超值奖励', link: '/tasks' },
  { id: 3, image: 'https://place.dog/750/322', title: '🛒 商店特惠', desc: '限时折扣等你来抢', link: '/shop' },
  { id: 4, image: 'https://place.dog/750/323', title: '🏆 排行榜争夺战', desc: '谁是最后的赢家', link: '/rankings' }
]);

const myPets = ref<any[]>([]);
const totalTasks = ref(0);
const completedTasks = ref(0);
const taskProgress = computed(() => (totalTasks.value ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0));
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

const onBannerClick = (bannerItem: any) => {
  if (bannerItem.link) router.push(bannerItem.link);
};

const goToPets = () => router.push('/pets');
const goToShop = () => router.push('/shop');
const goToTasks = () => router.push('/tasks');
const goToRankings = () => router.push('/rankings');
const goToProfile = () => router.push('/profile');
const goToAddPet = () => router.push('/pets/add');
const goToCommunity = () => router.push('/community');
const goToAchievements = () => router.push('/achievements');
const goToFriends = () => uni.showToast({ title: '好友系统即将上线', icon: 'none' });
const goToMail = () => router.push('/mail');
const goToPetDetail = (id: number) => router.push(`/pets/detail?id=${id}`);

const openGacha = () => {
  if (coins.value < 100) {
    uni.showToast({ title: '金币不足', icon: 'error' });
    return;
  }
  coins.value -= 100;
  authStore.updateCoins(-100);
  const gachaResults = ['🐶', '🐱', '🐰', '🐹', '🦜', '🐠'];
  const result = gachaResults[Math.floor(Math.random() * gachaResults.length)];
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
      const colors = ['#f1f5f9', '#f0fdf4', '#fef3c7', '#fdf2f8', '#f0f9ff'];
      const emojiMap: any = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', parrot: '🦜', fish: '🐠' };
      myPets.value = (pets || []).slice(0, 5).map((p: any, idx: number) => ({
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
        name: t.title.replace('宠物', '').replace('每日', ''),
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
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Header */
.header {
  background: #fff;
  padding: 48px 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  font-size: 44px;
  display: block;
}

.level-badge {
  position: absolute;
  bottom: -2px;
  right: -6px;
  background: #f59e0b;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.user-tag {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.coin-balance,
.gem-balance {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.coin-icon,
.gem-icon {
  font-size: 14px;
  margin-right: 4px;
}

.coin-amount,
.gem-amount {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

/* Sign Button */
.sign-section {
  position: absolute;
  right: 20px;
  top: 56px;
}

.sign-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #22c55e;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.sign-btn:active {
  opacity: 0.8;
}

.sign-btn.signed {
  background: #e2e8f0;
}

.sign-plus {
  font-size: 14px;
  font-weight: 600;
  margin-right: 2px;
  color: #fff;
}

.sign-text {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.sign-btn.signed .sign-text {
  color: #64748b;
}

/* Banner */
.banner {
  margin: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.pet-swiper {
  width: 100%;
  height: 100%;
}

.banner-item {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 40px 16px 16px;
}

.banner-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: block;
  margin-bottom: 4px;
}

.banner-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #e2e8f0;
  margin: 0 16px;
  border-radius: 12px;
  overflow: hidden;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #fff;
  cursor: pointer;
}

.action-item:active {
  background: #f8fafc;
}

.action-icon {
  font-size: 22px;
  margin-bottom: 6px;
}

.action-text {
  font-size: 11px;
  color: #475569;
}

/* Gacha */
.gacha-section {
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.gacha-content {
  display: flex;
  align-items: center;
}

.gacha-icon {
  font-size: 28px;
  margin-right: 12px;
}

.gacha-text {
  display: flex;
  flex-direction: column;
}

.gacha-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.gacha-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.gacha-arrow {
  font-size: 20px;
  color: #cbd5e1;
}

/* Section */
.section {
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.section-more {
  font-size: 12px;
  color: #94a3b8;
}

/* Pets Scroll */
.pets-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pets-scroll::-webkit-scrollbar {
  display: none;
}

.pet-mini-card {
  min-width: 120px;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.pet-mini-avatar {
  font-size: 32px;
  text-align: center;
  margin-bottom: 8px;
}

.pet-mini-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pet-mini-name {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.pet-mini-level {
  font-size: 11px;
  color: #64748b;
}

.pet-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-label {
  font-size: 9px;
  color: #94a3b8;
  width: 12px;
}

.status-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  border-radius: 2px;
}

.pet-add-card {
  min-width: 80px;
  border-radius: 10px;
  padding: 12px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-icon {
  font-size: 24px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.add-text {
  font-size: 11px;
  color: #94a3b8;
}

/* Tasks */
.tasks-progress-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-label {
  font-size: 13px;
  color: #64748b;
}

.progress-count {
  font-size: 13px;
  color: #22c55e;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: #22c55e;
  border-radius: 3px;
}

.tasks-preview {
  display: flex;
  gap: 8px;
}

.task-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.task-item.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.task-emoji {
  font-size: 18px;
  margin-bottom: 4px;
}

.task-name {
  font-size: 10px;
  color: #64748b;
  margin-bottom: 2px;
}

.task-status {
  font-size: 10px;
  color: #94a3b8;
}

.bottom-space {
  height: 20px;
}
</style>
