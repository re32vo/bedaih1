import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('🔍 Checking Database Connection...\n');
console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing database credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    // Check donations table
    console.log('\n📊 Checking DONATIONS table:');
    const { data: donations, error: donErr } = await supabase
      .from('donations')
      .select('*')
      .limit(5);
    
    if (donErr) {
      console.log('❌ Error:', donErr.message);
    } else {
      console.log('✅ Table exists');
      console.log('   Records found:', donations?.length || 0);
      if (donations && donations.length > 0) {
        console.log('   Sample:', JSON.stringify(donations[0], null, 2));
      }
    }

    // Check bank_transfers table
    console.log('\n📊 Checking BANK_TRANSFERS table:');
    const { data: transfers, error: btErr } = await supabase
      .from('bank_transfers')
      .select('*')
      .limit(5);
    
    if (btErr) {
      console.log('❌ Error:', btErr.message);
    } else {
      console.log('✅ Table exists');
      console.log('   Records found:', transfers?.length || 0);
      if (transfers && transfers.length > 0) {
        console.log('   Sample:', JSON.stringify(transfers[0], null, 2));
      }
    }

    // Check donors table
    console.log('\n📊 Checking DONORS table:');
    const { data: donors, error: donorErr } = await supabase
      .from('donors')
      .select('*')
      .limit(5);
    
    if (donorErr) {
      console.log('❌ Error:', donorErr.message);
    } else {
      console.log('✅ Table exists');
      console.log('   Records found:', donors?.length || 0);
    }

    // Check all tables via information_schema
    console.log('\n📋 All tables in database:');
    const { data: tables, error: tableErr } = await supabase
      .rpc('get_tables', {}, { count: 'exact' })
      .catch(() => ({ data: null, error: { message: 'RPC function not available' } }));
    
    if (tableErr) {
      console.log('⚠️  Could not fetch tables via RPC');
    } else if (tables) {
      console.log('   Tables:', tables);
    }

  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

checkDatabase();
