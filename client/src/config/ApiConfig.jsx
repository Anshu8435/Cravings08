import axios from 'axios';
import toast from 'react-hot-toast';

const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:4500';

const baseURL = (rawBaseURL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: baseURL || 'http://localhost:4500',
  withCredentials: true,
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
  (error) => {
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
