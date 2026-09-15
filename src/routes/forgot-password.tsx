import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputClass } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  return (
    <AuthLayout
      title={t("Reset your password")}
      subtitle={t("We'll email you a secure link valid for 30 minutes.")}
      footer={
        <>
          {t("Remembered it?")} {" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            {t("Back to sign in")}
          </Link>
        </>
      }
    >
      <Field label={t("Email")}>
        <input type="email" className={inputClass} placeholder="you@email.com" />
      </Field>
      <button className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
        {t("Send reset link")}
      </button>
    </AuthLayout>
  );
}
