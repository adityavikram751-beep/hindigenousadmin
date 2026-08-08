'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ServerSettingsModal } from '@/components/ui/ServerSettingsModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#090D16] flex text-slate-100 antialiased">
        {/* Responsive Sidebar (Fixed Desktop, Slide-over Mobile) */}
        <Sidebar
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all">
          {/* Fixed Top Header (h-14) */}
          <Header
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Top Spacer guaranteeing natural clearance below header */}
          <div className="h-16 w-full shrink-0" />

          {/* Page Body Container */}
          <main className="flex-1 px-4 sm:px-6 md:px-8 pb-12 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>

        {/* Global Server Settings Modal */}
        <ServerSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
