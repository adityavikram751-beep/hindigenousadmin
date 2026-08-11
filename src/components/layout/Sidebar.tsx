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
  Server,
  X,
  Sparkles,
  Images,
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
    { name: 'Gallery (गैलरी)', href: '/dashboard/gallery', icon: Images },
    { name: 'Homepage Articles', href: '/dashboard/homepage-articles', icon: FileText },
  ];

  const categoriesNav = [
    { name: 'History (इतिहास)', href: '/dashboard/category/history', icon: History },
    { name: 'Literature (साहित्य)', href: '/dashboard/category/literature', icon: BookOpen },
    { name: 'Sahitya (काव्य)', href: '/dashboard/category/sahitya', icon: Scroll },
    { name: 'Art (कला)', href: '/dashboard/category/art', icon: Palette },
    { name: 'Rajpath (राजपथ)', href: '/dashboard/category/rajpath', icon: Landmark },
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
          className="fixed inset-0 bg-[#0B0F17]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`w-64 h-screen bg-[#0E1524] border-r border-[#23314D] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } select-none`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#23314D] flex items-center justify-between">
          <Link href="/dashboard" onClick={handleNavClick} className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight">
                HINDIGENOUS
              </h1>
              <p className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
                Admin Control Panel
              </p>
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
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Main Menu
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
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold shadow-md'
                        : 'text-slate-300 hover:bg-[#162138] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Categories Section */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Cultural Categories
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
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold shadow-md'
                        : 'text-slate-300 hover:bg-[#162138] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer / Server & Admin Control */}
        <div className="p-3 border-t border-[#23314D] space-y-2 bg-[#0B0F17]">
          <button
            onClick={() => {
              onOpenSettings();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-[#162138] transition-colors border border-[#23314D]"
          >
            <div className="flex items-center space-x-2">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>API Server Settings</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shrink-0 shadow">
                <div className="w-full h-full rounded-full bg-[#0B0F17] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white truncate max-w-[100px]">
                  {user?.username || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                  {user?.email || 'admin'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
