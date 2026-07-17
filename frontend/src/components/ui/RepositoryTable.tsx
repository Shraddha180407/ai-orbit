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
    <div className="w-full flex flex-col border border-[#232326]/60 rounded-xl bg-[#131316]/10">
      {/* Sticky Table Header */}
      <div className="sticky top-[68px] z-30 bg-[#000000] border-b border-[#232326]/60 px-4 py-3.5 select-none hidden sm:block rounded-t-xl">
        <div className="grid grid-cols-[0.3fr_3fr_1.2fr_1.2fr_0.4fr] md:grid-cols-[0.3fr_2.5fr_1.5fr_1fr_1fr_0.4fr] lg:grid-cols-[0.3fr_2fr_1.2fr_0.8fr_0.8fr_0.8fr_0.6fr_0.3fr] xl:grid-cols-[0.3fr_2.5fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr_0.4fr] gap-4 items-center text-[11px] font-extrabold tracking-wider text-[#71717A]">
          {/* Rank Column Header */}
          <div className="uppercase text-center">
            #
          </div>

          {/* Repository Column Header with Popover */}
          <div className="relative">
            <button
              onClick={onToggleRepoFilter}
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
          <div className="relative hidden md:block">
            <button
              onClick={onToggleCompanyDropdown}
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
            />
          </div>


          {/* Stars Column Header */}
          <button
            onClick={() => onSort("stars")}
            className={`flex items-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none block ${sortField === "stars" ? "text-white" : ""}`}
          >
            STARS
            <ArrowUpDown size={11} className={sortField === "stars" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* Forks Column Header */}
          <button
            onClick={() => onSort("forks")}
            className={`flex items-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none hidden lg:flex ${sortField === "forks" ? "text-white" : ""}`}
          >
            FORKS
            <ArrowUpDown size={11} className={sortField === "forks" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* License Column Header with Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={onToggleLicenseDropdown}
              className={`flex items-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none ${
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
            />
          </div>

          {/* Size Column Header */}
          <button
            onClick={() => onSort("size")}
            className={`flex items-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none hidden xl:flex ${sortField === "size" ? "text-white" : ""}`}
          >
            SIZE
            <ArrowUpDown size={11} className={sortField === "size" ? "text-white" : "text-[#71717A]/75"} />
          </button>

          {/* Updated Column Header (Muted Gray State) */}
          <button
            onClick={() => onSort("updated")}
            className={`flex items-center gap-1 uppercase hover:text-white transition-colors cursor-pointer focus:outline-none block md:hidden lg:flex ${sortField === "updated" ? "text-white" : ""}`}
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
