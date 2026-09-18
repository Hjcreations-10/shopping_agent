import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const AdminRAG: React.FC = () => {
  const [chunks, setChunks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Chunk Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [formCategory, setFormCategory] = useState<ProductCategory>('groceries');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formSource, setFormSource] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('');

  // Simulator State
  const [testQuery, setTestQuery] = useState<string>('vegetarian protein for 4 people');
  const [retrievedResults, setRetrievedResults] = useState<any[] | null>(null);
  const [testingRAG, setTestingRAG] = useState<boolean>(false);

  const fetchChunks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/knowledge');
      if (res.ok) {
        const data = await res.json();
        setChunks(data.chunks || []);
      }
    } catch (err) {
      console.error('Failed to fetch knowledge chunks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChunks();
  }, []);

  const handleDeleteChunk = async (id: string) => {
    if (!confirm('Are you sure you want to remove this knowledge chunk?')) return;
    try {
      const res = await fetch(`/api/admin/knowledge/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setChunks(chunks.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete chunk:', err);
    }
  };

  const handleAddChunk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formTitle,
        category: formCategory,
        content: formContent,
        source: formSource || 'Domain Guidelines',
        tags: formTags.split(',').map(s => s.trim())
      };
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormTitle('');
        setFormContent('');
        setFormSource('');
        setFormTags('');
        fetchChunks();
      }
    } catch (err) {
      console.error('Failed to add chunk:', err);
    }
  };

  const handleTestRetrieval = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingRAG(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, category: selectedCategory !== 'all' ? selectedCategory : undefined })
      });
      if (res.ok) {
        const data = await res.json();
        setRetrievedResults(data.relevantChunks || []);
      }
    } catch (err) {
      console.error('Failed test retrieval:', err);
    } finally {
      setTestingRAG(false);
    }
  };

  const filteredChunks = chunks.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">RAG Domain Knowledge Base</h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage chunked nutritional ratios, fabric standards, scalp formulations, and grounded domain knowledge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchChunks}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Chunk</span>
          </button>
        </div>
      </div>

      {/* RAG Simulator Banner */}
      <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Live Retrieval Simulator</h3>
          </div>
          <span className="text-[10px] text-stone-400">RAGEngine.retrieve</span>
        </div>

        <form onSubmit={handleTestRetrieval} className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={e => setTestQuery(e.target.value)}
            placeholder="Test retrieval query..."
            className="flex-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={testingRAG}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:bg-stone-700 cursor-pointer"
          >
            {testingRAG ? 'Searching...' : 'Test Retrieval'}
          </button>
        </form>

        {retrievedResults && (
          <div className="pt-2 border-t border-stone-800 text-xs space-y-2">
            <span className="text-emerald-400 font-semibold block text-[11px]">
              Top Retrieved Grounding Chunks ({retrievedResults.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {retrievedResults.map((r: any) => (
                <div key={r.id} className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700/80">
                  <p className="font-bold text-white text-xs">{r.title}</p>
                  <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'groceries', 'clothing', 'personal_care', 'household', 'electronics'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Knowledge' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chunks by title, text, tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Chunks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChunks.map(chunk => (
          <div key={chunk.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800">
                  {chunk.category}
                </span>
                <button
                  onClick={() => handleDeleteChunk(chunk.id)}
                  className="text-stone-400 hover:text-red-600 p-1 rounded cursor-pointer"
                  title="Delete chunk"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-sm text-stone-900 leading-snug">{chunk.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">{chunk.content}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="flex flex-wrap gap-1">
                {(chunk.tags || []).map((t: string) => (
                  <span key={t} className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 italic">Source: {chunk.source}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Chunk Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Add RAG Knowledge Document</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChunk} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                >
                  <option value="groceries">Groceries</option>
                  <option value="clothing">Clothing</option>
                  <option value="personal_care">Personal Care</option>
                  <option value="household">Household</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICMR Protein Sizing for Vegetarian Households"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Chunk Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Exact nutritional, dimensional or quality guidance rules..."
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Source / Citation</label>
                <input
                  type="text"
                  placeholder="e.g. National Institute of Nutrition (NIN)"
                  value={formSource}
                  onChange={e => setFormSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="nutrition, protein, family-planning"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save Chunk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
