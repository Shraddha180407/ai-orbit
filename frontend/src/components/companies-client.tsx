'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Company, CompanyType } from "@/lib/types";
import { API_URL } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";
import Image from "next/image";

const COMPANY_TYPES: { label: string; value: CompanyType }[] = [
  { label: "AI Native", value: "AI_NATIVE" },
  { label: "Model Companies", value: "MODEL_COMPANIES" },
  { label: "Tool Companies", value: "TOOL_COMPANIES" },
  { label: "Profitable", value: "PROFITABLE" },
  { label: "Unicorns", value: "UNICORNS" },
];

type SortField = 'name' | 'valuation' | 'employeeCount' | 'country' | 'sector';
type SortDir = 'asc' | 'desc';

function formatValuation(val: string | null | undefined): string {
  if (!val) return "—";
  const num = Number(val);
  if (isNaN(num)) return val;
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(1)}T`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num}`;
}

function formatValEmp(valuation: string | null | undefined, employeeCount: number | null | undefined): string {
  if (!valuation || !employeeCount) return "—";
  const val = Number(valuation);
  if (isNaN(val) || employeeCount <= 0) return "—";
  const ratio = val / employeeCount;
  if (ratio >= 1_000_000_000) return `$${(ratio / 1_000_000_000).toFixed(2)}B`;
  if (ratio >= 1_000_000) return `$${(ratio / 1_000_000).toFixed(2)}M`;
  if (ratio >= 1_000) return `$${(ratio / 1_000).toFixed(2)}K`;
  return `$${ratio.toFixed(0)}`;
}

