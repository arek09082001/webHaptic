import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client using anonymous key
// This is safe for public/read operations
// Sensitive operations should use the service role key server-side (see lib/auth.ts)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
