'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Server, Check, HardDrive, Globe } from 'lucide-react';

interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerSettingsModal = ({ isOpen, onClose }: ServerSettingsModalProps) => {
  const { baseUrl, updateBaseUrl } = useAuth();
  const { showToast } = useToast();
  const [customUrl, setCustomUrl] = useState<string>(baseUrl);

  const presetUrls = [
    { label: 'Local Development Server', url: 'http://localhost:5000', icon: HardDrive },
    { label: 'Production Render Deployment', url: 'https://hindigenousbackend.onrender.com', icon: Globe },
  ];

  const handleSave = (urlToSet?: string) => {
    const finalUrl = (urlToSet || customUrl).trim().replace(/\/$/, '');
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      showToast('Invalid URL', 'Please enter a valid HTTP/HTTPS base URL', 'error');
      return;
    }
    updateBaseUrl(finalUrl);
    setCustomUrl(finalUrl);
    showToast('API Server Updated', `Base URL set to ${finalUrl}`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Backend API Server"
      subtitle="Select or specify the target Express backend URL for API calls"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Preset Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Presets
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {presetUrls.map((preset) => {
              const isSelected = baseUrl === preset.url;
              const Icon = preset.icon;
              return (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => handleSave(preset.url)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-[#162138]/60 border-[#23314d] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{preset.label}</h4>
                      <p className="text-xs font-mono text-slate-400">{preset.url}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-2 pt-2 border-t border-[#1E2B45]">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Custom Base URL
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Server className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="http://localhost:5000"
                className="w-full bg-[#162138] border border-[#23314d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
            <button
              onClick={() => handleSave()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
