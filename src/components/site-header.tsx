import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, Menu, Plane, UserRound, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const links = [
  { to: "/search", label: "Flights" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/help", label: "Help" },
] as const;

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-hairline bg-surface/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:px-8 lg:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors",
              solid
                ? "bg-primary text-primary-foreground"
                : "bg-primary-foreground/12 text-primary-foreground",
            )}
          >
            <Plane className="h-4.5 w-4.5 -rotate-45" strokeWidth={2.2} />
          </span>
          <span
            className={cn(
              "text-display truncate text-lg font-semibold",
              solid ? "text-ink" : "text-primary-foreground",
            )}
          >
            Skyla
          </span>
        </Link>

        <nav className="hidden justify-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                solid
                  ? "text-ink-soft hover:bg-surface-muted hover:text-ink"
                  : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
              activeProps={{
                className: solid ? "text-ink bg-surface-muted" : "text-primary-foreground",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className={cn(
              "hidden items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-semibold transition-colors sm:flex",
              solid
                ? "text-ink-soft hover:bg-surface-muted"
                : "text-primary-foreground/80 hover:bg-primary-foreground/10",
            )}
          >
            <Globe className="h-4 w-4" />
            EN
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold sm:flex",
                  solid ? "text-ink" : "text-primary-foreground",
                )}
              >
                <UserRound className="h-4 w-4" />
                <span className="truncate max-w-[120px]">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                type="button"
                className={cn(
                  "hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:inline-flex",
                  solid
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/15"
                    : "bg-destructive/20 text-destructive-foreground hover:bg-destructive/30",
                )}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={cn(
                "hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:inline-flex",
                solid
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
              )}
            >
              <UserRound className="h-4 w-4" />
              Login
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg lg:hidden",
              solid
                ? "text-ink hover:bg-surface-muted"
                : "text-primary-foreground hover:bg-primary-foreground/10",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade border-t border-hairline bg-surface px-5 py-3 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-semibold text-ink hover:bg-surface-muted"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="border-t border-hairline py-3 px-2 text-sm font-semibold text-ink">
                  {user.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-md px-2 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-semibold text-ink hover:bg-surface-muted"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
