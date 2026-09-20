// Supabase configuration placeholder - fill before connecting
const SUPABASE_URL = '';
const SUPABASE_PUBLISHABLE_KEY = '';

// Create supabase client when keys are provided
let supabase = null;
function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  supabase = supabase || window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return supabase;
}

export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, createSupabaseClient, supabase };
