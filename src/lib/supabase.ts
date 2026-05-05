import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  // If config is missing or placeholder, we return the dummy client via the proxy catch block
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase')) {
    throw new Error('SUPABASE_CONFIG_MISSING');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// This proxy allows the app to load even if environment variables are missing
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    try {
      const client = getSupabase();
      const value = (client as any)[prop];

      // Fix for internal 'this' binding in supabase-js
      if (typeof value === 'function') {
        return value.bind(client);
      }

      // Deep proxy for 'auth' to handle its methods too
      if (prop === 'auth' && typeof value === 'object' && value !== null) {
        return new Proxy(value, {
          get: (authTarget, authProp) => {
            const authValue = (authTarget as any)[authProp];
            if (typeof authValue === 'function') {
              return authValue.bind(authTarget);
            }
            return authValue;
          }
        });
      }

      return value;
    } catch (e: any) {
      if (e.message === 'SUPABASE_CONFIG_MISSING') {
        // Safe mocks for auth methods to prevent crashes
        if (prop === 'auth') {
          return {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ error: { message: 'Supabase URL not configured' } }),
            signUp: async () => ({ error: { message: 'Supabase URL not configured' } }),
            signOut: async () => ({ error: null }),
          };
        }
        if (prop === 'from') {
          const dummy: any = () => ({
            select: () => dummy(),
            eq: () => dummy(),
            single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            then: (res: any) => res({ data: null, error: null }),
          });
          return dummy;
        }
        return (target as any)[prop];
      }
      throw e;
    }
  }
});

