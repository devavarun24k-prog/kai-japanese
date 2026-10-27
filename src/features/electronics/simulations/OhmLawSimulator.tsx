// src/features/electronics/simulations/OhmLawSimulator.tsx
// Interactive Ohm's Law (V = I * R) simulator with animated circuit schematic & live V-I graph
import React, { useState } from 'react';
import { Sliders, Zap, Activity } from 'lucide-react';

export const OhmLawSimulator: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12); // Volts (1 - 24V)
  const [resistance, setResistance] = useState<number>(120); // Ohms (10 - 1000Ω)

  // Calculations
  const current = voltage / resistance; // Amperes
  const currentMA = current * 1000; // Milliamperes
  const power = voltage * current; // Watts

  // Animation speed based on current (lower duration = faster flow)
  const animDuration = Math.max(0.4, Math.min(3, 2.5 / (current * 5 || 0.1)));

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Applied Voltage (V)
          </span>
          <p className="text-2xl font-bold font-mono text-[#84231D] dark:text-[#FF8A80] mt-1">
            {voltage.toFixed(1)} <span className="text-sm font-normal">V</span>
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Circuit Current (I)
          </span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {currentMA >= 1000 ? `${current.toFixed(2)} A` : `${currentMA.toFixed(1)} mA`}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Dissipated Power (P)
          </span>
          <p className="text-2xl font-bold font-mono text-[#C59B27] mt-1">
            {power < 1 ? `${(power * 1000).toFixed(1)} mW` : `${power.toFixed(2)} W`}
          </p>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="p-5 rounded-2xl bg-[#F7F2E8] dark:bg-[#0E1526] border border-[#DDD2B8] dark:border-[#253659] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
          <Sliders className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
          Circuit Parameter Sliders
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Voltage slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#6B6358] dark:text-[#94A3B8]">Voltage Source:</span>
              <span className="font-bold text-[#84231D] dark:text-[#FF8A80]">{voltage} V</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-[#84231D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              <span>1V (Logic/Cell)</span>
              <span>12V (Auto/DC)</span>
              <span>24V (Industrial)</span>
            </div>
          </div>

          {/* Resistance slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#6B6358] dark:text-[#94A3B8]">Resistance Load:</span>
              <span className="font-bold text-[#C59B27]">{resistance} Ω</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={resistance}
              onChange={(e) => setResistance(parseFloat(e.target.value))}
              className="w-full accent-[#C59B27] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              <span>10 Ω (Low load)</span>
              <span>220 Ω (LED limit)</span>
              <span>1000 Ω (1 kΩ)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visualizations: Circuit Schematic + V-I Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Animated Circuit Diagram */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
              <Zap className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
              Live Circuit Schematic
            </div>
            <span className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              Flow rate: {currentMA.toFixed(0)} mA
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-[#0A101C] rounded-xl flex items-center justify-center p-4 overflow-hidden border border-[#1E2C48]">
            <svg viewBox="0 0 320 220" className="w-full h-full">
              {/* Circuit loop path */}
              <rect
                x="40"
                y="30"
                width="240"
                height="160"
                rx="12"
                fill="none"
                stroke="#2E4370"
                strokeWidth="4"
              />

              {/* Animated electron flow along the wire */}
              <rect
                x="40"
                y="30"
                width="240"
                height="160"
                rx="12"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="6 14"
                style={{
                  animation: `dash ${animDuration}s linear infinite`
                }}
              />

              {/* DC Voltage Source (Left vertical leg) */}
              <g transform="translate(40, 110)">
                <circle cx="0" cy="0" r="22" fill="#0A101C" stroke="#84231D" strokeWidth="2.5" />
                {/* Long bar + short bar */}
                <line x1="-12" y1="-7" x2="12" y2="-7" stroke="#FF8A80" strokeWidth="2.5" />
                <line x1="-6" y1="7" x2="6" y2="7" stroke="#FF8A80" strokeWidth="2.5" />
                <text x="-4" y="-12" fill="#FF8A80" fontSize="10" fontFamily="monospace" fontWeight="bold">+</text>
                <text x="-3" y="20" fill="#FF8A80" fontSize="10" fontFamily="monospace" fontWeight="bold">-</text>
                <text x="26" y="4" fill="#E2E8F0" fontSize="11" fontFamily="monospace">
                  {voltage.toFixed(1)}V
                </text>
              </g>

              {/* Resistor (Right vertical leg - zig-zag) */}
              <g transform="translate(280, 110)">
                <rect x="-16" y="-30" width="32" height="60" fill="#0A101C" />
                <polyline
                  points="0,-28 10,-20 -10,-10 10,0 -10,10 10,20 0,28"
                  fill="none"
                  stroke="#C59B27"
                  strokeWidth="3"
                />
                <text x="-80" y="4" fill="#C59B27" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  {resistance}Ω
                </text>
              </g>

              {/* Ammeter indicator (Top horizontal branch) */}
              <g transform="translate(160, 30)">
                <circle cx="0" cy="0" r="14" fill="#0A101C" stroke="#3B82F6" strokeWidth="2" />
                <text x="-4" y="4" fill="#60A5FA" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
                <text x="-20" y="-18" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  {currentMA.toFixed(0)} mA
                </text>
              </g>

              {/* Labels */}
              <text x="160" y="195" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                I = V / R = {voltage.toFixed(1)}V / {resistance}Ω = {current.toFixed(3)}A
              </text>
            </svg>
          </div>

          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -40;
              }
            }
          `}</style>
        </div>

        {/* Live V-I Graph */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
              <Activity className="w-4 h-4 text-[#C59B27]" />
              V-I Characteristic Slope
            </div>
            <span className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              Slope = 1/R (Conductance: {(1 / resistance * 1000).toFixed(2)} mS)
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-[#0A101C] rounded-xl p-4 flex items-center justify-center border border-[#1E2C48]">
            <svg viewBox="0 0 320 220" className="w-full h-full">
              {/* Grid lines */}
              <line x1="40" y1="180" x2="290" y2="180" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="100" x2="290" y2="100" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="165" y1="20" x2="165" y2="180" stroke="#1E293B" strokeDasharray="3 3" />

              {/* Axis labels */}
              <text x="290" y="195" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">
                Voltage V (0 - 24V) →
              </text>
              <text x="35" y="25" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">
                Current I ↑
              </text>

              {/* V-I Slope line: mapped for R */}
              {/* Max X is 24V mapped to 280, 0V mapped to 40 */}
              {/* Max Y is 1.5A mapped to 30, 0A mapped to 180 */}
              {(() => {
                const maxV = 24;
                const maxI = 1.2; // 1.2A full scale
                const xAt24 = 40 + (24 / maxV) * 240;
                const iAt24 = 24 / resistance;
                const yAt24 = 180 - Math.min(150, (iAt24 / maxI) * 150);

                const currentX = 40 + (voltage / maxV) * 240;
                const currentY = 180 - Math.min(150, (current / maxI) * 150);

                return (
                  <>
                    <line
                      x1="40"
                      y1="180"
                      x2={xAt24}
                      y2={yAt24}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    {/* Active operating point */}
                    <circle cx={currentX} cy={currentY} r="6" fill="#FF8A80" stroke="#84231D" strokeWidth="2" />
                    {/* Crosshairs */}
                    <line x1={currentX} y1={currentY} x2={currentX} y2="180" stroke="#FF8A80" strokeDasharray="2 2" />
                    <line x1="40" y1={currentY} x2={currentX} y2={currentY} stroke="#FF8A80" strokeDasharray="2 2" />
                    <text x={currentX + 8} y={currentY - 8} fill="#F3EBDD" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ({voltage.toFixed(1)}V, {currentMA.toFixed(0)}mA)
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
