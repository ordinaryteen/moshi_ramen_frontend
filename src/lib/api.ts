import axios from 'axios';

const BASE_URL = import.meta.env.PROD 
  ? 'https://moshi-ramen-backend-a4w6.onrender.com' 
  : 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

// 2. Interceptor (Middleware Frontend)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;