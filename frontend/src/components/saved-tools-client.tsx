'use client';
import { API_URL } from '@/lib/api';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/shadcn-button';
import { EmptyState } from '@/components/ui/empty-state';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface SavedTool {
  id: string;
  toolId: string;
  name: string;
  category: string | null;
  createdAt: string;
}

export function SavedToolsClient() {
  const queryClient = useQueryClient();

  // Fetch Saved Tools
  const { data: savedTools = [], isLoading } = useQuery<SavedTool[]>({
    queryKey: ['saved-tools'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/user/saved-tools`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch saved tools');
      const data = await res.json();
      return data.savedTools || [];
    },
  });

  // Delete Saved Tool
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/user/saved-tools/${id}`, { credentials: 'include',  method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete saved tool');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-tools'] });
      toast.success('Tool removed from saved list');
    },
    onError: () => {
      toast.error('Failed to remove tool');
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Saved Tools</h2>
          <p className="text-sm text-muted-foreground">Keep your favorite tools and workflows close at hand.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col border-t border-border mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 border-b border-border py-4 px-2">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[250px]" />
              </div>
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>
      ) : savedTools.length === 0 ? (
        <EmptyState
          title="No saved tools yet"
          description="Save tools you use often from the main directory to keep your workspace focused."
          action={
            <Link href="/">
              <Button variant="secondary">Discover tools</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col border-t border-border mt-4">
          {savedTools.map((tool) => (
            <div
              key={tool.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border py-4 px-2 transition-colors hover:bg-neutral-800/20"
            >
              <div className="flex-1 overflow-hidden space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-[14px] font-medium text-white truncate">{tool.name}</h3>
                  {tool.category && (
                    <Badge variant="secondary" className="text-[10px] bg-transparent border-border text-[#8A8F98]">{tool.category}</Badge>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-end w-full sm:w-auto mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[12px] text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all"
                  onClick={() => deleteMutation.mutate(tool.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

