'use client';

import React, { useState, useEffect } from 'react';
import { homeVideoApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { VideoFormModal } from '@/components/forms/VideoFormModal';
import { Modal } from '@/components/ui/Modal';
import {
  Video,
  Plus,
  Trash2,
  Edit,
  Play,
  RefreshCw,
  FileVideo,
  Calendar,
} from 'lucide-react';

export default function VideosPage() {
  const { showToast } = useToast();

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Video Preview Player Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await homeVideoApi.getAll();
      const list = Array.isArray(res) ? res : res?.data || res?.videos || [];
      setVideos(list);
    } catch {
      showToast('Error', 'Failed to fetch homepage videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreateSubmit = async (formData: FormData) => {
    if (editingItem) {
      const payload = {
        title: formData.get('title'),
        description: formData.get('description'),
      };
      await homeVideoApi.update(editingItem._id || editingItem.id, payload);
      showToast('Updated', 'Video entry updated successfully', 'success');
    } else {
      await homeVideoApi.create(formData);
      showToast('Created', 'New homepage video entry uploaded successfully', 'success');
    }
    fetchVideos();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video entry?')) return;
    try {
      await homeVideoApi.delete(id);
      showToast('Deleted', 'Video entry deleted', 'info');
      fetchVideos();
    } catch {
      showToast('Error', 'Failed to delete video entry', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Video className="w-6 h-6 text-amber-400 shrink-0" />
            <span>Featured Homepage Videos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload and manage video collections displayed on the Hindigenous home page
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="px-3.5 py-2 bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Video Entry</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center space-y-3 bg-[#131C2E] rounded-2xl border border-[#23314D]">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm font-medium">Loading video collections...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-[#131C2E] rounded-2xl border border-[#23314D]">
          <Video className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Homepage Videos Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Get started by uploading up to 4 featured videos for the home page.
          </p>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Upload First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item: any) => {
            const mediaList = Array.isArray(item.videos)
              ? item.videos
              : item.videoUrl
              ? [item.videoUrl]
              : [];

            return (
              <div
                key={item._id || item.id}
                className="bg-[#131C2E] rounded-2xl border border-[#23314D] overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all shadow-md"
              >
                {/* Media Preview Header */}
                <div className="relative h-48 bg-[#0E1524] border-b border-[#1E2B45] flex items-center justify-center overflow-hidden">
                  {mediaList.length > 0 ? (
                    <div className="relative w-full h-full group/video">
                      {mediaList[0].match(/\.(mp4|webm|mov)$/i) ? (
                        <video
                          src={mediaList[0]}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={mediaList[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-90 group-hover/video:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPreviewVideoUrl(mediaList[0])}
                          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition-transform"
                        >
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 text-[10px] font-mono text-amber-400 rounded-md border border-amber-500/30">
                        {mediaList.length} File{mediaList.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <FileVideo className="w-12 h-12 text-slate-600" />
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2 flex-1">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {item.title || 'Untitled Video Entry'}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3">
                    {item.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-3 bg-[#0E1524]/60 border-t border-[#1E2B45] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'Recently Added'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsFormModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#162138] hover:bg-[#23314D] text-slate-300 transition-colors"
                      title="Edit Entry"
                    >
                      <Edit className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Form Modal */}
      <VideoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleCreateSubmit}
        initialData={editingItem}
        title={editingItem ? 'Edit Video Entry' : 'Upload Featured Video Entry'}
      />

      {/* Video Preview Player Modal */}
      {previewVideoUrl && (
        <Modal
          isOpen={!!previewVideoUrl}
          onClose={() => setPreviewVideoUrl(null)}
          title="Media Preview Player"
          maxWidth="max-w-3xl"
        >
          <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border border-[#23314D]">
            {previewVideoUrl.match(/\.(mp4|webm|mov)$/i) ? (
              <video src={previewVideoUrl} controls autoPlay className="w-full h-full" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={previewVideoUrl} alt="Preview" className="w-full h-full object-contain" />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
