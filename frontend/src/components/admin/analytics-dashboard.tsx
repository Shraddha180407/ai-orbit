'use client';

import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Users, PenTool, Activity, Newspaper } from 'lucide-react';

export function AnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/analytics`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    }
  });

  if (isLoading) return <div className="text-white">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error loading analytics data.</div>;

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Active Users', value: analytics.activeUsers, icon: Activity, color: 'text-green-500' },
    { label: 'Total Tools', value: analytics.totalTools, icon: PenTool, color: 'text-purple-500' },
    { label: 'Total News', value: analytics.totalNews, icon: Newspaper, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm text-[#8A8F98] mt-1">Overview of the platform's key metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#8A8F98]">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
        <h3 className="text-lg font-medium text-white mb-6">User Growth Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.growthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#8A8F98" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#8A8F98" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0A0A0A', stroke: '#ef4444', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
