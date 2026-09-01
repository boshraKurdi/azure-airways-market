import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputClass } from "@/components/ui-kit";
import { login, setAuthToken } from "@/lib/api/auth";
import { validateLoginForm } from "@/lib/validation";
import { useAuth } from "@/lib/auth-context";
import type { ValidationErrors } from "@/lib/validation";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to your Skyla account" },
      {
        name: "description",
        content: "Sign in to Skyla to manage bookings, track fare drops and access your e-tickets.",
      },
      { property: "og:title", content: "Log in to your Skyla account" },
      { property: "og:description", content: "Manage bookings and fare alerts on Skyla." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateLoginForm(formData.email, formData.password);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // Store the JWT token
      setAuthToken(response.token);

      // Set user in auth context
      setUser(response.user);

      toast.success("Login successful");

      // Redirect based on role
      if (response.user.role === "ADMIN") {
        navigate({ to: "/" }); // TODO: Replace with admin dashboard when created
      } else {
        navigate({ to: "/bookings" });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error("Invalid email or password");
          setErrors({ email: "Invalid credentials", password: "Invalid credentials" });
        } else if (error.status === 400) {
          toast.error("Validation failed. Please check your input.");
        } else if (error.status === 500) {
          toast.error("Something went wrong. Please try again.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your bookings and fare alerts."
      footer={
        <>
          New to Skyla?{" "}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Field label="Email" className={errors.email ? "has-error" : ""}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="you@email.com"
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
          </Field>
        </div>

        <div>
          <Field label="Password" className={errors.password ? "has-error" : ""}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>}
          </Field>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-accent"
              disabled={isLoading}
            />
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-xs font-semibold text-accent hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
