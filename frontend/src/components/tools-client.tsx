'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ToolGrid } from "@/components/ToolGrid";
import { Pagination } from "@/components/Pagination";
import { API_URL } from "@/lib/api";
import type { SortOption } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/shadcn-button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ToolsClient() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [tools, setTools] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', websiteUrl: '', pricingModel: 'FREE' });
  const [isSaving, setIsSaving] = useState(false);

  const params = {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    pricing: searchParams.get("pricing") || undefined,
    sort: (searchParams.get("sort") || undefined) as SortOption | undefined,
    page: searchParams.get("page") || undefined,
  };

  const fetchTools = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.q) query.set("q", params.q);
        if (params.category) query.set("category", params.category);
        if (params.pricing) query.set("pricing", params.pricing);
        if (params.sort) query.set("sort", params.sort);
        if (params.page) query.set("page", params.page);

        const res = await fetch(`${API_URL}/api/v1/tools?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTools(data.tools || []);
          setPage(data.page || 1);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setIsLoading(false);
      }
    }

  useEffect(() => {
    

    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/tools/${editingId}` : `${API_URL}/api/admin/tools`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save tool');
      toast.success(editingId ? 'Tool updated successfully' : 'Tool added successfully');
      setIsModalOpen(false);
      fetchTools();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/tools/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete tool');
      toast.success('Tool deleted successfully');
      fetchTools();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEdit = (tool: any) => {
    setEditingId(tool.id);
    setFormData({ name: tool.name || '', slug: tool.slug || '', description: tool.description || '', websiteUrl: tool.websiteUrl || '', pricingModel: tool.pricingModel || 'FREE' });
    setIsModalOpen(true);
  };

  return (
    <main className="mx-auto max-w-[1070px] px-6 py-10">
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
            ))}
          </div>
        ) : (
          <>
            <ToolGrid tools={tools} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
            <Pagination page={page} totalPages={totalPages} params={params} />
          </>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Tool' : 'Add Tool'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Name</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Website URL</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Pricing Model</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="FREE, FREEMIUM, etc." value={formData.pricingModel} onChange={e => setFormData({...formData, pricingModel: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Description</label><textarea className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        </div>
      </Modal>
    </main>
  );
}
