import React, { useState, useMemo } from 'react';
import GlobalHero from '../components/GlobalHero';
import FilterBar from '../components/FilterBar';
import RobotCardGrid from '../components/RobotCardGrid';
import RobotCardList from '../components/RobotCardList';
import CompareDrawer from '../components/CompareDrawer';
import QuickViewModal from '../components/QuickViewModal';
import InquiryModal from '../components/InquiryModal';
import { ROBOTS_DATA } from '../data/robotsData';
import { Bot, RotateCcw, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function RobotsListingPage({
  bookmarks,
  onToggleBookmark,
  onOpenInquiryModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Compare state
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Quick view state
  const [quickViewRobot, setQuickViewRobot] = useState(null);

  // Inquiry modal state
  const [inquiryRobot, setInquiryRobot] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Toggle compare selection (max 3)
  const handleToggleCompare = (robot) => {
    if (selectedForCompare.some((r) => r.id === robot.id)) {
      setSelectedForCompare(selectedForCompare.filter((r) => r.id !== robot.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 robotic systems side-by-side.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, robot]);
    }
  };

  const handleRemoveCompare = (robotId) => {
    setSelectedForCompare(selectedForCompare.filter((r) => r.id !== robotId));
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  const handleOpenInquiryForRobot = (robot) => {
    setInquiryRobot(robot);
    setIsInquiryOpen(true);
  };

  // Filter & Sort Logic
  const filteredRobots = useMemo(() => {
    return ROBOTS_DATA.filter((robot) => {
      // Category filter
      if (selectedCategory !== 'All' && robot.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All Statuses' && robot.status !== selectedStatus) {
        return false;
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = robot.name.toLowerCase().includes(q);
        const matchesMfg = robot.manufacturer.toLowerCase().includes(q);
        const matchesTag = robot.tagLine.toLowerCase().includes(q);
        const matchesCategory = robot.category.toLowerCase().includes(q);
        const matchesCapabilities = robot.capabilities.some((c) => c.toLowerCase().includes(q));
        const matchesSpecs = 
          robot.specs.compute.toLowerCase().includes(q) ||
          robot.specs.actuatorType.toLowerCase().includes(q) ||
          robot.specs.sensors.toLowerCase().includes(q);

        if (!matchesName && !matchesMfg && !matchesTag && !matchesCategory && !matchesCapabilities && !matchesSpecs) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.releaseYear - a.releaseYear;
        case 'payload': {
          const pA = parseFloat(a.specs.payload) || 0;
          const pB = parseFloat(b.specs.payload) || 0;
          return pB - pA;
        }
        case 'price_asc': {
          const prA = parseInt(a.pricing.startingPrice.replace(/[^0-9]/g, '')) || 0;
          const prB = parseInt(b.pricing.startingPrice.replace(/[^0-9]/g, '')) || 0;
          return prA - prB;
        }
        case 'price_desc': {
          const prA = parseInt(a.pricing.startingPrice.replace(/[^0-9]/g, '')) || 0;
          const prB = parseInt(b.pricing.startingPrice.replace(/[^0-9]/g, '')) || 0;
          return prB - prA;
        }
        case 'popularity':
        default:
          return b.reviewsCount - a.reviewsCount;
      }
    });
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All Statuses');
    setSortBy('popularity');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Global Hero with Live Metrics */}
      <GlobalHero
        totalRobots={ROBOTS_DATA.length}
        onQuickCategory={(cat) => setSelectedCategory(cat)}
        onOpenInquiry={() => {
          setInquiryRobot(null);
          setIsInquiryOpen(true);
        }}
      />

      {/* Sticky Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedForCompareCount={selectedForCompare.length}
        onOpenCompare={() => {}}
        totalResults={filteredRobots.length}
        onResetFilters={handleResetFilters}
      />

      {/* Active Filters Tag Bar (if filters active) */}
      {(selectedCategory !== 'All' || selectedStatus !== 'All Statuses' || searchQuery !== '') && (
        <div className="bg-[#0b0b0e] border-b border-[#1C1C1F] py-2 px-4 sm:px-8">
          <div className="mx-auto max-w-[1440px] flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#71717A] font-medium">Active filters:</span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#181820] text-[#E4E4E7] border border-[#272730]">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="text-[#71717A] hover:text-white">×</button>
              </span>
            )}

            {selectedStatus !== 'All Statuses' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#181820] text-[#E4E4E7] border border-[#272730]">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('All Statuses')} className="text-[#71717A] hover:text-white">×</button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#181820] text-[#E4E4E7] border border-[#272730]">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-[#71717A] hover:text-white">×</button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[#6E56CF] hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Main Listing Body */}
      <main className="mx-auto max-w-[1440px] w-full px-3.5 sm:px-8 py-8 sm:py-12 flex-1">
        {filteredRobots.length === 0 ? (
          /* Empty State */
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#16161c] border border-[#272730] flex items-center justify-center text-[#71717A] mb-4">
              <Bot size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">No Robotic Systems Found</h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6">
              No active robots matched your search criteria. Try removing some filters or search for another capability or manufacturer.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E4E4E7] transition-all"
            >
              <RotateCcw size={13} />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredRobots.map((robot) => (
                  <RobotCardGrid
                    key={robot.id}
                    robot={robot}
                    isBookmarked={bookmarks.includes(robot.id)}
                    onToggleBookmark={onToggleBookmark}
                    isSelectedForCompare={selectedForCompare.some((r) => r.id === robot.id)}
                    onToggleCompare={handleToggleCompare}
                    onQuickView={(r) => setQuickViewRobot(r)}
                    onOpenInquiry={handleOpenInquiryForRobot}
                  />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="flex flex-col gap-3">
                {filteredRobots.map((robot) => (
                  <RobotCardList
                    key={robot.id}
                    robot={robot}
                    isBookmarked={bookmarks.includes(robot.id)}
                    onToggleBookmark={onToggleBookmark}
                    isSelectedForCompare={selectedForCompare.some((r) => r.id === robot.id)}
                    onToggleCompare={handleToggleCompare}
                    onQuickView={(r) => setQuickViewRobot(r)}
                    onOpenInquiry={handleOpenInquiryForRobot}
                  />
                ))}
              </div>
            )}

            {/* Enterprise Procurement Banner */}
            <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-[#232326] bg-gradient-to-r from-[#131316] via-[#16161c] to-[#181424] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-[10.5px] uppercase font-bold text-[#A78BFA] tracking-wider mb-1 block">
                  AI Orbit Hardware Consulting
                </span>
                <h4 className="text-xl font-bold text-white mb-2">
                  Procuring Humanoid Fleets for Factory Automation?
                </h4>
                <p className="text-xs sm:text-[13px] text-[#A1A1AA] leading-relaxed">
                  Our physical robotics integration engineers provide end-to-end evaluation, factory floor cycle-time simulation, ROS 2 pipeline auditing, and direct tier-1 manufacturer quoting.
                </p>
              </div>
              <button
                onClick={() => {
                  setInquiryRobot(null);
                  setIsInquiryOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#6E56CF] hover:bg-[#7C66DC] text-white transition-all shadow-lg shadow-[#6E56CF]/25 shrink-0 active:scale-95 cursor-pointer"
              >
                Schedule Engineering Consultation
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Compare Floating Dock & Modal */}
      <CompareDrawer
        selectedRobots={selectedForCompare}
        onRemoveRobot={handleRemoveCompare}
        onClearAll={handleClearCompare}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        robot={quickViewRobot}
        isOpen={!!quickViewRobot}
        onClose={() => setQuickViewRobot(null)}
        onOpenInquiry={handleOpenInquiryForRobot}
      />

      {/* Inquiry / Quote Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        selectedRobot={inquiryRobot}
      />
    </div>
  );
}
