import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Leaf, Award, Flame, Dumbbell, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { CarbonInputData } from '../types';
import { calculateCarbonStats } from '../utils/carbonCalc';

interface DashboardViewProps {
  user: User;
  carbonData: CarbonInputData | null;
  onNavigate: (view: string) => void;
}

export default function DashboardView({ user, carbonData, onNavigate }: DashboardViewProps) {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Compute metrics based on actual or fallback inputs
  const stats = carbonData ? calculateCarbonStats(carbonData) : {
    totalEmissions: 12.4, // Fallback default
    ecoScore: 78,
    dailySaved: 6.1,
    transportEmissions: 5.2,
    electricityEmissions: 4.2,
    dietEmissions: 3.0,
    digitalEmissions: 0.6,
  };

  const username = user.email ? user.email.split('@')[0] : 'User';

  // Call server-side API proxy to get personalized climate action suggestions
  useEffect(() => {
    const fetchAiInsight = async () => {
      setLoadingInsight(true);
      try {
        const payload = carbonData || {
          transport_mode: 'car',
          transport_distance: 18,
          ac_hours: 4,
          laptop_hours: 7,
          diet_type: 'nonveg',
          digital_hours: 6
        };

        const response = await fetch('/api/gemini/insight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const resData = await response.json();
        if (resData.insight) {
          setAiInsight(resData.insight);
        } else {
          setAiInsight('Check transport options. Switching to metro, bike, or train can cut up to 300kg CO₂ annually.');
        }
      } catch (err) {
        console.error('Error fetching Gemini AI Insight:', err);
        setAiInsight('Transport is your primary emissions category. Aim to swap 2 standard drives each week with carbon-free alternatives to see major environmental improvements.');
      } finally {
        setLoadingInsight(false);
      }
    };

    fetchAiInsight();
  }, [carbonData]);

  // Construct coordinates for dynamic SVG trendline mapping based on dailyEmissions
  // We offset it so more carbon => higher peak curve!
  const strokeColor = stats.ecoScore > 80 ? 'url(#chartGreenGlow)' : 'url(#chartCyanGlow)';
  const fillAlpha = stats.ecoScore > 80 ? 'rgba(52, 211, 153, 0.08)' : 'rgba(34, 211, 238, 0.08)';

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
      {/* Welcome Heading */}
      <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">Live impact cockpit</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent uppercase text-3xl font-black tracking-wide">{username}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-white/50 text-sm sm:text-base">
            Your carbon habits are analyzed against cloud sustainability modules to project planetary risk horizons.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('carbon_input')} 
          className="px-5 py-2.5 rounded-full border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          {carbonData ? 'Change Daily Habits' : 'Log Daily Carbon'}
        </button>
      </section>

      {/* Habit list card */}
      <section className="mb-8 p-5 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/80">Logged carbon metrics</p>
        <h2 className="mt-1 text-xl font-bold text-white">Daily habit telemetry</h2>
        
        {carbonData ? (
          <div className="mt-5 grid gap-4 grid-cols-2 md:grid-cols-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs font-medium text-white/40">Transport</span>
              <strong className="block mt-1 text-base text-white">{carbonData.transport_mode} ({carbonData.transport_distance} km)</strong>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs font-medium text-white/40">Electricity</span>
              <strong className="block mt-1 text-base text-white">{carbonData.ac_hours} hrs AC</strong>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs font-medium text-white/40">Diet Preference</span>
              <strong className="block mt-1 text-base text-white capitalize">{carbonData.diet_type}</strong>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs font-medium text-white/40">Digital Footprint</span>
              <strong className="block mt-1 text-base text-white">{carbonData.digital_hours} hrs digital</strong>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-5 text-center border border-dashed border-white/10 rounded-xl">
            <p className="text-white/60 text-sm">No user habits logged yet today. Using benchmark variables.</p>
            <button 
              onClick={() => onNavigate('carbon_input')}
              className="mt-3.5 px-4.5 py-2 text-xs font-bold text-stone-900 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              Provide Live Telemetry
            </button>
          </div>
        )}
      </section>

      {/* Core KPI metrics grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Footprint */}
        <article className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3.5 shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-white/50 tracking-wider block">Daily CO₂ Footprint</span>
          <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl tracking-tight">
            {stats.totalEmissions} <span className="text-xs text-white/40">kg</span>
          </h2>
          <span className="mt-2 inline-block text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Verified Level
          </span>
        </article>

        {/* Eco Score */}
        <article className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3.5 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-white/50 tracking-wider block">Eco Score</span>
          <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl tracking-tight">
            {stats.ecoScore}<span className="text-lg text-white/50">/100</span>
          </h2>
          <span className="mt-2 inline-block text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
            {stats.ecoScore >= 75 ? 'Strong progress' : 'Moderate footprint'}
          </span>
        </article>

        {/* Active Streak */}
        <article className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-3.5 shadow-sm animate-pulse">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-white/50 tracking-wider block">Logged Streak</span>
          <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl tracking-tight">
            {carbonData ? '1 Day' : '0 Days'}
          </h2>
          <span className="mt-2 inline-block text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
            Keep logging daily!
          </span>
        </article>

        {/* Saved CO2 equivalents */}
        <article className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3.5 shadow-sm">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-white/50 tracking-wider block">Daily offsets</span>
          <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl tracking-tight">
            {stats.dailySaved} <span className="text-xs text-white/40">kg</span>
          </h2>
          <span className="mt-2 inline-block text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
            Saved vs. average user
          </span>
        </article>
      </section>

      {/* Main content row */}
      <section className="mt-6 grid gap-6 lg:grid-cols-12">
        
        {/* Server-Side Gemini insight block */}
        <article className="lg:col-span-5 p-6 sm:p-7 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-[#071310] to-[#040c09] shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-emerald-400/5 rounded-full blur-2xl" />
          
          <div>
            <div className="flex items-center gap-1 text-emerald-400 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400/20 animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-[0.24em]">Gemini AI climate insight</span>
            </div>

            <h3 className="text-xl font-extrabold text-white leading-snug">
              Sustainable action levers optimized for you:
            </h3>

            {loadingInsight ? (
              <div className="mt-5 flex flex-col items-center justify-center py-7 text-white/50 text-sm">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3.5" />
                <span>Formulating personalized habits...</span>
              </div>
            ) : (
              <p className="mt-4 leading-6 text-emerald-100/75 text-[0.92rem] text-justify font-normal">
                {aiInsight}
              </p>
            )}
          </div>

          <button 
            onClick={() => onNavigate('time_machine')}
            className="mt-6 w-full py-3 px-4 text-xs font-bold uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-stone-950 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Open Carbon Time Machine &rarr;
          </button>
        </article>

        {/* Dynamic emissions Curve widget */}
        <article className="lg:col-span-7 p-6 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/80">Projection curves</p>
              <h2 className="mt-1 text-xl font-bold text-white">Interactive emissions trend</h2>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active state
            </span>
          </div>

          {/* Render Curve container */}
          <div className="relative h-64 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden">
            {/* Custom Grid Layout lines on Canvas */}
            <div className="absolute inset-0 opacity-[0.06] select-none pointer-events-none" 
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Custom SVG line plotting */}
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 640 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGreenGlow" x1="0" x2="1" y1="0" y2="0">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="chartCyanGlow" x1="0" x2="1" y1="0" y2="0">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Shaded Area underneath the emissions curve */}
              <path 
                d={
                  stats.ecoScore > 80
                    ? "M 10 210 Q 150 140 320 180 T 630 110 L 630 250 L 10 250 Z" 
                    : `M 10 210 Q 150 110, 320 ${210 - stats.totalEmissions * 5} T 630 50 L 630 250 L 10 250 Z`
                }
                fill={fillAlpha} 
                transition="d 0.5s ease"
              />

              {/* Main Line path */}
              <path 
                d={
                  stats.ecoScore > 80
                    ? "M 10 210 Q 150 140 320 180 T 630 110" 
                    : `M 10 210 Q 150 110, 320 ${210 - stats.totalEmissions * 5} T 630 50`
                }
                fill="none" 
                stroke={strokeColor}
                strokeWidth="5" 
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Float labels */}
            <div className="absolute top-4 left-4 text-xs font-mono text-white/30 lowercase">H-Emissions Threshold</div>
            <div className="absolute bottom-4 right-4 text-xs font-mono text-emerald-400/50 uppercase tracking-wide flex items-center gap-1">
              <span>Eco Optimal</span>
            </div>
          </div>
        </article>

      </section>
    </main>
  );
}
