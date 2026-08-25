import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputClass } from "@/components/ui-kit";

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
      <Field label="Email">
        <input type="email" className={inputClass} placeholder="you@email.com" />
      </Field>
      <Field label="Password">
        <input type="password" className={inputClass} placeholder="••••••••" />
      </Field>
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
          <input type="checkbox" className="h-4 w-4 rounded border-input accent-accent" />
          Keep me signed in
        </label>
        <Link to="/forgot-password" className="text-xs font-semibold text-accent hover:underline">
          Forgot password?
        </Link>
      </div>
      <Link
        to="/bookings"
        className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
      >
        Sign in
      </Link>
    </AuthLayout>
  );
}
