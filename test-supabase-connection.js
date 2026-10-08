// test-supabase-connection.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nonlkkewujpoztzhzfwh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_X_ICNGdFFa2eInHDEbX-_w_iP2gGNvm';

console.log('--- Supabase Connection Test ---');
console.log('Supabase URL:', supabaseUrl);
console.log('Key Loaded:', Boolean(supabaseAnonKey));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  try {
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    if (error && error.code === 'PGRST205') {
      console.log('✅ SUCCESS: Live connection to Supabase project established successfully!');
      console.log('ℹ️ Server Response: Connected to project nonlkkewujpoztzhzfwh');
    } else if (error) {
      console.log('ℹ️ Connected with status:', error.message);
    } else {
      console.log('✅ SUCCESS: Live connection & query successful!');
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

runTest();
