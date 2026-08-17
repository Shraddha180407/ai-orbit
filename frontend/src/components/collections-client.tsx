'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryMenu } from "@/components/CategoryMenu";
import { CollectionGrid } from "@/components/CollectionGrid";
import { API_URL } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollectionsClient() {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const searchParams = useSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  const params = {
    category: searchParams.get("category") || undefined,
    page: searchParams.get("page") || undefined,
  };

  const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.category) query.set("category", params.category);
        if (params.page) query.set("page", params.page);

        const res = await fetch(`${API_URL}/api/v1/collections?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.pagination?.total || 0);
          setCategoryCounts(data.categoryCounts || {});
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    }

  useEffect(() => {
    

    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/collections/${editingId}` : `${API_URL}/api/admin/collections`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save collection');
      toast.success(editingId ? 'Collection updated successfully' : 'Collection added successfully');
      setIsModalOpen(false);
      fetchCollections();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/collections/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete collection');
      toast.success('Collection deleted successfully');
      fetchCollections();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (collection: any) => {
    setEditingId(collection.id);
    setFormData({ name: collection.name || '', slug: collection.slug || '', description: collection.description || '' });
    setIsModalOpen(true);
  };

  return (
    <>
      <main className="mx-auto max-w-container px-6 py-10">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Collections</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {total} curated bundle{total === 1 ? "" : "s"} of the best AI tools
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-white text-black hover:bg-neutral-200" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Collection
          </Button>
        )}
      </header>

      <div className="mb-8 rounded-lg border border-border bg-surface p-5">
        <CategoryMenu categoryCounts={categoryCounts} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-[#232326] bg-[#131316]" />
          ))}
        </div>
      ) : (
        <CollectionGrid collections={items} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
      )}
    </main>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Collection' : 'Add Collection'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Name</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Description</label><textarea className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        </div>
      </Modal>
    </>
  );
}
