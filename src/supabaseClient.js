import { createClient } from '@supabase/supabase-js';

// 1. Replace these with your actual Supabase Project URL and Anon Key
// You can find these in your Supabase Dashboard under Settings > API
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

// 2. Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/* 
  Usage Example in App.jsx:
  
  import { supabase } from './supabaseClient';

  // Fetching data:
  const { data, error } = await supabase.from('tasks').select('*');

  // Inserting data:
  const { error } = await supabase.from('expenses').insert([
    { amount: 500, note: 'Milk', owner: 'Sarah' }
  ]);
*/