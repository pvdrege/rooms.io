import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Redirect to login if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: error.message || 'Network error',
      };
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request({
      method: 'POST',
      url: '/api/auth/login',
      data: credentials,
    });
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.request({
      method: 'POST',
      url: '/api/auth/register',
      data,
    });
  }

  async getCurrentUser() {
    return this.request({
      method: 'GET',
      url: '/api/auth/me',
    });
  }

  async logout() {
    return this.request({
      method: 'POST',
      url: '/api/auth/logout',
    });
  }

  // Profile endpoints
  async updateProfile(data: any) {
    return this.request({
      method: 'PUT',
      url: '/api/profiles',
      data,
    });
  }

  // Hashtag endpoints
  async getHashtags() {
    return this.request({
      method: 'GET',
      url: '/api/hashtags',
    });
  }

  async getHashtagsByCategory(category: string) {
    return this.request({
      method: 'GET',
      url: `/api/hashtags/category/${category}`,
    });
  }

  async getPopularHashtags(limit?: number) {
    return this.request({
      method: 'GET',
      url: '/api/hashtags/popular',
      params: { limit },
    });
  }

  async searchHashtags(query: string) {
    return this.request({
      method: 'GET',
      url: '/api/hashtags/search',
      params: { q: query },
    });
  }

  // Discovery endpoints
  async discoverProfiles(filters: {
    hashtags?: string;
    categories?: string;
    search?: string;
    location?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    return this.request({
      method: 'GET',
      url: '/api/discovery',
      params: filters,
    });
  }

  async getProfile(userId: number) {
    return this.request({
      method: 'GET',
      url: `/api/discovery/profile/${userId}`,
    });
  }

  // Connection endpoints
  async sendConnectionRequest(data: { addresseeId: number; message?: string }) {
    return this.request({
      method: 'POST',
      url: '/api/connections',
      data,
    });
  }

  async updateConnectionRequest(connectionId: number, action: 'accept' | 'decline') {
    return this.request({
      method: 'PUT',
      url: `/api/connections/${connectionId}`,
      data: { action },
    });
  }

  async getConnections(status: 'accepted' | 'pending' | 'blocked' = 'accepted') {
    return this.request({
      method: 'GET',
      url: '/api/connections',
      params: { status },
    });
  }

  // User endpoints
  async getUserStats() {
    return this.request({
      method: 'GET',
      url: '/api/users/stats',
    });
  }

  async updateUserSettings(data: { emailNotifications?: boolean; smsNotifications?: boolean }) {
    return this.request({
      method: 'PUT',
      url: '/api/users/settings',
      data,
    });
  }
}

export const api = new ApiClient();
export default api; 