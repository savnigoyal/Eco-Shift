import { useState, useEffect } from 'react';
import { Sparkles, Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import { CarbonInputData } from '../types';
import { computeRiskScore } from '../utils/carbonCalc';

interface TimeMachineViewProps {
  carbonData: CarbonInputData | null;
  onNavigate: (view: string) => void;
}

export default function TimeMachineView({ carbonData, onNavigate }: TimeMachineViewProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2050);
  const [activeDot, setActiveDot] = useState<number>(2); // 0, 1, 2 corresponds to 2025, 2035, 2050

  const userHabits: CarbonInputData = carbonData || {
    transport_mode: 'car',
    transport_distance: 18,
    ac_hours: 4,
    laptop_hours: 7,
    diet_type: 'nonveg',
    digital_hours: 6
  };

  // Compute environmental risk score (0-100%) dynamically based on selected year and tracked habits!
  const riskPercent = computeRiskScore(userHabits, selectedYear);
  const norm = riskPercent / 100; // Value between 0 and 1

  // Map activeYear matching selectedDot index
  const dotsRange = [2025, 2037, 2050];
  const selectDot = (idx: number) => {
    setActiveDot(idx);
    setSelectedYear(dotsRange[idx]);
  };

  // Synchronize dot when year changes
  useEffect(() => {
    if (selectedYear <= 2030) {
      setActiveDot(0);
    } else if (selectedYear > 2030 && selectedYear <= 2042) {
      setActiveDot(1);
    } else {
      setActiveDot(2);
    }
  }, [selectedYear]);

  const handleNextHorizon = () => {
    // Increment year by 5 or reset to 2025
    if (selectedYear >= 2050) {
      setSelectedYear(2025);
    } else {
      setSelectedYear(Math.min(2050, selectedYear + 5));
    }
  };

  // Stylistic modifiers for the rotating Earth model
  const earthHaze = 0.2 + 0.8 * norm;
  const mapOpacity = 0.95 - 0.65 * norm;
  const shadowDark = 0.4 + 0.55 * norm;
  const earthGlow = 1.0 - 0.6 * norm;

  // Compute rotation angle based on risk severity
  const tiltX = 8 + 6 * norm;
  const tiltY = -14 - 10 * norm;
  const scale = 1 - 0.08 * norm;

  return (
    <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-4xl flex-col items-center px-5 py-8 sm:px-8">
      {/* Page Title */}
      <section className="w-full text-center">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-[#6dff58] sm:text-4xl filter drop-shadow-[0_0_15px_rgba(109,255,88,0.4)]">
          Carbon Time Machine
        </h1>
        <div className="w-20 h-1 bg-[#6dff58] mx-auto mt-3 rounded-full shadow-[0_0_12px_#6dff58]" />
      </section>

      {/* Interactive Hologram Box stage */}
      <section className="relative mt-8 w-full max-w-2xl">
        <div className="relative rounded-[2.5rem] border border-white/10 p-1 bg-[#0a1114]/70 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.5),0_0_50px_rgba(109,255,88,0.12)]">
          
          <div className="rounded-[2.4rem] bg-[#071612]/92 border border-emerald-500/10 p-5 sm:p-7 flex flex-col justify-between overflow-hidden relative min-h-[26rem] sm:min-h-[30rem]">
            {/* Hologram scan lines overlay effect */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40" />

            {/* Stage header info */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 bg-emerald-500/20 text-[#74ff63] text-xs font-black tracking-wider uppercase rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(116,255,99,0.2)]">
                System Active
              </span>
              <span className="text-[#cffafe] text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center gap-1.5 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Est. {selectedYear}
              </span>
            </div>

            {/* Earth Hologram Simulation Space */}
            <div className="h-64 sm:h-72 my-4 relative flex items-center justify-center">
              
              {/* Rotating abstract data rings */}
              <div className="absolute w-[85%] aspect-square border border-teal-500/20 rounded-full animate-[spin_28s_linear_infinite] pointer-events-none opacity-60">
                <div className="absolute inset-1.5 border border-dashed border-emerald-400/10 rounded-full" />
              </div>
              <div className="absolute w-[70%] aspect-square border border-dashed border-emerald-500/25 rounded-full animate-[spin_18s_linear_infinite_reverse] pointer-events-none opacity-70" />
              <div className="absolute w-[55%] aspect-square border border-cyan-500/20 rounded-full animate-[spin_12s_linear_infinite] pointer-events-none opacity-50" />

              {/* Dynamic Laser sweeping scanline */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6dff58] to-transparent shadow-[0_0_15px_#6dff58] top-1/2 -translate-y-1/2 animate-[pulse_2s_ease-in-out_infinite]" />

              {/* 3D-styled Interactive Earth core */}
              <div 
                className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden transition-all duration-700"
                style={{
                  transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
                  boxShadow: `
                    inset -25px -20px 40px rgba(0,0,0,${shadowDark}),
                    inset 10px 8px 30px rgba(207,250,254,${0.12 * earthHaze}),
                    0 0 25px rgba(34,211,238,${0.6 * earthGlow}),
                    0 0 60px rgba(16,185,129,${0.35 * earthGlow})
                  `,
                  background: `
                    radial-gradient(circle at 33% 24%, rgba(255,255,255,${0.35 * earthHaze}) 0, transparent 12%),
                    radial-gradient(circle at 55% 50%, rgba(34,211,238,${0.2 * earthHaze}) 0, transparent 55%),
                    linear-gradient(135deg, rgba(34,211,238,${0.85 * earthGlow}), rgba(5,46,22,0.98) 55%, rgba(1,8,10,0.98))
                  `
                }}
              >
                {/* Simulated Green Landmass maps with dynamic opacities representing eco state */}
                <span 
                  className="absolute left-[26%] top-[24%] w-[30%] h-[38%] bg-emerald-400/[0.42] rounded-[55%_35%_48%_42%] -rotate-[28deg] transition-all duration-[600ms] animate-pulse"
                  style={{ opacity: mapOpacity }}
                />
                <span 
                  className="absolute right-[22%] top-[29%] w-[25%] h-[30%] bg-emerald-500/[0.42] rounded-[45%_60%_35%_50%] rotate-[24deg] transition-all duration-[600ms] animate-pulse delay-500"
                  style={{ opacity: mapOpacity }}
                />
                <span 
                  className="absolute left-[43%] bottom-[17%] w-[20%] h-[22%] bg-lime-400/[0.38] rounded-[45%_40%_65%_30%] transition-all duration-[600ms] animate-pulse delay-1000"
                  style={{ opacity: mapOpacity }}
                />

                {/* Shading overlay layer for temporal darkening */}
                <div 
                  className="absolute inset-0 bg-stone-900 transition-opacity duration-700" 
                  style={{ opacity: Math.max(0, norm - 0.2) * 0.7 }}
                />
              </div>

            </div>

            {/* Matrix risk values footer */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 z-10 mt-2">
              <div className="w-full sm:w-2/3">
                <span className="text-xs font-bold uppercase tracking-wider text-green-300/80">Probability Matrix</span>
                <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-[#5dff50] transition-all duration-700 shadow-[0_0_12px_rgba(93,255,80,0.8)]"
                    style={{ width: `${riskPercent}%` }}
                  />
                </div>
              </div>
              <strong className="text-3xl font-black tracking-tight text-[#6dff58] filter drop-shadow-[0_0_10px_rgba(109,255,88,0.4)]">
                {riskPercent}%
              </strong>
            </div>

          </div>

        </div>
      </section>

      {/* Projection explanations */}
      <section className="mt-8 text-center max-w-xl">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Planetary risk horizon in {selectedYear}
        </h2>
        <p className="mt-2 text-white/50 text-sm leading-6">
          Our simulation modules combine your daily transport, eating, and electricity variables with long-term climate matrices to compute target planetary carbon load scores.
        </p>
      </section>

      {/* How it works details card */}
      <section className="mt-6 w-full max-w-xl p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-left text-sm text-white/70">
        <h3 className="text-white font-bold inline-flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Projections Explained
        </h3>
        <ul className="mt-2.5 space-y-1.5 list-disc pl-5 text-xs text-white/50">
          <li>Probability percent is the relative risk weighting index. High rates indicate severe greenhouse loads.</li>
          <li>Earth visuals darken as values peak, illustrating environmental load projections.</li>
          <li>Matrix slider uses your exact habits dynamically as variables.</li>
        </ul>
      </section>

      {/* Temporal range control slider */}
      <section className="mt-7 w-full max-w-xl p-4 bg-white/5 border border-white/8 rounded-2xl backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-bold tracking-widest text-white/40 uppercase">
          <span>2025</span>
          <span>Timeline Tracking</span>
          <span>2050</span>
        </div>
        <input
          type="range"
          min="2025"
          max="2050"
          className="w-full h-2 mt-4 rounded-lg bg-neutral-800 accent-[#5dff50] cursor-pointer"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        />
      </section>

      {/* Progressive dot step indicators */}
      <div className="flex items-center gap-2.5 mt-6">
        {dotsRange.map((yr, idx) => (
          <button
            key={yr}
            onClick={() => selectDot(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              activeDot === idx ? 'w-8 bg-[#73ff59] shadow-[0_0_10px_#73ff59]' : 'w-2.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Select year ${yr}`}
          />
        ))}
      </div>

      {/* Next Horizon primary trigger */}
      <button 
        onClick={handleNextHorizon}
        className="mt-8 flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#73ff59] text-stone-950 font-black tracking-wider uppercase text-sm shadow-[0_12px_45px_rgba(0,0,0,0.4),0_0_25px_rgba(115,255,89,0.3)] hover:scale-102 transition-transform cursor-pointer"
      >
        Advance Horizon
        <ArrowRight className="w-5 h-5 font-black" />
      </button>

      {/* Skip button */}
      <button 
        onClick={() => onNavigate('dashboard')}
        className="mt-6 text-white/60 hover:text-[#73ff59] text-sm font-semibold transition-colors uppercase tracking-wider cursor-pointer"
      >
        Dismiss Simulation
      </button>

    </main>
  );
}
