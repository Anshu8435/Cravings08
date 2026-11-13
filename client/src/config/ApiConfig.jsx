import axios from 'axios';
import toast from 'react-hot-toast';

const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://cravings08.onrender.com' : 'http://localhost:4500');

const baseURL = (rawBaseURL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: baseURL || 'http://localhost:4500',
  withCredentials: true,
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('cravingToken') || localStorage.getItem('cravingToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    toast.dismiss('server-wakeup');
    return response;
  },
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED';
    const isNetworkError = !error.response;
    const isGatewayError = status === 502 || status === 503 || status === 504;
    const isTransientError = isTimeout || isNetworkError || isGatewayError;

    if (config && isTransientError && (!config.__retryCount || config.__retryCount < 3)) {
      config.__retryCount = (config.__retryCount || 0) + 1;

      toast.loading('Waking up server, please wait a moment...', { id: 'server-wakeup' });

      const delay = Math.pow(2, config.__retryCount - 1) * 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      try {
        const retryResponse = await api(config);
        toast.dismiss('server-wakeup');
        return retryResponse;
      } catch (retryError) {
        if (!config.__retryCount || config.__retryCount >= 3) {
          toast.dismiss('server-wakeup');
        }
        return Promise.reject(retryError);
      }
    }

    toast.dismiss('server-wakeup');

    if (error.response?.data) {
      if (!error.response.data.message && error.response.data.error?.message) {
        error.response.data.message = error.response.data.error.message;
      }
    }
    const isAuthRoute =
      config?.url?.includes('/auth/login') ||
      config?.url?.includes('/auth/verify-otp') ||
      config?.url?.includes('/auth/register');

    if (error.response && error.response.status === 401 && !isAuthRoute) {
      sessionStorage.removeItem('cravingUser');
      sessionStorage.removeItem('cravingToken');
      localStorage.removeItem('cravingToken');
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        toast.error('Session expired or unauthorized. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
