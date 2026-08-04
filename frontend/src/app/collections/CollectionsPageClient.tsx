'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import { CollectionListItem, CollectionSubCategory } from "@/lib/types";
import { fetchCollectionSubCategories } from "@/lib/collections";
import { API_URL } from "@/lib/api";

// Import modular components
import { CollectionToolbar } from "@/components/collections/CollectionToolbar";
import { CollectionFilters } from "@/components/collections/CollectionFilters";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { CollectionListTable } from "@/components/collections/CollectionListTable";

const ALL_CATEGORIES = "All Categories";
type DbCreatorType = "EDITORIAL" | "COMMUNITY";
type SortKey = "updated" | "name" | "tools" | "creator";

interface NormalizedCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  creatorType: DbCreatorType;
  isFeatured: boolean;
  isCurated: boolean;
  toolCount: number;
  updatedAt: string;
  category: string;
  categoriesList: string[];
  imageUrl: string;
  color: string;
}

const CREATOR_COLORS: Record<DbCreatorType, string> = {
  EDITORIAL: "#A78BFA",
  COMMUNITY: "#34D399",
};

function normalizeCollection(item: any): NormalizedCollection {
  const name = item.name || item.title || "Unnamed Collection";
  const slug = item.slug || item.id || "";
  
  let creatorName = "Anonymous";
  let creatorAvatar = "";
  if (item.creator && typeof item.creator === 'object') {
    creatorName = item.creator.name || creatorName;
    creatorAvatar = item.creator.image || item.creator.avatar || item.creator.avatarUrl || "";
  } else {
    if (item.creatorName) creatorName = item.creatorName;
    if (item.creatorAvatar) creatorAvatar = item.creatorAvatar;
  }
  
  const creatorType: DbCreatorType = item.creatorType === "EDITORIAL" ? "EDITORIAL" : "COMMUNITY";
  const isFeatured = !!(item.isFeatured ?? item.featured);
  const isCurated = !!(item.isCurated ?? item.curated);
  const toolCount = typeof item.toolCount === 'number' ? item.toolCount : (item.tools ? item.tools.length : 0);

  let categoriesList: string[] = [];
  if (Array.isArray(item.categories)) {
    categoriesList = item.categories.map((c: any) => c.categoryName || c.name || "").filter(Boolean);
  }
  const category = categoriesList.length > 0 ? categoriesList[0] : "General";

  const color = item.color || CREATOR_COLORS[creatorType] || "#6E56CF";

  return {
    id: item.id || slug,
    slug,
    name,
    description: item.description || "",
    creatorName,
    creatorAvatar,
    creatorType,
    isFeatured,
    isCurated,
    toolCount,
    updatedAt: item.updatedAt || item.updated_at || "",
    category,
    categoriesList,
    imageUrl: item.imageUrl || item.image || "",
    color,
  };
}

const PAGE_SIZE = 20;

interface Props {
  initialItems?: CollectionListItem[];
  initialNextCursor?: string | null;
}

