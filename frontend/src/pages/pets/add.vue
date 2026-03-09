<template>
  <view class="add-pet-container">
    <view class="form-section">
      <view class="form-group">
        <text class="label">宠物名称</text>
        <input 
          v-model="petName"
          type="text"
          placeholder="给你的宠物起个名字"
          class="input"
        />
      </view>

      <view class="form-group">
        <text class="label">宠物类型</text>
        <view class="type-selector">
          <view 
            v-for="type in petTypes"
            :key="type.id"
            class="type-option"
            :class="{ active: petType === type.id }"
            @click="petType = type.id"
          >
            {{ type.emoji }} {{ type.name }}
          </view>
        </view>
      </view>

      <button 
        @click="onSubmit"
        :disabled="loading"
        class="btn-submit"
      >
        {{ loading ? '创建中...' : '创建宠物' }}
      </button>
    </view>

    <view v-if="error" class="error-message">
      {{ error }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { usePetsStore } from '@/stores/pets';
import { useAuthStore } from '@/stores/auth';
import { petAPI } from '@/services/api';

const petsStore = usePetsStore();
const authStore = useAuthStore();

const petName = ref('');
const petType = ref('');
const loading = ref(false);
const error = ref('');

const petTypes = ref<any[]>([]);

onMounted(async () => {
  try {
    const types = await petAPI.getTypes();
    petTypes.value = types || [];
    petType.value = petTypes.value[0]?.id || '';
  } catch (err) {
    petTypes.value = [];
  }
});

const onSubmit = async () => {
  error.value = '';

  if (!petName.value.trim()) {
    error.value = '请输入宠物名称';
    return;
  }

  loading.value = true;
  try {
    const userId = authStore.userId || 1;
    await petsStore.createPet(userId, petName.value, petType.value);
    uni.showToast({ title: '创建成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (err: any) {
    error.value = err.error || '创建失败，请重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-pet-container {
  background: #f8fafc;
  min-height: 100vh;
  padding: 20px;
}

.form-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #22c55e;
}

.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-option {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 14px;
}

.type-option.active {
  background: #22c55e;
  color: #fff;
  border-color: #22c55e;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 12px;
}

.btn-submit:disabled {
  opacity: 0.6;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 16px;
  text-align: center;
  background: #fef2f2;
  padding: 12px;
  border-radius: 8px;
}
</style>
