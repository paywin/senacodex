import axios, { AxiosInstance } from 'axios';
import { User, AuthToken } from '@types/index';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  login(email: string, password: string) {
    return this.client.post<AuthToken>('/auth/login', { email, password });
  }

  register(userData: Partial<User> & { password: string }) {
    return this.client.post<AuthToken>('/auth/register', userData);
  }

  logout() {
    return this.client.post('/auth/logout');
  }

  // Projects
  getProjects() {
    return this.client.get('/projects');
  }

  getProjectById(id: string) {
    return this.client.get(`/projects/${id}`);
  }

  createProject(data: any) {
    return this.client.post('/projects', data);
  }

  updateProject(id: string, data: any) {
    return this.client.put(`/projects/${id}`, data);
  }

  deleteProject(id: string) {
    return this.client.delete(`/projects/${id}`);
  }

  // Versions
  submitVersion(projectId: string, data: any) {
    return this.client.post(`/projects/${projectId}/versions`, data);
  }

  getVersions(projectId: string) {
    return this.client.get(`/projects/${projectId}/versions`);
  }

  // Evaluations
  getEvaluations() {
    return this.client.get('/evaluations');
  }

  submitEvaluation(projectId: string, data: any) {
    return this.client.post(`/evaluations/${projectId}`, data);
  }

  // Dashboard
  getStats() {
    return this.client.get('/dashboard/stats');
  }

  getActivities() {
    return this.client.get('/dashboard/activities');
  }

  getRiskProjects() {
    return this.client.get('/dashboard/risk-projects');
  }
}

export default new ApiService();
