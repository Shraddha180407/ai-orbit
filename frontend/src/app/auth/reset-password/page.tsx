'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/lib/api';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !email) {
      setError('Invalid password reset link.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword: password }),
        credentials: 'include',
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
      } else {
        setSuccess(true);
        toast.success(data.message || 'Password reset successfully.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <Card title="Invalid Link" description="This password reset link is invalid or missing information." className="w-full max-w-md">
        <div className="mt-6">
          <a href="/auth/forgot-password">
            <Button className="w-full">
              Request a new link
            </Button>
          </a>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card title="Password Reset" description="Your password has been successfully reset." className="w-full max-w-md">
        <div className="mt-6">
          <a href="/auth/signin">
            <Button className="w-full">
              Log in with new password
            </Button>
          </a>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Set new password" description={`Resetting password for ${email}`} className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="New Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength={6}
        />
        
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16 text-white sm:px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        <Suspense fallback={<Card title="Loading..." description="Please wait" className="w-full max-w-md" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
