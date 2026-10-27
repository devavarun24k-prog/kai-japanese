// src/features/career/components/DocumentVersionManager.tsx
// Named document version management per job application (Save, Restore, Duplicate, Compare)
import React, { useState } from 'react';
import { History, Copy, Trash2, RotateCcw, Plus, X, GitCompare, Check, AlertCircle } from 'lucide-react';
import { CareerProfile, DocumentVersion } from '../types';
import {
  loadDocumentVersions,
  saveDocumentVersion,
  deleteDocumentVersion,
  duplicateDocumentVersion
} from '../storage';

interface DocumentVersionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: CareerProfile;
  userId?: string;
  onRestoreVersion: (profile: CareerProfile) => void;
}

export const DocumentVersionManager: React.FC<DocumentVersionManagerProps> = ({
  isOpen,
  onClose,
  currentProfile,
  userId,
  onRestoreVersion
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>(() => loadDocumentVersions(userId));
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [comparingVersion, setComparingVersion] = useState<DocumentVersion | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    if (!newVersionName.trim()) return;
    const version: DocumentVersion = {
      id: `ver_${Date.now()}`,
      name: newVersionName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetCompany: targetCompany.trim() || undefined,
      profileSnapshot: JSON.parse(JSON.stringify(currentProfile))
    };
    const updated = saveDocumentVersion(version, userId);
    setVersions(updated);
    setNewVersionName('');
    setTargetCompany('');
    setStatusMsg(`Saved version "${version.name}".`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDuplicate = (id: string, name: string) => {
    const dup = duplicateDocumentVersion(id, `${name} (Copy)`, userId);
    if (dup) {
      setVersions(loadDocumentVersions(userId));
      setStatusMsg(`Duplicated to "${dup.name}".`);
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteDocumentVersion(id, userId);
    setVersions(updated);
    if (comparingVersion?.id === id) setComparingVersion(null);
  };

  const handleRestore = (version: DocumentVersion) => {
    if (window.confirm(`Restore profile from version "${version.name}"? Current edits will be replaced.`)) {
      onRestoreVersion(version.profileSnapshot);
      setStatusMsg(`Restored profile from "${version.name}".`);
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F3EBDD] dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-kai-gold/10 text-kai-gold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif_jp font-bold text-lg text-[#14110F] dark:text-[#F3EBDD]">
                Document Version History
              </h2>
              <p className="text-xs text-[#7A7164] dark:text-[#8B9BB4]">
                Save customized resume & CV versions for each target company.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Save Current Snapshot Form */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] space-y-3">
          <h3 className="text-xs font-bold text-[#14110F] dark:text-[#F3EBDD]">
            Save Current Profile as a Named Version
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newVersionName}
              onChange={e => setNewVersionName(e.target.value)}
              placeholder="e.g. Sony - Embedded Firmware"
              className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-700 text-xs text-[#14110F] dark:text-[#F3EBDD]"
            />
            <input
              type="text"
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              placeholder="Target Company (optional)"
              className="px-3 py-1.5 rounded-lg bg-[#FAF6EE] dark:bg-[#0A101C] border border-stone-200 dark:border-stone-700 text-xs text-[#14110F] dark:text-[#F3EBDD]"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveCurrent}
              disabled={!newVersionName.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-kai-indigo text-white text-xs font-medium hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Save Version Snapshot
            </button>
          </div>
        </div>

        {/* Saved Versions List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#14110F] dark:text-[#F3EBDD]">
            Saved Versions ({versions.length})
          </h3>
          {versions.length === 0 ? (
            <p className="text-xs text-stone-500 italic p-3 rounded-xl bg-white/40 dark:bg-[#10192C]/40 border border-stone-200 dark:border-stone-800 text-center">
              No versions saved yet. Save a snapshot above to preserve custom variations.
            </p>
          ) : (
            <div className="space-y-2">
              {versions.map(v => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-white/80 dark:bg-[#10192C] border border-[#DDD2B8] dark:border-[#203050] flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>{v.name}</span>
                      {v.targetCompany && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {v.targetCompany}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      Created: {new Date(v.createdAt).toLocaleDateString()} • Projects: {v.profileSnapshot.projects.length} • Skills: {v.profileSnapshot.skills.length}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setComparingVersion(comparingVersion?.id === v.id ? null : v)}
                      className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 text-xs flex items-center gap-1"
                    >
                      <GitCompare className="w-3 h-3" />
                      {comparingVersion?.id === v.id ? 'Close Diff' : 'Compare'}
                    </button>
                    <button
                      onClick={() => handleDuplicate(v.id, v.name)}
                      className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
                      title="Duplicate version"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRestore(v)}
                      className="px-2.5 py-1 rounded-lg bg-kai-vermilion text-white font-medium text-xs flex items-center gap-1 hover:opacity-90"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500"
                      title="Delete version"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Version Comparison View */}
        {comparingVersion && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#10192C] border-2 border-kai-indigo dark:border-sky-500/50 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-kai-indigo dark:text-sky-300">
                Comparing Current Active Profile vs. Version: "{comparingVersion.name}"
              </span>
              <button onClick={() => setComparingVersion(null)} className="text-stone-400 text-xs">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-600 dark:text-stone-400">Current Active Profile:</span>
                <p className="text-[11px] mt-1">Skills ({currentProfile.skills.length}): {currentProfile.skills.map(s => s.name).join(', ') || 'None'}</p>
                <p className="text-[11px] mt-1">Projects ({currentProfile.projects.length}): {currentProfile.projects.map(p => p.title).join(', ') || 'None'}</p>
              </div>
              <div className="border-l pl-4 border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-600 dark:text-stone-400">Version "{comparingVersion.name}":</span>
                <p className="text-[11px] mt-1">Skills ({comparingVersion.profileSnapshot.skills.length}): {comparingVersion.profileSnapshot.skills.map(s => s.name).join(', ') || 'None'}</p>
                <p className="text-[11px] mt-1">Projects ({comparingVersion.profileSnapshot.projects.length}): {comparingVersion.profileSnapshot.projects.map(p => p.title).join(', ') || 'None'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
