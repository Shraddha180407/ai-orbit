'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Lock from 'lucide-react/dist/esm/icons/lock';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { API_URL } from '@/lib/api';

function SignInForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const errorDetails = searchParams.get('details');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === 'OAuthAccountNotLinked'
      ? 'Email already in use with another provider.'
      : urlError
      ? `Sign in error: ${errorDetails ? decodeURIComponent(errorDetails) : urlError}`
      : null
  );
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid email or password.');
      } else {
        const data = await res.json();
        window.location.href = data.user?.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/dashboard';
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoadingEmail(false);
    }
  }

  function handleGoogle() {
    setLoadingGoogle(true);
    window.location.href = `${API_URL}/api/auth/google`;
  }

  const disabled = loadingEmail || loadingGoogle;

  return (
    <div className="flex h-screen max-h-screen w-full overflow-hidden bg-black text-white selection:bg-white/20">

      {/* ── Left Column — Center Aligned Form ── */}
      <div className="flex w-full lg:w-[42%] xl:w-[40%] flex-col justify-between px-8 sm:px-12 xl:px-14 py-6 xl:py-8 border-r border-white/[0.08] relative z-20 h-full overflow-y-auto lg:overflow-hidden">

        {/* Top Header Logo */}
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#3b82f6] via-[#06b6d4] to-[#38bdf8] flex items-center justify-center p-[2px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <Image src="/icon.png" alt="AI Orbit" width={30} height={30} className="object-cover" />
              </div>
            </div>
            <div>
              <p className="text-[13.5px] font-black tracking-[0.16em] text-white leading-none">AIORBIT</p>
              <p className="text-[8px] text-white/40 font-bold tracking-[0.18em] uppercase mt-1">AI Intelligence Hub</p>
            </div>
          </Link>
        </div>

        {/* Center Form Section — Horizontally and Vertically Centered */}
        <div className="my-auto py-4 w-full max-w-[340px] mx-auto flex flex-col justify-center">
          <div className="space-y-1 mb-5 text-left">
            <h1 className="text-[30px] xl:text-[32px] font-black tracking-tight text-white leading-tight">
              Welcome back
            </h1>
            <p className="text-[12.5px] text-white/45">
              Sign in to access your AI workspace
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.12] bg-[#0c0c0e] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] hover:border-white/[0.2] transition-all active:scale-[0.99] disabled:opacity-40 shadow-sm cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>{loadingGoogle ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-white/[0.08]" />
            <span className="text-[11px] text-white/30 font-medium">or</span>
            <div className="flex-1 border-t border-white/[0.08]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email */}
            <div className="space-y-1 text-left">
              <label className="text-[11.5px] font-semibold text-white/70 block">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/[0.1] bg-[#0c0c0e] pl-9 pr-4 py-2.5 text-[12.5px] text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-[#121216] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[11.5px] font-semibold text-white/70">Password</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-white/40 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/[0.1] bg-[#0c0c0e] pl-9 pr-9 py-2.5 text-[12.5px] text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-[#121216] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-3 py-2 text-left">
                <p className="text-[11.5px] text-red-400 leading-snug">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={disabled}
              className="w-full rounded-xl bg-white hover:bg-white/90 px-4 py-2.5 text-[13px] font-bold text-black transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer mt-1"
            >
              {loadingEmail ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Switch link */}
          <p className="text-center text-[12px] text-white/40 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-white font-semibold hover:underline transition-all">
              Create one free
            </Link>
          </p>
        </div>

        {/* Bottom Terms & Left Avatar Indicator */}
        <div className="space-y-3 pt-3 border-t border-white/[0.04] w-full">
          <p className="text-[10px] text-white/25 leading-relaxed">
            By signing in you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white/50 transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-white/50 transition-colors">Privacy Policy</Link>.
          </p>

          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/80 text-[10px] font-semibold bg-white/[0.02]">
              N
            </div>
          </div>
        </div>

      </div>

      {/* ── Right Column — Hero & Showcase ── */}
      <AuthRightPanel />

    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
