import SearchX from 'lucide-react/dist/esm/icons/search-x';
import { ToolCard } from "@/components/ToolCard";
import type { ToolCardData } from "@/lib/types";

export function ToolGrid({ tools }: { tools: ToolCardData[] }) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
        <SearchX size={32} className="text-foreground-faint" aria-hidden="true" />
        <div>
          <p className="font-medium text-foreground">No tools match your filters</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Try a different search term or clear a filter to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="list"
      className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10"
    >
      {tools.map((tool) => (
        <div key={tool.id} role="listitem">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  );
}
