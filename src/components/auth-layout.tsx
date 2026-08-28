import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { SiteHeader } from "./site-header";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="grid min-h-screen pt-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex items-center justify-center px-5 py-14 sm:px-10">
          <div className="animate-rise w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
            <p className="mt-2.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8 space-y-4">{children}</div>
            <div className="mt-7 text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>

        <div className="hero-canvas relative hidden overflow-hidden lg:block">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 400 600"
            fill="none"
            aria-hidden
          >
            <path
              d="M40 520 C 140 470, 210 300, 360 90"
              stroke="white"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="5 7"
            />
            <circle cx="40" cy="520" r="4" fill="white" fillOpacity="0.8" />
            <circle cx="360" cy="90" r="4" fill="white" fillOpacity="0.8" />
          </svg>
          <div className="absolute bottom-14 left-12 right-12">
            <Plane className="h-6 w-6 -rotate-45 text-primary-foreground/80" />
            <p className="mt-5 max-w-sm text-xl font-semibold leading-snug text-primary-foreground">
              One account for every route you watch, book and fly.
            </p>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/60">
              Save searches, get fare-drop alerts, and keep every e-ticket in one place.
            </p>
            <Link
              to="/search"
              search={{}}
              className="mt-6 inline-block text-xs font-semibold text-primary-foreground/80 underline-offset-4 hover:underline"
            >
              Browse offers instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
