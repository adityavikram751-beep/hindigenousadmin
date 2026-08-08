'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading Hindigenous Admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-400" />
        <h2 className="text-lg font-bold text-white">Authentication Required</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          Please sign in with your admin credentials to access this dashboard page.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
