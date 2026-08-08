'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Video,
  FileText,
  History,
  BookOpen,
  Scroll,
  Palette,
  Landmark,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Sparkles,
  Server,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  onOpenSettings: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ onOpenSettings, isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries', href: '/dashboard/enquiries', icon: Inbox },
    { name: 'Featured Videos', href: '/dashboard/videos', icon: Video },
    { name: 'Homepage Articles', href: '/dashboard/homepage-articles', icon: FileText },
  ];

  const categoriesNav = [
    { name: 'History (इतिहास)', href: '/dashboard/category/history', icon: History, color: 'text-amber-400' },
    { name: 'Literature (साहित्य)', href: '/dashboard/category/literature', icon: BookOpen, color: 'text-indigo-400' },
    { name: 'Sahitya (काव्य)', href: '/dashboard/category/sahitya', icon: Scroll, color: 'text-emerald-400' },
    { name: 'Art (कला)', href: '/dashboard/category/art', icon: Palette, color: 'text-pink-400' },
    { name: 'Rajpath (राजपथ)', href: '/dashboard/category/rajpath', icon: Landmark, color: 'text-cyan-400' },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`w-64 h-screen bg-[#0D1322] border-r border-[#1E2B45] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } select-none`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1E2B45] flex items-center justify-between">
          <Link href="/dashboard" onClick={handleNavClick} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                HINDIGENOUS
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-amber-400/90 uppercase px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#162138]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Section */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Core Modules
            </p>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-[#162138] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Categories Section */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Categories CMS
            </p>
            <nav className="space-y-1">
              {categoriesNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-[#162138] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer / Server & Admin Control */}
        <div className="p-3 border-t border-[#1E2B45] space-y-2 bg-[#0A0E1A]">
          <button
            onClick={() => {
              onOpenSettings();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-[#162138] transition-colors border border-slate-800"
          >
            <div className="flex items-center space-x-2">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>API Server Settings</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                  {user?.username || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                  {user?.email || 'admin@hindigenous'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
