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
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('cravingToken') || localStorage.getItem('cravingToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isNetworkError = !error.response;
    const isGatewayError = status === 502 || status === 504;
    const isTransientError =
      isNetworkError ||
      isGatewayError ||
      (status === 503 && config?.method?.toLowerCase() === 'get');

    if (config && isTransientError && (!config.__retryCount || config.__retryCount < 2)) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      const delay = Math.pow(2, config.__retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    if (error.response?.data) {
      if (!error.response.data.message && error.response.data.error?.message) {
        error.response.data.message = error.response.data.error.message;
      }
    }
    if (error.response && error.response.status === 401) {
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
