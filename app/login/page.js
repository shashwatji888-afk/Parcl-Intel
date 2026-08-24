'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, demoLogin, isConfigured } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        setSuccessMsg('Authentication successful! Redirecting...');
        setTimeout(() => router.push('/overview'), 800);
      } else {
        await signUp(email, password, fullName);
        setSuccessMsg('Account created successfully! Redirecting to intelligence dashboard...');
        setTimeout(() => router.push('/overview'), 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      if (!isConfigured) {
        setSuccessMsg('Signed in with Google Demo Account! Redirecting...');
        setTimeout(() => router.push('/overview'), 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Google OAuth failed. Ensure Google Provider is enabled in Supabase Dashboard.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    demoLogin('shashwat@parclintel.io', 'Shashwat');
    setSuccessMsg('Logged in as Admin Demo User! Redirecting...');
    setTimeout(() => router.push('/overview'), 600);
  };

  const handleGuestLogin = () => {
    demoLogin('guest.analyst@parclintel.io', 'Guest Analyst');
    setSuccessMsg('Logged in as Guest Analyst! Redirecting...');
    setTimeout(() => router.push('/overview'), 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col justify-between relative overflow-hidden font-body">
      
      {/* Background Orbs */}
      <div className="parcl-orb parcl-orb--blue" style={{ width: 500, height: 500, top: -100, left: -100, opacity: 0.1 }} />
      <div className="parcl-orb parcl-orb--violet" style={{ width: 400, height: 400, bottom: -100, right: -100, opacity: 0.1 }} />

      {/* Top Bar */}
      <header className="p-6 sm:p-8 flex justify-between items-center z-10">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="text-2xl font-headline font-bold text-primary tracking-tight shadow-glow-primary">
            Parcl Intel
          </div>
          <span className="font-label text-[10px] uppercase text-slate-500 tracking-widest border border-white/10 px-2 py-0.5 rounded">
            ML Engine v2.4
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-accent shadow-glow-accent' : 'bg-warning'}`} />
          <span className="font-label text-[10px] uppercase tracking-wider text-slate-400">
            {isConfigured ? 'Supabase Connected' : 'Demo Sandbox Mode'}
          </span>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle gradient bar top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

          <div className="text-center mb-6">
            <h1 className="text-2xl font-headline font-bold mb-1">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-400">
              Access Machine Learning Real Estate Buyer Intelligence
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface1 rounded-xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-2 text-xs font-label uppercase font-bold rounded-lg transition-colors cursor-pointer ${
                mode === 'signin' ? 'bg-surface3 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 text-xs font-label uppercase font-bold rounded-lg transition-colors cursor-pointer ${
                mode === 'signup' ? 'bg-surface3 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-label flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-label flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              {successMsg}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 bg-surface1 hover:bg-surface2 border border-white/10 rounded-lg text-xs font-label font-bold text-white transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm mb-4"
          >
            {googleLoading ? (
              <span className="material-symbols-outlined animate-spin text-base text-primary">sync</span>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-label uppercase text-slate-500">Or use email</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-label uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Shashwat"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-label uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="shashwat@parclintel.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-label uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface1 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-headline font-bold rounded-lg shadow-glow-primary transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock_open</span>
                  {mode === 'signin' ? 'Sign In to Account' : 'Create Supabase Account'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-label uppercase text-slate-500">Quick Test Options</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* One-Click Quick Access Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="py-2.5 bg-surface2 hover:bg-surface3 text-slate-200 border border-white/10 rounded-lg text-xs font-label uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-accent text-sm">person</span>
              Guest Analyst
            </button>

            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="py-2.5 bg-surface2 hover:bg-surface3 text-slate-200 border border-white/10 rounded-lg text-xs font-label uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-sm">bolt</span>
              Demo Admin
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs font-mono text-slate-500 border-t border-white/5 z-10">
        © 2026 Parcl Intel. Real Estate Machine Learning Intelligence Engine.
      </footer>

    </div>
  );
}
