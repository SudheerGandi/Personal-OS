import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { progressService } from '../lib/services/progressService';
import { LogIn, Mail, Lock, Loader2, Zap, AlertCircle, LogOut } from 'lucide-react';

const ConfigWarning = () => {
  const isMissing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!isMissing) return null;

  return (
    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
      <div className="flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={18} />
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Configuration Required</p>
          <p className="text-[10px] text-[#b0bac8] leading-relaxed">
            Supabase credentials are missing. Please go to <b>Settings &gt; Environment Variables</b> and add:
          </p>
          <div className="font-mono text-[9px] bg-[#0e0f12] p-2 rounded border border-[#1c1e24] text-[#6b7280]">
            VITE_SUPABASE_URL<br />
            VITE_SUPABASE_ANON_KEY
          </div>
          <p className="text-[10px] text-[#b0bac8]">
            You can find these in your Supabase Dashboard under <b>Project Settings &gt; API</b>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Login() {
  const { session, user, signOut, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If we have a user and session is confirmed, go home
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleCancelSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (err) {
      console.error('Cancel sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (user) {
      try {
        const masterEmail = import.meta.env.VITE_MASTER_EMAIL;
        const role = email === masterEmail ? 'MASTER' : 'USER';
        
        // Ensure profile exists. If it's the master, ensure they have the MASTER role
        await progressService.ensureProfile(user.id, email, user.user_metadata.display_name || email.split('@')[0], role);
        navigate('/');
      } catch (err: any) {
        console.error('Profile sync error:', err);
        // We still navigate if the login itself was successful, 
        // the App.tsx will handle the rest
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
           <div className="inline-flex p-3 bg-[#e8622a]/10 rounded-xl mb-4 border border-[#e8622a]/20">
             <Zap className="text-[#e8622a]" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-[#dde3ee] tracking-tight">Execution OS</h1>
           <p className="text-[#4b5563] text-sm mt-2 font-mono">SYSTEM ACCESS REQUIRED</p>
        </div>

        <div className="bg-[#141519] border border-[#1c1e24] p-8 rounded-2xl shadow-xl">
          <ConfigWarning />
          {session && !user && !authLoading && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-3">
              <div className="flex gap-3">
                <Mail className="text-blue-500 shrink-0" size={18} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Email Confirmation Pending</p>
                  <p className="text-[10px] text-[#b0bac8] leading-relaxed">
                    Check your inbox (<b>{session.user.email}</b>) and follow the link to activate your system clearance.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleCancelSignOut}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 text-[10px] bg-[#1c1e24] text-[#6b7280] hover:text-[#dde3ee] rounded-lg transition-colors font-mono disabled:opacity-50"
              >
                <LogOut size={12} />
                CANCEL & SIGN OUT
              </button>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg font-mono">
                {error.toUpperCase()}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest block ml-1">Email Identifier</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0e0f12] border border-[#1c1e24] rounded-xl py-3 pl-10 pr-4 text-[#dde3ee] focus:outline-none focus:border-[#e8622a]/50 transition-colors placeholder-[#4b5563]/50"
                  placeholder="name@nexus.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest block ml-1">Access Logic</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0e0f12] border border-[#1c1e24] rounded-xl py-3 pl-10 pr-4 text-[#dde3ee] focus:outline-none focus:border-[#e8622a]/50 transition-colors placeholder-[#4b5563]/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8622a] hover:bg-[#ff7b45] text-[#0e0f12] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>INITIALIZE SYSTEM</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1c1e24] text-center">
             <p className="text-[#4b5563] text-xs">
               New operator? {' '}
               <Link to="/register" className="text-[#e8622a] hover:underline font-semibold">
                 REQUEST CLEARANCE
               </Link>
             </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-[#4b5563] font-mono uppercase tracking-[0.2em] opacity-50">
          Secure Multi-User Protocol v2.4
        </p>
      </div>
    </div>
  );
}
