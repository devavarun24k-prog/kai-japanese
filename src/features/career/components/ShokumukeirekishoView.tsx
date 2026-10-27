// src/features/career/components/ShokumukeirekishoView.tsx
// Standard Japanese 職務経歴書 (Shokumukeirekisho) Layout
// Supports both Standard Work-History and Project-Based modes for early career / transitioners
import React, { useState } from 'react';
import { Briefcase, Code, HelpCircle, Edit3, Printer, Layers, Info } from 'lucide-react';
import { CareerProfile } from '../types';
import { convertToJapaneseEra, formatRirekishoDate } from '../utils/eraConverter';

interface ShokumukeirekishoViewProps {
  profile: CareerProfile;
  onChange?: (updated: CareerProfile) => void;
}

export const ShokumukeirekishoView: React.FC<ShokumukeirekishoViewProps> = ({ profile, onChange }) => {
  // If work history is 0 or user prefers projects, default to project-based layout
  const [isProjectBased, setIsProjectBased] = useState<boolean>(profile.workHistory.length === 0);
  const [isEditingInPlace, setIsEditingInPlace] = useState<boolean>(false);
  const todayEra = convertToJapaneseEra(new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-6">
      {/* Top Controls & Layout Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#EFE8DC] dark:bg-[#0D1526] border border-[#DDD2B8] dark:border-[#223354] print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#141D33] p-1 rounded-xl border border-stone-300 dark:border-stone-700">
            <button
              onClick={() => setIsProjectBased(false)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                !isProjectBased
                  ? 'bg-kai-indigo text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Company Work History
            </button>
            <button
              onClick={() => setIsProjectBased(true)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isProjectBased
                  ? 'bg-kai-vermilion text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Project-Based Layout
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingInPlace(!isEditingInPlace)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isEditingInPlace
                ? 'bg-kai-gold text-white border-kai-gold'
                : 'bg-white dark:bg-[#141D33] text-[#544D42] dark:text-[#CBD5E1] border-stone-300 dark:border-stone-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditingInPlace ? 'Editing Mode Active' : 'Inline Edit'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-kai-vermilion text-white shadow-sm hover:opacity-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Mode Advisory Notice */}
      {isProjectBased ? (
        <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2.5 print:hidden">
          <Info className="w-4 h-4 flex-shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
          <div>
            <span className="font-semibold">Project-Based Layout Active: </span>
            Ideal for university students, new graduates, self-taught engineers, and career transitioners with little or no corporate work history. Emphasizes your technical projects, role, technologies, and tangible results.
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 print:hidden">
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold">Standard Corporate Work History: </span>
            Highlights employment timeline, company profile, key duties, and engineering achievements chronologically.
          </div>
        </div>
      )}

      {/* A4 Printable Japanese Shokumukeirekisho Document */}
      <div className="shokumu-sheet bg-white text-[#14110F] p-8 sm:p-12 rounded-2xl shadow-md border border-stone-300 max-w-4xl mx-auto font-sans leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full space-y-6">
        {/* Document Header */}
        <div className="text-right text-xs font-serif_jp text-stone-600 border-b border-stone-200 pb-2">
          <div>{todayEra ? todayEra.formattedFull : new Date().toLocaleDateString('ja-JP')} 現在</div>
          <div className="text-sm font-bold text-black mt-1">
            氏名: {profile.personalDetails.fullNameKanji || profile.personalDetails.fullNameRomaji || '（未入力）'}
          </div>
        </div>

        <div className="text-center py-2">
          <h1 className="text-2xl font-serif_jp font-bold tracking-widest border-b-2 border-black inline-block pb-1">
            職　務　経　歴　書
          </h1>
        </div>

        {/* 1. 職務要約 (Career Summary) */}
        <section className="space-y-2">
          <h2 className="text-sm font-serif_jp font-bold bg-stone-100 px-3 py-1 border-l-4 border-black">
            【職務要約】
          </h2>
          <div className="px-2 text-xs font-serif_jp leading-relaxed">
            {profile.workHistory.length > 0 ? (
              <p>
                これまで{profile.workHistory.map(w => w.companyName).filter(Boolean).join('、')}等にて、
                主に{profile.targetRoles.length > 0 ? profile.targetRoles.join('・') : 'エンジニアリング'}業務に従事。
                {profile.skills.length > 0 && `【${profile.skills.slice(0, 4).map(s => s.name).join('、')}】等を活用し、信頼性の高い実装と課題解決に貢献してまいりました。`}
              </p>
            ) : (
              <p>
                {profile.educationHistory.length > 0 && `${profile.educationHistory[profile.educationHistory.length - 1].institution}にて`}
                {profile.targetRoles.length > 0 ? profile.targetRoles.join('・') : 'ソフトウェア・ハードウェア'}に関する技術習得に注力。
                実践的なプロジェクト開発を通じて、{profile.skills.slice(0, 4).map(s => s.name).join('、')}を用いた実装力と問題解決能力を培ってまいりました。
              </p>
            )}
          </div>
        </section>

        {/* 2. 活かせる経験・知識・技術 (Skills Matrix) */}
        <section className="space-y-2">
          <h2 className="text-sm font-serif_jp font-bold bg-stone-100 px-3 py-1 border-l-4 border-black">
            【活かせる経験・知識・技術】
          </h2>
          <div className="border border-black text-xs font-serif_jp">
            <div className="grid grid-cols-12 bg-stone-100 font-bold border-b border-black divide-x divide-black py-1 px-2 text-center">
              <div className="col-span-5">スキル / 技術</div>
              <div className="col-span-3">習熟度</div>
              <div className="col-span-4">経験内容 / 活用領域</div>
            </div>
            <div className="divide-y divide-stone-300">
              {profile.skills.length === 0 ? (
                <div className="p-3 text-center text-stone-500 italic">スキル未登録</div>
              ) : (
                profile.skills.map((skill, idx) => (
                  <div key={skill.id || idx} className="grid grid-cols-12 divide-x divide-black py-1.5 px-2 items-center">
                    <div className="col-span-5 font-bold">{skill.name}</div>
                    <div className="col-span-3 text-center">
                      {skill.level === 'expert' ? '実務熟練 (Expert)' :
                       skill.level === 'advanced' ? '応用レベル (Advanced)' :
                       skill.level === 'intermediate' ? '実務可能 (Intermediate)' : '基礎習得 (Beginner)'}
                    </div>
                    <div className="col-span-4 text-stone-700 pl-2">
                      {skill.category.toUpperCase()} / プロジェクト実装
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 3. 職務経歴詳細 (Projects or Work History) */}
        <section className="space-y-3">
          <h2 className="text-sm font-serif_jp font-bold bg-stone-100 px-3 py-1 border-l-4 border-black">
            {isProjectBased ? '【プロジェクト開発経歴詳細】' : '【職務経歴詳細】'}
          </h2>

          {isProjectBased ? (
            /* Project-Based Layout */
            <div className="space-y-4">
              {profile.projects.length === 0 ? (
                <p className="text-xs text-stone-500 italic p-2">プロジェクトが登録されていません。</p>
              ) : (
                profile.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="border border-black p-3 space-y-2 text-xs font-serif_jp">
                    <div className="flex items-center justify-between border-b border-black pb-1">
                      <span className="font-bold text-sm">■ {proj.title}</span>
                      <span className="text-stone-600 font-mono">担当役割: {proj.role}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 py-1 bg-stone-50 px-2 rounded">
                      <span className="font-bold text-stone-600">使用技術 / 環境:</span>
                      <span className="col-span-3 font-mono">{proj.tools.join(', ') || '—'}</span>
                    </div>
                    <div>
                      <div className="font-bold text-stone-600 mb-0.5">【開発内容・担当職務】</div>
                      <p className="whitespace-pre-line leading-relaxed pl-2">{proj.whatIDid}</p>
                    </div>
                    {proj.measurableResult && (
                      <div>
                        <div className="font-bold text-stone-600 mb-0.5">【成果・定量的実績】</div>
                        <p className="pl-2 text-stone-800 font-semibold">{proj.measurableResult}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Corporate Work-History Layout */
            <div className="space-y-4">
              {profile.workHistory.map((work, idx) => {
                const startEra = work.startDate ? convertToJapaneseEra(work.startDate) : null;
                const endEra = work.endDate ? convertToJapaneseEra(work.endDate) : null;
                return (
                  <div key={work.id || idx} className="border border-black p-3 space-y-2 text-xs font-serif_jp">
                    <div className="flex items-center justify-between border-b border-black pb-1">
                      <span className="font-bold text-sm">■ {work.companyName}</span>
                      <span className="font-mono text-stone-600">
                        {startEra?.formattedYear} 〜 {work.isCurrent ? '現在に至る' : endEra?.formattedYear}
                      </span>
                    </div>
                    <div className="py-1">
                      <span className="font-bold text-stone-600">役職・職務: </span>
                      <span>{work.role}</span>
                    </div>
                    <div>
                      <div className="font-bold text-stone-600 mb-0.5">【担当業務および成果】</div>
                      <p className="whitespace-pre-line leading-relaxed pl-2">{work.responsibilities}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. 自己PR (Self-PR) */}
        <section className="space-y-2">
          <h2 className="text-sm font-serif_jp font-bold bg-stone-100 px-3 py-1 border-l-4 border-black">
            【自己PR】
          </h2>
          <div className="border border-black p-4 text-xs font-serif_jp leading-relaxed">
            {isEditingInPlace ? (
              <textarea
                rows={4}
                value={profile.selfPR}
                onChange={e => onChange && onChange({ ...profile, selfPR: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded text-xs font-serif_jp"
              />
            ) : (
              <p className="whitespace-pre-line">{profile.selfPR || '（自己PRが未入力です）'}</p>
            )}
          </div>
        </section>

        {/* Document Footer */}
        <div className="text-right text-xs font-serif_jp font-bold pt-4">
          以　上
        </div>
      </div>
    </div>
  );
};
