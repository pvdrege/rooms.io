export interface User {
  id: string;
  email: string;
  name: string;
  pictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  pictureUrl?: string;
  hashtags: Hashtag[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Hashtag {
  id: string;
  name: string;
  category: string;
  description?: string;
  usageCount: number;
}

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  updatedAt: string;
  requester: User;
  addressee: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface DiscoveryFilters {
  hashtags?: string[];
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
} 