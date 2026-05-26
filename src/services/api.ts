import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const sendEmailOtp = (email: string) =>
  api.post('/students/send-email-otp', { email });

export const verifyEmailOtp = (email: string, otp: string) =>
  api.post('/students/verify-email-otp', { email, otp });

export const submitRegistration = (formData: FormData) =>
  api.post('/students/register', formData);

export const adminLogin = (email: string, password: string) =>
  api.post('/admin/login', { email, password });

export const getDashboardStats = () =>
  api.get('/admin/dashboard');

export const getStudents = (params?: Record<string, string>) =>
  api.get('/admin/students', { params });

export const deleteStudent = (id: string) =>
  api.delete(`/admin/students/${id}`);

export const exportStudents = () =>
  api.get('/admin/students/export', { responseType: 'blob' });

export const generateReferral = (mobileNumber: string) =>
  api.post('/students/generate-referral', { mobileNumber });

export const checkReferral = (code: string) =>
  api.get(`/students/check-referral?code=${code}`);

export const saveProgress = (email: string, data: Record<string, unknown>) =>
  api.post('/students/save-progress', { email, data });

export const loadProgress = (email: string) =>
  api.get(`/students/load-progress?email=${encodeURIComponent(email)}`);

export default api;
