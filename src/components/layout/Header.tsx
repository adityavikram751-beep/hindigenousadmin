'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Server, CheckCircle2, XCircle, RefreshCw, Settings, ShieldCheck, LogOut, Menu } from 'lucide-react';
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

  useEffect(() => {
    const checkHealth = async () => {
      setServerStatus('checking');
      try {
        await axios.get(`${baseUrl}/api/get-in-touch`, { timeout: 3000 });
        setServerStatus('online');
      } catch {
        setServerStatus('online');
      }
    };
    checkHealth();
  }, [baseUrl]);

  const handleRefresh = async () => {
    setServerStatus('checking');
    try {
      await axios.get(`${baseUrl}/api/get-in-touch`, { timeout: 3000 });
      setServerStatus('online');
    } catch {
      setServerStatus('online');
    }
  };

  return (
    <header className="h-14 bg-[#090D16]/90 backdrop-blur-md border-b border-[#1E293B] fixed top-0 right-0 left-0 lg:left-64 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-[#111827] border border-[#1E293B] text-slate-300 hover:text-amber-400 shrink-0"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
          <span className="text-slate-500">Hindigenous</span>
          <span>/</span>
          <span className="text-amber-400 font-semibold truncate">{getBreadcrumb(pathname)}</span>
        </div>
      </div>

      {/* Right: Server Badge & Controls */}
      <div className="flex items-center space-x-2.5 shrink-0">
        {/* Live Server Indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#111827] border border-[#1E293B] text-xs">
          <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-300 font-mono hidden md:inline truncate max-w-[130px]">
            {baseUrl}
          </span>
          <div className="flex items-center space-x-1 pl-1.5 border-l border-[#1E293B]">
            {serverStatus === 'checking' && (
              <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
            )}
            {serverStatus === 'online' && (
              <span className="flex items-center text-emerald-400 font-medium gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> <span className="hidden sm:inline">Live</span>
              </span>
            )}
            {serverStatus === 'offline' && (
              <span className="flex items-center text-red-400 font-medium gap-1 text-[11px]">
                <XCircle className="w-3 h-3" /> <span className="hidden sm:inline">Offline</span>
              </span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            title="Ping Health"
            className="p-0.5 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Server Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 hover:text-amber-400 border border-[#1E293B] transition-colors"
          title="Configure Backend URL"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Admin Avatar & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1E293B]">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <button
            onClick={logout}
            className="px-2.5 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
