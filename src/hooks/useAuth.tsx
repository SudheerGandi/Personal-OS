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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setSession(session);
        const currentUser = session?.user ?? null;
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
      const currentUser = session?.user ?? null;
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
    await supabase.auth.signOut();
  };

  const isMaster = profile?.role === 'MASTER' || (user?.email === masterEmail && masterEmail !== undefined);

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
