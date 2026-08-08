'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Upload, Image as ImageIcon, Loader2, User, FileText, Type } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: any;
  title: string;
  categoryLabel?: string;
}

export const ArticleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  categoryLabel = 'Article',
}: ArticleFormModalProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    authorName: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subTitle: initialData.subTitle || '',
        authorName: initialData.authorName || '',
        description: initialData.description || '',
      });
      setPreviewUrl(initialData.image || null);
    } else {
      setFormData({
        title: '',
        subTitle: '',
        authorName: '',
        description: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Validation Error', 'Title is required', 'error');
      return;
    }
    if (!formData.authorName.trim()) {
      showToast('Validation Error', 'Author name is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subTitle', formData.subTitle);
      data.append('authorName', formData.authorName);
      data.append('description', formData.description);

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      await onSubmit(data);
      onClose();
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || err.message || 'Failed to submit article', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`Manage ${categoryLabel} title, subtitle, author, description, and cover image`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Article Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" /> Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 5000 Years of Vedic Knowledge and Heritage"
              className="w-full bg-[#162138] border border-[#23314d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Subtitle / Tagline
            </label>
            <input
              type="text"
              value={formData.subTitle}
              onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
              placeholder="Brief summary line or subtitle"
              className="w-full bg-[#162138] border border-[#23314d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Author Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" /> Author Name *
            </label>
            <input
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              placeholder="e.g. Acharya Vikrant"
              className="w-full bg-[#162138] border border-[#23314d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Description / Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Description / Article Content
          </label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write complete article details, historical context, or commentary..."
            className="w-full bg-[#162138] border border-[#23314d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors resize-y"
          />
        </div>

        {/* Cover Image Upload Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> Cover Image Upload (Cloudinary)
          </label>

          <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-[#162138]/60 border border-dashed border-[#2b3c5e] rounded-xl">
            {previewUrl ? (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-[#23314d] shrink-0 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-24 rounded-lg border border-dashed border-[#23314d] bg-[#0E1524] flex items-center justify-center text-slate-500 shrink-0">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md">
                <Upload className="w-4 h-4" />
                <span>{selectedFile ? 'Change File' : 'Choose File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400">
                {selectedFile ? selectedFile.name : 'Supports JPG, PNG, WEBP (Max 5MB)'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1E2B45]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#23314d] text-slate-300 hover:bg-[#162138] text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-colors flex items-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Article</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
