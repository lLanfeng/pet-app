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
  background: var(--bg-base);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 80px 32px 40px;
  box-sizing: border-box;
}

.login-main {
  flex: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.logo-box {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--accent-lav), var(--accent-coral));
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: var(--shadow);
  border: 2px solid rgba(255,255,255,0.5);
}

.logo {
  font-size: 36px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.subtitle {
  font-size: 15px;
  color: var(--text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-wrap .input {
  width: 100%;
  padding: 16px;
  background: #fff;
  border: 2px solid var(--stroke);
  border-radius: 18px;
  font-size: 15px;
  box-sizing: border-box;
}

.input-wrap .input:focus {
  outline: none;
  background: #fff;
  border-color: rgba(75, 209, 200, 0.5);
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}

.remember input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-mint);
}

.forgot {
  font-size: 14px;
  color: var(--accent-coral);
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent-mint), var(--accent-coral));
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 500;
  margin-top: 8px;
  box-shadow: var(--shadow);
}

.demo-btn {
  width: 100%;
  padding: 16px;
  background: #fff;
  color: var(--text-primary);
  border: 2px solid var(--stroke);
  border-radius: 999px;
  font-size: 16px;
}

.register {
  text-align: center;
  margin-top: 32px;
  font-size: 15px;
  color: var(--text-muted);
}

.register span {
  color: var(--accent-coral);
  margin-left: 4px;
}

.agreement {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
}

.agreement span {
  color: var(--accent-coral);
  margin: 0 2px;
}
</style>
