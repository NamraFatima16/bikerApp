import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://jnrwhxotenpczrrwqtpn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucndoeG90ZW5wY3pycndxdHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjkwNDUsImV4cCI6MjA4ODkwNTA0NX0.tGEIXCn18XsMs1MsLp4YjQOW91R-QN0YnATdZLdztK0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
