import Link from "next/link";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-2">
            {it.href && !last ? (
              <Link href={it.href} className="text-xs font-medium text-foreground-faint hover:text-foreground-muted transition-colors">
                {it.label}
              </Link>
            ) : (
              <span className={`text-xs font-medium ${last ? "text-foreground-muted" : "text-foreground-faint"}`}>{it.label}</span>
            )}
            {!last && <ChevronRight size={13} className="text-foreground-faint" />}
          </span>
        );
      })}
    </nav>
  );
}
