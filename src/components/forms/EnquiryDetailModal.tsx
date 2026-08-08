'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Mail, Phone, Calendar, CheckCircle2, Clock, Trash2, User, MessageSquare } from 'lucide-react';

interface EnquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: any;
  onToggleRead: (id: string, isRead: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EnquiryDetailModal = ({
  isOpen,
  onClose,
  enquiry,
  onToggleRead,
  onDelete,
}: EnquiryDetailModalProps) => {
  if (!enquiry) return null;

  const isRead = enquiry.status === 'read' || enquiry.isRead;
  const formattedDate = enquiry.createdAt
    ? new Date(enquiry.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'N/A';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Visitor Enquiry Detail"
      subtitle={`Received from ${enquiry.name || 'Anonymous User'}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Status Badge & Actions Header */}
        <div className="flex items-center justify-between p-3.5 bg-[#162138] border border-[#23314d] rounded-xl">
          <div className="flex items-center space-x-2">
            {isRead ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Read
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" /> Unread Enquiry
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> {formattedDate}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleRead(enquiry._id || enquiry.id, isRead)}
              className="px-3 py-1.5 rounded-lg bg-[#23314d] hover:bg-[#2e4063] text-xs font-medium text-slate-200 transition-colors"
            >
              Mark as {isRead ? 'Unread' : 'Read'}
            </button>
            <button
              onClick={() => {
                onDelete(enquiry._id || enquiry.id);
                onClose();
              }}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Delete Enquiry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sender Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-[#162138]/60 border border-[#23314d] rounded-xl flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Full Name
              </span>
              <p className="text-sm font-semibold text-white">{enquiry.name || 'N/A'}</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#162138]/60 border border-[#23314d] rounded-xl flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mail className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </span>
              <p className="text-sm font-semibold text-white truncate">
                <a href={`mailto:${enquiry.email}`} className="hover:underline text-indigo-300">
                  {enquiry.email || 'N/A'}
                </a>
              </p>
            </div>
          </div>

          {enquiry.phoneNumber && (
            <div className="p-3.5 bg-[#162138]/60 border border-[#23314d] rounded-xl flex items-center space-x-3 sm:col-span-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Phone Number
                </span>
                <p className="text-sm font-semibold text-white">
                  <a href={`tel:${enquiry.phoneNumber}`} className="hover:underline text-emerald-300">
                    {enquiry.phoneNumber}
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message / Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Enquiry Message
          </label>
          <div className="p-4 bg-[#0E1524] border border-[#23314d] rounded-xl text-sm text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[100px]">
            {enquiry.description || enquiry.message || 'No description provided.'}
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E2B45]">
          <a
            href={`mailto:${enquiry.email}?subject=Response to your Hindigenous Enquiry`}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            <Mail className="w-3.5 h-3.5" /> Direct Email Reply
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#23314d] hover:bg-[#2e4063] text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
