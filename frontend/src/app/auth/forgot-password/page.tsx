'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/shadcn-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setError(data.error || 'Failed to send reset email.');
      } else {
        setSuccess(true);
        toast.success(data.message || 'Password reset email sent.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16 text-white sm:px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        {success ? (
          <Card title="Check your email" description="If an account exists, we've sent you a password reset link." className="w-full max-w-md">
            <div className="mt-6">
              <a href="/auth/signin">
                <Button className="w-full" variant="secondary">
                  Return to log in
                </Button>
              </a>
            </div>
          </Card>
        ) : (
          <Card title="Reset your password" description="Enter your email to receive a password reset link." className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
            
            <p className="mt-6 text-center text-sm text-[#A1A1AA]">
              Remember your password?{' '}
              <a className="font-medium text-white underline" href="/auth/signin">
                Log in
              </a>
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
