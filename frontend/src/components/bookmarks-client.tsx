'use client';
import { API_URL } from '@/lib/api';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { toast } from 'sonner';

interface Bookmark {
  id: string;
  title: string | null;
  url: string;
  createdAt: string;
}

import { Skeleton } from '@/components/ui/skeleton';

export function BookmarksClient() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Fetch Bookmarks
  const { data: bookmarks = [], isLoading } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/bookmarks`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch bookmarks');
      return res.json();
    },
  });

  // Create Bookmark
  const createMutation = useMutation({
    mutationFn: async (newBookmark: { title: string; url: string }) => {
      const res = await fetch(`${API_URL}/api/bookmarks`, { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookmark),
      });
      if (!res.ok) throw new Error('Failed to create bookmark');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setIsModalOpen(false);
      setNewTitle('');
      setNewUrl('');
      toast.success('Bookmark added successfully');
    },
    onError: () => {
      toast.error('Failed to add bookmark');
    },
  });

  // Delete Bookmark
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/bookmarks/${id}`, { credentials: 'include',  method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete bookmark');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark removed');
    },
    onError: () => {
      toast.error('Failed to remove bookmark');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    createMutation.mutate({ title: newTitle, url: newUrl });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Bookmarks</h2>
          <p className="text-sm text-muted-foreground">Manage and organize your saved links.</p>
        </div>
        <Button className="bg-black text-white hover:bg-neutral-900 border border-border" onClick={() => setIsModalOpen(true)}>Add Bookmark</Button>
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
      ) : bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Add links you return to often for quick access later."
          action={<Button variant="secondary" onClick={() => setIsModalOpen(true)}>Add bookmark</Button>}
        />
      ) : (
        <div className="flex flex-col border-t border-border mt-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border py-4 px-2 transition-colors hover:bg-neutral-800/20"
            >
              <div className="flex-1 overflow-hidden space-y-1">
                <h3 className="text-[14px] font-medium text-white truncate">{bookmark.title || 'Untitled Bookmark'}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-[#8A8F98] hover:text-[#EFEFEF] transition-colors truncate max-w-full"
                >
                  {bookmark.url} <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <div className="flex shrink-0 items-center justify-end w-full sm:w-auto mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[12px] text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all"
                  onClick={() => deleteMutation.mutate(bookmark.id)}
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

      {/* Add Bookmark Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a new bookmark">
        <form id="bookmark-form" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title (Optional)"
            placeholder="e.g. Linear Inspiration"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            label="URL"
            type="url"
            placeholder="https://..."
            required
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </form>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-black text-white hover:bg-neutral-900 border border-border shadow-none" type="submit" form="bookmark-form" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save bookmark'}
          </Button>
        </div>
      </Modal>
    </>
  );
}

