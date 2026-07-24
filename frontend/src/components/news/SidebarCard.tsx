import type { ReactNode } from "react";

interface SidebarCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

/** Same card shell as the rest of the site's bordered surfaces: bg-surface, border-border, rounded-lg. */
export function SidebarCard({ title, action, children }: SidebarCardProps) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
