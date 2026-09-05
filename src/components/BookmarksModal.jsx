import React from 'react';
import { Link } from 'react-router-dom';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import { ROBOTS_DATA } from '../data/robotsData';

export default function BookmarksModal({ isOpen, onClose, bookmarkedIds = [], onToggleBookmark }) {
  if (!isOpen) return null;

  // Search in both leaderboard and robots
  const allItems = [...LEADERBOARD_DATA, ...ROBOTS_DATA];
  const bookmarkedItems = allItems.filter((item) => bookmarkedIds.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-full bg-[#111114] border-l border-[#232326] p-6 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#232326]">
          <div className="flex items-center gap-2">
            <Bookmark size={18} className="text-[#A78BFA] fill-[#A78BFA]/30" />
            <h3 className="font-bold text-base text-white">Saved Items ({bookmarkedItems.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#232326] bg-[#16161a] flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {bookmarkedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#71717A]">
              <Bookmark size={32} className="mb-2 opacity-40" />
              <p className="text-xs">No saved systems yet. Click the bookmark icon on any card or detail page to pin items here.</p>
            </div>
          ) : (
            bookmarkedItems.map((item) => {
              const isLeaderboard = 'arenaElo' in item;
              const linkUrl = isLeaderboard ? `/leaderboard/${item.slug}` : `/robots/${item.slug}`;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#16161c] border border-[#232326] group hover:border-[#3b3b44] transition-colors"
                >
                  <Link
                    to={linkUrl}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#111115] border border-[#232326] flex items-center justify-center font-mono font-bold text-xs text-[#A78BFA] shrink-0">
                      {isLeaderboard ? `#${item.rank}` : 'BOT'}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-white block group-hover:text-[#A78BFA] truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#71717A] block truncate">
                        {isLeaderboard ? `${item.org} • ${item.arenaElo} Elo` : item.manufacturer}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    className="p-1.5 text-[#71717A] hover:text-red-400 transition-colors ml-2 cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {bookmarkedItems.length > 0 && (
          <div className="pt-4 border-t border-[#232326]">
            <Link
              to="/"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#6E56CF] hover:bg-[#7C66DC] text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#6E56CF]/20"
            >
              <span>Back to Leaderboard</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
