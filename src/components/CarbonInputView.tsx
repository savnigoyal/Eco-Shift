import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CarbonInputData, TransportMode, DietType } from '../types';
import { ShieldAlert, Car, Zap, ChefHat, Monitor, Sparkles } from 'lucide-react';

interface CarbonInputViewProps {
  user: User;
  existingData: CarbonInputData | null;
  onSaveSuccess: (data: CarbonInputData) => void;
  onNavigate: (view: string) => void;
}

export default function CarbonInputView({ user, existingData, onSaveSuccess, onNavigate }: CarbonInputViewProps) {
  // Setup standard state with matching defaults if there is no pre-existing data
  const [transportMode, setTransportMode] = useState<TransportMode>(existingData?.transport_mode || 'car');
  const [transportDistance, setTransportDistance] = useState<number>(existingData?.transport_distance ?? 18);
  const [acHours, setAcHours] = useState<number>(existingData?.ac_hours ?? 4);
  const [laptopHours, setLaptopHours] = useState<number>(existingData?.laptop_hours ?? 7);
  const [dietType, setDietType] = useState<DietType>(existingData?.diet_type || 'nonveg');
  const [digitalHours, setDigitalHours] = useState<number>(existingData?.digital_hours ?? 6);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setErrorDetails('');

    const payload: CarbonInputData = {
      transport_mode: transportMode,
      transport_distance: Number(transportDistance),
      ac_hours: Number(acHours),
      laptop_hours: Number(laptopHours),
      diet_type: dietType,
      digital_hours: Number(digitalHours),
    };

    const docPath = `carbon_inputs/${user.uid}`;
    try {
      // Write to cloud firestore database with strict validation
      const ref = doc(db, 'carbon_inputs', user.uid);
      await setDoc(ref, payload);
      
      setFeedback('Habits logged successfully! Syncing projection matrix...');
      onSaveSuccess(payload);
      
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } catch (err: any) {
      console.error('Firestore habit writes error:', err);
      setFeedback('Error saving habits. Falling back to local state storage.');
      
      // LocalStorage fallback for high resilience
      try {
        localStorage.setItem('local_carbon_input', JSON.stringify(payload));
        onSaveSuccess(payload);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1200);
      } catch (localErr: any) {
        console.error('LocalStorage backup error:', localErr);
      }

      // Handle structural operational logging as mandated by secure skill
      try {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      } catch (logErr: any) {
        setErrorDetails(logErr.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8">
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">Daily habit tracking</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Carbon Input</h1>
        <p className="mt-2 max-w-2xl text-white/50 text-sm sm:text-base">
          Update your daily activity coordinates to see how small changes alter future climate trajectories.
        </p>
      </section>

      {feedback && (
        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-2.5 text-sm ${
          errorDetails ? 'border-rose-500/20 bg-rose-500/10 text-rose-300' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
        }`}>
          <ShieldAlert className={`w-5 h-5 shrink-0 ${errorDetails ? 'text-rose-400' : 'text-emerald-400'}`} />
          <div>
            <span>{feedback}</span>
            {errorDetails && <p className="mt-1.5 text-xs font-mono text-rose-200/60 leading-normal">{errorDetails}</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid gap-5 md:grid-cols-2">
        
        {/* Category 1: Transport */}
        <section className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
            <Car className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Transport</h2>
          
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-xs font-bold text-white/60 tracking-wider uppercase" htmlFor="transport-select">Mode</label>
              <select
                id="transport-select"
                className="w-full bg-[#030705]/80 border border-white/10 focus:border-emerald-500 rounded-xl py-3 px-4 text-white outline-none"
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as TransportMode)}
              >
                <option value="car">Car (Combustion)</option>
                <option value="bus">Bus (Transit)</option>
                <option value="metro">Metro (Subway)</option>
                <option value="bike">Bike (Electric)</option>
                <option value="cycle">Cycle (Carbon Neutral)</option>
              </select>
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/60 tracking-wider uppercase" htmlFor="distance-slider">Daily Distance</label>
                <span className="text-sm font-extrabold text-emerald-300">{transportDistance} km</span>
              </div>
              <input
                id="distance-slider"
                type="range"
                min="0"
                max="80"
                className="w-full h-2 rounded-lg bg-neutral-800 accent-emerald-500 cursor-pointer"
                value={transportDistance}
                onChange={(e) => setTransportDistance(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Category 2: Electricity */}
        <section className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Electricity</h2>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/60 tracking-wider uppercase" htmlFor="ac-slider">AC usage</label>
                <span className="text-sm font-extrabold text-cyan-300">{acHours} hrs</span>
              </div>
              <input
                id="ac-slider"
                type="range"
                min="0"
                max="14"
                className="w-full h-2 rounded-lg bg-neutral-800 accent-cyan-400 cursor-pointer"
                value={acHours}
                onChange={(e) => setAcHours(Number(e.target.value))}
              />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/60 tracking-wider uppercase" htmlFor="laptop-slider">Laptop usage</label>
                <span className="text-sm font-extrabold text-cyan-300">{laptopHours} hrs</span>
              </div>
              <input
                id="laptop-slider"
                type="range"
                min="0"
                max="16"
                className="w-full h-2 rounded-lg bg-neutral-800 accent-cyan-400 cursor-pointer"
                value={laptopHours}
                onChange={(e) => setLaptopHours(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Category 3: Diet preference */}
        <section className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-sm">
            <ChefHat className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Diet</h2>

          <div className="grid gap-1.5">
            <label className="text-xs font-bold text-white/60 tracking-wider uppercase" htmlFor="diet-select">Diet type</label>
            <select
              id="diet-select"
              className="w-full bg-[#030705]/80 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-white outline-none"
              value={dietType}
              onChange={(e) => setDietType(e.target.value as DietType)}
            >
              <option value="veg">Vegetarian (Planet Conscious)</option>
              <option value="nonveg">Non-Vegetarian (Heavy footprint)</option>
              <option value="vegan">Vegan (Zero Livestock Impact)</option>
            </select>
          </div>
        </section>

        {/* Category 4: Digital cloud consumption */}
        <section className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 shadow-sm">
            <Monitor className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">Digital Footprint</h2>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/60 tracking-wider uppercase" htmlFor="digital-slider">Digital Activity</label>
                <span className="text-sm font-extrabold text-teal-300">{digitalHours} hrs</span>
              </div>
              <input
                id="digital-slider"
                type="range"
                min="0"
                max="24"
                className="w-full h-2 rounded-lg bg-neutral-800 accent-teal-400 cursor-pointer"
                value={digitalHours}
                onChange={(e) => setDigitalHours(Number(e.target.value))}
              />
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Consolidated hours spent streaming multimedia, gaming, utilizing compute clouds, and active network connections.
            </p>
          </div>
        </section>

        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-black uppercase tracking-wider shadow-lg active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Syncing...' : 'Review Future Outlook'}
            <Sparkles className="w-5 h-5" />
          </button>
        </div>

      </form>
    </main>
  );
}
