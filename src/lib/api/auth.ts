// Authentication API functions
import { apiPost, ApiError } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

const AUTH_USER_KEY = "authUser";

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

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

export function getAuthToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem("authToken");
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function setAuthUser(user: LoginResponse["user"]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function getAuthUser(): LoginResponse["user"] | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(AUTH_USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as LoginResponse["user"];
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}
