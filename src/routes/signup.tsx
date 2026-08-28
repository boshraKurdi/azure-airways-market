import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth-layout";
import { Field, inputClass } from "@/components/ui-kit";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your free Skyla account" },
      {
        name: "description",
        content: "Create a Skyla account to save routes, receive fare-drop alerts and book curated flight offers.",
      },
      { property: "og:title", content: "Create your free Skyla account" },
      { property: "og:description", content: "Save routes, get fare alerts and book curated offers." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. No card required to browse or track fares."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input className={inputClass} placeholder="Boshra" />
        </Field>
        <Field label="Last name">
          <input className={inputClass} placeholder="Kurdi" />
        </Field>
      </div>
      <Field label="Email">
        <input type="email" className={inputClass} placeholder="you@email.com" />
      </Field>
      <Field label="Password" hint="At least 8 characters with one number.">
        <input type="password" className={inputClass} placeholder="••••••••" />
      </Field>
      <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
        <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-input accent-accent" />
        I agree to the Skyla terms of service and privacy policy.
      </label>
      <Link
        to="/search"
              search={{}}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
      >
        Create account
      </Link>
    </AuthLayout>
  );
}
