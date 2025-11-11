import { createClient as createClientSide } from "@supabase/supabase-js";

export async function createClientSideClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPA_API_KEY!;
  const supabase = createClientSide(supabaseUrl, supabaseKey);
  return supabase;
}
