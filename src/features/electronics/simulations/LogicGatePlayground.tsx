// src/features/electronics/simulations/LogicGatePlayground.tsx
// Interactive Logic Gate Playground with ANSI SVG symbols & live-highlighted truth tables
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Binary, Cpu } from 'lucide-react';

export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';

export const LogicGatePlayground: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<0 | 1>(0);
  const [inputB, setInputB] = useState<0 | 1>(1);

  // Compute logic function output
  const computeOutput = (gate: GateType, a: 0 | 1, b: 0 | 1): 0 | 1 => {
    switch (gate) {
      case 'AND':
        return a === 1 && b === 1 ? 1 : 0;
      case 'OR':
        return a === 1 || b === 1 ? 1 : 0;
      case 'NOT':
        return a === 1 ? 0 : 1;
      case 'NAND':
        return !(a === 1 && b === 1) ? 1 : 0;
      case 'NOR':
        return !(a === 1 || b === 1) ? 1 : 0;
      case 'XOR':
        return a !== b ? 1 : 0;
    }
  };

  const currentOutput = computeOutput(selectedGate, inputA, inputB);

  // Truth table definitions
  const truthTables: Record<GateType, Array<{ a: 0 | 1; b?: 0 | 1; y: 0 | 1 }>> = {
    AND: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 }
    ],
    OR: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 1 }
    ],
    NOT: [
      { a: 0, y: 1 },
      { a: 1, y: 0 }
    ],
    NAND: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 }
    ],
    NOR: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 0 }
    ],
    XOR: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 }
    ]
  };

  const gateInfo: Record<GateType, { titleJp: string; formula: string; desc: string }> = {
    AND: {
      titleJp: '論理積 (AND回路)',
      formula: 'Y = A · B',
      desc: 'Outputs 1 ONLY when both A and B are 1.'
    },
    OR: {
      titleJp: '論理和 (OR回路)',
      formula: 'Y = A + B',
      desc: 'Outputs 1 when at least one input is 1.'
    },
    NOT: {
      titleJp: '否定 (インバータ)',
      formula: 'Y = ¬A',
      desc: 'Inverts the binary logic level (1 becomes 0, 0 becomes 1).'
    },
    NAND: {
      titleJp: '否定論理積 (NAND回路 - 万能ゲート)',
      formula: 'Y = ¬(A · B)',
      desc: 'Universal gate: Inverted AND, outputs 0 only when both inputs are 1.'
    },
    NOR: {
      titleJp: '否定論理和 (NOR回路 - 万能ゲート)',
      formula: 'Y = ¬(A + B)',
      desc: 'Universal gate: Inverted OR, outputs 1 only when both inputs are 0.'
    },
    XOR: {
      titleJp: '排他的論理和 (XOR回路)',
      formula: 'Y = A ⊕ B',
      desc: 'Outputs 1 when inputs are different; 0 when inputs match.'
    }
  };

  return (
    <div className="space-y-6">
      {/* Gate Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/90 dark:bg-[#0E1526]/90 border border-[#DDD2B8] dark:border-[#253659]">
        {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as GateType[]).map((gate) => (
          <button
            key={gate}
            onClick={() => setSelectedGate(gate)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedGate === gate
                ? 'bg-[#84231D] text-white shadow-sm scale-[1.02]'
                : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-100 dark:hover:bg-[#1A253D]'
            }`}
          >
            {gate}
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] flex items-center justify-between">
        <div>
          <h4 className="text-sm font-serif_jp font-bold text-[#14110F] dark:text-[#F3EBDD]">
            {gateInfo[selectedGate].titleJp}
          </h4>
          <p className="text-xs text-[#6B6358] dark:text-[#94A3B8]">
            {gateInfo[selectedGate].desc}
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-white dark:bg-[#0A101C] border border-[#DDD2B8] dark:border-[#253659] text-[#84231D] dark:text-[#FF8A80]">
          {gateInfo[selectedGate].formula}
        </span>
      </div>

      {/* Interactive Controls & Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Input Switch Toggles */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
            <Binary className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
            Input Logic Switches
          </div>

          {/* Input A Switch */}
          <div className="p-3.5 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD] block">
                Input A
              </span>
              <span className="text-[11px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
                {inputA === 1 ? 'HIGH (+5V)' : 'LOW (0V)'}
              </span>
            </div>
            <button
              onClick={() => setInputA(inputA === 1 ? 0 : 1)}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                inputA === 1
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              {inputA === 1 ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {inputA}
            </button>
          </div>

          {/* Input B Switch (hidden if NOT gate) */}
          {selectedGate !== 'NOT' ? (
            <div className="p-3.5 rounded-xl bg-[#F7F2E8] dark:bg-[#141D33] border border-[#DDD2B8] dark:border-[#253659] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD] block">
                  Input B
                </span>
                <span className="text-[11px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
                  {inputB === 1 ? 'HIGH (+5V)' : 'LOW (0V)'}
                </span>
              </div>
              <button
                onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                  inputB === 1
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {inputB === 1 ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                {inputB}
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-[#141D33]/60 border border-dashed border-[#DDD2B8] dark:border-[#253659] text-xs text-[#6B6358] dark:text-[#94A3B8] text-center font-mono">
              NOT gate takes a single input (Input A).
            </div>
          )}

          {/* Output State Display */}
          <div className="p-4 rounded-xl bg-[#0A101C] border border-[#1E2C48] text-center space-y-1">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
              Output Y Result
            </span>
            <p className={`text-3xl font-bold font-mono ${currentOutput === 1 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-slate-500'}`}>
              {currentOutput}
            </p>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {currentOutput === 1 ? 'Logic HIGH (+5V)' : 'Logic LOW (0V Ground)'}
            </span>
          </div>
        </div>

        {/* ANSI Gate Diagram SVG */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
            <Cpu className="w-4 h-4 text-[#C59B27]" />
            Live ANSI Schematic Symbol
          </div>

          <div className="relative w-full aspect-[4/3] bg-[#0A101C] rounded-xl p-4 flex items-center justify-center border border-[#1E2C48]">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              {/* Input A Line */}
              <line
                x1="30"
                y1={selectedGate === 'NOT' ? '100' : '70'}
                x2="100"
                y2={selectedGate === 'NOT' ? '100' : '70'}
                stroke={inputA === 1 ? '#34D399' : '#475569'}
                strokeWidth="4"
              />
              <text x="25" y={selectedGate === 'NOT' ? '105' : '75'} fill={inputA === 1 ? '#34D399' : '#94A3B8'} fontSize="11" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                A={inputA}
              </text>

              {/* Input B Line (if not NOT) */}
              {selectedGate !== 'NOT' && (
                <>
                  <line
                    x1="30"
                    y1="130"
                    x2="100"
                    y2="130"
                    stroke={inputB === 1 ? '#34D399' : '#475569'}
                    strokeWidth="4"
                  />
                  <text x="25" y="135" fill={inputB === 1 ? '#34D399' : '#94A3B8'} fontSize="11" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                    B={inputB}
                  </text>
                </>
              )}

              {/* Output Y Line */}
              <line
                x1={['NAND', 'NOR', 'NOT'].includes(selectedGate) ? '216' : '200'}
                y1="100"
                x2="270"
                y2="100"
                stroke={currentOutput === 1 ? '#34D399' : '#475569'}
                strokeWidth="4"
              />
              <text x="275" y="105" fill={currentOutput === 1 ? '#34D399' : '#94A3B8'} fontSize="11" fontFamily="monospace" fontWeight="bold">
                Y={currentOutput}
              </text>

              {/* Gate Shapes */}
              {selectedGate === 'AND' && (
                <path
                  d="M100,50 L140,50 A50,50 0 0,1 140,150 L100,150 Z"
                  fill="#1E293B"
                  stroke="#38BDF8"
                  strokeWidth="3"
                />
              )}
              {selectedGate === 'NAND' && (
                <>
                  <path
                    d="M100,50 L140,50 A50,50 0 0,1 140,150 L100,150 Z"
                    fill="#1E293B"
                    stroke="#38BDF8"
                    strokeWidth="3"
                  />
                  <circle cx="205" cy="100" r="7" fill="#0A101C" stroke="#38BDF8" strokeWidth="2.5" />
                </>
              )}
              {selectedGate === 'OR' && (
                <path
                  d="M100,50 Q120,100 100,150 Q160,150 200,100 Q160,50 100,50 Z"
                  fill="#1E293B"
                  stroke="#F59E0B"
                  strokeWidth="3"
                />
              )}
              {selectedGate === 'NOR' && (
                <>
                  <path
                    d="M100,50 Q120,100 100,150 Q160,150 200,100 Q160,50 100,50 Z"
                    fill="#1E293B"
                    stroke="#F59E0B"
                    strokeWidth="3"
                  />
                  <circle cx="209" cy="100" r="7" fill="#0A101C" stroke="#F59E0B" strokeWidth="2.5" />
                </>
              )}
              {selectedGate === 'XOR' && (
                <>
                  <path
                    d="M90,50 Q110,100 90,150"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="3"
                  />
                  <path
                    d="M100,50 Q120,100 100,150 Q160,150 200,100 Q160,50 100,50 Z"
                    fill="#1E293B"
                    stroke="#EC4899"
                    strokeWidth="3"
                  />
                </>
              )}
              {selectedGate === 'NOT' && (
                <>
                  <polygon
                    points="100,60 190,100 100,140"
                    fill="#1E293B"
                    stroke="#A855F7"
                    strokeWidth="3"
                  />
                  <circle cx="201" cy="100" r="7" fill="#0A101C" stroke="#A855F7" strokeWidth="2.5" />
                </>
              )}

              <text x="145" y="105" fill="#E2E8F0" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {selectedGate}
              </text>
            </svg>
          </div>

          <p className="text-[10px] font-mono text-center text-[#6B6358] dark:text-[#94A3B8]">
            Wires illuminate Green (+5V HIGH) or Gray (0V LOW).
          </p>
        </div>

        {/* Live Highlighted Truth Table */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
              真理値表 (Truth Table)
            </span>
            <span className="text-[10px] font-mono text-[#84231D] dark:text-[#FF8A80]">
              Active Row Glowing
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#DDD2B8] dark:border-[#253659]">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#F7F2E8] dark:bg-[#141D33] text-[#6B6358] dark:text-[#94A3B8] border-b border-[#DDD2B8] dark:border-[#253659]">
                <tr>
                  <th className="p-2.5">A</th>
                  {selectedGate !== 'NOT' && <th className="p-2.5">B</th>}
                  <th className="p-2.5 font-bold text-[#84231D] dark:text-[#FF8A80]">Output Y</th>
                </tr>
              </thead>
              <tbody>
                {truthTables[selectedGate].map((row, idx) => {
                  const isActive =
                    selectedGate === 'NOT'
                      ? row.a === inputA
                      : row.a === inputA && row.b === inputB;

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isActive
                          ? 'bg-[#C59B27]/20 dark:bg-[#C59B27]/25 font-bold text-[#14110F] dark:text-white'
                          : 'text-[#6B6358] dark:text-[#94A3B8] hover:bg-stone-50 dark:hover:bg-[#141D33]/40'
                      }`}
                    >
                      <td className="p-2.5 border-b border-stone-200 dark:border-stone-800">
                        {row.a}
                      </td>
                      {selectedGate !== 'NOT' && (
                        <td className="p-2.5 border-b border-stone-200 dark:border-stone-800">
                          {row.b}
                        </td>
                      )}
                      <td className="p-2.5 border-b border-stone-200 dark:border-stone-800">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                            row.y === 1
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {row.y}
                        </span>
                        {isActive && (
                          <span className="ml-2 text-[10px] text-[#84231D] dark:text-[#FF8A80] font-normal">
                            ← Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
