const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manual parser
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[match[1]] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Diagnostic Supabase Client:");
console.log("URL:", supabaseUrl);
console.log("Key Length:", supabaseKey ? supabaseKey.length : 0);

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
  try {
    console.log("\n1. Querying profiles count...");
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .limit(10);
    
    if (pError) {
      console.error("❌ Profiles Table Error:", pError);
    } else {
      console.log("✅ Profiles retrieved successfully!");
      console.log("Profiles Count:", profiles.length);
      console.log("Profiles list:", profiles);
    }

    console.log("\n2. Querying registrations count...");
    const { data: regs, error: rError } = await supabase
      .from('registrations')
      .select('id, status')
      .limit(10);
    
    if (rError) {
      console.error("❌ Registrations Table Error:", rError);
    } else {
      console.log("✅ Registrations retrieved successfully!");
      console.log("Registrations Count:", regs.length);
      console.log("Registrations list:", regs);
    }

  } catch (err) {
    console.error("Exception during diagnostic query:", err);
  }
}

runDiagnostics();
