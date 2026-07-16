'use client';
import { API_URL } from '@/lib/api';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/shadcn-button';
import BookmarkPlus from 'lucide-react/dist/esm/icons/bookmark-plus';
import BookmarkCheck from 'lucide-react/dist/esm/icons/bookmark-check';
import { toast } from 'sonner';

interface SavedTool {
  id: string;
  toolId: string;
}

export function SaveToolButton({ tool }: { tool: { id: string; name: string; category: string } }) {
  const queryClient = useQueryClient();

  // Fetch Saved Tools
  const { data: savedTools = [] } = useQuery<SavedTool[]>({
    queryKey: ['saved-tools'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/user/saved-tools`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data.savedTools || [];
    },
  });

  const existingTool = savedTools.find((t) => t.toolId === tool.id);
  const isSaved = !!existingTool;

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        const res = await fetch(`${API_URL}/api/user/saved-tools/${existingTool.id}`, { credentials: 'include',  method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to unsave');
      } else {
        const res = await fetch(`${API_URL}/api/user/saved-tools`, { credentials: 'include', 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId: tool.id, name: tool.name, category: tool.category }),
        });
        if (!res.ok) throw new Error('Failed to save');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-tools'] });
      toast.success(isSaved ? 'Tool removed from saved list' : 'Tool saved successfully');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
      className={`h-7 px-2 text-[12px] transition-colors ${
        isSaved 
          ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-400/10' 
          : 'text-[#8A8F98] hover:text-white hover:bg-neutral-800/50'
      }`}
    >
      {isSaved ? (
        <BookmarkCheck className="mr-1.5 h-3.5 w-3.5" />
      ) : (
        <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
      )}
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
}

