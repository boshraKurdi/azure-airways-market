import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PageShell({
  children,
  transparentHeader = false,
  padTop = true,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
  padTop?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader transparent={transparentHeader} />
      <main className={padTop ? "flex-1 pt-16" : "flex-1"}>{children}</main>
      <SiteFooter />
    </div>
  );
}
