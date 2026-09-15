import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputClass } from "@/components/ui-kit";
import { register } from "@/lib/api/auth";
import { validateRegisterForm } from "@/lib/validation";
import { useAuth } from "@/lib/auth-context";
import { setAuthToken } from "@/lib/api/auth";
import type { ValidationErrors } from "@/lib/validation";
import { ApiError } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your free Skyla account" },
      {
        name: "description",
        content:
          "Create a Skyla account to save routes, receive fare-drop alerts and book curated flight offers.",
      },
      { property: "og:title", content: "Create your free Skyla account" },
      {
        property: "og:description",
        content: "Save routes, get fare alerts and book curated offers.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    // Combine first and last name
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    // Validate form
    const newErrors = validateRegisterForm(fullName, formData.email, formData.password);
    
    if (!agreedToTerms) {
      toast.error(t("Please agree to the terms of service and privacy policy"));
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        name: fullName,
        email: formData.email,
        password: formData.password,
      });

      setUser(response.user);
      toast.success(t("Account created successfully"));
      
      // Redirect to login page
      navigate({ to: "/login" });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrors({ email: t("Email is already registered") });
          toast.error(t("Email is already registered"));
        } else if (error.status === 400) {
          // Backend validation errors
          const data = error.data as any;
          if (data?.errors && Array.isArray(data.errors)) {
            const fieldErrors: ValidationErrors = {};
            data.errors.forEach((err: any) => {
              if (err.field) {
                fieldErrors[err.field as keyof ValidationErrors] = err.message;
              }
            });
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(fieldErrors);
            }
          }
          toast.error(t("Validation failed. Please check your input."));
        } else if (error.status === 500) {
          toast.error(t("Something went wrong. Please try again."));
        } else {
          toast.error(t("An error occurred. Please try again."));
        }
      } else {
        toast.error(t("An unexpected error occurred"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("Create your account")}
      subtitle={t("Free forever. No card required to browse or track fares.")}
      footer={
        <>
          {t("Already have an account?")} {" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            {t("Sign in")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Field label={t("First name")} className={errors.name ? "has-error" : ""}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Boshra"
                disabled={isLoading}
              />
            </Field>
          </div>
          <div>
            <Field label={t("Last name")}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Kurdi"
                disabled={isLoading}
              />
            </Field>
          </div>
        </div>

        <div>
          <Field label={t("Email")} className={errors.email ? "has-error" : ""}>
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
          <Field label={t("Password")} hint={t("At least 8 characters.")} className={errors.password ? "has-error" : ""}>
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

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-input accent-accent"
            disabled={isLoading}
          />
          {t("I agree to the Skyla terms of service and privacy policy.")}
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("Creating account...") : t("Create account")}
        </button>
      </form>
    </AuthLayout>
  );
}
