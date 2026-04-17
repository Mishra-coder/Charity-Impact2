const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const isConfigured = supabaseUrl && 
                     supabaseServiceKey && 
                     !supabaseUrl.includes('your_supabase') && 
                     !supabaseServiceKey.includes('your_supabase');

if (!isConfigured) {
  console.error('\n⚠️  WARNING: Supabase credentials not configured!');
  console.error('Please update backend/.env with your Supabase credentials');
  console.error('The server will start but API calls will fail.\n');
}

// Use valid placeholder values that pass Supabase client validation
const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  isConfigured ? supabaseServiceKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoxOTI1MDM1MjAwfQ.placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = supabase;
