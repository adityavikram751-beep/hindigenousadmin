'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { galleryApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { Modal } from '@/components/ui/Modal';
import {
  Images,
  Plus,
  Trash2,
  Edit,
  Play,
  RefreshCw,
  Search,
  Calendar,
  ExternalLink,
  Video,
  X,
  CheckCircle2,
} from 'lucide-react';

interface GalleryItem {
  _id: string;
  id?: string;
  title: string;
  youtubeUrl: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Utility to parse YouTube Video ID from various link formats
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Utility to get YouTube Thumbnail URL
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
};

// Utility to get YouTube Embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return url;
};

export default function GalleryPage() {
  const { showToast } = useToast();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Video Preview Player Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch all gallery items from API
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getAll();
      const list = Array.isArray(res) ? res : res?.data || res?.items || [];
      setItems(list);
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to fetch gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Open modal for creating new item
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: '', youtubeUrl: '', description: '' });
    setIsFormModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      youtubeUrl: item.youtubeUrl || '',
      description: item.description || '',
    });
    setIsFormModalOpen(true);
  };

  // Submit create or update form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Validation Error', 'Title is required', 'error');
      return;
    }

    if (!formData.youtubeUrl.trim()) {
      showToast('Validation Error', 'YouTube URL is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        const itemId = editingItem._id || editingItem.id || '';
        await galleryApi.update(itemId, {
          title: formData.title.trim(),
          youtubeUrl: formData.youtubeUrl.trim(),
          description: formData.description.trim(),
        });
        showToast('Success', 'Gallery item updated successfully', 'success');
      } else {
        await galleryApi.create({
          title: formData.title.trim(),
          youtubeUrl: formData.youtubeUrl.trim(),
          description: formData.description.trim(),
        });
        showToast('Success', 'New gallery item created successfully', 'success');
      }
      setIsFormModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm delete item
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await galleryApi.delete(deletingId);
      showToast('Deleted', 'Gallery item deleted successfully', 'info');
      fetchGallery();
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || 'Failed to delete gallery item', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const previewVideoId = getYouTubeVideoId(formData.youtubeUrl);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Images className="w-6 h-6 text-amber-400 shrink-0" />
            <span>Gallery Management (गैलरी प्रबंधन)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage public video gallery items, titles, and YouTube links (`/api/gallery`)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={fetchGallery}
            disabled={loading}
            className="px-3.5 py-2 bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Item</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131C2E] p-4 rounded-xl border border-[#23314D]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gallery by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0E1524] border border-[#23314D] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 bg-[#0E1524] border border-[#23314D] rounded-md text-amber-400 font-bold">
            Total Items: {filteredItems.length}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center space-y-3 bg-[#131C2E] rounded-2xl border border-[#23314D]">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm font-medium">Loading gallery items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-[#131C2E] rounded-2xl border border-[#23314D]">
          <Images className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {searchQuery ? 'No Gallery Items Match Your Search' : 'No Gallery Items Found'}
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search query or clear the filter.'
              : 'Get started by creating your first YouTube gallery item.'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add First Gallery Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const thumbnail = getYouTubeThumbnail(item.youtubeUrl);

            return (
              <div
                key={item._id || item.id}
                className="bg-[#131C2E] rounded-2xl border border-[#23314D] overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition-all shadow-md"
              >
                {/* Media Preview / Thumbnail */}
                <div className="relative h-48 bg-[#0E1524] border-b border-[#1E2B45] flex items-center justify-center overflow-hidden">
                  {thumbnail ? (
                    <div className="relative w-full h-full group/video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-90 group-hover/video:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPreviewVideoUrl(item.youtubeUrl)}
                          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition-transform"
                          title="Play YouTube Video"
                        >
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 text-[10px] font-mono text-amber-400 rounded-md border border-amber-500/30 flex items-center gap-1">
                        <Video className="w-3 h-3" /> YouTube
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 p-4 text-center">
                      <Video className="w-10 h-10 text-slate-600" />
                      <span className="text-[11px] font-mono truncate max-w-full px-2">
                        {item.youtubeUrl}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5 flex-1">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline truncate max-w-full"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.youtubeUrl}</span>
                  </a>
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
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg bg-[#162138] hover:bg-[#23314D] text-slate-300 transition-colors"
                      title="Edit Gallery Entry"
                    >
                      <Edit className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item._id || item.id || '')}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Gallery Entry"
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

      {/* Form Modal (Create / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsFormModalOpen(false);
            setEditingItem(null);
          }
        }}
        title={editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Traditional Folk Music Video"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-[#23314D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              YouTube Video URL <span className="text-amber-400">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-[#23314D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Supports standard YouTube links, Shorts, or share URLs (e.g. `youtu.be/xxx`)
            </p>
          </div>

          {/* YouTube Video Preview inside Modal */}
          {previewVideoId && (
            <div className="p-3 bg-[#0B0F17] rounded-xl border border-[#23314D] space-y-2">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Valid YouTube Video Detected
              </span>
              <div className="aspect-video rounded-lg overflow-hidden border border-[#23314D] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${previewVideoId}/hqdefault.jpg`}
                  alt="YouTube Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide brief details about this gallery video..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-[#23314D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E2B45]">
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setIsFormModalOpen(false);
                setEditingItem(null);
              }}
              className="px-4 py-2 bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow transition-colors disabled:opacity-50"
            >
              {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingItem ? 'Save Changes' : 'Create Gallery Item'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <Modal
          isOpen={!!previewVideoUrl}
          onClose={() => setPreviewVideoUrl(null)}
          title="Gallery Video Player"
          maxWidth="max-w-4xl"
        >
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-[#23314D]">
            <iframe
              src={getYouTubeEmbedUrl(previewVideoUrl)}
              title="YouTube video player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Confirm Delete"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this gallery item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Delete Item
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
