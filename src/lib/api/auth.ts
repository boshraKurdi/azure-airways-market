// Authentication API functions
import { apiPost, apiGet, ApiError } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CurrentUserResponse,
} from "../types/auth";

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    return await apiPost<RegisterResponse>("/api/auth/register", data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Unknown error", error);
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    return await apiPost<LoginResponse>("/api/auth/login", data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Unknown error", error);
  }
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  try {
    return await apiGet<CurrentUserResponse>("/api/auth/me");
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Unknown error", error);
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function clearAuthToken(): void {
  localStorage.removeItem("authToken");
}
