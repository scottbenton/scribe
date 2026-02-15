import { createClient } from "@supabase/supabase-js";
import { getEnvVarOrThrow } from "./env.lib";

const SUPABASE_URL = getEnvVarOrThrow("VITE_SUPABASE_URL");
const SUPABASE_PUBLISHABLE_KEY = getEnvVarOrThrow(
  "VITE_SUPABASE_PUBLISHABLE_KEY",
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
