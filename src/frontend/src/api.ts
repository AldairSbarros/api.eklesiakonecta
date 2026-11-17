import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// Interceptor: injeta token + schema em todas as requisições
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  const schema = localStorage.getItem('schema') || 'public';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['x-schema'] = schema;
  return config;
});

// Interceptor: redireciona ao erro 401
api.interceptors.response.use(
  (res: any) => res,
  (err: any) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('schema');
      localStorage.removeItem('igrejaId');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
