import React from "react";
import ArrowUpDown from "lucide-react/dist/esm/icons/arrow-up-down";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import Filter from "lucide-react/dist/esm/icons/filter";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { RepositoryNameFilterPopover } from "@/components/ui/RepositoryNameFilterPopover";

interface RepositoryTableProps {
  children: React.ReactNode;
  sortField: "stars" | "forks" | "size" | "updated" | null;
  sortOrder: "asc" | "desc";
  onSort: (field: "stars" | "forks" | "size" | "updated") => void;
  selectedLicense: string | null;
  onSelectLicense: (license: string | null) => void;
  licenseCounts: Record<string, number>;
  selectedCompany: string | null;
  onSelectCompany: (company: string | null) => void;
  companyCounts: Record<string, number>;
  totalCount: number;
  isLicenseDropdownOpen: boolean;
  onToggleLicenseDropdown: () => void;
  onCloseLicenseDropdown: () => void;
  isCompanyDropdownOpen: boolean;
  onToggleCompanyDropdown: () => void;
  onCloseCompanyDropdown: () => void;
  activeRepoSearch: string;
  repoSearchQuery: string;
  onChangeRepoSearchQuery: (query: string) => void;
  onApplyRepoSearch: () => void;
  onResetRepoSearch: () => void;
  isRepoFilterOpen: boolean;
  onToggleRepoFilter: () => void;
  onCloseRepoFilter: () => void;
}

export function RepositoryTable({
  children,
  sortField,
  sortOrder,
  onSort,
  selectedLicense,
  onSelectLicense,
  licenseCounts,
  selectedCompany,
  onSelectCompany,
  companyCounts,
  totalCount,
  isLicenseDropdownOpen,
  onToggleLicenseDropdown,
  onCloseLicenseDropdown,
  isCompanyDropdownOpen,
  onToggleCompanyDropdown,
  onCloseCompanyDropdown,
  activeRepoSearch,
  repoSearchQuery,
  onChangeRepoSearchQuery,
  onApplyRepoSearch,
  onResetRepoSearch,
  isRepoFilterOpen,
  onToggleRepoFilter,
  onCloseRepoFilter,
}: RepositoryTableProps) {
  return (
    <div 
      className="w-full flex flex-col border border-[#232326]/60 rounded-xl bg-[#131316]/10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* Sticky Table Header */}
      <div className="sticky top-navbar z-30 bg-[#000000] border-b border-[#232326]/60 px-[9px] py-[12px] h-[48.8px] select-none hidden sm:flex items-center rounded-t-xl">
        <div className="grid grid-cols-[30px_minmax(0,2.5fr)_minmax(0,1.8fr)_minmax(0,1.5fr)_60px] md:grid-cols-[30px_minmax(0,2.2fr)_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] lg:grid-cols-[30px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_60px] xl:grid-cols-[30px_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_60px] gap-[10px] items-center text-[10px] font-semibold tracking-[0.4px] text-[#71717A] w-full">
          {/* Rank Column Header */}
          <div className="uppercase text-center">
            #
          </div>

          {/* Repository Column Header with Popover */}
          <div className="relative text-left">
            <button
              onClick={onToggleRepoFilter}
              aria-haspopup="dialog"
              aria-expanded={isRepoFilterOpen}
              aria-controls="repo-name-filter-popover"
              className={`flex items-center gap-1.5 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none ${
                activeRepoSearch ? "text-white" : ""
              }`}
            >
              REPOSITORY
              <Filter
                size={10}
                className={activeRepoSearch ? "text-white" : "text-[#71717A]/75"}
              />
            </button>
            <RepositoryNameFilterPopover
              isOpen={isRepoFilterOpen}
              onClose={onCloseRepoFilter}
              searchQuery={repoSearchQuery}
              onChangeSearchQuery={onChangeRepoSearchQuery}
              onApply={onApplyRepoSearch}
              onReset={onResetRepoSearch}
            />
          </div>

          {/* Company Column Header with Dropdown */}
          <div className="relative hidden md:block text-left">
            <button
              onClick={onToggleCompanyDropdown}
              aria-haspopup="listbox"
              aria-expanded={isCompanyDropdownOpen}
              aria-controls="company-filter-dropdown"
              className={`flex items-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none ${
                selectedCompany ? "text-white" : ""
              }`}
            >
              COMPANY
              <ChevronDown
                size={11}
                className={selectedCompany ? "text-white" : "text-[#71717A]/75"}
              />
            </button>
            <FilterDropdown
              isOpen={isCompanyDropdownOpen}
              onClose={onCloseCompanyDropdown}
              itemsCounts={companyCounts}
              totalCount={totalCount}
              selectedItem={selectedCompany}
              onSelectItem={onSelectCompany}
              searchPlaceholder="Search companies..."
              allLabel="All companies"
              id="company-filter-dropdown"
            />
          </div>

          {/* Stars Column Header */}
          <button
            onClick={() => onSort("stars")}
            className={`flex items-center justify-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none block w-full ${sortField === "stars" ? "text-white" : ""}`}
          >
            STARS
            <ArrowUpDown size={11} className={sortField === "stars" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* Forks Column Header */}
          <button
            onClick={() => onSort("forks")}
            className={`flex items-center justify-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none hidden lg:flex w-full ${sortField === "forks" ? "text-white" : ""}`}
          >
            FORKS
            <ArrowUpDown size={11} className={sortField === "forks" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* License Column Header with Dropdown */}
          <div className="relative hidden md:flex items-center justify-center">
            <button
              onClick={onToggleLicenseDropdown}
              aria-haspopup="listbox"
              aria-expanded={isLicenseDropdownOpen}
              aria-controls="license-filter-dropdown"
              className={`flex items-center justify-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none ${
                selectedLicense ? "text-white" : ""
              }`}
            >
              LICENSE
              <ChevronDown
                size={11}
                className={selectedLicense ? "text-white" : "text-[#71717A]/75"}
              />
            </button>
            <FilterDropdown
              isOpen={isLicenseDropdownOpen}
              onClose={onCloseLicenseDropdown}
              itemsCounts={licenseCounts}
              totalCount={totalCount}
              selectedItem={selectedLicense}
              onSelectItem={onSelectLicense}
              searchPlaceholder="Search license..."
              allLabel="All Licenses"
              id="license-filter-dropdown"
            />
          </div>

          {/* Size Column Header */}
          <button
            onClick={() => onSort("size")}
            className={`flex items-center justify-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none hidden xl:flex w-full ${sortField === "size" ? "text-white" : ""}`}
          >
            SIZE
            <ArrowUpDown size={11} className={sortField === "size" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* Updated Column Header (Muted Gray State) */}
          <button
            onClick={() => onSort("updated")}
            className={`flex items-center justify-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none block md:hidden lg:flex w-full ${sortField === "updated" ? "text-white" : ""}`}
          >
            UPDATED
            <ArrowUpDown size={11} className={sortField === "updated" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* Action Column Header (Empty) */}
          <div className="block"></div>
        </div>
      </div>






      {/* Table Body / Rows */}
      <div className="flex flex-col divide-y divide-[#232326]/60">
        {children}
      </div>
    </div>
  );
}
