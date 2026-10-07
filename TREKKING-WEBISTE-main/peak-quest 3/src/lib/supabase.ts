import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values so createClient never receives undefined.
// If env vars are missing (e.g. on Vercel without them set), the client will
// be created but auth calls will fail gracefully — handled by try/catch in
// App.tsx and AuthModal, which fall back to localStorage auth.
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://placeholder.supabase.co';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'placeholder-anon-key';

if (
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseAnonKey === 'placeholder-anon-key'
) {
  console.warn(
    '[Peak Quest] Supabase env vars missing. Auth falls back to localStorage.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
