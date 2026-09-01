import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types/auth";

export function useProtectedRoute(requiredRole?: UserRole) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      navigate({ to: "/" });
      return;
    }
  }, [user, isLoading, requiredRole, navigate]);

  return { user, isLoading };
}
