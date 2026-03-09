<template>
  <view class="settings-container">
    <!-- 设置头部 -->
    <view class="settings-header">
      <text class="settings-title">⚙️ 设置</text>
      <text class="settings-subtitle">个性化你的应用体验</text>
    </view>

    <!-- 设置选项列表 -->
    <scroll-view class="settings-list" scroll-y="true">
      <!-- 通知设置 -->
      <view class="settings-section">
        <text class="section-title">🔔 通知设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">推送通知</text>
            <text class="setting-desc">接收宠物提醒和活动通知</text>
          </view>
          <switch :checked="settings.notifications" @change="updateSetting('notifications', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">喂食提醒</text>
            <text class="setting-desc">宠物饥饿时提醒喂食</text>
          </view>
          <switch :checked="settings.feedingReminders" @change="updateSetting('feedingReminders', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">每日任务提醒</text>
            <text class="setting-desc">提醒完成每日任务</text>
          </view>
          <switch :checked="settings.taskReminders" @change="updateSetting('taskReminders', ($event as any).detail.value)" />
        </view>
      </view>

      <!-- 声音设置 -->
      <view class="settings-section">
        <text class="section-title">🔊 声音设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">背景音乐</text>
            <text class="setting-desc">播放轻音乐背景</text>
          </view>
          <switch :checked="settings.backgroundMusic" @change="updateSetting('backgroundMusic', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">音效</text>
            <text class="setting-desc">按钮点击和宠物互动音效</text>
          </view>
          <switch :checked="settings.soundEffects" @change="updateSetting('soundEffects', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">音量调节</text>
            <text class="setting-desc">调整应用音量</text>
          </view>
          <view class="volume-control">
            <text class="volume-icon">🔉</text>
            <slider
              :value="settings.volume"
              :min="0"
              :max="100"
              :step="10"
              @change="updateSetting('volume', ($event as any).detail.value)"
              activeColor="#667eea"
            />
            <text class="volume-text">{{ settings.volume }}%</text>
          </view>
        </view>
      </view>

      <!-- 显示设置 -->
      <view class="settings-section">
        <text class="section-title">🎨 显示设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">深色模式</text>
            <text class="setting-desc">切换深色/浅色主题</text>
          </view>
          <switch :checked="settings.darkMode" @change="updateSetting('darkMode', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">动画效果</text>
            <text class="setting-desc">显示宠物动画和过渡效果</text>
          </view>
          <switch :checked="settings.animations" @change="updateSetting('animations', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">字体大小</text>
            <text class="setting-desc">调整应用字体大小</text>
          </view>
          <view class="font-size-control">
            <button class="size-btn" @click="decreaseFontSize">-</button>
            <text class="size-text">{{ fontSizeLabels[settings.fontSize] }}</text>
            <button class="size-btn" @click="increaseFontSize">+</button>
          </view>
        </view>
      </view>

      <!-- 游戏设置 -->
      <view class="settings-section">
        <text class="section-title">🎮 游戏设置</text>
        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">自动保存</text>
            <text class="setting-desc">自动保存游戏进度</text>
          </view>
          <switch :checked="settings.autoSave" @change="updateSetting('autoSave', ($event as any).detail.value)" />
        </view>

        <view class="setting-item">
          <view class="setting-info">
            <text class="setting-name">离线奖励</text>
            <text class="setting-desc">离线时获得金币奖励</text>
          </view>
          <switch :checked="settings.offlineRewards" @change="updateSetting('offlineRewards', ($event as any).detail.value)" />
        </view>
      </view>

      <!-- 账户设置 -->
      <view class="settings-section">
        <text class="section-title">👤 账户设置</text>
        <view class="setting-item clickable" @click="showChangePassword">
          <view class="setting-info">
            <text class="setting-name">修改密码</text>
            <text class="setting-desc">更改账户密码</text>
          </view>
          <text class="arrow">›</text>
        </view>

        <view class="setting-item clickable" @click="showPrivacySettings">
          <view class="setting-info">
            <text class="setting-name">隐私设置</text>
            <text class="setting-desc">管理数据隐私</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 关于应用 -->
      <view class="settings-section">
        <text class="section-title">ℹ️ 关于应用</text>
        <view class="setting-item clickable" @click="showAbout">
          <view class="setting-info">
            <text class="setting-name">版本信息</text>
            <text class="setting-desc">v1.0.0</text>
          </view>
          <text class="arrow">›</text>
        </view>

        <view class="setting-item clickable" @click="showHelp">
          <view class="setting-info">
            <text class="setting-name">帮助中心</text>
            <text class="setting-desc">常见问题解答</text>
          </view>
          <text class="arrow">›</text>
        </view>

        <view class="setting-item clickable" @click="showFeedback">
          <view class="setting-info">
            <text class="setting-name">意见反馈</text>
            <text class="setting-desc">告诉我们你的建议</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 重置设置 -->
      <view class="settings-section">
        <view class="setting-item clickable danger" @click="showResetConfirm">
          <view class="setting-info">
            <text class="setting-name">重置设置</text>
            <text class="setting-desc">恢复所有设置为默认值</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>
    </scroll-view>

    <!-- 确认重置弹窗 -->
    <view v-if="showResetModal" class="modal-overlay" @click="hideResetModal">
      <view class="modal-content" @click.stop>
        <text class="modal-title">⚠️ 确认重置</text>
        <text class="modal-message">这将恢复所有设置为默认值，此操作不可撤销。</text>
        <view class="modal-buttons">
          <button class="cancel-btn" @click="hideResetModal">取消</button>
          <button class="confirm-btn" @click="resetSettings">确认重置</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 设置数据
