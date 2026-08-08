'use client';

import React, { useState, useEffect } from 'react';
import { enquiryApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { EnquiryDetailModal } from '@/components/forms/EnquiryDetailModal';
import {
  Inbox,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
} from 'lucide-react';

export default function EnquiriesPage() {
  const { showToast } = useToast();

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const res = await enquiryApi.getAll(filter);
      const list = Array.isArray(res) ? res : res?.data || res?.enquiries || [];
      setEnquiries(list);
    } catch {
      showToast('Error', 'Failed to fetch enquiries from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      if (isRead) {
        await enquiryApi.markUnread(id);
      } else {
        await enquiryApi.markRead(id);
      }
      showToast('Success', `Enquiry marked as ${isRead ? 'unread' : 'read'}`, 'success');
      fetchEnquiries();
    } catch {
      showToast('Error', 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await enquiryApi.delete(id);
      showToast('Deleted', 'Enquiry removed successfully', 'info');
      fetchEnquiries();
    } catch {
      showToast('Error', 'Failed to delete enquiry', 'error');
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const q = searchQuery.toLowerCase();
    const name = (e.name || '').toLowerCase();
    const email = (e.email || '').toLowerCase();
    const phone = (e.phoneNumber || '').toLowerCase();
    const desc = (e.description || e.message || '').toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q) || desc.includes(q);
  });

  const unreadCount = enquiries.filter((e) => e.status === 'unread' || !e.isRead).length;
  const readCount = enquiries.length - unreadCount;

  return (
    <div className="space-y-6">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-amber-400 shrink-0" />
            <span>Visitor Enquiries Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review inquiries submitted by visitors via Get In Touch forms
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Enquiries</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#131C2E] p-4 rounded-2xl border border-[#23314D] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-[#0E1524] p-1 rounded-xl border border-[#1E2B45] w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({enquiries.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'unread'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'read'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Read ({readCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full bg-[#162138] border border-[#23314D] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#131C2E] rounded-2xl border border-[#23314D] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-sm font-medium">Fetching enquiries list...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No Enquiries Found</h4>
            <p className="text-xs">No visitor messages match your current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0E1524] text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-[#1E2B45]">
                <tr>
                  <th className="py-3.5 px-5">Visitor Name</th>
                  <th className="py-3.5 px-5">Email & Phone</th>
                  <th className="py-3.5 px-5">Message Preview</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2B45] text-slate-200">
                {filteredEnquiries.map((item: any) => {
                  const isRead = item.status === 'read' || item.isRead;
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr
                      key={item._id || item.id}
                      className={`hover:bg-[#162138]/70 transition-colors ${
                        !isRead ? 'bg-amber-500/[0.03]' : ''
                      }`}
                    >
                      <td className="py-4 px-5 font-semibold text-white">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="truncate max-w-[150px]">{item.name || 'Anonymous'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-xs text-slate-300">
                        <div className="flex flex-col space-y-0.5">
                          <span className="flex items-center gap-1.5 text-indigo-300 font-medium truncate max-w-[180px]">
                            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            {item.email}
                          </span>
                          {item.phoneNumber && (
                            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {item.phoneNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-xs text-slate-300 max-w-xs truncate">
                        {item.description || item.message || 'No message details provided.'}
                      </td>

                      <td className="py-4 px-5 text-xs text-slate-400 font-mono whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {dateStr}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {isRead ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Read
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                            Unread
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedEnquiry(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#23314D] hover:bg-[#32456b] text-xs font-semibold text-white transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleToggleRead(item._id || item.id, isRead)}
                            className="p-1.5 rounded-lg bg-[#162138] hover:bg-[#23314D] text-slate-300 transition-colors"
                            title={isRead ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            {isRead ? (
                              <Clock className="w-4 h-4 text-amber-400" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id || item.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <EnquiryDetailModal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          enquiry={selectedEnquiry}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
