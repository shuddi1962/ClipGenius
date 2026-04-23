import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
                refreshToken,
              });

              const newAccessToken = refreshResponse.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);

              // Retry the original request
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(error.config);
            } catch (refreshError) {
              // Refresh failed, logout
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Admin API methods
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
    const response = await this.client.get('/admin/users', { params });
    return response.data;
  }

  async updateUser(id: string, updates: any) {
    const response = await this.client.patch(`/admin/users/${id}`, updates);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.client.delete(`/admin/users/${id}`);
    return response.data;
  }

  async impersonateUser(id: string) {
    const response = await this.client.post(`/admin/users/${id}/impersonate`);
    return response.data;
  }

  async getPlatformSettings() {
    const response = await this.client.get('/admin/settings');
    return response.data;
  }

  async updatePlatformSetting(key: string, value: any) {
    const response = await this.client.patch(`/admin/settings/${key}`, { value });
    return response.data;
  }

  async getWhiteLabelSettings() {
    const response = await this.client.get('/admin/white-label');
    return response.data;
  }

  async updateWhiteLabelSettings(updates: any) {
    const response = await this.client.patch('/admin/white-label', updates);
    return response.data;
  }

  async getModules() {
    const response = await this.client.get('/admin/modules');
    return response.data;
  }

  async updateModule(planId: string, moduleName: string, enabled: boolean) {
    const response = await this.client.patch(`/admin/modules/${planId}/${moduleName}`, { enabled });
    return response.data;
  }

  async getApiKeys() {
    const response = await this.client.get('/admin/api-keys');
    return response.data;
  }

  async createApiKey(data: { provider: string; key: string; label: string; category: string }) {
    const response = await this.client.post('/admin/api-keys', data);
    return response.data;
  }

  async testApiKey(id: string) {
    const response = await this.client.post(`/admin/api-keys/${id}/test`);
    return response.data;
  }

  // Model API
  async getModels(type: 'llm' | 'image' | 'video' | 'music') {
    const response = await this.client.get(`/api/models/${type}`);
    return response.data;
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
);