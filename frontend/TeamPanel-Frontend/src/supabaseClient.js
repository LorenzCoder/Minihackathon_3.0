/*
Author: C0Eight (3fa85f64-e556-3210-p3xu2c0d3)
supabaseClient.js (c) 2025
Created:  2025-12-06T18:46:05.410Z
*/

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase Env Variablen fehlen im Frontend.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
