// User types
export interface User {
  id: number;
  email: string;
  membership: 'free' | 'premium';
  profile: Profile;
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  profilePicture?: string;
  isVisible: boolean;
  hashtags: Hashtag[];
  createdAt: string;
  updatedAt?: string;
}

// Hashtag types
export interface Hashtag {
  id: number;
  name: string;
  displayName: string;
  category: string;
}

export interface HashtagCategory {
  [key: string]: Hashtag[];
}

// Connection types
export interface Connection {
  id: number;
  status: 'pending' | 'accepted' | 'blocked';
  message?: string;
  createdAt: string;
  isRequester: boolean;
  connectedUser: {
    id: number;
    firstName: string;
    lastName: string;
    displayName: string;
    profilePicture?: string;
  };
}

// Discovery types
export interface DiscoveredProfile {
  userId: number;
  firstName: string;
  lastName: string;
  displayName: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  membership: 'free' | 'premium';
  connectionCount: number;
  hashtags: Hashtag[];
  joinedAt: string;
}

export interface DiscoveryFilters {
  hashtags: string[];
  categories: string[];
  search: string;
  location: string;
  sortBy: 'latest' | 'popular' | 'alphabetical';
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  field: string;
  message: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

// Form types
export interface ProfileUpdateForm {
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isVisible: boolean;
  hashtags: number[];
}

export interface ConnectionRequestForm {
  addresseeId: number;
  message?: string;
}

// Socket events
export interface SocketEvents {
  // Connection events
  connection_request: {
    id: number;
    requesterId: number;
    requesterName: string;
    message?: string;
    createdAt: string;
  };
  connection_accepted: {
    id: number;
    addresseeName: string;
    createdAt: string;
  };
  // Message events
  new_message: {
    id: number;
    senderId: number;
    content: string;
    createdAt: string;
  };
  user_typing: {
    userId: number;
    isTyping: boolean;
  };
} 