function TypeBadge({ hasType }: { hasType: boolean }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${hasType ? 'text-emerald-400' : 'text-[#71717A]'}`}>
      {hasType ? "Yes" : "No"}
    </span>
  );
}

export function CompaniesClient() {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [visibleCount, setVisibleCount] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const [activeType, setActiveType] = useState<CompanyType | null>(null);
  const [sortField, setSortField] = useState<SortField>('valuation');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logoUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${API_URL}/api/v1/companies`);
      if (activeType) url.searchParams.set('type', activeType);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCompanies(data || []);
    } catch (e) {
      console.error("Failed to fetch companies:", e);
    } finally {
      setIsLoading(false);
    }
  }, [activeType]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const filteredAndSorted = useMemo(() => {
    let list = companies;
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(needle));
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'valuation':
          cmp = (Number(a.valuation || 0)) - (Number(b.valuation || 0));
          break;
        case 'employeeCount':
          cmp = (a.employeeCount || 0) - (b.employeeCount || 0);
          break;
        case 'country':
          cmp = (a.country || '').localeCompare(b.country || '');
          break;
        case 'sector':
          cmp = (a.sector || '').localeCompare(b.sector || '');
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [companies, q, sortField, sortDir]);

  useEffect(() => {
    setVisibleCount(30);
  }, [q, activeType]);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= filteredAndSorted.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 30);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => { if (currentSentinel) observer.unobserve(currentSentinel); };
  }, [isLoading, visibleCount, filteredAndSorted.length]);

  const visibleCompanies = filteredAndSorted.slice(0, visibleCount);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/companies/${editingId}` : `${API_URL}/api/admin/companies`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' });
      if (!res.ok) throw new Error('Failed to save company');
      toast.success(editingId ? 'Company updated successfully' : 'Company added successfully');
      setIsModalOpen(false);
      getCompanies();
    } catch (error: any) { toast.error(error.message); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/companies/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete company');
      toast.success('Company deleted successfully');
      getCompanies();
    } catch (error: any) { toast.error(error.message); }
  };

  const openAdd = () => { setEditingId(null); setFormData({ name: '', slug: '', logoUrl: '' }); setIsModalOpen(true); };
  const openEdit = (company: any) => { setEditingId(company.id); setFormData({ name: company.name || '', slug: company.slug || '', logoUrl: company.logoUrl || '' }); setIsModalOpen(true); };

  const SortableHeader = ({ label, field, className = '' }: { label: string; field: SortField; className?: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold hover:text-white transition-colors ${sortField === field ? 'text-[#6E56CF]' : 'text-[#71717A]'} ${className}`}
    >
      {label}
      {sortField === field && (
        <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
      )}
      {sortField !== field && <ArrowUpDown className="w-3 h-3 opacity-40" />}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8 flex-1 w-full">
        <div className="relative flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveType(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
              activeType === null
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-[#A1A1AA] border-[#2A2A2E] hover:border-[#555] hover:text-white'
            }`}
          >
            All
          </button>
          {COMPANY_TYPES.map((ct) => (
            <button
              key={ct.value}
              onClick={() => setActiveType(activeType === ct.value ? null : ct.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                activeType === ct.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-[#A1A1AA] border-[#2A2A2E] hover:border-[#555] hover:text-white'
              }`}
            >
              {ct.label}
            </button>
          ))}

          {isAdmin && (
            <Button className="absolute right-0 bg-white text-black hover:bg-neutral-200 h-8 text-xs" onClick={openAdd}>
              <Plus className="h-3 w-3 mr-1" /> Add Company
            </Button>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="rounded-xl border border-[#1C1C1F] overflow-hidden bg-[#0A0A0C]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse bg-[#131316]/50 border-b border-[#1C1C1F] last:border-b-0" />
            ))}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-20 border border-[#1C1C1F] bg-[#0A0A0C] rounded-xl">
            <p className="text-[#71717A] text-sm">
              {q ? `No companies match "${q}".` : "No companies found."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#1C1C1F] overflow-hidden bg-[#0A0A0C]">
           <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(220px,2fr)_100px_120px_120px_90px_90px_140px_70px_70px] gap-3 items-center px-4 py-3 border-b border-[#1C1C1F] bg-[#0D0D0F] min-w-[1100px]">
              <SortableHeader label="Company" field="name" />
              <SortableHeader label="Country" field="country" />
              <SortableHeader label="Valuation" field="valuation" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A]">Val/Emp</span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A]">AI Native</span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A]">Profitable</span>
              <SortableHeader label="Sector" field="sector" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] text-right">Models</span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] text-right">Tools</span>
            </div>

            {/* Table Body */}
            {visibleCompanies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group grid grid-cols-[minmax(220px,2fr)_100px_120px_120px_90px_90px_140px_70px_70px] gap-3 items-center px-4 py-3 border-b border-[#1C1C1F] last:border-b-0 hover:bg-[#111114] transition-colors min-w-[1100px]"
              >
                {/* Company Name + Logo + Models */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-[#18181C] border border-[#232326] flex items-center justify-center shrink-0 overflow-hidden">
                    {company.logoUrl ? (
                      <Image src={company.logoUrl} alt={company.name} width={36} height={36} className="object-contain rounded-lg" />
                    ) : (
                      <span className="text-sm font-black text-white">{company.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-white truncate group-hover:text-white">{company.name}</h3>
                    {company.aiModels && company.aiModels.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        {company.aiModels.slice(0, 3).map((model) => (
                          <span
                            key={model.id}
                            className="text-[10px] text-[#8A8F98] bg-[#1A1A1E] border border-[#2A2A2E] rounded px-1.5 py-0.5 truncate max-w-[110px]"
                          >
                            {model.name}
                          </span>
                        ))}
                        {company.aiModels.length > 3 && (
                          <span className="text-[10px] text-[#555]">+{company.aiModels.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="text-xs text-[#A1A1AA] truncate">
                  {company.country || "—"}
                </div>

                {/* Valuation */}
                <div className="text-xs text-white font-medium">
                  {formatValuation(company.valuation)}
                </div>

                {/* Val/Emp */}
                <div className="text-xs text-white font-medium">
                  {formatValEmp(company.valuation, company.employeeCount)}
                </div>

                {/* AI Native */}
                <div>
                  <TypeBadge hasType={company.type?.includes('AI_NATIVE') || false} />
                </div>

                {/* Profitable */}
                <div>
                  <TypeBadge hasType={company.type?.includes('PROFITABLE') || false} />
                </div>

                {/* Sector */}
                <div className="text-xs text-[#A1A1AA] truncate">
                  {company.sector || "—"}
                </div>

                {/* Models count */}
                <div className="text-xs text-white font-medium text-right">
                  {company._count?.aiModels || 0}
                </div>

                {/* Tools count */}
                <div className="text-xs text-white font-medium text-right">
                  {company._count?.tools || 0}
                </div>
              </Link>
            ))}

            {/* Sentinel for infinite scroll */}
            {filteredAndSorted.length > 0 && visibleCount < filteredAndSorted.length && (
              <div ref={sentinelRef} className="h-16 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
           </div>
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
