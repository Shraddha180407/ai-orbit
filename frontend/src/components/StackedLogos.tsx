import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const ROTATIONS = ["-rotate-6", "-rotate-2", "rotate-2", "rotate-6"];

export function StackedLogos({
  tools,
  size = 44,
}: {
  tools: { logoUrl: string | null; name: string }[];
  size?: number;
}) {
  const visible = tools.slice(0, 4);

  return (
    <div className="group/stack flex items-center" style={{ height: size + 8 }} aria-hidden="true">
      {visible.map((tool, index) => (
        <div
          key={tool.name + index}
          className={cn(
            "relative overflow-hidden rounded-xl border-2 border-surface bg-surface-raised shadow-sm transition-transform duration-300 ease-out",
            "group-hover/stack:translate-x-0 group-hover/stack:rotate-0",
            ROTATIONS[index]
          )}
          style={{
            width: size,
            height: size,
            marginLeft: index === 0 ? 0 : -size * 0.4,
            zIndex: visible.length - index,
          }}
        >
          <Logo src={tool.logoUrl} name={tool.name} size={size} className="rounded-[10px] p-1.5" />
        </div>
      ))}
    </div>
  );
}
