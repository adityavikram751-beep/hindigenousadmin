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
      <div className="min-h-screen bg-[#0B0F17] flex text-slate-100 antialiased">
        {/* Responsive Sidebar (Fixed Desktop, Slide-over Mobile) */}
        <Sidebar
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all">
          {/* Fixed Top Header */}
          <Header
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Page Body Container with generous top spacing */}
          <main className="flex-1 pt-24 sm:pt-28 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
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
