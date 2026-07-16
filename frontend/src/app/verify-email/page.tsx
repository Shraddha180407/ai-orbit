'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/shadcn-button';
import { API_URL } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setErrorMessage('Invalid or missing verification link parameters.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email }),
          credentials: 'include',
        });

        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus('error');
          setErrorMessage(data.error || 'Failed to verify email. The link may have expired.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('A network error occurred while verifying your email.');
      }
    };

    verify();
  }, [token, email]);

  return (
    <Card className="w-full max-w-md p-6 text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
          <h2 className="text-xl font-semibold">Verifying your email...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we confirm your account.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your account is now fully active. You can log in to your dashboard.
          </p>
          <Button onClick={() => router.push('/auth/signin')} className="w-full">
            Go to Sign In
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <XCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
          <p className="text-sm text-red-400 mb-4">{errorMessage}</p>
          <Button variant="secondary" onClick={() => router.push('/auth/signup')} className="w-full">
            Back to Sign Up
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16 text-white sm:px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <Suspense fallback={<Card className="w-full max-w-md p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500" /></Card>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </main>
  );
}
