import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { progressService } from '../lib/services/progressService';
import { UserPlus, Mail, Lock, User, Loader2, Zap, AlertCircle } from 'lucide-react';

const ConfigWarning = () => {
  const isMissing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!isMissing) return null;

  return (
    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left">
      <div className="flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={18} />
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Configuration Required</p>
          <p className="text-[10px] text-[#b0bac8] leading-relaxed">
            Registering requires Supabase to be connected. Add these keys in <b>Settings &gt; Environment Variables</b>:
          </p>
          <div className="font-mono text-[9px] bg-[#0e0f12] p-2 rounded border border-[#1c1e24] text-[#6b7280]">
            VITE_SUPABASE_URL<br />
            VITE_SUPABASE_ANON_KEY
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const masterEmail = import.meta.env.VITE_MASTER_EMAIL;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Check if we have a session. If not, email confirmation might be enabled.
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          setError('REGISTRATION SUCCESSFUL. PLEASE CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT BEFORE LOGGING IN.');
          setLoading(false);
          return;
        }

        // Create profile
        // Role is MASTER if email matches VITE_MASTER_EMAIL
        const role = email === masterEmail ? 'MASTER' : 'USER';
        try {
          await progressService.ensureProfile(data.user.id, email, displayName, role);
          navigate('/');
        } catch (profileError: any) {
          console.error('Profile creation failed:', profileError);
          // If profile creation fails but user is created, they can try to log in 
          // which will also trigger ensureProfile in some flows
          setError(`ACCOUNT CREATED BUT PROFILE SYNC FAILED: ${profileError.message}. TRY LOGGING IN.`);
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
           <div className="inline-flex p-3 bg-[#e8622a]/10 rounded-xl mb-4 border border-[#e8622a]/20">
             <Zap className="text-[#e8622a]" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-[#dde3ee] tracking-tight">Operator Registration</h1>
           <p className="text-[#4b5563] text-sm mt-2 font-mono">NEW ACCOUNT PROVISIONING</p>
        </div>

        <div className="bg-[#141519] border border-[#1c1e24] p-8 rounded-2xl shadow-xl">
          <ConfigWarning />
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg font-mono">
                {error.toUpperCase()}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#4b5563] uppercase tracking-widest block ml-1">Display Identity</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={16} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#0e0f12] border border-[#1c1e24] rounded-xl py-3 pl-10 pr-4 text-[#dde3ee] focus:outline-none focus:border-[#e8622a]/50 transition-colors placeholder-[#4b5563]/50"
                  placeholder="Operator Name"
                  required
                />
              </div>
            </div>

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
                  <UserPlus size={20} />
                  <span>REQUEST CLEARANCE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1c1e24] text-center">
             <p className="text-[#4b5563] text-xs">
               Existing operator? {' '}
               <Link to="/login" className="text-[#e8622a] hover:underline font-semibold">
                 LOG IN
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
