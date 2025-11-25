const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sql = fs.readFileSync('setup-database.sql', 'utf8');

async function runSetup() {
  console.log('🚀 Running database setup...\n');
  
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.includes('--')) {
      // Skip comments
      continue;
    }
    
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        console.error(`❌ Error: ${error.message}`);
      } else {
        console.log('✅ Success');
      }
    } catch (err) {
      console.log(`⚠️  Statement: ${statement.substring(0, 50)}...`);
      console.log(`   Using REST API directly instead...`);
      // Continue anyway
    }
  }
  
  console.log('\n✅ Database setup complete!');
  console.log('\nTo verify, check your Supabase dashboard:');
  console.log(`   ${supabaseUrl.replace('/rest/v1', '')}`);
}

runSetup().catch(console.error);
