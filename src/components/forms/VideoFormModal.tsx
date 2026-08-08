'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Upload, Video, Loader2, FileVideo, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: any;
  title: string;
}

export const VideoFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: VideoFormModalProps) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
      });
      setSelectedFiles([]);
    } else {
      setFormData({
        title: '',
        description: '',
      });
      setSelectedFiles([]);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 4) {
        showToast('File Limit Exceeded', 'You can upload up to 4 videos/media files', 'warning');
        setSelectedFiles(filesArray.slice(0, 4));
      } else {
        setSelectedFiles(filesArray);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Validation Error', 'Title is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);

      selectedFiles.forEach((file) => {
        data.append('videos', file);
      });

      await onSubmit(data);
      onClose();
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || err.message || 'Failed to save video entry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Upload featured homepage videos (Supports up to 4 media files)"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-amber-400" /> Entry Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Featured Indian Heritage & Culture Showcase"
            className="w-full bg-[#162138] border border-[#23314d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide brief details about this featured video collection..."
            className="w-full bg-[#162138] border border-[#23314d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors resize-y"
          />
        </div>

        {/* File Upload (Up to 4) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Video / Media Files (Max 4)</span>
            <span className="text-amber-400 font-mono text-[11px]">{selectedFiles.length} / 4 Selected</span>
          </label>

          <div className="p-4 bg-[#162138]/60 border border-dashed border-[#2b3c5e] rounded-xl text-center space-y-3">
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20">
              <Upload className="w-4 h-4" />
              <span>Select Videos (Up to 4)</span>
              <input
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-slate-400">
              Supports MP4, WEBM, MOV video files or featured thumbnails
            </p>

            {/* Selected File Badges */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#0E1524] border border-[#23314d] text-xs text-slate-200"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileVideo className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Footer */}
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
                <span>Uploading...</span>
              </>
            ) : (
              <span>Save Entry</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
