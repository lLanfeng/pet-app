<template>
  <div class="login-page">
    <div class="login-main">
      <!-- Logo -->
      <div class="login-header">
        <div class="logo-box">
          <span class="logo">🐾</span>
        </div>
        <h1 class="title">萌宠</h1>
        <p class="subtitle">和萌宠一起生活</p>
      </div>

      <!-- 表单 -->
      <div class="login-form">
        <div class="input-wrap">
          <input 
            v-model="phone" 
            type="tel"
            placeholder="手机号"
            class="input"
            maxlength="11"
          />
        </div>
        <div class="input-wrap">
          <input 
            v-model="password" 
            :type="showPwd ? 'text' : 'password'"
            placeholder="密码"
            class="input"
          />
        </div>
        
        <div class="form-row">
          <label class="remember">
            <input type="checkbox" v-model="remember" />
            <span>记住我</span>
          </label>
          <span class="forgot">忘记密码？</span>
        </div>

        <button class="login-btn" @click="handleLogin">
          登录
        </button>

        <button class="demo-btn" @click="handleDemo">
          立即体验
        </button>
      </div>

      <!-- 注册 -->
      <p class="register">
        还没有账号？
        <span @click="goRegister">注册</span>
      </p>
    </div>

    <!-- 协议 -->
    <p class="agreement">
      登录即同意
      <span>《用户协议》</span>
      <span>《隐私政策》</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const phone = ref('');
const password = ref('');
const showPwd = ref(false);
const remember = ref(true);

const handleLogin = () => {
  if (!phone.value || !password.value) return;
  
  authStore.setAuth('token_' + Date.now(), 1, {
    id: 1,
    phone: phone.value,
    nickname: '用户',
    avatar: '👤',
    level: 1,
    coins: 100,
    diamonds: 0
  });
  
  uni.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => router.replace('/'), 500);
};

const handleDemo = () => {
  authStore.setAuth('demo', 1, {
    nickname: '萌宠达人',
    avatar: '👤',
    level: 5,
    coins: 500,
    diamonds: 10
  });
  uni.showToast({ title: '欢迎体验', icon: 'success' });
  setTimeout(() => router.replace('/'), 500);
};

const goRegister = () => router.push('/register');
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 24px 32px;
}

.login-main {
  flex: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-box {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo {
  font-size: 32px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-wrap .input {
  width: 100%;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  box-sizing: border-box;
}

.input-wrap .input:focus {
  outline: none;
  border-color: #22c55e;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.remember input {
  width: 16px;
  height: 16px;
  accent-color: #22c55e;
}

.forgot {
  font-size: 13px;
  color: #22c55e;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 8px;
}

.demo-btn {
  width: 100%;
  padding: 14px;
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

.register {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
}

.register span {
  color: #22c55e;
}

.agreement {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

.agreement span {
  color: #22c55e;
  margin: 0 4px;
}
</style>
