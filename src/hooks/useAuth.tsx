import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserRole = 'MASTER' | 'USER';

interface AuthProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: AuthProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isMaster: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const masterEmail = import.meta.env.VITE_MASTER_EMAIL;

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as AuthProfile;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // Safety timeout: stop loading after 5s if nothing happens
      const timeout = setTimeout(() => {
        if (mounted && loading) {
          console.warn('[Auth] Initialization timed out. Proceeding as guest.');
          setLoading(false);
        }
      }, 5000);

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setSession(currentSession);
        
        // Only allow user in if they have confirmed their email
        const isConfirmed = currentSession?.user?.email_confirmed_at;
        const currentUser = isConfirmed ? (currentSession?.user ?? null) : null;
        
        if (currentSession?.user && !isConfirmed) {
          console.warn('[Auth] Email not confirmed yet');
        }

        setUser(currentUser);
        
        if (currentUser) {
          const p = await fetchProfile(currentUser.id);
          if (mounted) setProfile(p);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        clearTimeout(timeout);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setSession(session);
      
      const isConfirmed = session?.user?.email_confirmed_at;
      const currentUser = isConfirmed ? (session?.user ?? null) : null;
      setUser(currentUser);
      
      if (currentUser) {
        const p = await fetchProfile(currentUser.id);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
        // If there's a session but no currentUser (unconfirmed), ensure we transition out of loading
        if (session) {
          console.warn('[Auth] Session exists but user is unconfirmed or hidden');
        }
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('[Auth] Sign out initiated');
    
    // 1. Force clear local React state immediately
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);

    try {
      // 2. Clear storage manually first
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('execution')) {
          localStorage.removeItem(key);
        }
      });
      console.log('[Auth] Local storage cleared');
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }

    // 3. Attempt supabase sign out (best effort)
    try {
      // We don't await this indefinitely to prevent UI hangs
      const signOutPromise = supabase.auth.signOut({ scope: 'local' });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 1500)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('[Auth] Supabase sign out successful');
    } catch (err) {
      console.warn('[Auth] Supabase sign out warning (non-fatal):', err);
    } finally {
      // 4. Final Escape Hatch: Hard reload
      console.log('[Auth] Finalizing sign out with reload');
      window.location.href = '/login';
      // If href doesn't trigger immediately, force it
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const isMaster = profile?.role === 'MASTER' || (user?.email === masterEmail && masterEmail !== undefined);

  // Listen for real-time profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          console.log('[Auth] Profile real-time update:', payload.new);
          setProfile(payload.new as AuthProfile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, isMaster, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
