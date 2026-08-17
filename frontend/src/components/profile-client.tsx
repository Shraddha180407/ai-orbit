'use client';
import { API_URL } from '@/lib/api';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

export function ProfileClient() {
  const { user, update } = useUser();
  const [name, setName] = useState(user?.name || '');
  
  const avatarUrl = user?.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.email || user?.name || 'user')}`;

  const updateMutation = useMutation({
    mutationFn: async ({ newName }: { newName: string }) => {
      const res = await fetch(`${API_URL}/api/user`, { credentials: 'include', 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: async () => {
      await update();
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (name === user?.name) {
      toast.success('Profile updated successfully');
      return;
    }
    updateMutation.mutate({ newName: name });
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Section */}
      <div className="rounded-lg border border-border bg-background p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-xl font-medium text-white border border-border overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-[15px] font-medium text-white">{user?.name || 'User'}</h2>
            <p className="text-[13px] text-[#8A8F98]">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[13px] font-medium text-white">
              Display Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-md h-9 text-[13px] bg-transparent border-border focus-visible:ring-1 focus-visible:ring-neutral-700"
              placeholder="Enter your name"
            />
            <p className="text-[12px] text-[#8A8F98]">This is your public display name.</p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button 
              type="submit" 
              size="sm"
              disabled={updateMutation.isPending}
              className="h-8 px-4 text-[12px] bg-black text-white hover:bg-neutral-900 border border-border shadow-none"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

