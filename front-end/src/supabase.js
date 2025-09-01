import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
