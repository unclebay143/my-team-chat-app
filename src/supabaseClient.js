
import { createClient } from "@supabase/supabase-js";

const supabasebaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasebaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabasebaseUrl, supabasebaseAnonKey)