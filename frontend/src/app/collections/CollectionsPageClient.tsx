"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { 
  Search, SlidersHorizontal, ArrowUpDown, X, Bookmark, 
  Share2, RotateCcw, LayoutGrid, List, Check, ChevronDown, ChevronUp, Copy, Twitter, Linkedin
} from "lucide-react";
import type { CollectionListItem, CreatorProfile } from "@/lib/types";

interface Props {
  initialCollections: CollectionListItem[];
}

export default function CollectionsPageClient({ initialCollections }: Props) {
  // --- UI Layout States ---
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [activeShareMenu, setActiveShareMenu] = useState<string | null>(null);

  // --- API / Filter Parameter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("recently_updated");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [creatorType, setCreatorType] = useState<string>("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minTools, setMinTools] = useState(0);

  // --- Active Mock Collections Management (Infinite Scroll emulation) ---
  const [items, setItems] = useState<CollectionListItem[]>(initialCollections);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Handle Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Handle Session Storage Sort Persistence
  useEffect(() => {
    const savedSort = sessionStorage.getItem("collections_sort");
    if (savedSort) setSortBy(savedSort);
  }, []);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    sessionStorage.setItem("collections_sort", value);
  };

  // Toggle Accordion Rows (Mobile/Tablet details)
  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Bookmark Sync Mutation Handlers
  const toggleBookmark = async (id: string) => {
    const isCurrentlyBookmarked = bookmarkedIds.has(id);
    const newBookmarks = new Set(bookmarkedIds);
    
    if (isCurrentlyBookmarked) {
      newBookmarks.delete(id);
      setBookmarkedIds(newBookmarks);
      // await fetch(`/api/v1/collections/${id}/bookmark`, { method: 'DELETE' });
    } else {
      newBookmarks.add(id);
      setBookmarkedIds(newBookmarks);
      // await fetch(`/api/v1/collections/${id}/bookmark`, { method: 'POST' });
    }
  };

  // Simulated Infinite Scroll Loader
  const loadMoreItems = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    // Emulating next batch delivery matching API parameters
    setTimeout(() => {
      const nextBatch = initialCollections.map((item, idx) => ({
        ...item,
        id: `gen-${items.length + idx}-${Date.now()}`,
        name: `${item.name} (Batch ${Math.floor(items.length / 3) + 1})`,
      }));
      
      setItems(prev => [...prev, ...nextBatch]);
      setIsLoading(false);
      if (items.length > 40) setHasMore(false); // Cap virtualization loop mock
    }, 800);
  };

  // --- Frontend Engine Filtering Loop ---
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !debouncedSearch || 
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.creator.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesCategory = !selectedCategory || item.categories.some(c => c.categoryName === selectedCategory);
      const matchesFeatured = !featuredOnly || item.isFeatured;
      const matchesMinTools = item.toolCount >= minTools;

      return matchesSearch && matchesCategory && matchesFeatured && matchesMinTools;
    });
  }, [items, debouncedSearch, selectedCategory, featuredOnly, minTools]);

  // --- TanStack Virtualizer Configuration ---
  const containerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useWindowVirtualizer({
    count: filteredItems.length,
    estimateSize: () => (density === "compact" ? 54 : 88),
    overscan: 6,
  });

  // Infinite scroll threshold monitor
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300) {
        loadMoreItems();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items, isLoading, hasMore]);

  const clearFilters = () => {
    setSelectedCategory("");
    setCreatorType("");
    setFeaturedOnly(false);
    setMinTools(0);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 text-[#E4E4E7]">
      
      {/* 1. Dynamic Search & Utility Control Header Block */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#232326] pb-6 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search collections by name, creator, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#09090B] border border-[#232326] rounded-xl pl-10 pr-10 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 h-11 px-4 bg-[#09090B] border border-[#232326] rounded-xl text-sm font-medium hover:border-neutral-500 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {(selectedCategory || featuredOnly || minTools > 0) && (
              <span className="w-2 h-2 rounded-full bg-white ml-1" />
            )}
          </button>

          <div className="relative flex items-center bg-[#09090B] border border-[#232326] rounded-xl h-11 px-3">
            <ArrowUpDown className="h-4 w-4 text-[#A1A1AA] mr-2" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="recently_updated">Recently Updated</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="most_tools">Most Tools</option>
              <option value="most_bookmarked">Popular</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center border border-[#232326] bg-[#09090B] rounded-xl p-1 h-11">
            <button 
              onClick={() => setDensity("compact")} 
              className={`p-2 rounded-lg transition-colors ${density === "compact" ? "bg-[#232326] text-white" : "text-[#A1A1AA]"}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setDensity("comfortable")} 
              className={`p-2 rounded-lg transition-colors ${density === "comfortable" ? "bg-[#232326] text-white" : "text-[#A1A1AA]"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {(selectedCategory || featuredOnly || minTools > 0) && (
        <div className="flex flex-wrap gap-2 items-center mb-6">
          <span className="text-xs text-[#A1A1AA] mr-1">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#232326] text-white">
              Category: {selectedCategory}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
            </span>
          )}
          {featuredOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#232326] text-white">
              ★ Featured First
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFeaturedOnly(false)} />
            </span>
          )}
          {minTools > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#232326] text-white">
              Tools: &ge; {minTools}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setMinTools(0)} />
            </span>
          )}
          <button onClick={clearFilters} className="text-xs font-bold text-white underline decoration-[#A1A1AA] hover:text-red-400 ml-2">
            Clear All
          </button>
        </div>
      )}

      {/* 2. Virtualized Performance Render Stream */}
      <div ref={containerRef} className="w-full flex flex-col gap-px bg-[#18181B]/40 border border-[#232326] rounded-xl overflow-hidden">
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = filteredItems[virtualRow.index];
          if (!item) return null;
          const isExpanded = !!expandedRows[item.id];
          const isBookmarked = bookmarkedIds.has(item.id);

          return (
            <div
              key={item.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={`w-full flex flex-col bg-[#09090B] hover:bg-[#121214] transition-colors border-b border-[#232326]/40 last:border-0 ${
                density === "compact" ? "p-3" : "p-5"
              }`}
            >
              {/* Main Structural Row Flex Layer */}
              <div className="flex items-start md:items-center justify-between gap-4 min-h-[44px]">
                <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                  {/* Creator Identity Block */}
                  <img
                    src={item.creator.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={item.creator.name}
                    className="w-10 h-10 rounded-full border border-[#232326] object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-white text-sm md:text-base tracking-tight truncate max-w-md">
                        {item.name}
                      </h3>
                      {item.isFeatured && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      {item.isCurated && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Curated
                        </span>
                      )}
                    </div>
                    
                    {/* Conditionally reveal parameters based on grid layouts */}
                    {density === "comfortable" && (
                      <p className="text-xs text-[#A1A1AA] line-clamp-1 max-w-2xl mb-1.5">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#71717A]">
                      <span>by <strong className="text-[#E4E4E7]">{item.creator.name}</strong></span>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-white font-medium">{item.toolCount} sub-tools</span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex gap-1.5">
                        {item.categories.map((c, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 bg-[#18181B] rounded text-[#A1A1AA]">
                            {c.categoryName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Deck Interaction Handles */}
                <div className="flex items-center gap-1.5 self-center">
                  <div className="hidden md:flex items-center gap-4 text-xs text-[#71717A] mr-4">
                    <span className="bg-[#18181B] px-2.5 py-1 rounded-md border border-[#232326]">
                      {item._count.relatedModels} Models
                    </span>
                    <span className="bg-[#18181B] px-2.5 py-1 rounded-md border border-[#232326]">
                      {item._count.relatedCompanies} Ops
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#232326] transition-colors ${
                      isBookmarked ? "bg-white text-black border-transparent" : "bg-transparent text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"
                    }`}
                  >
                    <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setActiveShareMenu(activeShareMenu === item.id ? null : item.id)}
                      className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[#232326] text-[#A1A1AA] hover:text-white hover:bg-[#18181B] transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    {activeShareMenu === item.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#09090B] border border-[#232326] rounded-xl shadow-xl z-50 p-1">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/collections/${item.slug}`);
                            setActiveShareMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-[#18181B] transition-colors text-left"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy Link
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-[#18181B] transition-colors text-left">
                          <Twitter className="h-3.5 w-3.5" /> Post to X
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleRowExpand(item.id)}
                    className="p-2.5 md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Meta Box for Tablets/Mobile Viewports */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#232326]/40 md:hidden flex flex-col gap-3 text-xs bg-[#040405] p-3 rounded-lg">
                  <p className="text-[#A1A1AA] leading-relaxed">{item.description}</p>
                  <div className="flex gap-4 font-semibold text-[#E4E4E7]">
                    <span className="bg-[#18181B] px-2 py-1 rounded border border-[#232326]">{item._count.relatedModels} Models</span>
                    <span className="bg-[#18181B] px-2 py-1 rounded border border-[#232326]">{item._count.relatedCompanies} Ecosystems</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="p-4 bg-[#18181B] rounded-full border border-[#232326] mb-4">
              <RotateCcw className="h-6 w-6 text-[#71717A]" />
            </div>
            <h4 className="font-bold text-white mb-1">No collections found</h4>
            <p className="text-sm text-[#71717A] max-w-xs">Try adjusting your query configurations or clear the category parameters.</p>
          </div>
        )}
      </div>

      {/* 3. Sliding Structural Filters Side Drawer Canvas */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-md h-full bg-[#09090B] border-l border-[#232326] p-6 flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#232326] mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Collection Filters
              </h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-[#18181B] rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              {/* Category Segment Selectors */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Domain Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Engineering", "Data Science", "Design", "Productivity"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                      className={`h-10 text-xs px-3 rounded-lg border font-semibold text-left transition-all ${
                        selectedCategory === cat 
                          ? "bg-white text-black border-transparent" 
                          : "bg-[#18181B] border-[#232326] text-[#A1A1AA] hover:border-neutral-500"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Configuration for Tool Thresholds */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Minimum Tools Count</label>
                  <span className="text-xs font-bold text-white bg-[#232326] px-2 py-0.5 rounded">{minTools}+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={minTools}
                  onChange={(e) => setMinTools(Number(e.target.value))}
                  className="w-full h-1 bg-[#232326] rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Toggle Switches */}
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer p-3 bg-[#18181B] rounded-xl border border-[#232326]">
                  <div>
                    <div className="text-xs font-bold text-white">Featured Exclusives</div>
                    <div className="text-[11px] text-[#71717A]">Isolate specialized hand-picked records first</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#232326] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#A1A1AA] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-black relative"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#232326] mt-6 flex gap-3">
              <button 
                onClick={clearFilters}
                className="flex-1 h-11 rounded-xl bg-transparent border border-[#232326] text-xs font-bold hover:bg-[#18181B] transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 h-11 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Status Indicator */}
      {isLoading && (
        <div className="w-full flex justify-center items-center py-6 text-xs text-[#A1A1AA] gap-2">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>Parsing incremental ledger arrays...</span>
        </div>
      )}
    </div>
  );
}