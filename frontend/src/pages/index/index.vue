<template>
  <div class="home-container">
    <!-- 顶部用户信息�?-->
    <div class="header">
      <div class="header-bg"></div>
      <div class="header-content">
        <div class="user-section">
          <div class="avatar-wrapper" @click="goToProfile">
            <span class="avatar">{{ userAvatar }}</span>
            <span class="level-badge">Lv.{{ userLevel }}</span>
          </div>
          <div class="user-info">
            <span class="greeting">{{ timeOfDay }}，{{ userNickname }}</span>
            <span class="user-tag">🌟 {{ userTitleText }}</span>
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
    </div>

    <!-- 宠物轮播�?-->
    <div class="banner">
      <swiper
        class="pet-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="600"
        :circular="true"
        indicator-color="rgba(255,255,255,0.4)"
        indicator-active-color="#ffd93d"
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

    <!-- 快捷功能�?-->
    <div class="section quick-actions-section">
      <div class="quick-actions">
        <div class="action-item" @click="goToPets">
          <div class="action-icon">🐾</div>
          <span class="action-text">我的宠物</span>
        </div>
        <div class="action-item" @click="goToShop">
          <div class="action-icon">🛒</div>
          <span class="action-text">宠物商店</span>
        </div>
        <div class="action-item" @click="goToTasks">
          <div class="action-icon">📋</div>
          <span class="action-text">每日任务</span>
        </div>
        <div class="action-item" @click="goToRankings">
          <div class="action-icon">🏆</div>
          <span class="action-text">排行榜</span>
        </div>
        <div class="action-item" @click="goToCommunity">
          <div class="action-icon">💬</div>
          <span class="action-text">社区</span>
        </div>
        <div class="action-item" @click="goToAchievements">
          <div class="action-icon">🎖️</div>
          <span class="action-text">成就</span>
        </div>
        <div class="action-item" @click="goToFriends">
          <div class="action-icon">👥</div>
          <span class="action-text">好友</span>
        </div>
        <div class="action-item" @click="goToMail">
          <div class="action-icon">📮</div>
          <span class="action-text">邮件</span>
        </div>
      </div>
    </div>

    <!-- 扭蛋机入�?-->
    <div class="gacha-section" @click="openGacha">
      <div class="gacha-content">
        <span class="gacha-icon">🎰</span>
        <div class="gacha-text">
          <span class="gacha-title">幸运扭蛋</span>
          <span class="gacha-desc">花费 100 金币抽取稀有宠物！</span>
        </div>
      </div>
      <span class="gacha-arrow">›</span>
    </div>

    <!-- 我的宠物预览 -->
    <div class="section pets-preview-section">
      <div class="section-header">
        <span class="section-title">🐾 我的萌宠</span>
        <span class="section-more" @click="goToPets">查看全部 ></span>
      </div>
      <div class="pets-scroll">
        <div
          v-for="pet in myPets"
          :key="pet.id"
          class="pet-mini-card"
          :style="{ background: pet.bgGradient }"
          @click="goToPetDetail(pet.id)"
        >
          <div class="pet-mini-avatar">{{ pet.emoji }}</div>
          <div class="pet-mini-info">
            <span class="pet-mini-name">{{ pet.name }}</span>
            <span class="pet-mini-level">Lv.{{ pet.level }}</span>
          </div>
          <div class="pet-status">
            <div class="status-item">
              <span class="status-label">饱</span>
              <div class="status-bar">
                <div class="status-fill hunger" :style="{ width: pet.hunger + '%' }"></div>
              </div>
            </div>
            <div class="status-item">
              <span class="status-label">乐</span>
              <div class="status-bar">
                <div class="status-fill happiness" :style="{ width: pet.happiness + '%' }"></div>
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
    <div class="section tasks-section">
      <div class="section-header">
        <span class="section-title">📋 今日任务</span>
        <span class="section-more" @click="goToTasks">更多 ></span>
      </div>
      <div class="tasks-progress-card">
        <div class="progress-header">
          <span class="progress-label">任务进度</span>
          <span class="progress-count">{{ completedTasks }}/{{ totalTasks }}</span>
        </div>
        <div class="progress-bar-large">
          <div class="progress-fill" :style="{ width: taskProgress + '%' }"></div>
        </div>
        <div class="tasks-preview">
          <div
            v-for="task in taskPreview"
            :key="task.id"
            class="task-mini-item"
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
    uni.showToast({ title: `签到成功�?${reward}金币`, icon: 'success' });
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
      const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
        'linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%)'
      ];
      const emojiMap: any = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', parrot: '🦜', fish: '🐠' };
      myPets.value = (pets || []).slice(0, 5).map((p: any, idx: number) => ({
        id: p.id,
        name: p.name,
        emoji: emojiMap[p.type] || '🐾',
        level: p.level,
        hunger: p.hunger,
        happiness: p.happiness,
        bgGradient: gradients[idx % gradients.length]
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
  background-color: transparent;
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 16px 30px; border-radius: 0 0 24px 24px;
  color: white;
  position: relative;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjUwJSIgY3k9IjUwJSIgcj0iMjAlIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+');
  opacity: 0.5;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.user-section {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  margin-right: 12px;
  cursor: pointer;
}

.avatar {
  font-size: 48px;
  display: block;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.level-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ffd93d, #ffb347);
  color: #333;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.user-tag {
  font-size: 12px;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.coin-balance,
.gem-balance {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  backdrop-filter: blur(4px);
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
}

.sign-section {
  position: absolute;
  right: 16px;
  bottom: -14px;
  z-index: 2;
}

.sign-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd93d, #ffb347);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 217, 61, 0.4);
  transition: all 0.3s;
}

.sign-btn:active {
  transform: scale(0.95);
}

.sign-btn.signed {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: none;
}

.sign-plus {
  font-size: 16px;
  font-weight: 700;
  margin-right: 4px;
  color: #333;
}

.sign-text {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.sign-btn.signed .sign-text {
  color: white;
}

.banner {
  width: calc(100% - 32px);
  height: 180px;
  margin: 16px; border-radius: 16px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
  height: 100%;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  padding: 40px 20px 20px;
}

.banner-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  display: block;
  margin-bottom: 6px;
}

.banner-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.section {
  background: white;
  margin: 12px 16px;
  border-radius: 22px;
  padding: 16px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
}

.section-more {
  font-size: 13px;
  color: #999;
}

.quick-actions-section {
  padding: 12px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 6px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.action-item:active {
  transform: scale(0.95);
}

.action-item:nth-child(1) {
  background: linear-gradient(135deg, #ffe5e5, #ffc9c9);
}
.action-item:nth-child(2) {
  background: linear-gradient(135deg, #e5f0ff, #c9dcff);
}
.action-item:nth-child(3) {
  background: linear-gradient(135deg, #e5ffe9, #c9ffcf);
}
.action-item:nth-child(4) {
  background: linear-gradient(135deg, #fff5e5, #ffdec9);
}
.action-item:nth-child(5) {
  background: linear-gradient(135deg, #f0e5ff, #ddc9ff);
}
.action-item:nth-child(6) {
  background: linear-gradient(135deg, #ffe5f0, #ffc9dd);
}
.action-item:nth-child(7) {
  background: linear-gradient(135deg, #e5fafa, #c9f5f5);
}
.action-item:nth-child(8) {
  background: linear-gradient(135deg, #fff9e5, #fff2c9);
}

.action-icon {
  font-size: 26px;
  margin-bottom: 6px;
}

.action-text {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.gacha-section {
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  margin: 12px 16px;
  border-radius: 22px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: var(--shadow);
  border: 2px solid rgba(255, 255, 255, 0.45);
}

.gacha-content {
  display: flex;
  align-items: center;
}

.gacha-icon {
  font-size: 36px;
  margin-right: 14px;
}

.gacha-text {
  display: flex;
  flex-direction: column;
}

.gacha-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.gacha-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.gacha-arrow {
  font-size: 28px;
  color: white;
  font-weight: 300;
}

.pets-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pets-scroll::-webkit-scrollbar {
  display: none;
}

.pet-mini-card {
  min-width: 150px;
  border-radius: 18px;
  padding: 14px;
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.08), 0 18px 30px rgba(0, 0, 0, 0.12);
}

.pet-mini-avatar {
  font-size: 40px;
  text-align: center;
  margin-bottom: 10px;
}

.pet-mini-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pet-mini-name {
  font-size: 15px;
  font-weight: 700;
}

.pet-mini-level {
  font-size: 12px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 8px;
  border-radius: 10px;
}

.pet-status {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-label {
  font-size: 10px;
  width: 16px;
  opacity: 0.9;
}

.status-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  border-radius: 3px;
}

.status-fill.hunger {
  background: #4ecdc4;
}

.status-fill.happiness {
  background: #ff69b4;
}

.pet-add-card {
  min-width: 100px;
  border-radius: 18px;
  padding: 14px;
  background: #f5f7fa;
  border: 3px dashed rgba(58, 43, 63, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-icon {
  font-size: 32px;
  color: #999;
  margin-bottom: 6px;
}

.add-text {
  font-size: 12px;
  color: #999;
}

.tasks-progress-card {
  background: linear-gradient(135deg, #f8f9ff, #f0f2f5);
  border-radius: 16px;
  padding: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.progress-count {
  font-size: 14px;
  color: var(--accent-mint);
  font-weight: 700;
}

.progress-bar-large {
  height: 10px;
  background: #e8e8e8;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar-large .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-mint), #3aafa9);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.tasks-preview {
  display: flex;
  gap: 8px;
}

.task-mini-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 6px;
  background: white;
  border-radius: 12px;
}

.task-mini-item.completed {
  background: linear-gradient(135deg, #e5ffe9, #c9ffcf);
}

.task-emoji {
  font-size: 20px;
  margin-bottom: 6px;
}

.task-name {
  font-size: 11px;
  color: #333;
  margin-bottom: 2px;
  font-weight: 500;
}

.task-status {
  font-size: 10px;
  color: #666;
}

.bottom-space {
  height: 24px;
}
</style>



