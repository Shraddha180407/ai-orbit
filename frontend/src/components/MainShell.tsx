'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const NO_SHELL_PATHS = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PATHS.some((p) => pathname.startsWith(p));

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col w-full max-w-full overflow-x-clip">
        {children}
      </div>
      <Footer />
    </>
  );
}
