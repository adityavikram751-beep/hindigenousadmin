'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { enquiryApi, homeVideoApi, homeArticleApi, categoryArticleApi, CategoryKey } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { EnquiryDetailModal } from '@/components/forms/EnquiryDetailModal';
import { ArticleFormModal } from '@/components/forms/ArticleFormModal';
import { VideoFormModal } from '@/components/forms/VideoFormModal';
import {
  Inbox,
  Video,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Mail,
  User,
  History,
  BookOpen,
  Scroll,
  Palette,
  Landmark,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enquiriesTotal: 0,
    enquiriesUnread: 0,
    enquiriesRead: 0,
    videosTotal: 0,
    homeArticlesTotal: 0,
    categoryArticlesTotal: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  // Quick Action Modals
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Enquiries
      const enquiriesData = await enquiryApi.getAll().catch(() => []);
      const enqList = Array.isArray(enquiriesData)
        ? enquiriesData
        : enquiriesData?.data || enquiriesData?.enquiries || [];

      const unreadCount = enqList.filter((e: any) => e.status === 'unread' || !e.isRead).length;
      const readCount = enqList.length - unreadCount;

      // 2. Fetch Videos
      const videosData = await homeVideoApi.getAll().catch(() => []);
      const vidList = Array.isArray(videosData)
        ? videosData
        : videosData?.data || videosData?.videos || [];

      // 3. Fetch Home Articles
      const homeArtData = await homeArticleApi.getAll().catch(() => []);
      const homeArtList = Array.isArray(homeArtData)
        ? homeArtData
        : homeArtData?.data || homeArtData?.articles || [];

      // 4. Fetch Category Counts
      const catKeys: CategoryKey[] = ['history', 'literature', 'sahitya', 'art', 'rajpath'];
      let catCount = 0;
      for (const cat of catKeys) {
        const catRes = await categoryArticleApi.getAll(cat).catch(() => []);
        const list = Array.isArray(catRes) ? catRes : catRes?.data || catRes?.articles || [];
        catCount += list.length;
      }

      setStats({
        enquiriesTotal: enqList.length,
        enquiriesUnread: unreadCount,
        enquiriesRead: readCount,
        videosTotal: vidList.length,
        homeArticlesTotal: homeArtList.length,
        categoryArticlesTotal: catCount,
      });

      setRecentEnquiries(enqList.slice(0, 5));
    } catch {
      showToast('Dashboard Sync Warning', 'Could not sync all metrics with backend', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      if (isRead) {
        await enquiryApi.markUnread(id);
      } else {
        await enquiryApi.markRead(id);
      }
      showToast('Status Updated', `Enquiry marked as ${isRead ? 'unread' : 'read'}`, 'success');
      fetchDashboardData();
    } catch {
      showToast('Error', 'Failed to update enquiry status', 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    try {
      await enquiryApi.delete(id);
      showToast('Deleted', 'Enquiry removed successfully', 'info');
      fetchDashboardData();
    } catch {
      showToast('Error', 'Failed to delete enquiry', 'error');
    }
  };

  const handleCreateArticle = async (formData: FormData) => {
    await homeArticleApi.create(formData);
    showToast('Article Created', 'Homepage article added successfully', 'success');
    fetchDashboardData();
  };

  const handleCreateVideo = async (formData: FormData) => {
    await homeVideoApi.create(formData);
    showToast('Video Created', 'Featured homepage video entry added', 'success');
    fetchDashboardData();
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome to Hindigenous Control Center 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time platform overview, visitor enquiries, and cultural content administration
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-amber-400 text-xs font-semibold flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Enquiries Card */}
        <div className="bg-[#131C2E] p-5 rounded-2xl border border-[#23314D] space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Visitor Enquiries
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.enquiriesTotal}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {stats.enquiriesUnread} Unread
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {stats.enquiriesRead} Read
              </span>
            </div>
          </div>
        </div>

        {/* Home Videos Card */}
        <div className="bg-[#131C2E] p-5 rounded-2xl border border-[#23314D] space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Featured Videos
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.videosTotal}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Active homepage video collections
            </p>
          </div>
        </div>

        {/* Home Articles Card */}
        <div className="bg-[#131C2E] p-5 rounded-2xl border border-[#23314D] space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Homepage Articles
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.homeArticlesTotal}
            </div>
            <p className="text-xs text-slate-400 mt-2">Published main landing page stories</p>
          </div>
        </div>

        {/* Categories Total Card */}
        <div className="bg-[#131C2E] p-5 rounded-2xl border border-[#23314D] space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Category Articles
            </span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.categoryArticlesTotal}
            </div>
            <p className="text-xs text-slate-400 mt-2">Across 5 Cultural & Literary categories</p>
          </div>
        </div>
      </div>

      {/* Quick Content Creation Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Quick Actions:
        </h3>
        <button
          onClick={() => setIsArticleModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Homepage Article</span>
        </button>

        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Featured Video Entry</span>
        </button>

        <Link
          href="/dashboard/enquiries"
          className="px-4 py-2 rounded-lg bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-slate-200 text-xs font-bold flex items-center space-x-2 transition-colors ml-auto"
        >
          <span>Manage All Enquiries ({stats.enquiriesTotal})</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>

      {/* Category Modules Overview Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cultural Categories Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'History', hindi: 'इतिहास', icon: History, href: '/dashboard/category/history', color: 'border-amber-500/30 text-amber-400' },
            { title: 'Literature', hindi: 'साहित्य', icon: BookOpen, href: '/dashboard/category/literature', color: 'border-indigo-500/30 text-indigo-400' },
            { title: 'Sahitya', hindi: 'काव्य', icon: Scroll, href: '/dashboard/category/sahitya', color: 'border-emerald-500/30 text-emerald-400' },
            { title: 'Art', hindi: 'कला', icon: Palette, href: '/dashboard/category/art', color: 'border-pink-500/30 text-pink-400' },
            { title: 'Rajpath', hindi: 'राजपथ', icon: Landmark, href: '/dashboard/category/rajpath', color: 'border-cyan-500/30 text-cyan-400' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`p-4 rounded-xl bg-[#131C2E] border ${item.color} hover:bg-[#162138] transition-all flex flex-col items-center justify-center text-center space-y-2 group`}
              >
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 font-hindi">{item.hindi}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Enquiries Table Section */}
      <div className="bg-[#131C2E] rounded-2xl border border-[#23314D] overflow-hidden space-y-4">
        <div className="p-5 border-b border-[#1E2B45] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Inbox className="w-5 h-5 text-amber-400" /> Recent Visitor Enquiries
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest inquiries received from Get In Touch form
            </p>
          </div>
          <Link
            href="/dashboard/enquiries"
            className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
          >
            View All ({stats.enquiriesTotal}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No recent enquiries found.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0E1524] text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-[#1E2B45]">
                <tr>
                  <th className="py-3 px-5">Visitor</th>
                  <th className="py-3 px-5">Contact</th>
                  <th className="py-3 px-5">Message Preview</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2B45] text-slate-200">
                {recentEnquiries.map((item: any) => {
                  const isRead = item.status === 'read' || item.isRead;
                  return (
                    <tr key={item._id || item.id} className="hover:bg-[#162138]/60 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="truncate">{item.name || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-300">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" /> {item.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-400 max-w-xs truncate">
                        {item.description || item.message || 'No description'}
                      </td>
                      <td className="py-3.5 px-5">
                        {isRead ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Read
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                            Unread
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setSelectedEnquiry(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#23314D] hover:bg-[#31446b] text-xs font-semibold text-slate-200 transition-colors"
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <EnquiryDetailModal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          enquiry={selectedEnquiry}
          onToggleRead={handleToggleRead}
          onDelete={handleDeleteEnquiry}
        />
      )}

      {/* Article Creation Modal */}
      <ArticleFormModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSubmit={handleCreateArticle}
        title="Publish New Homepage Article"
        categoryLabel="Homepage Article"
      />

      {/* Video Creation Modal */}
      <VideoFormModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSubmit={handleCreateVideo}
        title="Upload Homepage Video Entry"
      />
    </div>
  );
}
