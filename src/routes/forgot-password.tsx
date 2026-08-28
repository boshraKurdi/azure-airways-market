import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputClass } from "@/components/ui-kit";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your Skyla password" },
      {
        name: "description",
        content:
          "Enter your email and we will send a secure link to reset your Skyla account password.",
      },
      { property: "og:title", content: "Reset your Skyla password" },
      { property: "og:description", content: "Get a secure password reset link by email." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure link valid for 30 minutes."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <Field label="Email">
        <input type="email" className={inputClass} placeholder="you@email.com" />
      </Field>
      <button className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
        Send reset link
      </button>
    </AuthLayout>
  );
}
