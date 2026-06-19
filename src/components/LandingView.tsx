import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  isLoggedIn: boolean;
  onNavigate: (view: string) => void;
}

export default function LandingView({ isLoggedIn, onNavigate }: LandingViewProps) {
  return (
    <main className="relative z-10 flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-5 pb-16 pt-16 sm:pb-24">
      <section className="mx-auto max-w-4xl text-center flex flex-col items-center">
        
        {/* Animated Earth planetary sphere concept */}
        <motion.div 
          className="relative w-44 h-44 sm:w-56 sm:h-56 mb-8 flex justify-center items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* Pulsing Atmosphere aura rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-[ping_4s_ease-in-out_infinite]" />
          <div className="absolute inset-3 rounded-full border border-emerald-400/20 animate-[ping_4s_ease-in-out_infinite_1.6s]" />

          {/* Interactive Earth core sphere */}
          <motion.div 
            className="relative w-3/4 h-3/4 overflow-hidden rounded-full shadow-[0_0_50px_rgba(34,197,94,0.6),inset_-15px_-15px_40px_rgba(0,0,0,0.5)]"
            style={{
              background: `
                radial-gradient(circle at 30% 22%, rgba(255,255,255,0.95) 0 4%, transparent 5%),
                radial-gradient(circle at 38% 52%, #22c55e 0 16%, transparent 17%),
                radial-gradient(circle at 66% 35%, #16a34a 0 13%, transparent 14%),
                radial-gradient(circle at 60% 76%, #65a30d 0 11%, transparent 12%),
                linear-gradient(135deg, #22d3ee, #0f766e 52%, #052e16)
              `
            }}
            animate={{ 
              y: [-6, 6, -6],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Glossy overlay sheen */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none opacity-40" />
            
            {/* Abstract orbit cross rings */}
            <span className="absolute left-[-13%] top-[48%] w-[126%] h-[4px] rounded-full bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent transform -rotate-[18deg]" />
            <span className="absolute left-[-13%] top-[48%] w-[126%] h-[4px] rounded-full bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent transform rotate-[24deg] opacity-60" />
          </motion.div>
        </motion.div>

        {/* AI capability kicker */}
        <motion.div 
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/80">AI climate intelligence</span>
        </motion.div>

        {/* Brand Display Header */}
        <motion.h1 
          className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Eco<span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200 bg-clip-text text-transparent">Shift</span>
        </motion.h1>

        {/* Tagline Slogan */}
        <motion.p 
          className="mt-4 text-xl font-semibold tracking-wide text-white/90 sm:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Shift Today. Save Tomorrow.
        </motion.p>

        {/* Description intro */}
        <motion.p 
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Explore your daily carbon habits, preview future planetary scenarios under custom temporal tracks, and discover personalized low-carbon changes optimized for dynamic action.
        </motion.p>

        {/* Master Action Trigger */}
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
        >
          <button 
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'login')}
            className="group flex items-center gap-3.5 px-6.5 py-3.5 rounded-full border border-emerald-300/50 hover:border-emerald-300 bg-gradient-to-r from-emerald-300 via-emerald-500 to-cyan-400 text-stone-950 font-black tracking-wide shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 pointer-events-auto cursor-pointer"
          >
            {isLoggedIn ? 'Access Cockpit' : 'Get Started'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </section>
    </main>
  );
}
