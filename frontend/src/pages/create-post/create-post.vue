<template>
  <div class="page-create-post">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn" @click="$router.back()">
        <span class="material-icons">close</span>
      </button>
      <h1 class="title">发布动态</h1>
      <button class="icon-btn">
        <span class="material-icons">more_horiz</span>
      </button>
    </header>

    <!-- Content -->
    <main class="content">
      <!-- Image Upload -->
      <div class="image-grid">
        <div class="upload-box">
          <span class="material-icons">add_a_photo</span>
          <span>添加图片</span>
        </div>
        <div
          v-for="i in 2"
          :key="i"
          class="uploaded-img"
          :style="{ backgroundImage: `url(https://picsum.photos/300/300?random=${i+10})` }"
        >
          <button class="remove-btn">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>

      <!-- Text Input -->
      <div class="text-input">
        <textarea placeholder="分享宠物的趣事..."></textarea>
      </div>

      <!-- Location -->
      <div class="location-box">
        <div class="location-left">
          <span class="material-icons">location_on</span>
          <span>添加地点</span>
        </div>
        <span class="material-icons">chevron_right</span>
      </div>

      <!-- Tags -->
      <div class="tags-section">
        <div class="tags-header">
          <span class="material-icons">sell</span>
          <h4>选择标签</h4>
        </div>
        <div class="tags-list">
          <span
            v-for="tag in tags"
            :key="tag"
            class="tag-item"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </main>

    <!-- Bottom Buttons -->
    <div class="bottom-buttons">
      <button class="btn-draft">存草稿</button>
      <button class="btn-publish">立即发布</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tags = ['汪星人', '喵星人', '宠物日常', '新手铲屎官', '好物推荐'];
const selectedTags = ref<string[]>([]);

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};
</script>

<style scoped>
.page-create-post {
  min-height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid rgba(238, 140, 43, 0.1);
}

.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

/* Content */
.content {
  flex: 1;
  padding: 16px;
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.upload-box {
  aspect-ratio: 1;
  border: 2px dashed var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  background: var(--bg-gray);
}

.upload-box .material-icons {
  font-size: 32px;
  color: var(--text-muted);
}

.upload-box span:last-child {
  font-size: 12px;
  color: var(--text-muted);
}

.uploaded-img {
  aspect-ratio: 1;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove-btn .material-icons {
  font-size: 16px;
  color: white;
}

/* Text Input */
.text-input {
  margin-bottom: 16px;
}

.text-input textarea {
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 15px;
  resize: none;
  outline: none;
  font-family: inherit;
}

.text-input textarea:focus {
  border-color: var(--primary);
}

/* Location */
.location-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 20px;
  cursor: pointer;
}

.location-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-left .material-icons {
  color: var(--primary);
}

.location-left span:last-child {
  font-size: 14px;
  color: var(--text-secondary);
}

.location-box > .material-icons {
  color: var(--text-muted);
}

/* Tags */
.tags-section {
  margin-bottom: 20px;
}

.tags-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tags-header .material-icons {
  color: var(--primary);
  font-size: 20px;
}

.tags-header h4 {
  font-size: 14px;
  font-weight: 600;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--bg-gray);
  color: var(--text-secondary);
  cursor: pointer;
}

.tag-item.active {
  background: var(--primary-10);
  color: var(--primary);
  border: 1px solid var(--primary-20);
}

/* Bottom Buttons */
.bottom-buttons {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-top: 1px solid var(--border);
}

.btn-draft,
.btn-publish {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-draft {
  background: var(--bg-gray);
  color: var(--text-secondary);
}

.btn-publish {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(238, 140, 43, 0.3);
}
</style>
