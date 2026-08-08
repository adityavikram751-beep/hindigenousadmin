'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading Hindigenous Admin Panel...</p>
    </div>
  );
}
