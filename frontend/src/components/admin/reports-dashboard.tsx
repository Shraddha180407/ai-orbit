'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Flag, MoreHorizontal, Check, X, Ban, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function ReportsDashboard() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports', page, statusFilter],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/reports?page=${page}&status=${statusFilter}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch reports');
      return res.json();
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_URL}/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to update report status');
    },
    onSuccess: () => {
      toast.success('Report status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    }
  });

  const statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'IGNORED'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'APPROVED': return <Check className="h-4 w-4 text-green-500" />;
      case 'REJECTED': return <X className="h-4 w-4 text-red-500" />;
      case 'IGNORED': return <Ban className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'APPROVED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'IGNORED': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-white/5 text-gray-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports System</h1>
          <p className="text-sm text-[#8A8F98] mt-1">Manage user reports for tools, news, and users.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? 'bg-white text-black' 
                  : 'bg-[#111111] text-[#8A8F98] hover:text-white border border-white/[0.06]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#111111] text-xs uppercase text-[#8A8F98] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 font-medium">Report Target</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Reporter</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8A8F98]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#8A8F98] border-t-transparent" />
                      Loading reports...
                    </div>
                  </td>
                </tr>
              ) : data?.reports?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8A8F98]">
                    <Flag className="mx-auto h-8 w-8 mb-3 opacity-20" />
                    No reports found.
                  </td>
                </tr>
              ) : (
                data?.reports?.map((report: any) => {
                  let targetName = 'Unknown';
                  let targetType = 'Unknown';
                  
                  if (report.reportedTool) {
                    targetName = report.reportedTool.name;
                    targetType = 'Tool';
                  } else if (report.reportedUser) {
                    targetName = report.reportedUser.name || report.reportedUser.email;
                    targetType = 'User';
                  } else if (report.reportedNews) {
                    targetName = report.reportedNews.title;
                    targetType = 'News';
                  }

                  return (
                    <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white max-w-[200px] truncate" title={targetName}>{targetName}</div>
                        <div className="text-xs text-[#8A8F98] mt-0.5">{targetType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[250px] truncate" title={report.reason}>{report.reason}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white max-w-[150px] truncate">{report.reporter?.name || 'Anonymous'}</div>
                        <div className="text-xs text-[#8A8F98] mt-0.5 truncate max-w-[150px]">{report.reporter?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#8A8F98]">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {report.status !== 'APPROVED' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: report.id, status: 'APPROVED' })}
                              className="p-1.5 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                              title="Approve Report"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {report.status !== 'REJECTED' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: report.id, status: 'REJECTED' })}
                              className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title="Reject Report"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          {report.status !== 'IGNORED' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: report.id, status: 'IGNORED' })}
                              className="p-1.5 rounded bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors"
                              title="Ignore Report"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-[#111111]/50 mt-auto">
            <span className="text-sm text-[#8A8F98]">
              Page <span className="font-medium text-white">{page}</span> of{' '}
              <span className="font-medium text-white">{data.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-transparent border-white/[0.06] text-white hover:bg-white/[0.04]"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="bg-transparent border-white/[0.06] text-white hover:bg-white/[0.04]"
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
