export function SectionHeader({
  label,
  title,
  description,
  action,
  accent = "#5e6ad2",
}: {
  label: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <p
          className="mb-2.5 flex items-center gap-2 font-mono text-[11.5px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: accent }}
        >
          <span
            className="h-[3px] w-5 rounded-full"
            style={{ background: accent }}
          />
          {label}
        </p>
        <h2 className="text-[28px] font-bold tracking-[-0.01em] text-primary">{title}</h2>
        {description && <p className="mt-1.5 text-[14.5px] text-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}