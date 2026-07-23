'use client';

import React, { useEffect, useState, useRef } from "react";
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import { AIModel } from "@/lib/types";
import { fetchAllModels } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

export function ModelsClient() {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [models, setModels] = useState<AIModel[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', creator: '', contextWindow: '', parameterSize: '', modality: '', releaseDate: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getModels = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllModels();
      setModels(data || []);
    } catch (e) {
      console.error("Failed to fetch models:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getModels();
  }, []);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= models.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 15);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, visibleCount, models.length]);

  const visibleModels = models.slice(0, visibleCount);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/models/${editingId}` : `${API_URL}/api/admin/models`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save model');
      toast.success(editingId ? 'Model updated successfully' : 'Model added successfully');
      setIsModalOpen(false);
      getModels();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/models/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete model');
      toast.success('Model deleted successfully');
      getModels();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', creator: '', contextWindow: '', parameterSize: '', modality: '', releaseDate: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (model: any) => {
    setEditingId(model.id);
    setFormData({ name: model.name || '', creator: model.creator || '', contextWindow: model.contextWindow || '', parameterSize: model.parameterSize || '', modality: model.modality || '', releaseDate: model.releaseDate || '', description: model.description || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-[#6E56CF]" />
              AI Language Models
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-2">
              Discover and explore state-of-the-art LLMs, neural architectures, and vision models pushing machine intelligence limits.
            </p>
          </div>
          {isAdmin && (
            <Button className="bg-white text-black hover:bg-neutral-200" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Model
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No models found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleModels.map((model: AIModel) => (
              <div
                key={model.id}
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_180px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all w-full"
              >
                {/* Column 1: Initials */}
                <div className="h-10 w-10 rounded-lg bg-[#18181C] flex items-center justify-center font-bold text-white uppercase border border-[#232326]/60 shrink-0">
                  {model.name.charAt(0)}
                </div>

                {/* Column 2: Name + Description */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">
                      {model.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-[#18181C] text-[9px] text-[#A1A1AA] border border-[#232326] shrink-0 font-mono">
                      {model.modality}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-1 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                {/* Column 3: Context / Parameters */}
                <div className="text-xs text-[#A1A1AA] font-mono flex flex-col gap-0.5 sm:block hidden">
                  <div>Context: <strong className="text-white">{model.contextWindow}</strong></div>
                  <div className="text-[10px] text-[#71717A]">Params: {model.parameterSize}</div>
                </div>

                {/* Column 4: Release Date */}
                <div className="text-right sm:block hidden">
                  <span className="text-[10px] font-mono text-[#71717A] block">RELEASED</span>
                  <span className="text-xs text-white font-medium">{model.releaseDate}</span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-white/5 border border-white/10 hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        openEdit(model);
                      }}
                    >
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to delete this model?')) {
                          handleDelete(model.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Sentinel for infinite scroll */}
            {models.length > 0 && visibleCount < models.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Model' : 'Add Model'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Name *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. GPT-4o" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Creator *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. OpenAI" value={formData.creator} onChange={e => setFormData({...formData, creator: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-[#8A8F98]">Context Window *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. 128k" value={formData.contextWindow} onChange={e => setFormData({...formData, contextWindow: e.target.value})} /></div>
            <div><label className="text-xs text-[#8A8F98]">Parameter Size *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. 70B" value={formData.parameterSize} onChange={e => setFormData({...formData, parameterSize: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-[#8A8F98]">Modality *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. Text, Multimodal" value={formData.modality} onChange={e => setFormData({...formData, modality: e.target.value})} /></div>
            <div><label className="text-xs text-[#8A8F98]">Release Date *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. 2024-05" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} /></div>
          </div>
          <div><label className="text-xs text-[#8A8F98]">Description *</label><textarea className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20" placeholder="Short description of the model..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        </div>
      </Modal>
    </div>
  );
}
