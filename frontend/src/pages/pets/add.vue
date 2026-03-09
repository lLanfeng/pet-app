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
  background-color: var(--bg-base);
  min-height: 100vh;
  padding: 20px;
  padding-top: 30px;
}

.form-section {
  background: white;
  border-radius: 22px;
  padding: 20px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.form-group {
  margin-bottom: 25px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--stroke);
  border-radius: 16px;
  font-size: 14px;
  background-color: #fff;
}

.input:focus {
  border-color: rgba(75, 209, 200, 0.6);
  background-color: white;
}

.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.type-option {
  padding: 10px 15px;
  border: 2px solid var(--stroke);
  border-radius: 16px;
  background: #fff;
  color: #333;
  font-size: 14px;
}

.type-option.active {
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: white;
  border-color: transparent;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-coral) 100%);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  box-shadow: var(--shadow);
}

.btn-submit:disabled {
  opacity: 0.6;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
  background: white;
  padding: 15px;
  border-radius: 18px;
  border: 2px solid var(--stroke);
}
</style>
