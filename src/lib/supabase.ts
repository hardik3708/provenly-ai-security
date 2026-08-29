import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Add these keys in the Keys/API keys tab.",
  );
}

/**
 * Supabase client for the Provenly project.
 *
 * Use this to access Supabase features: database queries, auth, storage, realtime subscriptions.
 *
 * @example
 * ```ts
 * import { supabase } from "@/lib/supabase";
 *
 * const { data, error } = await supabase.from("threats").select("*");
 * ```
 */
export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
);
