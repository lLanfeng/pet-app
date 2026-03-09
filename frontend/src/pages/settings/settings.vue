<template>
  <view class="settings-container">
    <!-- 设置头部 -->
    <view class="settings-header">
      <text class="settings-title">设置</text>
    </view>

    <!-- 设置选项列表 -->
    <scroll-view class="settings-list" scroll-y="true">
      <!-- 通知设置 -->
      <view class="settings-section">
        <text class="section-title">通知设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">推送通知</text>
          </view>
          <switch :checked="settings.notifications" @change="updateSetting('notifications', ($event as any).detail.value)" />
        </view>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">喂食提醒</text>
          </view>
          <switch :checked="settings.feedingReminders" @change="updateSetting('feedingReminders', ($event as any).detail.value)" />
        </view>
      </view>

      <!-- 声音设置 -->
      <view class="settings-section">
        <text class="section-title">声音设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">背景音乐</text>
          </view>
          <switch :checked="settings.backgroundMusic" @change="updateSetting('backgroundMusic', ($event as any).detail.value)" />
        </view>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">音效</text>
          </view>
          <switch :checked="settings.soundEffects" @change="updateSetting('soundEffects', ($event as any).detail.value)" />
        </view>
      </view>

      <!-- 显示设置 -->
      <view class="settings-section">
        <text class="section-title">显示设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">深色模式</text>
          </view>
          <switch :checked="settings.darkMode" @change="updateSetting('darkMode', ($event as any).detail.value)" />
        </view>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">动画效果</text>
          </view>
          <switch :checked="settings.animations" @change="updateSetting('animations', ($event as any).detail.value)" />
        </view>
      </view>

      <!-- 关于 -->
      <view class="settings-section">
        <text class="section-title">关于</text>
        <view class="setting-item" @click="showAbout">
          <view class="setting-info">
            <text class="setting-name">版本信息</text>
            <text class="setting-desc">v1.0.0</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
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
  background: #f8fafc;
}

.settings-header {
  background: #fff;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.settings-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.settings-list {
  height: calc(100vh - 60px);
  padding: 12px 16px;
}

.settings-section {
  background: #fff;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  display: block;
  margin-bottom: 12px;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-size: 15px;
  color: #1e293b;
  display: block;
}

.setting-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.arrow {
  font-size: 18px;
  color: #cbd5e1;
}
</style>
