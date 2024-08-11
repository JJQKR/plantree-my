import { Database } from './../types/supabase';

import { createClient, UserAttributes as SupabaseUserAttributes } from '@supabase/supabase-js';

export type UserAttributes = SupabaseUserAttributes & { token?: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and API key are required.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
