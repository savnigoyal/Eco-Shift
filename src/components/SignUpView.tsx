import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface SignUpViewProps {
  onNavigate: (view: string) => void;
  onSuccess: () => void;
}

export default function SignUpView({ onNavigate, onSuccess }: SignUpViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password || !confirmPassword) {
      setErrorMsg('Please enter all the details.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      console.error('Email registration error:', err);
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
        setErrorMsg('This email address is already in use. Try logging in instead!');
      } else if (code === 'auth/weak-password' || msg.includes('weak-password')) {
        setErrorMsg('Weak password. Please use a password with at least 6 characters.');
      } else {
        setErrorMsg(msg || 'Registration failed. Please attempt with valid parameters.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-5 py-12">
      <section className="w-full max-w-md p-7 sm:p-9 rounded-2xl border border-white/10 bg-[#0c1411]/72 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.4),0_0_40px_rgba(34,197,94,0.1)] hover:border-emerald-500/20 transition-all duration-300">
        <div className="mb-6 text-center">
          {/* Logo Orb */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.32)]">
            <span className="w-7 h-7 rounded-full shadow-inner"
              style={{
                background: `linear-gradient(135deg, #34d399, #059669 60%, #06b6d4)`
              }}
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Create Account</h1>
          <p className="mt-2 text-sm text-white/55">Join EcoShift to track and lower your carbon impact</p>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold text-white/70" htmlFor="signup-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                id="signup-email"
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
            <label className="text-sm font-bold text-white/70" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4.5 h-4.5" />
              </span>
              <input
                id="signup-password"
                type="password"
                required
                disabled={loading}
                className="w-full bg-[#030705]/80 border border-white/10 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold text-white/70" htmlFor="signup-confirm">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                <KeyRound className="w-4.5 h-4.5" />
              </span>
              <input
                id="signup-confirm"
                type="password"
                required
                disabled={loading}
                className="w-full bg-[#030705]/80 border border-white/10 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-stone-950 font-black tracking-wide shadow-lg cursor-pointer disabled:opacity-50 transition-all active:scale-98"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/50">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')} 
            className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            Log in
          </button>
        </p>
      </section>
    </main>
  );
}
