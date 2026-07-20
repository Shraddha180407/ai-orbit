"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import X from 'lucide-react/dist/esm/icons/x';
import { Pencil, Trash2, Plus, Settings2 } from "lucide-react";
import { buildToolsUrl, cn } from "@/lib/utils";
import type { ToolsSearchParams } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/shadcn-button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

type TopFiltersProps = {
  categories: { slug: string; name: string; _count: { tools: number }; id?: string }[];
  params: ToolsSearchParams;
};

export function TopFilters({ categories, params }: TopFiltersProps) {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const hasActiveFilters = Boolean(params.category || params.q);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/categories/${editingId}` : `${API_URL}/api/admin/categories`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save category');
      toast.success(editingId ? 'Category updated successfully' : 'Category added successfully');
      setIsModalOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/categories/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete category');
      toast.success('Category deleted successfully');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditingId(cat.id); // NOTE: TopFilters categories prop might not include id right now, we need to ensure it does.
    setFormData({ name: cat.name || '', slug: cat.slug || '' });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-5 mb-8 relative">
      <style jsx global>{`
        /* Hide scrollbars for the categories horizontal container */
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
        }
        .scrollbar-none {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* Category Tags scroll row */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="block text-[10px] font-mono tracking-widest text-foreground-faint uppercase">
            CATEGORIES
          </span>
          {isAdmin && (
            <button onClick={openAdd} className="text-[#8A8F98] hover:text-white transition-colors" title="Manage Categories">
              <Settings2 className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-none pb-1">
          {/* "All" category chip */}
          <Link
            href={buildToolsUrl(params, { category: null })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all active:scale-95 whitespace-nowrap",
              !params.category
                ? "bg-white text-black border-transparent hover:bg-neutral-200"
                : "bg-surface border-border text-foreground-muted hover:border-accent"
            )}
          >
            All Categories
          </Link>
          
          {localCategories.map((cat) => {
            const isActive = params.category === cat.slug;
            return (
              <div key={cat.slug} className="group flex items-center relative">
                <Link
                  href={buildToolsUrl(params, { category: isActive ? null : cat.slug })}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all active:scale-95 whitespace-nowrap flex items-center",
                    isActive
                      ? "bg-white text-black border-transparent hover:bg-neutral-200"
                      : "bg-surface border-border text-foreground-muted hover:border-accent"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className={cn(
                    "ml-1 text-[10px]",
                    isActive ? "text-black/50 font-bold" : "text-foreground-faint"
                  )}>
                    {cat._count.tools}
                  </span>
                </Link>
                {isAdmin && cat.id && (
                  <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1 z-10">
                    <button
                      onClick={() => openEdit(cat)}
                      className="bg-[#18181C] border border-[#232326] p-1 rounded hover:bg-[#232326] text-white"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this category?")) {
                          handleDelete(cat.id!);
                        }
                      }}
                      className="bg-red-500/10 border border-red-500/20 p-1 rounded hover:bg-red-500/20 text-red-500"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clear Filters row */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-all active:scale-95"
          >
            <X size={12} aria-hidden="true" />
            Clear all filters
          </Link>
        </div>
      )}
    </div>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Category' : 'Add Category'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Name</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
        </div>
      </Modal>
    </>
  );
}
