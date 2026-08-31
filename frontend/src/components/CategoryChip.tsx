import Link from "next/link";
import { cn } from "@/lib/utils";

type ChipProps = {
  label: string;
  href?: string;
  className?: string;
};

export function CategoryChip({ label, href, className }: ChipProps) {
  const classes = cn(
    "inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-foreground-muted transition-all duration-150 hover:border-accent hover:text-foreground whitespace-nowrap active:scale-95",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return <span className={classes}>{label}</span>;
}

export function TagChip({ label, href, className }: ChipProps) {
  const classes = cn(
    "inline-flex items-center rounded-md bg-surface-raised px-2 py-0.5 text-xs text-foreground-faint transition-all duration-150 whitespace-nowrap active:scale-95",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        #{label}
      </Link>
    );
  }

  return <span className={classes}>#{label}</span>;
}
