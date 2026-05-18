/**
 * frontend/src/types/api.ts
 * 
 * API response and request type definitions.
 */

export interface HealthResponse {
  status: 'ok' | 'degraded';
  database: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  request_id?: string;
  details?: Record<string, unknown>;
}

export interface User {
  id: number;
  username: string;
  email: string;
  display_name?: string;
  institution?: string;
  role: 'annotator' | 'reviewer' | 'admin' | 'superuser';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name?: string;
}

export interface UpdateUserRequest {
  display_name?: string;
  institution?: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  skip: number;
  limit: number;
  items: T[];
}
