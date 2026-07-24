'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Building from 'lucide-react/dist/esm/icons/building';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { Company } from "@/lib/types";
import { fetchAllCompanies } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

export function CompaniesClient() {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logoUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCompanies();
      setCompanies(data || []);
    } catch (e) {
      console.error("Failed to fetch companies:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!q) return companies;
    const needle = q.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(needle));
  }, [companies, q]);

  // Reset pagination whenever the active query changes.
  useEffect(() => {
    setVisibleCount(15);
  }, [q]);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= filteredCompanies.length) return;

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
  }, [isLoading, visibleCount, filteredCompanies.length]);

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/companies/${editingId}` : `${API_URL}/api/admin/companies`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save company');
      toast.success(editingId ? 'Company updated successfully' : 'Company added successfully');
      setIsModalOpen(false);
      getCompanies();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/companies/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete company');
      toast.success('Company deleted successfully');
      getCompanies();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', logoUrl: '' });
    setIsModalOpen(true);
  };

  const openEdit = (company: any) => {
    setEditingId(company.id);
    setFormData({ name: company.name || '', slug: company.slug || '', logoUrl: company.logoUrl || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Building className="text-[#6E56CF]" />
              AI Companies
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-2">
              Explore leading AI research labs, software vendors, and hardware makers in the global ecosystem.
            </p>
          </div>
          {isAdmin && (
            <Button className="bg-white text-black hover:bg-neutral-200" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Company
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">
              {q ? `No companies match "${q}".` : "No companies found."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleCompanies.map((company: Company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_200px_120px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all focus-visible:bg-[#18181C]/40 focus-visible:outline-none"
              >
                {/* Column 1: Initials/Logo */}
                <div className="h-10 w-10 rounded-lg bg-[#18181C] flex items-center justify-center font-black text-lg text-white border border-[#232326] shrink-0">
                  {company.name.charAt(0)}
                </div>
                {/* Column 2: Name */}
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-base truncate group-hover:text-white transition-colors">
                    {company.name}
                  </h3>
                </div>

                {/* Column 3: Headquarters */}
                <div className="text-sm text-[#A1A1AA] flex items-center gap-1 truncate">
                  <MapPin size={12} className="shrink-0 text-[#71717A]" />
                  <span>{company.headquarters || "Global HQ"}</span>
                </div>

                {/* Column 4: Founded Year */}
                <div className="text-sm text-[#A1A1AA] truncate">
                  <span className="sm:hidden text-xs text-[#71717A] mr-1">Founded:</span>
                  {company.foundedYear || "N/A"}
                </div>

                {/* Column 5: Action Link */}
                <div className="text-right sm:block hidden">
                  <span className="text-xs font-semibold text-[#71717A] group-hover:text-white transition-colors">
                    View Details &rarr;
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-white/5 border border-white/10 hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        openEdit(company);
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
                        if (window.confirm('Are you sure you want to delete this company?')) {
                          handleDelete(company.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </Link>
            ))}

            {/* Sentinel for infinite scroll */}
            {filteredCompanies.length > 0 && visibleCount < filteredCompanies.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Company' : 'Add Company'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Name *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. OpenAI" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug * (unique, lowercase, no spaces)</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. openai" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Logo URL (optional)</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="https://..." value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} /></div>
        </div>
      </Modal>
    </div>
  );
}
