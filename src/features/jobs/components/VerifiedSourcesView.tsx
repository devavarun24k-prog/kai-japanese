// src/features/jobs/components/VerifiedSourcesView.tsx
// User-curated official career portals and corporate job boards with 60-day freshness auditing
import React, { useState } from 'react';
import { ShieldCheck, Plus, ExternalLink, Trash2, Calendar, AlertTriangle, HelpCircle, Check } from 'lucide-react';
import { VerifiedSource } from '../types';
import { loadVerifiedSources, saveVerifiedSources, isSourceStale } from '../storage';

interface VerifiedSourcesViewProps {
  userId?: string;
}

export const VerifiedSourcesView: React.FC<VerifiedSourcesViewProps> = ({ userId }) => {
  const [sources, setSources] = useState<VerifiedSource[]>(() => loadVerifiedSources(userId));
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const newSource: VerifiedSource = {
      id: `src_${Date.now()}`,
      name: name.trim(),
      url: url.trim(),
      note: note.trim(),
      lastVerifiedDate: new Date().toISOString().slice(0, 10)
    };

    const updated = [newSource, ...sources];
    setSources(updated);
    saveVerifiedSources(updated, userId);
    setName('');
    setUrl('');
    setNote('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = sources.filter(s => s.id !== id);
    setSources(updated);
    saveVerifiedSources(updated, userId);
  };

  const handleMarkVerifiedToday = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = sources.map(s => (s.id === id ? { ...s, lastVerifiedDate: today } : s));
    setSources(updated);
    saveVerifiedSources(updated, userId);
  };

  return (
    <div className="space-y-6">
      {/* Informational Guidance Banner */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">
                Verified Official Career Sources
              </h2>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">
                Maintain your direct, authentic company career pages. Zero scraping and zero synthetic listings.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-kai-vermilion text-white text-xs font-semibold hover:opacity-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Verified Source
          </button>
        </div>
      </div>

      {/* Add Source Form */}
      {isAdding && (
        <form onSubmit={handleAddSource} className="p-5 rounded-3xl bg-white dark:bg-[#10192C] border border-kai-indigo dark:border-sky-500/50 shadow-md space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-kai-indigo dark:text-sky-300">
            Add Official Employer Career Portal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sony Semiconductor Careers, Hitachi R&D"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-300 dark:border-stone-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Direct Official Careers URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://www.sony-semicon.co.jp/recruit/..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-300 dark:border-stone-700 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Notes / Hiring Cycles</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Shinsotsu autumn intake starts September; mid-career updated weekly"
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-300 dark:border-stone-700 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-kai-indigo text-white text-xs font-semibold hover:opacity-90"
            >
              Save Source
            </button>
          </div>
        </form>
      )}

      {/* Sources List */}
      {sources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/40 dark:bg-[#10192C]/40 border border-stone-200 dark:border-stone-800 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-stone-400" />
          <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">No Verified Career Sources Added Yet</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            KAI avoids scraping external websites against terms of service. You curate your own list of official company career pages. Add the direct hiring URLs of companies you are targeting above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map(src => {
            const stale = isSourceStale(src.lastVerifiedDate, 60);

            return (
              <div
                key={src.id}
                className={`p-4 rounded-2xl bg-white dark:bg-[#10192C] border transition-all space-y-3 ${
                  stale
                    ? 'border-amber-300 dark:border-amber-900/60 shadow-sm'
                    : 'border-[#DDD2B8] dark:border-[#203050]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                      <span>{src.name}</span>
                      {stale && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 font-semibold flex items-center gap-1">
                          <AlertTriangle size={10} />
                          Stale (&gt;60 days)
                        </span>
                      )}
                    </h3>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-kai-indigo dark:text-sky-300 hover:underline flex items-center gap-1 font-mono mt-0.5 line-clamp-1"
                    >
                      {src.url} <ExternalLink size={10} />
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(src.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500"
                    title="Delete source"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {src.note && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-normal">
                    {src.note}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <span className="text-stone-500 font-mono">
                    Last verified: {src.lastVerifiedDate}
                  </span>
                  <button
                    onClick={() => handleMarkVerifiedToday(src.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 text-xs font-medium"
                  >
                    <Check size={12} className="text-emerald-600" />
                    Verify Today
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
