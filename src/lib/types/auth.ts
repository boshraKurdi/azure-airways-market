// Authentication types
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthError {
  status: number;
  message: string;
  errors?: ValidationError[];
}
