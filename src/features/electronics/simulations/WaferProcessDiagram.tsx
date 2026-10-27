// src/features/electronics/simulations/WaferProcessDiagram.tsx
// Interactive 8-Step Semiconductor Wafer Process Flow cross-section simulator
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProcessStep {
  stepNumber: number;
  titleJp: string;
  titleEn: string;
  romaji: string;
  description: string;
  keyMetric: string;
  equipmentJa: string;
  color: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: 1,
    titleJp: 'ウェハー製造・インゴット引き上げ',
    titleEn: '1. Ingot Growth & Slicing',
    romaji: 'Uehaa Seizou / Ingotto Hikiage',
    description: 'Ultra-pure molten silicon (99.9999999% purity) is pulled via the Czochralski method to form a cylindrical monocrystal ingot, then sliced into 300mm mirror-polished wafers.',
    keyMetric: '300mm Diameter / <0.5nm Surface Roughness',
    equipmentJa: '引き上げ装置 (Crystal Puller) / ワイヤーソー (Diamond Wire Saw)',
    color: '#94A3B8'
  },
  {
    stepNumber: 2,
    titleJp: '熱酸化膜形成 (SiO₂)',
    titleEn: '2. Thermal Oxidation',
    romaji: 'Netsu Sankamaku Keisei',
    description: 'Wafers enter a high-temperature diffusion furnace (~1,000°C) with pure oxygen gas. A uniform, defect-free silicon dioxide (SiO₂) dielectric film grows on the surface.',
    keyMetric: 'Thickness: 50nm - 200nm / Furnace Temp: 1000°C',
    equipmentJa: '縦型拡散炉 (Vertical Diffusion Furnace)',
    color: '#38BDF8'
  },
  {
    stepNumber: 3,
    titleJp: '写真製版・レジスト塗布 & 露光',
    titleEn: '3. Photolithography (Spin Coat & UV Exposure)',
    romaji: 'Shashin Seihan / Rokou',
    description: 'Light-sensitive photoresist is spin-coated across the wafer. Extreme Ultraviolet (EUV, 13.5nm) light shines through a chrome photomask to print nanometer circuit patterns.',
    keyMetric: 'EUV Wavelength: 13.5nm / Feature Size: sub-3nm',
    equipmentJa: 'EUV露光装置 (ASML EUV Stepper) / コータ・デベロッパ (Coater/Developer)',
    color: '#A855F7'
  },
  {
    stepNumber: 4,
    titleJp: 'ドライエッチング (微細加工)',
    titleEn: '4. Reactive Ion Plasma Etching (RIE)',
    romaji: 'Dorai Ecchingu',
    description: 'High-energy reactive plasma ions vaporize the unprotected SiO₂ areas, carving ultra-steep vertical trenches without undercutting (high anisotropy).',
    keyMetric: 'Selectivity > 30:1 / Aspect Ratio: up to 40:1',
    equipmentJa: 'ICPドライエッチング装置 (Plasma Etcher)',
    color: '#F43F5E'
  },
  {
    stepNumber: 5,
    titleJp: 'イオン注入 & 急速熱処理',
    titleEn: '5. Ion Implantation & Rapid Thermal Annealing',
    romaji: 'Ion Chuunyuu & Nesshori',
    description: 'Accelerated dopant ions (Boron for P-well, Phosphorus/Arsenic for N-well) penetrate into the silicon lattice, followed by flash annealing to repair crystal bonds.',
    keyMetric: 'Beam Energy: 10 keV - 2 MeV / Temp: 1,050°C for 2 sec',
    equipmentJa: 'イオン注入装置 (Ion Implanter) / RTAアニール炉 (Rapid Thermal Annealer)',
    color: '#10B981'
  },
  {
    stepNumber: 6,
    titleJp: '薄膜形成 & 銅配線形成 (CVD/PVD)',
    titleEn: '6. Thin-Film Deposition & Metallization',
    romaji: 'Hakumaku Keisei / Haisen',
    description: 'Chemical Vapor Deposition (CVD) and Physical Vapor Deposition (PVD) lay down alternating nanometer barriers and copper wiring across up to 15 vertical signal routing tiers.',
    keyMetric: '15+ Metal Routing Layers / Dual-Damascene Process',
    equipmentJa: 'CVD成膜装置 / PVDスパッタリング装置 (Sputterer)',
    color: '#F59E0B'
  },
  {
    stepNumber: 7,
    titleJp: '化学機械研磨 (CMP平坦化)',
    titleEn: '7. Chemical Mechanical Planarization (CMP)',
    romaji: 'Kagaku Kikai Kenma / Heitanka',
    description: 'Abrasive chemical slurry and rotating polyurethane pads polish excess copper and dielectric down to an atomically flat plane, ensuring sharp focus for subsequent layers.',
    keyMetric: 'Within-Wafer Non-Uniformity < 2nm',
    equipmentJa: 'CMP研磨装置 (CMP Polisher)',
    color: '#6366F1'
  },
  {
    stepNumber: 8,
    titleJp: 'ウェハー検査・ダイシング・パッケージング',
    titleEn: '8. Probing, Dicing & Packaging',
    romaji: 'Kensa / Daishingu / Pakkeejingu',
    description: 'Microscopic probe needles test every die on the wafer (wafer sort). Diamond saws dice the wafer into bare chips, which are wire-bonded and encapsulated in protective resin.',
    keyMetric: 'Yield Rate (歩留まり) Target: > 95%',
    equipmentJa: 'ウェハープローバ (Wafer Prober) / ダイシングソー / ワイヤーボンダ',
    color: '#EC4899'
  }
];

