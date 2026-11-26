import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing. History persistence will be unavailable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

/** Configurable Flask backend URL. Set VITE_ANALYSIS_API_URL when a real backend exists. */
export const ANALYSIS_API_URL = (import.meta.env.VITE_ANALYSIS_API_URL as string | undefined) ?? '';
