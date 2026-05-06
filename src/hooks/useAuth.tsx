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
  const hardcodedMaster = 'ce21b049@smail.iitm.ac.in';

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
      console.log('[Auth] Initializing...');
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
        
        const isConfirmed = currentSession?.user?.email_confirmed_at;
        const currentUser = isConfirmed ? (currentSession?.user ?? null) : null;
        setUser(currentUser);
        
        if (currentUser) {
          const p = await fetchProfile(currentUser.id);
          if (mounted) {
             setProfile(p);
             console.log(`[Auth] User ${currentUser.email} logged in. Role: ${p?.role}`);
          }
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
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
    try {
      await supabase.auth.signOut({ scope: 'local' });
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.href = '/login';
    }
  };

  // Force local master check and state sync
  const isMaster = profile?.role === 'MASTER' || 
                   (user?.email === masterEmail && masterEmail !== undefined) || 
                   (user?.email === hardcodedMaster);

  // Sync role to localStorage to help other tabs if real-time is slow
  useEffect(() => {
    if (user && isMaster) {
      localStorage.setItem(`is-master-${user.id}`, 'true');
    }
  }, [user, isMaster]);

  // Listen for real-time profile updates
  useEffect(() => {
    if (!user) return;

    console.log(`[Auth] Subscribing to profile updates for ${user.id}`);
    const channel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          console.log('[Auth] Profile real-time change received:', payload.new);
          setProfile(payload.new as AuthProfile);
        }
      )
      .subscribe((status) => {
        console.log(`[Auth] Profile channel status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle cross-tab role sync via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (user && e.key === `is-master-${user.id}` && e.newValue === 'true') {
        // If another tab found we are master, maybe refresh our profile
        refreshProfile();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
