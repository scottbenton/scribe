import { createClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase.type";

import { getEnvVarOrThrow } from "./env.lib";

const SUPABASE_URL = getEnvVarOrThrow("VITE_SUPABASE_URL");
const SUPABASE_PUBLISHABLE_KEY = getEnvVarOrThrow(
  "VITE_SUPABASE_PUBLISHABLE_KEY",
);

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
