// src/features/electronics/simulations/RCChargingSimulator.tsx
// Interactive RC Transient Charging Curve simulator (Vc(t) = V0 * (1 - e^(-t / tau)))
import React, { useState } from 'react';
import { Sliders, Clock, BatteryCharging } from 'lucide-react';

export const RCChargingSimulator: React.FC = () => {
  const [resistanceK, setResistanceK] = useState<number>(20); // kΩ (1 - 100 kΩ)
  const [capacitanceU, setCapacitanceU] = useState<number>(100); // μF (10 - 500 μF)
  const [supplyVoltage] = useState<number>(10); // Volts
  const [timeStepNormalized, setTimeStepNormalized] = useState<number>(1.0); // 0 to 5 in units of tau

  // Calculations
  const rOhms = resistanceK * 1000;
  const cFarads = capacitanceU * 1e-6;
  const tauSeconds = rOhms * cFarads; // Time constant tau = R * C (seconds)

  const currentTime = timeStepNormalized * tauSeconds;
  // Vc(t) = V0 * (1 - exp(-t / tau))
  const capacitorVoltage = supplyVoltage * (1 - Math.exp(-timeStepNormalized));
  const currentInstantaneousMA = ((supplyVoltage - capacitorVoltage) / rOhms) * 1000;

  // Percentage charged
  const percentCharged = (capacitorVoltage / supplyVoltage) * 100;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Time Constant (τ = RC)
          </span>
          <p className="text-2xl font-bold font-mono text-[#84231D] dark:text-[#FF8A80] mt-1">
            {tauSeconds >= 1 ? `${tauSeconds.toFixed(2)} s` : `${(tauSeconds * 1000).toFixed(0)} ms`}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Capacitor Voltage Vc(t)
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {capacitorVoltage.toFixed(2)} V
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Instant Current
          </span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {currentInstantaneousMA.toFixed(2)} mA
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-sm text-center">
          <span className="text-[11px] font-mono uppercase text-[#6B6358] dark:text-[#94A3B8]">
            Charge Percentage
          </span>
          <p className="text-2xl font-bold font-mono text-[#C59B27] mt-1">
            {percentCharged.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="p-5 rounded-2xl bg-[#F7F2E8] dark:bg-[#0E1526] border border-[#DDD2B8] dark:border-[#253659] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
          <Sliders className="w-4 h-4 text-[#84231D] dark:text-[#FF8A80]" />
          RC Component Sliders & Time Scrubber
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Resistance slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#6B6358] dark:text-[#94A3B8]">Resistance (R):</span>
              <span className="font-bold text-[#84231D] dark:text-[#FF8A80]">{resistanceK} kΩ</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={resistanceK}
              onChange={(e) => setResistanceK(parseFloat(e.target.value))}
              className="w-full accent-[#84231D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              <span>1 kΩ</span>
              <span>50 kΩ</span>
              <span>100 kΩ</span>
            </div>
          </div>

          {/* Capacitance slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#6B6358] dark:text-[#94A3B8]">Capacitance (C):</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{capacitanceU} μF</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={capacitanceU}
              onChange={(e) => setCapacitanceU(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              <span>10 μF</span>
              <span>250 μF</span>
              <span>500 μF</span>
            </div>
          </div>

          {/* Time Scrubber */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#6B6358] dark:text-[#94A3B8]">Time Elapsed (t):</span>
              <span className="font-bold text-[#C59B27]">{timeStepNormalized.toFixed(2)} τ ({currentTime.toFixed(2)}s)</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.05"
              value={timeStepNormalized}
              onChange={(e) => setTimeStepNormalized(parseFloat(e.target.value))}
              className="w-full accent-[#C59B27] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8]">
              <span>0 (Switch closed)</span>
              <span>1τ (63.2%)</span>
              <span>5τ (99.3% Full)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Charging Curve Visualization */}
      <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-[#DDD2B8] dark:border-[#253659] shadow-washi space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14110F] dark:text-[#F3EBDD]">
            <BatteryCharging className="w-4 h-4 text-emerald-500" />
            Capacitor Voltage Charging Curve (Vc vs. Time)
          </div>
          <span className="text-[10px] font-mono text-[#6B6358] dark:text-[#94A3B8] flex items-center gap-1">
            <Clock className="w-3 h-3" /> τ = {tauSeconds.toFixed(2)} seconds
          </span>
        </div>

        <div className="relative w-full aspect-[2/1] bg-[#0A101C] rounded-xl p-4 flex items-center justify-center border border-[#1E2C48] overflow-hidden">
          <svg viewBox="0 0 600 280" className="w-full h-full">
            {/* Grid & Axis */}
            <line x1="60" y1="230" x2="560" y2="230" stroke="#334155" strokeWidth="1.5" />
            <line x1="60" y1="30" x2="60" y2="230" stroke="#334155" strokeWidth="1.5" />

            {/* 10V Asymptote Line */}
            <line x1="60" y1="50" x2="560" y2="50" stroke="#64748B" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="50" y="54" fill="#94A3B8" fontSize="11" fontFamily="monospace" textAnchor="end">
              10V (V₀)
            </text>

            {/* 63.2% (1 tau) Guide */}
            {(() => {
              const xTau1 = 60 + (1 / 5) * 500; // 160
              const yTau1 = 230 - 0.632 * 180; // 116.24
              const xTau5 = 560;
              const yTau5 = 230 - 0.993 * 180;

              // Generate SVG path points for exponential curve V(t) = 10 * (1 - exp(-t/tau))
              const points: string[] = [];
              for (let t = 0; t <= 5; t += 0.05) {
                const px = 60 + (t / 5) * 500;
                const v = 1 - Math.exp(-t);
                const py = 230 - v * 180;
                points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
              }

              // Active cursor point
              const curX = 60 + (timeStepNormalized / 5) * 500;
              const curY = 230 - (1 - Math.exp(-timeStepNormalized)) * 180;

              return (
                <>
                  {/* Vertical markers for 1tau, 2tau, 3tau, 4tau, 5tau */}
                  {[1, 2, 3, 4, 5].map((k) => (
                    <g key={k}>
                      <line
                        x1={60 + (k / 5) * 500}
                        y1="40"
                        x2={60 + (k / 5) * 500}
                        y2="230"
                        stroke="#1E293B"
                        strokeDasharray="2 4"
                      />
                      <text
                        x={60 + (k / 5) * 500}
                        y="245"
                        fill="#64748B"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {k}τ
                      </text>
                    </g>
                  ))}

                  {/* 1 Tau Horizontal line to 63.2% */}
                  <line x1="60" y1={yTau1} x2={xTau1} y2={yTau1} stroke="#C59B27" strokeDasharray="2 2" strokeWidth="1" />
                  <circle cx={xTau1} cy={yTau1} r="4" fill="#C59B27" />
                  <text x={xTau1 + 6} y={yTau1 - 4} fill="#C59B27" fontSize="10" fontFamily="monospace">
                    1τ: 6.32V (63.2%)
                  </text>

                  {/* 5 Tau Full Charge */}
                  <circle cx={xTau5} cy={yTau5} r="4" fill="#10B981" />
                  <text x={xTau5 - 8} y={yTau5 - 6} fill="#10B981" fontSize="10" fontFamily="monospace" textAnchor="end">
                    5τ: 9.93V (Fully Charged)
                  </text>

                  {/* The Charging Curve line */}
                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    points={points.join(' ')}
                  />

                  {/* Area under curve gradient/fill */}
                  <polygon
                    fill="#10B981"
                    fillOpacity="0.1"
                    points={`60,230 ${points.join(' ')} 560,230`}
                  />

                  {/* Active time scrubber dot & crosshairs */}
                  <line x1={curX} y1="30" x2={curX} y2="230" stroke="#FF8A80" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="60" y1={curY} x2={curX} y2={curY} stroke="#FF8A80" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={curX} cy={curY} r="7" fill="#FF8A80" stroke="#84231D" strokeWidth="2.5" />
                  <text x={curX + 10} y={curY - 10} fill="#F3EBDD" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    t = {currentTime.toFixed(2)}s | Vc = {capacitorVoltage.toFixed(2)}V ({percentCharged.toFixed(0)}%)
                  </text>
                </>
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
};
