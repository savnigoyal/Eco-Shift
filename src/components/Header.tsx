import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function Header({ user, currentView, onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#030705]/80 border-b border-white/8 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Brand logo */}
        <button 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-2.5 text-white font-extrabold text-lg tracking-tight select-none cursor-pointer focus:outline-none"
        >
          {/* Custom Brand Orb representing planetary ecosystem */}
          <span className="w-[22px] h-[22px] flex rounded-full shadow-[0_0_12px_rgba(34,197,94,0.7)]"
            style={{
              background: `
                radial-gradient(circle at 35% 30%, #ecfeff 0 10%, transparent 11%),
                radial-gradient(circle at 70% 70%, #22d3ee 0 15%, transparent 16%),
                linear-gradient(135deg, #22c55e, #14532d 58%, #22d3ee)
              `
            }}
          />
          <span className="text-white hover:text-emerald-300 transition-colors">EcoShift</span>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-4 text-sm text-white/80">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate('dashboard')} 
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' 
                    : 'border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('carbon_input')} 
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  currentView === 'carbon_input'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5'
                }`}
              >
                Carbon Input
              </button>
              <button 
                onClick={() => onNavigate('time_machine')} 
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  currentView === 'time_machine'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5'
                }`}
              >
                Time Machine
              </button>
              <button 
                onClick={onLogout}
                className="px-3.5 py-1.5 text-xs font-semibold tracking-wider text-rose-300 border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10 rounded-full transition-all cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('landing')} 
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  currentView === 'landing' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('login')} 
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                  currentView === 'login' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('signup')} 
                className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
