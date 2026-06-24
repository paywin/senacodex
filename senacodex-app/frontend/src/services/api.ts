import axios, { AxiosInstance } from 'axios';
import type { AuthToken } from '@/shared/types';

const API_URL = (import.meta as any).env.VITE_API_URL || '/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  login(email: string, password: string) {
    return this.client.post<AuthToken>('/auth/login', { email, password });
  }

  register(name: string, email: string, password: string, role = 'student') {
    return this.client.post<AuthToken>('/auth/register', { name, email, password, role });
  }

  getProjects() {
    return this.client.get('/projects');
  }

  createProject(payload: Record<string, unknown>) {
    return this.client.post('/projects', payload);
  }

  getStats() {
    return this.client.get('/dashboard/stats');
  }

  getActivities() {
    return this.client.get('/dashboard/activities');
  }

  getRiskProjects() {
    return this.client.get('/dashboard/risk-projects');
  }

  getEvaluations() {
    return this.client.get('/dashboard/evaluations');
  }

  getRoleDashboardStats() {
    return this.client.get('/role-dashboard/stats');
  }

  uploadProjectVersion(projectId: string, formData: FormData) {
    return this.client.post(`/uploads/${projectId}/versions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  getProjectVersions(projectId: string) {
    return this.client.get(`/uploads/${projectId}/versions`);
  }

  getProject(projectId: string) {
    return this.client.get(`/projects/${projectId}`);
  }

  evaluateProject(projectId: string, payload: any) {
    return this.client.post(`/projects/${projectId}/evaluations`, payload);
  }

  async downloadFile(projectId: string, fileId: string, filename: string) {
    const response = await this.client.get(`/uploads/${projectId}/files/${fileId}/download`, {
      responseType: 'blob',
    });
    
    // Trigger download using Blob URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export default new ApiService();
