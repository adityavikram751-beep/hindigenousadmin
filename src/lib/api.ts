import axios from 'axios';

// Default API URL: points to Production Render Server or Localhost
export const DEFAULT_API_BASE_URL = 'https://hindigenousbackend-1.onrender.com';

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('hindigenous_api_base');
    if (saved) return saved;
  }
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
};

export const setApiBaseUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hindigenous_api_base', url.replace(/\/$/, ''));
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hindigenous_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hindigenous_token', token);
  }
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hindigenous_token');
    localStorage.removeItem('hindigenous_user');
  }
};

// Create Axios Instance with dynamic config
const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

// --- API Service Endpoints ---

// 1. Auth & Admin APIs
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/api/auth/admin/login', credentials);
    return res.data;
  },
  register: async (data: { username: string; email: string; password: string }) => {
    const res = await api.post('/api/auth/admin/sign', data);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/api/auth/admin/forgot-password', { email });
    return res.data;
  },
  verifyOtp: async (verificationId: string, otp: string) => {
    const res = await api.post('/api/auth/admin/verify-otp', { verificationId, otp });
    return res.data;
  },
  changePassword: async (data: { email: string; newpassword: string }) => {
    const res = await api.put('/api/auth/admin/change-password', data);
    return res.data;
  }
};

// 2. Enquiry / Get In Touch APIs
export const enquiryApi = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    const res = await api.get(`/api/get-in-touch${query}`);
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/api/get-in-touch/${id}`);
    return res.data;
  },
  markRead: async (id: string) => {
    const res = await api.patch(`/api/get-in-touch/${id}/read`);
    return res.data;
  },
  markUnread: async (id: string) => {
    const res = await api.patch(`/api/get-in-touch/${id}/unread`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/get-in-touch/${id}`);
    return res.data;
  }
};

// 3. Home Page Video APIs
export const homeVideoApi = {
  getAll: async () => {
    const res = await api.get('/api/home-page/video');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/api/home-page/video/${id}`);
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await api.post('/api/home-page/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/api/home-page/video/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/home-page/video/${id}`);
    return res.data;
  }
};

// 4. Home Page Article APIs
export const homeArticleApi = {
  getAll: async () => {
    const res = await api.get('/api/home-page/article');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/api/home-page/article/${id}`);
    return res.data;
  },
  getByAuthor: async (authorName: string) => {
    const res = await api.get(`/api/home-page/article/author/${encodeURIComponent(authorName)}`);
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await api.post('/api/home-page/article', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id: string, formData: FormData | any) => {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.put(`/api/home-page/article/${id}`, formData, { headers });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/home-page/article/${id}`);
    return res.data;
  }
};

// 5. Category Article APIs (Literature, History, Sahitya, Art, Rajpath)
export type CategoryKey = 'literature' | 'history' | 'sahitya' | 'art' | 'rajpath';

export const categoryArticleApi = {
  getAll: async (category: CategoryKey) => {
    const res = await api.get(`/api/${category}`);
    return res.data;
  },
  getById: async (category: CategoryKey, id: string) => {
    const res = await api.get(`/api/${category}/${id}`);
    return res.data;
  },
  getByAuthor: async (category: CategoryKey, authorName: string) => {
    const res = await api.get(`/api/${category}/author/${encodeURIComponent(authorName)}`);
    return res.data;
  },
  create: async (category: CategoryKey, formData: FormData) => {
    const res = await api.post(`/api/${category}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (category: CategoryKey, id: string, formData: FormData | any) => {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.put(`/api/${category}/${id}`, formData, { headers });
    return res.data;
  },
  delete: async (category: CategoryKey, id: string) => {
    const res = await api.delete(`/api/${category}/${id}`);
    return res.data;
  }
};
