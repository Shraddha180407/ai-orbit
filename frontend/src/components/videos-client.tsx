'use client';

import React, { useEffect, useState, useRef } from "react";
import Play from 'lucide-react/dist/esm/icons/play';
import { Video } from "@/lib/types";
import { fetchAllVideos } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideosClient() {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [videos, setVideos] = useState<Video[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', youtubeId: '', authorName: '', toolCategory: 'general-ai', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getVideos = async () => {
    try {
      const data = await fetchAllVideos();
      setVideos(data || []);
    } catch (e: unknown) {
      console.error("Failed to fetch videos:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getVideos();
  }, []);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= videos.length) return;

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
  }, [isLoading, visibleCount, videos.length]);

  const visibleVideos = videos.slice(0, visibleCount);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/videos/${editingId}` : `${API_URL}/api/admin/videos`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save video');
      toast.success(editingId ? 'Video updated successfully' : 'Video added successfully');
      setIsModalOpen(false);
      getVideos();
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/videos/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete video');
      toast.success('Video deleted successfully');
      getVideos();
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', youtubeId: '', authorName: '', toolCategory: 'general-ai', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData({ title: video.title || '', youtubeId: video.youtubeId || '', authorName: video.authorName || '', toolCategory: video.toolCategory || 'general-ai', description: video.description || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Play className="text-[#6E56CF]" />
              Trending AI Videos & Tutorials
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-2">
              Learn and master advanced machine learning concepts, tool tutorials, and model breakdowns.
            </p>
          </div>
          {isAdmin && (
            <Button className="bg-white text-black hover:bg-neutral-200" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Video
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No videos found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleVideos.map((video: Video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_180px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all w-full focus-visible:bg-[#18181C]/40 focus-visible:outline-none"
              >
                {/* Column 1: Play Icon */}
                <div className="h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-red-600/10 border border-red-600/20 flex text-red-500">
                  <Play size={20} className="fill-red-500" />
                </div>

                {/* Column 2: Title + Channel */}
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate group-hover:text-white transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] truncate mt-0.5">by {video.channel}</p>
                </div>

                {/* Column 3: Duration & Views */}
                <div className="text-xs text-[#A1A1AA] font-mono flex flex-col gap-0.5 sm:block hidden">
                  <div>Duration: <strong className="text-white">{video.duration}</strong></div>
                  <div className="text-[10px] text-[#71717A]">{video.views}</div>
                </div>

                {/* Column 4: Published Date */}
                <div className="text-right sm:block hidden">
                  <span className="text-[10px] font-mono text-[#71717A] block">PUBLISHED</span>
                  <span className="text-xs text-white font-medium">{video.publishedAt}</span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-white/5 border border-white/10 hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        openEdit(video);
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
                        if (window.confirm('Are you sure you want to delete this video?')) {
                          handleDelete(video.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </a>
            ))}

            {/* Sentinel for infinite scroll */}
            {videos.length > 0 && visibleCount < videos.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Video' : 'Add Video'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Title *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="Video title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">YouTube ID * (e.g. dQw4w9WgXcQ)</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="YouTube video ID" value={formData.youtubeId} onChange={e => setFormData({...formData, youtubeId: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Author / Channel Name</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. Fireship" value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Tool Category</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="general-ai | llm | agents | robotics | multimodal-ai" value={formData.toolCategory} onChange={e => setFormData({...formData, toolCategory: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Description</label><textarea className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20" placeholder="Short video description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
        </div>
      </Modal>
    </div>
  );
}
