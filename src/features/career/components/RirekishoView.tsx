// src/features/career/components/RirekishoView.tsx
// Ministry of Health, Labour and Welfare (MHLW) Standard Japanese 履歴書 (Rirekisho) Layout
// Features: No gender field, 3x4cm photo slot, Japanese Era dates, inline editable fields, A4 print layout
import React, { useState } from 'react';
import { User, HelpCircle, Edit3, Printer, AlertTriangle } from 'lucide-react';
import { CareerProfile } from '../types';
import { convertToJapaneseEra, formatRirekishoDate } from '../utils/eraConverter';

interface RirekishoViewProps {
  profile: CareerProfile;
  onChange?: (updated: CareerProfile) => void;
}

export const RirekishoView: React.FC<RirekishoViewProps> = ({ profile, onChange }) => {
  const [isEditingInPlace, setIsEditingInPlace] = useState<boolean>(false);
  const todayEra = convertToJapaneseEra(new Date().toISOString().slice(0, 10));

  // Compute age from date of birth
  const calculateAge = (dobString: string): number | null => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(profile.personalDetails.dateOfBirth);
  const dobEra = profile.personalDetails.dateOfBirth ? convertToJapaneseEra(profile.personalDetails.dateOfBirth) : null;

  return (
    <div className="space-y-6">
      {/* Top Controls & Conventions Helper */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#EFE8DC] dark:bg-[#0D1526] border border-[#DDD2B8] dark:border-[#223354] print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
            JIS / 厚生労働省様式 履歴書
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-kai-indigo/10 dark:bg-[#203254] text-kai-indigo dark:text-sky-300 font-medium">
            Gender-Free Standard
          </span>
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
            {isEditingInPlace ? 'Editing Mode Active' : 'Enable Quick Inline Edit'}
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

      {/* Conventions Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 print:hidden">
        <HelpCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <span className="font-semibold">Japanese Resume Conventions: </span>
          Dates follow Japanese era (令和/平成/昭和). Academic and work history concludes with right-aligned "以上" (The End). All text can be edited directly before printing or PDF export.
        </div>
      </div>

      {/* A4 Printable Japanese Rirekisho Sheet */}
      <div className="rirekisho-sheet bg-white text-[#14110F] p-8 sm:p-12 rounded-2xl shadow-md border border-stone-300 max-w-4xl mx-auto font-sans leading-normal print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full">
        {/* Title & Date */}
        <div className="flex items-end justify-between border-b-2 border-black pb-2 mb-4">
          <h1 className="text-2xl font-serif_jp font-bold tracking-widest">履　歴　書</h1>
          <div className="text-xs font-serif_jp">
            {todayEra ? todayEra.formattedFull : new Date().toLocaleDateString('ja-JP')} 現在
          </div>
        </div>

        {/* Top Personal Section Grid */}
        <div className="grid grid-cols-4 border-2 border-black divide-x divide-black mb-4">
          {/* Main Info */}
          <div className="col-span-3 divide-y divide-black">
            {/* Furigana */}
            <div className="px-3 py-1 flex items-center gap-4 text-xs">
              <span className="text-[10px] text-stone-500 font-serif_jp">ふりがな</span>
              <span className="font-serif_jp text-sm tracking-wide">
                {profile.personalDetails.fullNameKana || '（未入力）'}
              </span>
            </div>
            {/* Full Name */}
            <div className="px-3 py-2 flex items-center justify-between">
              <div className="text-xl font-serif_jp font-bold">
                {profile.personalDetails.fullNameKanji || profile.personalDetails.fullNameRomaji || '（氏名未入力）'}
              </div>
              {profile.personalDetails.fullNameRomaji && (
                <span className="text-xs text-stone-500 font-mono">
                  {profile.personalDetails.fullNameRomaji}
                </span>
              )}
            </div>
            {/* Date of Birth & Age */}
            <div className="px-3 py-1.5 flex items-center justify-between text-xs font-serif_jp">
              <div>
                生年月日: {dobEra ? dobEra.formattedFull : (profile.personalDetails.dateOfBirth || '—')} 生
              </div>
              <div>（満 {age !== null ? `${age} 歳` : '— 歳'}）</div>
            </div>
            {/* Address */}
            <div className="px-3 py-2 text-xs space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-stone-500 font-serif_jp">
                <span>ふりがな: {profile.personalDetails.addressKana || ''}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-stone-500 font-serif_jp">現住所:</span>
                <div>
                  {profile.personalDetails.postalCode && (
                    <span className="font-mono">〒{profile.personalDetails.postalCode} </span>
                  )}
                  <span className="font-serif_jp">{profile.personalDetails.address || '（住所未入力）'}</span>
                </div>
              </div>
            </div>
            {/* Contact */}
            <div className="px-3 py-1.5 grid grid-cols-2 divide-x divide-black text-xs">
              <div>
                <span className="text-[10px] text-stone-500 font-serif_jp">電話: </span>
                <span className="font-mono">{profile.personalDetails.phone || '—'}</span>
              </div>
              <div className="pl-2">
                <span className="text-[10px] text-stone-500 font-serif_jp">E-mail: </span>
                <span className="font-mono">{profile.personalDetails.email || '—'}</span>
              </div>
            </div>
          </div>

          {/* Photo Slot (3 x 4 cm standard) */}
          <div className="col-span-1 flex flex-col items-center justify-center p-2 text-center bg-stone-50">
            {profile.personalDetails.photoUrl ? (
              <img
                src={profile.personalDetails.photoUrl}
                alt="Resume Photo"
                className="w-24 h-32 object-cover border border-black shadow-sm"
              />
            ) : (
              <div className="w-24 h-32 border border-dashed border-stone-400 flex flex-col items-center justify-center text-[10px] text-stone-400 p-1">
                <User className="w-6 h-6 mb-1 text-stone-300" />
                <span>写　真</span>
                <span>(30mm × 40mm)</span>
              </div>
            )}
          </div>
        </div>

        {/* Academic & Work History Table */}
        <div className="border-2 border-black mb-4">
          <div className="grid grid-cols-12 bg-stone-100 border-b border-black text-xs font-serif_jp font-bold text-center divide-x divide-black py-1">
            <div className="col-span-2">年</div>
            <div className="col-span-1">月</div>
            <div className="col-span-9">学　歴　・　職　歴</div>
          </div>

          <div className="divide-y divide-stone-300 text-xs font-serif_jp min-h-[300px]">
            {/* Header: 学歴 */}
            <div className="grid grid-cols-12 divide-x divide-black py-1 bg-stone-50 font-bold text-center">
              <div className="col-span-2"></div>
              <div className="col-span-1"></div>
              <div className="col-span-9 tracking-widest">学　　歴</div>
            </div>

            {profile.educationHistory.map((edu, idx) => {
              const startEra = edu.startDate ? convertToJapaneseEra(edu.startDate) : null;
              const endEra = edu.endDate ? convertToJapaneseEra(edu.endDate) : null;
              const statusJp =
                edu.status === 'graduated' ? '卒業' :
                edu.status === 'enrolled' ? '在学中' :
                edu.status === 'expected' ? '卒業見込み' : '中途退学';

              return (
                <React.Fragment key={edu.id || idx}>
                  {edu.startDate && (
                    <div className="grid grid-cols-12 divide-x divide-black py-1">
                      <div className="col-span-2 text-center font-mono">{startEra?.formattedYear || ''}</div>
                      <div className="col-span-1 text-center font-mono">{startEra?.month || ''}</div>
                      <div className="col-span-9 px-3">{edu.institution} {edu.faculty ? `${edu.faculty} ` : ''}入学</div>
                    </div>
                  )}
                  {edu.endDate && (
                    <div className="grid grid-cols-12 divide-x divide-black py-1">
                      <div className="col-span-2 text-center font-mono">{endEra?.formattedYear || ''}</div>
                      <div className="col-span-1 text-center font-mono">{endEra?.month || ''}</div>
                      <div className="col-span-9 px-3">{edu.institution} {edu.faculty ? `${edu.faculty} ` : ''}{statusJp}</div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Header: 職歴 */}
            <div className="grid grid-cols-12 divide-x divide-black py-1 bg-stone-50 font-bold text-center border-t border-black">
              <div className="col-span-2"></div>
              <div className="col-span-1"></div>
              <div className="col-span-9 tracking-widest">職　　歴</div>
            </div>

            {profile.workHistory.length === 0 ? (
              <div className="grid grid-cols-12 divide-x divide-black py-1">
                <div className="col-span-2 text-center"></div>
                <div className="col-span-1 text-center"></div>
                <div className="col-span-9 px-3 text-stone-500 italic">なし (なし・プロジェクトベースにて活動)</div>
              </div>
            ) : (
              profile.workHistory.map((work, idx) => {
                const startEra = work.startDate ? convertToJapaneseEra(work.startDate) : null;
                const endEra = work.endDate ? convertToJapaneseEra(work.endDate) : null;
                return (
                  <React.Fragment key={work.id || idx}>
                    <div className="grid grid-cols-12 divide-x divide-black py-1">
                      <div className="col-span-2 text-center font-mono">{startEra?.formattedYear || ''}</div>
                      <div className="col-span-1 text-center font-mono">{startEra?.month || ''}</div>
                      <div className="col-span-9 px-3">{work.companyName} 入社 （{work.role}）</div>
                    </div>
                    {work.isCurrent ? (
                      <div className="grid grid-cols-12 divide-x divide-black py-1">
                        <div className="col-span-2 text-center"></div>
                        <div className="col-span-1 text-center"></div>
                        <div className="col-span-9 px-3">現在に至る</div>
                      </div>
                    ) : work.endDate ? (
                      <div className="grid grid-cols-12 divide-x divide-black py-1">
                        <div className="col-span-2 text-center font-mono">{endEra?.formattedYear || ''}</div>
                        <div className="col-span-1 text-center font-mono">{endEra?.month || ''}</div>
                        <div className="col-span-9 px-3">{work.companyName} 一身上の都合により退職</div>
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })
            )}

            {/* Ending: 以上 */}
            <div className="grid grid-cols-12 divide-x divide-black py-1 font-bold">
              <div className="col-span-2"></div>
              <div className="col-span-1"></div>
              <div className="col-span-9 px-3 text-right">以　上</div>
            </div>
          </div>
        </div>

        {/* Licenses and Certifications (免許・資格) */}
        <div className="border-2 border-black mb-4">
          <div className="grid grid-cols-12 bg-stone-100 border-b border-black text-xs font-serif_jp font-bold text-center divide-x divide-black py-1">
            <div className="col-span-2">年</div>
            <div className="col-span-1">月</div>
            <div className="col-span-9">免　許　・　資　格</div>
          </div>
          <div className="divide-y divide-stone-300 text-xs font-serif_jp">
            {profile.certifications.length === 0 && profile.languages.every(l => !l.jlptLevel) ? (
              <div className="grid grid-cols-12 divide-x divide-black py-1">
                <div className="col-span-2"></div>
                <div className="col-span-1"></div>
                <div className="col-span-9 px-3 text-stone-500">特になし</div>
              </div>
            ) : (
              <>
                {profile.certifications.map((cert, idx) => {
                  const era = cert.dateObtained ? convertToJapaneseEra(cert.dateObtained) : null;
                  return (
                    <div key={cert.id || idx} className="grid grid-cols-12 divide-x divide-black py-1">
                      <div className="col-span-2 text-center font-mono">{era?.formattedYear || ''}</div>
                      <div className="col-span-1 text-center font-mono">{era?.month || ''}</div>
                      <div className="col-span-9 px-3">{cert.name} 取得</div>
                    </div>
                  );
                })}
                {profile.languages.filter(l => l.jlptLevel).map((lang, idx) => (
                  <div key={lang.id || idx} className="grid grid-cols-12 divide-x divide-black py-1">
                    <div className="col-span-2 text-center"></div>
                    <div className="col-span-1 text-center"></div>
                    <div className="col-span-9 px-3">日本語能力試験 ({lang.jlptLevel}) 認定</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Self-PR / Reason for Application */}
        <div className="border-2 border-black mb-4 p-3 text-xs font-serif_jp space-y-2">
          <div className="font-bold border-b border-black pb-1">志望の動機、特技、自己PRなど</div>
          {isEditingInPlace ? (
            <textarea
              rows={4}
              value={profile.selfPR}
              onChange={e => onChange && onChange({ ...profile, selfPR: e.target.value })}
              className="w-full p-2 border border-stone-300 rounded text-xs font-serif_jp"
            />
          ) : (
            <p className="whitespace-pre-line leading-relaxed min-h-[60px]">
              {profile.selfPR || '（自己PRが未入力です）'}
            </p>
          )}
        </div>

        {/* Hopes & Wishes (本人希望記入欄) */}
        <div className="border-2 border-black p-3 text-xs font-serif_jp space-y-1">
          <div className="font-bold border-b border-black pb-1">本人希望記入欄（給与・職種・勤務時間・勤務地等の希望）</div>
          <p className="pt-1">
            {profile.hopesAndWishes || '貴社の規定に従います。'}
          </p>
        </div>
      </div>
    </div>
  );
};
