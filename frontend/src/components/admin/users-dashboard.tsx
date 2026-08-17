'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/hooks/use-user';
import { API_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, Shield, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  status: string;
  createdAt: string;
};

export function UsersDashboard() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/users?page=${page}&q=${encodeURIComponent(search)}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    }
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to update role');
    },
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to update status');
    },
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`${API_URL}/api/admin/users/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add admin');
      }
    },
    onSuccess: () => {
      toast.success('Admin added successfully');
      setInviteEmail('');
      setIsInviteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-sm text-[#8A8F98] mt-1">Manage user roles, statuses, and permissions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {isInviteOpen ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="Enter email to add admin"
                className="bg-[#0A0A0A] border-white/[0.06] text-white"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button 
                onClick={() => inviteMutation.mutate(inviteEmail)}
                disabled={!isValidEmail || inviteMutation.isPending}
              >
                {inviteMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
              <Button variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={() => setIsInviteOpen(true)} className="bg-white text-black hover:bg-neutral-200">
              <Shield className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8A8F98]" />
          <Input
            placeholder="Search users..."
            className="pl-9 bg-[#0A0A0A] border-white/[0.06] text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#8A8F98] uppercase bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-[#8A8F98]">Loading users...</td></tr>
              ) : data?.users?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-[#8A8F98]">No users found.</td></tr>
              ) : (
                data?.users?.map((u: User) => (
                  <tr key={u.id} className="border-b border-white/[0.06] hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-neutral-800 overflow-hidden">
                          <img src={u.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.email}`} alt="" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{u.name || 'Unknown'}</div>
                          <div className="text-xs text-[#8A8F98]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                        u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-[#8A8F98]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                        u.status === 'BLOCKED' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8A8F98]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {u.role === 'USER' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-blue-400 hover:bg-blue-400/10 hover:text-blue-300"
                            onClick={() => roleMutation.mutate({ id: u.id, role: 'ADMIN' })}
                          >
                            <Shield className="h-3.5 w-3.5 mr-1" /> Make Admin
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-[#8A8F98] hover:bg-white/5"
                            onClick={() => roleMutation.mutate({ id: u.id, role: 'USER' })}
                            disabled={currentUser?.id === u.id}
                            title={currentUser?.id === u.id ? "Cannot revoke your own admin role" : ""}
                          >
                            Revoke Admin
                          </Button>
                        )}
                        
                        {u.status === 'ACTIVE' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-orange-400 hover:bg-orange-400/10 hover:text-orange-300"
                            onClick={() => statusMutation.mutate({ id: u.id, status: 'BLOCKED' })}
                            disabled={currentUser?.id === u.id}
                            title={currentUser?.id === u.id ? "Cannot block your own account" : ""}
                          >
                            <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Block
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-green-400 hover:bg-green-400/10 hover:text-green-300"
                            onClick={() => statusMutation.mutate({ id: u.id, status: 'ACTIVE' })}
                          >
                            Unblock
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.06] bg-white/[0.01]">
            <span className="text-sm text-[#8A8F98]">
              Page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-8 bg-transparent border-white/[0.06] text-white"
              >
                Previous
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={page === data.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="h-8 bg-transparent border-white/[0.06] text-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
