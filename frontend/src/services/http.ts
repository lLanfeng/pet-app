import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const instance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  config => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

const unwrap = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const res = await promise;
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.clearAuth();
      uni.reLaunch({ url: '/pages/login/login' });
    }
    throw error?.response?.data || error;
  }
};

const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => unwrap<T>(instance.get(url, config)),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => unwrap<T>(instance.post(url, data, config)),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => unwrap<T>(instance.put(url, data, config)),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => unwrap<T>(instance.delete(url, config))
};

export default http;
