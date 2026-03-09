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
  background: radial-gradient(900px 500px at 10% -10%, rgba(75, 209, 200, 0.22), transparent 60%),
              radial-gradient(700px 500px at 90% 0%, rgba(255, 212, 106, 0.28), transparent 55%),
              var(--bg-base);
  padding: 20px;
}

.register-header {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.form-container {
  background: white;
  border-radius: 22px;
  padding: 30px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
}

.form-group {
  margin-bottom: 15px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--stroke);
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  box-sizing: border-box;
}

.input:focus {
  border-color: rgba(75, 209, 200, 0.6);
  background-color: white;
  outline: none;
}

.btn-register {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-coral) 100%);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: var(--shadow);
}

.btn-register:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-login-link {
  width: 100%;
  padding: 14px;
  background: transparent;
  color: var(--accent-coral);
  border: 2px solid var(--stroke);
  border-radius: 999px;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login-link:hover {
  background-color: #fff;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
}
</style>