const settings = reactive({
  notifications: true,
  feedingReminders: true,
  taskReminders: true,
  backgroundMusic: false,
  soundEffects: true,
  volume: 70,
  darkMode: false,
  animations: true,
  fontSize: 1, // 0: 小, 1: 中, 2: 大
  autoSave: true,
  offlineRewards: true
})

const fontSizeLabels = ['小', '中', '大']
const showResetModal = ref(false)

// 方法
const updateSetting = (key: keyof typeof settings, value: any) => {
  ;(settings as any)[key] = value

  // 显示设置更新提示
  uni.showToast({
    title: '设置已更新',
    icon: 'success',
    duration: 1500
  })

  // 保存到本地存储
  saveSettings()
}

const decreaseFontSize = () => {
  if (settings.fontSize > 0) {
    settings.fontSize--
    saveSettings()
  }
}

const increaseFontSize = () => {
  if (settings.fontSize < 2) {
    settings.fontSize++
    saveSettings()
  }
}

const showChangePassword = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
    duration: 2000
  })
}

const showPrivacySettings = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
    duration: 2000
  })
}

const showAbout = () => {
  uni.showModal({
    title: '关于萌宠应用',
    content: '萌宠应用 v1.0.0\n\n一个可爱的宠物养成游戏，让你体验养宠的乐趣！\n\n© 2026 萌宠团队',
    showCancel: false
  })
}

const showHelp = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
    duration: 2000
  })
}

const showFeedback = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
    duration: 2000
  })
}

const showResetConfirm = () => {
  showResetModal.value = true
}

const hideResetModal = () => {
  showResetModal.value = false
}

const resetSettings = () => {
  // 重置为默认设置
  Object.assign(settings, {
    notifications: true,
    feedingReminders: true,
    taskReminders: true,
    backgroundMusic: false,
    soundEffects: true,
    volume: 70,
    darkMode: false,
    animations: true,
    fontSize: 1,
    autoSave: true,
    offlineRewards: true
  })

  saveSettings()
  hideResetModal()

  uni.showToast({
    title: '设置已重置',
    icon: 'success',
    duration: 2000
  })
}

const saveSettings = () => {
  // 保存设置到本地存储
  uni.setStorageSync('app_settings', JSON.stringify(settings))
}

const loadSettings = () => {
  // 从本地存储加载设置
  const saved = uni.getStorageSync('app_settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(settings, parsed)
    } catch (e) {
      console.error('Failed to parse settings:', e)
    }
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: var(--bg-base);
  padding-bottom: 20px;
}

.settings-header {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  padding: 30px 20px 20px;
  text-align: center;
  border-radius: 0 0 25px 25px;
  box-shadow: var(--shadow);
}

.settings-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 5px;
}

.settings-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
}

.settings-list {
  height: calc(100vh - 120px);
  padding: 0 15px;
}

.settings-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15px;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.clickable {
  cursor: pointer;
}

.setting-item.clickable:active {
  background: rgba(0, 0, 0, 0.05);
}

.setting-item.danger {
  color: #ff6b6b;
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 2px;
}

.setting-desc {
  font-size: 12px;
  color: #666;
}

.arrow {
  font-size: 20px;
  color: #ccc;
  margin-left: 10px;
}

.volume-control, .font-size-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-icon {
  font-size: 16px;
}

.volume-text {
  font-size: 12px;
  color: #666;
  min-width: 35px;
  text-align: right;
}

.size-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-text {
  font-size: 14px;
  color: #333;
  min-width: 30px;
  text-align: center;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 2px solid var(--stroke);
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15px;
}

.modal-message {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
  display: block;
}

.modal-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
}

.confirm-btn {
  background: linear-gradient(45deg, var(--accent-mint), var(--accent-coral));
  color: white;
}
</style>
