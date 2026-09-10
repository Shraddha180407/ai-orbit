import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import BookmarksModal from './components/BookmarksModal';
import SubmitModal from './components/SubmitModal';

// Official Primary Module: AI Ecosystem Leaderboard
import LeaderboardPage from './pages/LeaderboardPage';
import LeaderboardDetailPage from './pages/LeaderboardDetailPage';
import LeaderboardComparePage from './pages/LeaderboardComparePage';

// Additional Ecosystem Modules
import RobotsListingPage from './pages/RobotsListingPage';
import RobotDetailPage from './pages/RobotDetailPage';
import BusinessPage from './pages/BusinessPage';
import LearnPage from './pages/LearnPage';
import TasksPage from './pages/TasksPage';
import CompaniesPage from './pages/CompaniesPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Leaderboard compare selection state
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Bookmarks state with localStorage persistence
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('orbit_saved_items');
      return saved ? JSON.parse(saved) : ['claude-3-7-sonnet', 'openai-o3-mini'];
    } catch {
      return ['claude-3-7-sonnet', 'openai-o3-mini'];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('orbit_saved_items', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleBookmark = (id) => {
    setBookmarks((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (item) => {
    setSelectedForCompare((prev) => {
      if (prev.some((m) => m.id === item.id)) {
        return prev.filter((m) => m.id !== item.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 models simultaneously.');
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#6E56CF]/30 selection:text-white antialiased overflow-x-hidden">
      <ScrollToTop />

      {/* Main AI Orbit Header with Real Logo */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
      />

      {/* Main Routes */}
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* PRIMARY OFFICIAL MODULE: AI Leaderboard Flow */}
          <Route 
            path="/" 
            element={
              <LeaderboardPage 
                bookmarks={bookmarks} 
                onToggleBookmark={handleToggleBookmark}
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
              />
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <LeaderboardPage 
                bookmarks={bookmarks} 
                onToggleBookmark={handleToggleBookmark}
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
              />
            } 
          />
          <Route 
            path="/leaderboard/:slug" 
            element={
              <LeaderboardDetailPage 
                bookmarks={bookmarks} 
                onToggleBookmark={handleToggleBookmark}
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
              />
            } 
          />
          <Route 
            path="/leaderboard/compare" 
            element={
              <LeaderboardComparePage 
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
              />
            } 
          />

          {/* Secondary Modules */}
          <Route 
            path="/robots" 
            element={
              <RobotsListingPage 
                bookmarks={bookmarks} 
                onToggleBookmark={handleToggleBookmark}
                onOpenInquiryModal={() => setIsSubmitOpen(true)}
              />
            } 
          />
          <Route 
            path="/robots/:slug" 
            element={
              <RobotDetailPage 
                bookmarks={bookmarks} 
                onToggleBookmark={handleToggleBookmark} 
              />
            } 
          />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/companies" element={<CompaniesPage />} />

          {/* Fallback */}
          <Route 
            path="*" 
            element={
              <LeaderboardPage 
                bookmarks={bookmarks} 
                onToggleBookmark={handleToggleBookmark}
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
              />
            } 
          />
        </Routes>
      </div>

      {/* Global AI Orbit Footer with Real Logo */}
      <Footer />

      {/* Overlays & Modals */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedIds={bookmarks}
        onToggleBookmark={handleToggleBookmark}
      />

      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
      />
    </div>
  );
}
