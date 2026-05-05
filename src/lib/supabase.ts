import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  let supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    // We throw a more descriptive error that will be caught by the usage site
    throw new Error('SUPABASE_CONFIG_MISSING');
  }

  // Sanitize URL: Remove /rest/v1 suffix if it exists
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  console.log('[Supabase] Initializing with URL:', supabaseUrl.substring(0, 20) + '...');
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// We export a proxy that lazily initializes the supabase client
// This prevents module-load time crashes while keeping the API compatible
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => {
    try {
      const client = getSupabase();
      return (client as any)[prop];
    } catch (e: any) {
      if (e.message === 'SUPABASE_CONFIG_MISSING') {
        // Return a dummy object that fails gracefully on major calls
        // This allows the app to mount and show a login screen or warning 
        // instead of a white screen crash
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
          return () => ({
            select: () => ({
              eq: () => ({
                single: async () => ({ data: null, error: { message: 'Supabase URL not configured' } }),
                order: () => ({ data: [], error: { message: 'Supabase URL not configured' } }),
              }),
              order: () => ({ data: [], error: { message: 'Supabase URL not configured' } }),
            }),
            upsert: async () => ({ error: { message: 'Supabase URL not configured' } }),
            insert: async () => ({ error: { message: 'Supabase URL not configured' } }),
          });
        }
      }
      throw e;
    }
  }
});
