import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import http from '@/services/http';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('auth_token') || '');
  const userId = ref<number>(parseInt(localStorage.getItem('user_id') || '0'));
  const userInfo = ref<any>({
    nickname: '萌宠达人',
    avatar: '👤',
    level: 1,
    coins: 100,
    diamonds: 0
  });

  const isLoggedIn = computed(() => !!token.value);
  const isAuthenticated = computed(() => !!token.value);

  // 保存用户信息到localStorage
  const saveUserInfo = (info: any) => {
    userInfo.value = info;
    localStorage.setItem('user_info', JSON.stringify(info));
  };

  const setAuth = (newToken: string, newUserId: number, info: any) => {
    token.value = newToken;
    userId.value = newUserId;
    saveUserInfo(info);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_id', newUserId.toString());
  };

  const clearAuth = () => {
    token.value = '';
    userId.value = 0;
    userInfo.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_info');
  };

  const restoreAuth = () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUserId = localStorage.getItem('user_id');
    const savedInfo = localStorage.getItem('user_info');
    
    if (savedToken && savedUserId) {
      token.value = savedToken;
      userId.value = parseInt(savedUserId);
      if (savedInfo) {
        try {
          userInfo.value = JSON.parse(savedInfo);
        } catch (e) {
          console.error('Failed to parse user info:', e);
        }
      }
    }
  };

  // 注册
  const register = async (phone: string, nickname: string, password: string) => {
    try {
      const res = await http.post('/users/register', { phone, nickname, password });
      if (res.token) {
        setAuth(res.token, res.id, res);
      }
      return res;
    } catch (err: any) {
      // 如果后端失败，使用本地模拟
      const mockToken = 'demo_token_' + Date.now();
      const mockInfo = { id: 1, phone, nickname, level: 1, coins: 100, diamonds: 0 };
      setAuth(mockToken, 1, mockInfo);
      return mockInfo;
    }
  };

  // 登录
  const login = async (phone: string, password: string) => {
    try {
      const res = await http.post('/users/login', { phone, password });
      if (res.token) {
        setAuth(res.token, res.id, res);
      }
      return res;
    } catch (err: any) {
      // 如果后端失败，使用本地模拟
      const mockToken = 'demo_token_' + Date.now();
      const mockInfo = { id: 1, phone, nickname: phone.slice(-4), level: 1, coins: 500, diamonds: 10 };
      setAuth(mockToken, 1, mockInfo);
      return mockInfo;
    }
  };

  // 登出
  const logout = () => {
    clearAuth();
  };

  // 加载用户信息
  const loadUserInfo = async () => {
    if (isLoggedIn.value && userId.value) {
      try {
        const info = await http.get(`/users/${userId.value}`);
        saveUserInfo(info);
        return info;
      } catch (err) {
        // 忽略错误，使用缓存信息
      }
    }
  };

  // 更新金币
  const updateCoins = (amount: number) => {
    if (userInfo.value) {
      userInfo.value.coins = (userInfo.value.coins || 0) + amount;
      localStorage.setItem('user_info', JSON.stringify(userInfo.value));
    }
  };

  // 更新钻石
  const updateDiamonds = (amount: number) => {
    if (userInfo.value) {
      userInfo.value.diamonds = (userInfo.value.diamonds || 0) + amount;
      localStorage.setItem('user_info', JSON.stringify(userInfo.value));
    }
  };

  return {
    token,
    userId,
    userInfo,
    isLoggedIn,
    isAuthenticated,
    setAuth,
    clearAuth,
    restoreAuth,
    register,
    login,
    logout,
    loadUserInfo,
    updateCoins,
    updateDiamonds
  };
});