export const WaferProcessDiagram: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const step = PROCESS_STEPS[currentStepIdx];

  return (
    <div className="space-y-6">
      {/* Step Stepper Navigation Bar */}
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#0E1526]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-[#6B6358] dark:text-[#94A3B8]">
            Fabrication Step {step.stepNumber} of 8
          </span>
          <span className="font-bold text-[#84231D] dark:text-[#FF8A80]">
            {Math.round((step.stepNumber / 8) * 100)}% Through Front-End-of-Line (FEOL)
          </span>
        </div>

        {/* Stepper Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {PROCESS_STEPS.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setCurrentStepIdx(idx)}
              className={`p-2 rounded-xl text-center transition-all ${
                idx === currentStepIdx
                  ? 'bg-[#84231D] text-white shadow-sm font-bold scale-[1.03]'
                  : idx < currentStepIdx
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-medium'
                  : 'bg-stone-100 dark:bg-[#141D33] text-[#6B6358] dark:text-[#94A3B8]'
              }`}
            >
              <div className="text-[10px] font-mono">Step {s.stepNumber}</div>
              <div className="text-[11px] font-serif_jp truncate mt-0.5">
                {s.titleJp.split('・')[0].slice(0, 4)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Wafer Cross-Section Dynamic SVG */}
      <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
            <Layers className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
            Wafer Cross-Section (断面図)
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-[#1A253D] text-[#6B6358] dark:text-[#94A3B8]">
            {step.titleEn}
          </span>
        </div>

        <div className="relative w-full aspect-[2/1] bg-[#0A101C] rounded-xl p-4 flex items-center justify-center border border-[#1E2C48] overflow-hidden">
          <svg viewBox="0 0 540 240" className="w-full h-full">
            {/* Silicon Wafer Substrate Base (constant across all steps) */}
            <rect x="70" y="140" width="400" height="70" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
            <text x="270" y="180" fill="#94A3B8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Silicon Substrate (Si 単結晶基板)
            </text>

            {/* STEP 1: Mirror polished surface reflection */}
            {currentStepIdx === 0 && (
              <g>
                <line x1="80" y1="140" x2="460" y2="140" stroke="#E2E8F0" strokeWidth="3" />
                <text x="270" y="90" fill="#F3EBDD" fontSize="13" fontFamily="monospace" textAnchor="middle">
                  Raw 300mm Monocrystalline Silicon Disc
                </text>
                <text x="270" y="115" fill="#64748B" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Atomic-level flatness prior to thermal processing
                </text>
              </g>
            )}

            {/* STEP 2: Thermal Oxide SiO2 layer */}
            {currentStepIdx === 1 && (
              <g>
                <rect x="70" y="110" width="400" height="30" fill="#0284C7" fillOpacity="0.85" stroke="#38BDF8" strokeWidth="2" />
                <text x="270" y="130" fill="#FFFFFF" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Thermal Oxide Layer (SiO₂ 酸化膜) ~100nm
                </text>
                {/* Heat glow arrows */}
                {[120, 200, 280, 360, 440].map((x) => (
                  <line key={x} x1={x} y1="60" x2={x} y2="100" stroke="#FF8A80" strokeWidth="2" strokeDasharray="3 3" />
                ))}
                <text x="270" y="50" fill="#FF8A80" fontSize="11" fontFamily="monospace" textAnchor="middle">
                  High-Temperature Oxygen Furnace (1,000°C)
                </text>
              </g>
            )}

            {/* STEP 3: Photoresist & UV Exposure */}
            {currentStepIdx === 2 && (
              <g>
                <rect x="70" y="110" width="400" height="30" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                {/* Photoresist coat */}
                <rect x="70" y="80" width="400" height="30" fill="#7E22CE" fillOpacity="0.8" stroke="#A855F7" strokeWidth="1.5" />
                <text x="270" y="100" fill="#FFFFFF" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Photoresist (感光レジスト)
                </text>
                {/* Photomask floating above */}
                <rect x="130" y="30" width="60" height="10" fill="#E2E8F0" />
                <rect x="250" y="30" width="60" height="10" fill="#E2E8F0" />
                <rect x="370" y="30" width="60" height="10" fill="#E2E8F0" />
                <text x="270" y="22" fill="#E2E8F0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Chrome Photomask Reticle (露光マスク)
                </text>
                {/* UV light rays */}
                <line x1="100" y1="40" x2="100" y2="80" stroke="#C084FC" strokeWidth="3" />
                <line x1="220" y1="40" x2="220" y2="80" stroke="#C084FC" strokeWidth="3" />
                <line x1="340" y1="40" x2="340" y2="80" stroke="#C084FC" strokeWidth="3" />
              </g>
            )}

            {/* STEP 4: Plasma Etched Trenches */}
            {currentStepIdx === 3 && (
              <g>
                {/* Patterned oxide blocks */}
                <rect x="70" y="110" width="80" height="30" fill="#0284C7" stroke="#38BDF8" />
                <rect x="210" y="110" width="80" height="30" fill="#0284C7" stroke="#38BDF8" />
                <rect x="350" y="110" width="120" height="30" fill="#0284C7" stroke="#38BDF8" />
                {/* Etched trenches */}
                <text x="175" y="130" fill="#F43F5E" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Etched Trench
                </text>
                <text x="315" y="130" fill="#F43F5E" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Etched Trench
                </text>
                {/* Plasma ions raining down */}
                {[175, 315].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="50" x2={x} y2="105" stroke="#F43F5E" strokeWidth="2.5" strokeDasharray="4 4" />
                    <polygon points={`${x-4},105 ${x+4},105 ${x},112`} fill="#F43F5E" />
                  </g>
                ))}
                <text x="270" y="40" fill="#F43F5E" fontSize="11" fontFamily="monospace" textAnchor="middle">
                  CF₄ Reactive Plasma Ions (ドライエッチング)
                </text>
              </g>
            )}

            {/* STEP 5: Ion Implantation & Doped Wells */}
            {currentStepIdx === 4 && (
              <g>
                {/* Doped wells in silicon */}
                <rect x="140" y="140" width="80" height="35" rx="6" fill="#059669" fillOpacity="0.8" stroke="#10B981" strokeWidth="2" />
                <text x="180" y="162" fill="#FFFFFF" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  N-Well (P⁺)
                </text>
                <rect x="290" y="140" width="80" height="35" rx="6" fill="#D97706" fillOpacity="0.8" stroke="#F59E0B" strokeWidth="2" />
                <text x="330" y="162" fill="#FFFFFF" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  P-Well (B⁻)
                </text>
                {/* Ion beam rays */}
                {[160, 180, 200, 310, 330, 350].map((x) => (
                  <line key={x} x1={x} y1="50" x2={x} y2="135" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                ))}
                <text x="270" y="35" fill="#10B981" fontSize="11" fontFamily="monospace" textAnchor="middle">
                  High-Energy Dopant Ion Beam (100 keV)
                </text>
              </g>
            )}

            {/* STEP 6: Multi-layer Copper Interconnects */}
            {currentStepIdx === 5 && (
              <g>
                {/* Dielectric inter-layer */}
                <rect x="70" y="60" width="400" height="80" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                {/* Copper wires (orange lines) */}
                <line x1="90" y1="80" x2="230" y2="80" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                <line x1="280" y1="80" x2="450" y2="80" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                <line x1="140" y1="110" x2="380" y2="110" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                {/* Vertical Vias */}
                <line x1="160" y1="80" x2="160" y2="140" stroke="#F59E0B" strokeWidth="4" />
                <line x1="330" y1="80" x2="330" y2="140" stroke="#F59E0B" strokeWidth="4" />
                <text x="270" y="50" fill="#F59E0B" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Multi-tier Copper Dual-Damascene Wiring (銅多層配線)
                </text>
              </g>
            )}

            {/* STEP 7: CMP Planarization */}
            {currentStepIdx === 6 && (
              <g>
                {/* Flattened top surface */}
                <rect x="70" y="80" width="400" height="60" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
                <line x1="70" y1="80" x2="470" y2="80" stroke="#E2E8F0" strokeWidth="3" />
                {/* CMP Polishing head */}
                <rect x="180" y="30" width="180" height="40" rx="4" fill="#4338CA" stroke="#818CF8" strokeWidth="2" />
                <text x="270" y="55" fill="#FFFFFF" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  CMP Rotating Polishing Pad
                </text>
                {/* Slurry droplets */}
                <circle cx="210" cy="75" r="3" fill="#818CF8" />
                <circle cx="270" cy="75" r="3" fill="#818CF8" />
                <circle cx="330" cy="75" r="3" fill="#818CF8" />
                <text x="270" y="115" fill="#E2E8F0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Chemical Slurry buffing wafer to optical flatness
                </text>
              </g>
            )}

            {/* STEP 8: Packaging & Probing */}
            {currentStepIdx === 7 && (
              <g>
                {/* Black Epoxy Package casing */}
                <rect x="120" y="50" width="300" height="90" rx="8" fill="#111827" stroke="#EC4899" strokeWidth="2.5" />
                {/* Silicon die inside */}
                <rect x="180" y="75" width="180" height="40" fill="#334155" stroke="#94A3B8" />
                <text x="270" y="99" fill="#F3EBDD" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Silicon Die (半導体チップ)
                </text>
                {/* External pins */}
                {[150, 190, 230, 270, 310, 350, 390].map((x) => (
                  <line key={x} x1={x} y1="140" x2={x} y2="160" stroke="#C59B27" strokeWidth="4" />
                ))}
                <text x="270" y="35" fill="#EC4899" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Packaged Integrated Circuit (QFP / BGA Package)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Detailed Technical Card */}
      <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E7DECE] dark:border-[#1E2C48]">
          <div>
            <h3 className="text-xl font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
              {step.titleJp}
            </h3>
            <p className="text-xs font-mono text-[#84231D] dark:text-[#FF8A80]">
              {step.titleEn} · {step.romaji}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#C59B27]/15 text-[#C59B27] border border-[#C59B27]/30">
            {step.keyMetric}
          </span>
        </div>

        <p className="text-xs text-[#6B6358] dark:text-[#94A3B8] leading-relaxed">
          {step.description}
        </p>

        <div className="p-3 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
            <span className="font-mono text-[#14110F] dark:text-[#F3EBDD]">
              Fab Equipment (製造装置): <strong>{step.equipmentJa}</strong>
            </span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD2B8] dark:border-[#253659] text-xs font-mono disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-[#1A253D]"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>
          <span className="text-xs font-mono text-[#6B6358] dark:text-[#94A3B8]">
            {currentStepIdx + 1} / {PROCESS_STEPS.length}
          </span>
          <button
            disabled={currentStepIdx === PROCESS_STEPS.length - 1}
            onClick={() => setCurrentStepIdx((prev) => Math.min(PROCESS_STEPS.length - 1, prev + 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84231D] text-white text-xs font-semibold shadow-sm disabled:opacity-30 hover:bg-[#6e1c17]"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
