import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnrwhxotenpczzrrwqtpn.supabase.co';
const supabaseAnonKey = 'sb_publishable_A4qA_WJwtMxq1QMx2QG-oQ_0STvA4s0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);