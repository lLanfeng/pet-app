<template>
  <div class="register-container">
    <div class="register-header">
      <span class="title">创建账户</span>
      <span class="subtitle">加入萌宠世界</span>
    </div>

    <div class="form-container">
      <div class="form-group">
        <input 
          v-model="phone" 
          type="text"
          placeholder="请输入手机号"
          class="input"
        />
      </div>

      <div class="form-group">
        <input 
          v-model="nickname" 
          type="text"
          placeholder="请输入昵称"
          class="input"
        />
      </div>

      <div class="form-group">
        <input 
          v-model="password" 
          type="password"
          placeholder="请输入密码（至少6位）"
          class="input"
        />
      </div>

      <div class="form-group">
        <input 
          v-model="confirmPassword" 
          type="password"
          placeholder="确认密码"
          class="input"
        />
      </div>

      <button 
        @click="onRegister"
        :disabled="loading"
        class="btn-register"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <button 
        @click="goToLogin"
        class="btn-login-link"
      >
        已有账号？登录
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const phone = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const onRegister = async () => {
  error.value = '';
  
  if (!phone.value || !nickname.value || !password.value || !confirmPassword.value) {
    error.value = '请填写所有字段';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致';
    return;
  }

  if (password.value.length < 6) {
    error.value = '密码至少需要6个字符';
    return;
  }

  loading.value = true;
  try {
    await authStore.register(phone.value, nickname.value, password.value);
    alert('注册成功！');
    router.push('/');
  } catch (err: any) {
    error.value = err.error || '注册失败，请重试';
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
  padding: 48px 20px 24px;
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.form-container {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid var(--border);
}

.form-group {
  margin-bottom: 12px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--bg-card);
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn-register {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
}

.btn-register:disabled {
  opacity: 0.6;
}

.btn-login-link {
  width: 100%;
  padding: 14px;
  background: var(--bg-gray);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
}

.error-message {
  color: var(--error);
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
  background: #FEF2F2;
  padding: 12px;
  border-radius: var(--radius-md);
}
</style>
