import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: string) => void;
  onSuccess: () => void;
}

export default function LoginView({ onNavigate, onSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please specify both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      console.error('Email sign in error:', err);
      setErrorMsg(err.message || 'Login failed. Please specify correct credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setErrorMsg(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-5 py-12">
      <section className="w-full max-w-md p-7 sm:p-9 rounded-2xl border border-white/10 bg-[#0c1411]/72 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.4),0_0_40px_rgba(34,197,94,0.1)] hover:border-emerald-500/20 transition-all duration-300">
        <div className="mb-8 text-center">
          {/* Logo Orb */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.32)]">
            <span className="w-7 h-7 rounded-full shadow-inner"
              style={{
                background: `linear-gradient(135deg, #34d399, #059669 60%, #06b6d4)`
              }}
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-white/50">Sign in to open your climate intelligence cockpit</p>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold text-white/70" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                id="email-input"
                type="email"
                required
                disabled={loading}
                className="w-full bg-[#030705]/80 border border-white/10 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all text-sm"
                placeholder="you@ecosystem.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold text-white/70" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4.5 h-4.5" />
              </span>
              <input
                id="password-input"
                type="password"
                required
                disabled={loading}
                className="w-full bg-[#030705]/80 border border-white/10 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-stone-950 font-black tracking-wide shadow-lg cursor-pointer disabled:opacity-50 transition-all active:scale-98"
          >
            {loading ? 'Signing in...' : 'Login'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/50">
          Don't have an account?{' '}
          <button 
            onClick={() => onNavigate('signup')} 
            className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            Sign up
          </button>
        </p>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-white/30">
          <span className="h-[1px] flex-1 bg-white/10" />
          or
          <span className="h-[1px] flex-1 bg-white/10" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-sm cursor-pointer disabled:opacity-50"
        >
          {/* Custom micro Google logo */}
          <span className="flex items-center justify-center w-5 h-5 bg-white text-stone-900 rounded-full font-black text-xs">
            G
          </span>
          Continue with Google
        </button>
      </section>
    </main>
  );
}
