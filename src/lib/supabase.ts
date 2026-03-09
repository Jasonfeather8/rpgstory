import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uunpzkkpjytldqsfnkac.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P-2eqnbT_t_OAel5qWv_yQ_veBo3gVQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
