'use client';

import React, { useState, useEffect, use } from 'react';
import { categoryArticleApi, CategoryKey } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { ArticleFormModal } from '@/components/forms/ArticleFormModal';
import { Modal } from '@/components/ui/Modal';
import {
  History,
  BookOpen,
  Scroll,
  Palette,
  Landmark,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  User,
  Image as ImageIcon,
  Calendar,
  Filter,
} from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

const CATEGORY_META: Record<string, { title: string; hindi: string; icon: any; color: string }> = {
  history: { title: 'History', hindi: 'इतिहास', icon: History, color: 'text-amber-400' },
  literature: { title: 'Literature', hindi: 'साहित्य', icon: BookOpen, color: 'text-indigo-400' },
  sahitya: { title: 'Sahitya', hindi: 'काव्य', icon: Scroll, color: 'text-emerald-400' },
  art: { title: 'Art', hindi: 'कला', icon: Palette, color: 'text-pink-400' },
  rajpath: { title: 'Rajpath', hindi: 'राजपथ', icon: Landmark, color: 'text-cyan-400' },
};

export default function DynamicCategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const rawCatName = resolvedParams.categoryName.toLowerCase();
  const categoryKey = rawCatName as CategoryKey;
  const meta = CATEGORY_META[rawCatName] || {
    title: rawCatName,
    hindi: '',
    icon: BookOpen,
    color: 'text-amber-400',
  };

  const { showToast } = useToast();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  const fetchCategoryArticles = async () => {
    setLoading(true);
    try {
      let res;
      if (authorFilter.trim()) {
        res = await categoryArticleApi.getByAuthor(categoryKey, authorFilter.trim());
      } else {
        res = await categoryArticleApi.getAll(categoryKey);
      }
      const list = Array.isArray(res) ? res : res?.data || res?.articles || [];
      setArticles(list);
    } catch {
      showToast('Error', `Failed to fetch ${meta.title} articles`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryArticles();
  }, [categoryKey, authorFilter]);

  const handleSubmit = async (formData: FormData) => {
    if (editingItem) {
      await categoryArticleApi.update(categoryKey, editingItem._id || editingItem.id, formData);
      showToast('Updated', `${meta.title} article updated successfully`, 'success');
    } else {
      await categoryArticleApi.create(categoryKey, formData);
      showToast('Published', `New ${meta.title} article created successfully`, 'success');
    }
    fetchCategoryArticles();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${meta.title} article?`)) return;
    try {
      await categoryArticleApi.delete(categoryKey, id);
      showToast('Deleted', `${meta.title} article removed`, 'info');
      fetchCategoryArticles();
    } catch {
      showToast('Error', 'Failed to delete article', 'error');
    }
  };

  const filteredArticles = articles.filter((art) => {
    const q = searchQuery.toLowerCase();
    const title = (art.title || '').toLowerCase();
    const subTitle = (art.subTitle || '').toLowerCase();
    const author = (art.authorName || '').toLowerCase();
    return title.includes(q) || subTitle.includes(q) || author.includes(q);
  });

  const IconComponent = meta.icon;

  return (
    <div className="space-y-6">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2B45]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <IconComponent className={`w-6 h-6 ${meta.color} shrink-0`} />
            <span>Category: {meta.title}</span>
            {meta.hindi && (
              <span className="text-xs font-normal text-amber-400 font-hindi px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
                ({meta.hindi})
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage articles, authors, and Cloudinary media uploads for {meta.title} section
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={fetchCategoryArticles}
            disabled={loading}
            className="px-3.5 py-2 bg-[#131C2E] hover:bg-[#1C2840] border border-[#23314D] text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New {meta.title} Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131C2E] p-4 rounded-2xl border border-[#23314D] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${meta.title} title, subtitle, author...`}
            className="w-full bg-[#162138] border border-[#23314D] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Filter by Author */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Filter className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-3" />
            <input
              type="text"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="Filter by Author Name..."
              className="w-full bg-[#162138] border border-[#23314D] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
          {authorFilter && (
            <button
              onClick={() => setAuthorFilter('')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Articles Table Container */}
      <div className="bg-[#131C2E] rounded-2xl border border-[#23314D] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-sm font-medium">Fetching {meta.title} articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <IconComponent className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No {meta.title} Articles Found</h3>
            <p className="text-xs max-w-sm mx-auto">
              No entries found in the {meta.title} category matching your search.
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsFormModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Publish First Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0E1524] text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-[#1E2B45]">
                <tr>
                  <th className="py-3.5 px-5">Cover</th>
                  <th className="py-3.5 px-5">Title & Subtitle</th>
                  <th className="py-3.5 px-5">Author</th>
                  <th className="py-3.5 px-5">Published Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2B45] text-slate-200">
                {filteredArticles.map((art: any) => (
                  <tr key={art._id || art.id} className="hover:bg-[#162138]/70 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3.5 px-5">
                      <div className="w-14 h-10 rounded-lg overflow-hidden border border-[#23314D] bg-[#0E1524] flex items-center justify-center shrink-0">
                        {art.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={art.image}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-5 max-w-sm">
                      <h4 className="font-bold text-white line-clamp-1">{art.title}</h4>
                      {art.subTitle && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{art.subTitle}</p>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-5 text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        {art.authorName || 'Hindigenous Author'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {art.createdAt ? new Date(art.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewingItem(art)}
                          className="p-1.5 rounded-lg bg-[#23314D] hover:bg-[#32456b] text-slate-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(art);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#162138] hover:bg-[#23314D] text-slate-300 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-indigo-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(art._id || art.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Article Form Modal */}
      <ArticleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingItem}
        title={editingItem ? `Edit ${meta.title} Article` : `Publish New ${meta.title} Article`}
        categoryLabel={`${meta.title} (${meta.hindi})`}
      />

      {/* View Detail Modal */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title={viewingItem.title}
          subtitle={`Author: ${viewingItem.authorName || 'Hindigenous Writer'}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {viewingItem.image && (
              <div className="w-full h-64 rounded-xl overflow-hidden border border-[#23314D] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewingItem.image}
                  alt={viewingItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {viewingItem.subTitle && (
              <h4 className="text-sm font-semibold text-amber-400 italic">
                "{viewingItem.subTitle}"
              </h4>
            )}
            <div className="p-4 bg-[#0E1524] rounded-xl border border-[#23314D] text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {viewingItem.description || 'No description content provided.'}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
