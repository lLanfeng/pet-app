<template>
  <div class="settings-container">
    <!-- 设置头部 -->
    <div class="settings-header">
      <span class="settings-title">设置</span>
    </div>

    <!-- 设置选项列表 -->
    <scroll-view class="settings-list" scroll-y="true">
      <!-- 通知设置 -->
      <div class="settings-section">
        <span class="section-title">通知设置</span>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">推送通知</span>
          </div>
          <switch :checked="settings.notifications" @change="updateSetting('notifications', ($event as any).detail.value)" />
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">喂食提醒</span>
          </div>
          <switch :checked="settings.feedingReminders" @change="updateSetting('feedingReminders', ($event as any).detail.value)" />
        </div>
      </div>

      <!-- 声音设置 -->
      <div class="settings-section">
        <span class="section-title">声音设置</span>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">背景音乐</span>
          </div>
          <switch :checked="settings.backgroundMusic" @change="updateSetting('backgroundMusic', ($event as any).detail.value)" />
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">音效</span>
          </div>
          <switch :checked="settings.soundEffects" @change="updateSetting('soundEffects', ($event as any).detail.value)" />
        </div>
      </div>

      <!-- 显示设置 -->
      <div class="settings-section">
        <span class="section-title">显示设置</span>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">深色模式</span>
          </div>
          <switch :checked="settings.darkMode" @change="updateSetting('darkMode', ($event as any).detail.value)" />
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">动画效果</span>
          </div>
          <switch :checked="settings.animations" @change="updateSetting('animations', ($event as any).detail.value)" />
        </div>
      </div>

      <!-- 关于 -->
      <div class="settings-section">
        <span class="section-title">关于</span>
        <div class="setting-item" @click="showAbout">
          <div class="setting-info">
            <span class="setting-name">版本信息</span>
            <span class="setting-desc">v1.0.0</span>
          </div>
          <span class="arrow">›</span>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const settings = reactive({
  notifications: true,
  feedingReminders: true,
  backgroundMusic: false,
  soundEffects: true,
  darkMode: false,
  animations: true
})

const updateSetting = (key: keyof typeof settings, value: any) => {
  (settings as any)[key] = value
  uni.showToast({ title: '设置已更新', icon: 'success' })
  uni.setStorageSync('app_settings', JSON.stringify(settings))
}

const showAbout = () => {
  uni.showModal({
    title: '关于萌宠',
    content: '萌宠应用 v1.0.0\n\n一个可爱的宠物养成游戏',
    showCancel: false
  })
}

onMounted(() => {
  const saved = uni.getStorageSync('app_settings')
  if (saved) {
    try {
      Object.assign(settings, JSON.parse(saved))
    } catch (e) {}
  }
})
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 40px;
}

/* 头部 */
.settings-header {
  background: var(--primary);
  padding: 50px 16px 20px;
  text-align: center;
}

.settings-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

/* 列表 */
.settings-list {
  padding: 12px 16px;
}

.settings-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: 10px;
  padding: 14px;
  border: 1px solid var(--border);
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  display: block;
  margin-bottom: 10px;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
}

.setting-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.arrow {
  font-size: 16px;
  color: var(--text-muted);
}
</style>