export default function CollectionsPageClient({ initialItems }: Props) {
  const [collections, setCollections] = useState<NormalizedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [nameSearch, setNameSearch] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [selectedCreatorType, setSelectedCreatorType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activePill, setActivePill] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<CollectionSubCategory[]>([]);
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string | null>(null);

  const [toolsMin, setToolsMin] = useState(0);
  const [toolsMax, setToolsMax] = useState(100);
  const [activeToolsFilter, setActiveToolsFilter] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setCollections(initialItems.map(normalizeCollection));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetch(`${API_URL}/api/v1/collections?sort=recently_updated`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.items)) {
            setCollections(data.items.map(normalizeCollection));
          }
        })
        .catch(err => console.error("Error loading collections", err))
        .finally(() => setIsLoading(false));
    }
  }, [initialItems]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCollectionSubCategories().then(setSubCategories).catch(() => {});
  }, []);

  const hasActiveFilters = nameSearch || selectedCategory !== ALL_CATEGORIES || selectedCreatorType !== "All" || activeToolsFilter || activePill || selectedSubCategorySlug;

  function clearAllFilters() {
    setNameSearch(""); setNameInput(""); setSelectedCategory(ALL_CATEGORIES);
    setSelectedCreatorType("All"); setToolsMin(0); setToolsMax(100);
    setActiveToolsFilter(false); setActivePill(null); setSelectedSubCategorySlug(null); setCurrentPage(1);
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collections.forEach((c) => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return counts;
  }, [collections]);

  const creatorTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collections.forEach((c) => { if (c.creatorType) counts[c.creatorType] = (counts[c.creatorType] || 0) + 1; });
    return counts;
  }, [collections]);

  const categories = useMemo(() => {
    return Array.from(new Set(collections.map((c) => c.category).filter(Boolean))).sort();
  }, [collections]);

  const filtered = useMemo(() => {
    let list = [...collections];
    if (nameSearch.trim()) {
      const q = nameSearch.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.creatorName.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    if (selectedCategory !== ALL_CATEGORIES) list = list.filter((d) => d.category === selectedCategory);
    if (selectedCreatorType !== "All") list = list.filter((d) => d.creatorType === selectedCreatorType);
    if (selectedSubCategorySlug) list = list.filter((d) => (d as any).subCategorySlugs?.includes(selectedSubCategorySlug));
    if (activeToolsFilter) {
      list = list.filter((d) => d.toolCount >= toolsMin && d.toolCount <= toolsMax);
    }
    if (activePill === "featured") {
      list = list.filter((d) => d.isFeatured);
    }
    if (activePill === "editorial") {
      list = list.filter((d) => d.creatorType === "EDITORIAL");
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "creator") cmp = a.creatorName.localeCompare(b.creatorName);
      else if (sortKey === "tools") cmp = a.toolCount - b.toolCount;
      else cmp = (a.updatedAt || "").localeCompare(b.updatedAt || "");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [collections, nameSearch, selectedCategory, selectedCreatorType, selectedSubCategorySlug, activeToolsFilter, activePill, toolsMin, toolsMax, sortKey, sortDir]);

  useEffect(() => { setCurrentPage(1); }, [nameSearch, selectedCategory, selectedCreatorType, selectedSubCategorySlug, sortKey, sortDir, activeToolsFilter, activePill]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8 flex-1">
      {/* ── TOOLBAR ── */}
      <CollectionToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        hasActiveFilters={!!hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* ── SUBCATEGORY FILTER CHIPS ── */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 mt-2">
          <button
            onClick={() => { setSelectedSubCategorySlug(null); setCurrentPage(1); }}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              !selectedSubCategorySlug
                ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            All
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => { setSelectedSubCategorySlug(sub.slug); setCurrentPage(1); }}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                selectedSubCategorySlug === sub.slug
                  ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                  : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div>
          <CollectionFilters 
            nameInput={nameInput}
            setNameInput={setNameInput}
            setNameSearch={setNameSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            selectedCreatorType={selectedCreatorType}
            setSelectedCreatorType={setSelectedCreatorType}
            sortKey={sortKey}
            sortDir={sortDir}
            setSortKey={setSortKey}
            setSortDir={setSortDir}
            toolsMin={toolsMin}
            toolsMax={toolsMax}
            setToolsMin={setToolsMin}
            setToolsMax={setToolsMax}
            activeToolsFilter={activeToolsFilter}
            setActiveToolsFilter={setActiveToolsFilter}
            setCurrentPage={setCurrentPage}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
          <CollectionGrid items={visible} isLoading={isLoading} />
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === "list" && (
        <div ref={dropdownRef}>
          <CollectionListTable 
            items={visible}
            isLoading={isLoading}
            sortKey={sortKey}
            sortDir={sortDir}
            handleSort={handleSort}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            nameSearch={nameSearch}
            nameInput={nameInput}
            setNameInput={setNameInput}
            setNameSearch={setNameSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            categoryCounts={categoryCounts}
            totalCount={collections.length}
            selectedCreatorType={selectedCreatorType}
            setSelectedCreatorType={setSelectedCreatorType}
            creatorTypeCounts={creatorTypeCounts}
            toolsMin={toolsMin}
            toolsMax={toolsMax}
            setToolsMin={setToolsMin}
            setToolsMax={setToolsMax}
            activeToolsFilter={activeToolsFilter}
            setActiveToolsFilter={setActiveToolsFilter}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-6 border-t border-[#232326]/60 mt-4">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
            .reduce<(number | string)[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) => p === "..." ? (
              <span key={`e-${i}`} className="text-[#52525B] text-xs px-1">...</span>
            ) : (
              <button key={p} onClick={() => setCurrentPage(p as number)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${currentPage === p ? "border-[#6E56CF] bg-[#6E56CF] text-white" : "border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]"}`}>
                {p}
              </button>
            ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#232326] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Next →
          </button>
        </div>
      )}
    </main>
  );
}