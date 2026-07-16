'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/shadcn-button';
import { Input } from '@/components/ui/input';
import { signOut } from '@/lib/auth-client';
import { toast } from 'sonner';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import { API_URL } from '@/lib/api';

export function SettingsClient() {
  const { data: settingsData } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/settings`, {
        credentials: 'include',
      });
      if (!res.ok) return { connectedProviders: [], hasPassword: true };
      return res.json();
    },
  });

  const connectedProviders: string[] = settingsData?.connectedProviders || [];
  const hasPassword: boolean = settingsData?.hasPassword ?? true;
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const passwordMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/password`, { credentials: 'include', 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      return data;
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/account`, { credentials: 'include', 
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      return data;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      signOut({ callbackUrl: '/' });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    passwordMutation.mutate();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all data will be permanently lost.')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="max-w-2xl space-y-8">


      {/* Connected Accounts Section */}
      {connectedProviders.length > 0 && (
        <div className="rounded-lg border border-border bg-background p-6">
          <h3 className="text-[14px] font-medium text-white">Connected Accounts</h3>
          <p className="mt-1 text-[13px] text-[#8A8F98] mb-4">You have connected the following social accounts for login.</p>
          <div className="flex flex-col gap-2">
            {connectedProviders.map((provider) => (
              <div key={provider} className="flex items-center justify-between p-3 border border-border rounded-md bg-neutral-900/30">
                <span className="text-[13px] text-white capitalize">{provider}</span>
                <span className="text-[11px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">Connected</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Section */}
      {hasPassword && (
        <div className="rounded-lg border border-border bg-background p-6">
          <h3 className="text-[14px] font-medium text-white">Change Password</h3>
          <p className="mt-1 text-[13px] text-[#8A8F98] mb-6">Update your account password.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-[13px] font-medium text-white">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="max-w-md h-9 text-[13px] bg-transparent border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-[13px] font-medium text-white">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="max-w-md h-9 text-[13px] bg-transparent border-border"
                required
                minLength={6}
              />
            </div>
            <div className="pt-2">
              <Button 
                type="submit" 
                size="sm"
                disabled={passwordMutation.isPending}
                className="h-8 px-4 text-[12px] bg-black text-white hover:bg-neutral-900 border border-border shadow-none"
              >
                {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Account Access (Logout) */}
      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="text-[14px] font-medium text-white">Account Access</h3>
        <p className="mt-1 text-[13px] text-[#8A8F98] mb-4">Log out of your current session on this device.</p>
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="h-8 px-4 text-[12px] text-red-400 bg-red-400/10 hover:bg-red-400/20 hover:text-red-300 border-transparent transition-colors"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Log out
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-900/30 bg-red-900/5 p-6">
        <h3 className="text-[14px] font-medium text-red-400">Danger Zone</h3>
        <p className="mt-1 text-[13px] text-[#8A8F98] mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <Button 
          variant="secondary"
          size="sm"
          onClick={handleDeleteAccount}
          disabled={deleteMutation.isPending}
          className="h-8 px-4 text-[12px] text-red-400 bg-red-400/10 hover:bg-red-400/20 hover:text-red-300 border-transparent transition-colors"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Account'}
        </Button>
      </div>
    </div>
  );
}

