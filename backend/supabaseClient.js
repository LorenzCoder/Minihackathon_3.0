/*
Author: C0Eight (3fa85f64-e556-3210-p3xu2c0d3)
supabaseClient.js (c) 2025
Created:  2025-12-05T23:03:12.045Z
*/

// backend/supabaseClient.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log("Supabase URL aus .env:", supabaseUrl ? "✔️ gesetzt" : "❌ FEHLT");
console.log(
  "Supabase Key aus .env:",
  supabaseKey ? "✔️ gesetzt" : "❌ FEHLT"
);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL oder Key fehlen. Check deine .env im backend.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
