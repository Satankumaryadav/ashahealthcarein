// Supabase configuration placeholder - fill before connecting
const SUPABASE_URL = 'https://aszbnhaqncseochisjct.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9CkV2PAoG07_Agz7NY6nDA_1zUk8wwC';

// Create supabase client when keys are provided
let supabase = null;
function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  supabase = supabase || window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return supabase;
}

export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, createSupabaseClient, supabase };
