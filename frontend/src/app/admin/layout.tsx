'use client';

import { Shell } from '@/components/ui/shell';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Client-side guard since Next.js middleware was removed
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/signin?callbackUrl=/admin');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <div className="text-[#8A8F98]">Loading Admin Console...</div>
      </div>
    );
  }
  
  return (
    <Shell>
      {children}
    </Shell>
  );
}
