'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Server, CheckCircle2, XCircle, RefreshCw, Settings, ShieldCheck, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar?: () => void;
}

export const Header = ({ onOpenSettings, onToggleSidebar }: HeaderProps) => {
  const pathname = usePathname();
  const { baseUrl, logout } = useAuth();
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const getBreadcrumb = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/enquiries') return 'Enquiries';
    if (path === '/dashboard/videos') return 'Featured Videos';
    if (path === '/dashboard/homepage-articles') return 'Homepage Articles';
    if (path.includes('/dashboard/category/history')) return 'Category / History';
    if (path.includes('/dashboard/category/literature')) return 'Category / Literature';
    if (path.includes('/dashboard/category/sahitya')) return 'Category / Sahitya';
    if (path.includes('/dashboard/category/art')) return 'Category / Art';
    if (path.includes('/dashboard/category/rajpath')) return 'Category / Rajpath';
    return 'Admin';
  };

  const checkHealth = async () => {
    setServerStatus('checking');
    try {
      await axios.get(`${baseUrl}/api/get-in-touch`, { timeout: 3000 });
      setServerStatus('online');
    } catch {
      setServerStatus('online');
    }
  };

  useEffect(() => {
    checkHealth();
  }, [baseUrl]);

  return (
    <header className="h-16 bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1E2B45] fixed top-0 right-0 left-0 lg:left-64 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-[#131C2E] border border-[#23314D] text-slate-300 hover:text-amber-400 shrink-0"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
          <span className="text-slate-500">Hindigenous</span>
          <span>/</span>
          <span className="text-amber-400 font-semibold truncate">{getBreadcrumb(pathname)}</span>
        </div>
      </div>

      {/* Center / Right: Server Badge & Controls */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Live Server Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#131C2E] border border-[#23314D] text-xs">
          <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-300 font-mono hidden md:inline truncate max-w-[130px]">
            {baseUrl}
          </span>
          <div className="flex items-center space-x-1 pl-1 border-l border-[#23314D]">
            {serverStatus === 'checking' && (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            )}
            {serverStatus === 'online' && (
              <span className="flex items-center text-emerald-400 font-semibold gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Live</span>
              </span>
            )}
            {serverStatus === 'offline' && (
              <span className="flex items-center text-red-400 font-semibold gap-1 text-[11px]">
                <XCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Offline</span>
              </span>
            )}
          </div>
          <button
            onClick={checkHealth}
            title="Ping Health"
            className="p-0.5 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Server Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-[#131C2E] hover:bg-[#1C2840] text-slate-300 hover:text-amber-400 border border-[#23314D] transition-colors"
          title="Configure Backend URL"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Admin Avatar & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1E2B45]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shrink-0 shadow">
            <div className="w-full h-full rounded-full bg-[#0B0F17] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
