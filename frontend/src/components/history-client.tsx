'use client';
import { API_URL } from '@/lib/api';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

function formatDistanceToNow(date: Date) {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'just now';
}

export function HistoryClient() {
  const { data: history = [], isLoading } = useQuery<any[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/user/history`, {
        credentials: 'include',
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[250px]" />
            </div>
            <Skeleton className="h-3 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <EmptyState title="No recent activity" description="Your history will appear here as you start interacting with the app." />
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-border bg-background">
          <div>
            <p className="font-medium text-white text-[14px]">
              {item.action === 'CLICK_TOOL' ? 'Visited tool' : item.action}
            </p>
            <p className="text-[13px] text-[#8A8F98]">{item.entity}</p>
          </div>
          <p className="text-[12px] text-[#636871] whitespace-nowrap">
            {formatDistanceToNow(new Date(item.createdAt))}
          </p>
        </Card>
      ))}
    </div>
  );
}
