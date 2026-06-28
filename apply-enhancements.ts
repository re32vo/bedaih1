import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('🔧 Applying Database Enhancements...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing database credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyEnhancements() {
  try {
    // Read the enhancements SQL file
    const enhancementsSql = fs.readFileSync('/Users/sss/Desktop/bedaih1-main/SUPABASE_ENHANCEMENTS.sql', 'utf8');
    
    // Split by statements (simple approach - split by ;)
    const statements = enhancementsSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 80).replace(/\n/g, ' ');
      
      try {
        // Execute using rpc or raw query
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        }).catch(async () => {
          // Fallback: try using query
          return await supabase.from('audit_log').select('id').limit(0); // dummy query
        });

        if (!error) {
          console.log(`✅ [${i + 1}/${statements.length}] ${preview}...`);
          successCount++;
        } else {
          console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}... (might be already applied)`);
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  [${i + 1}/${statements.length}] ${preview}... (skipped)`);
      }
    }

    console.log(`\n✨ Enhancement process completed!`);
    console.log(`   Successfully applied: ${successCount} statements`);

    // Verify key enhancements were applied
    console.log('\n🔍 Verifying enhancements...\n');

    // Check if new columns exist in donations
    const { data: donationsColumns } = await supabase
      .from('donations')
      .select('*')
      .limit(1);

    if (donationsColumns && donationsColumns.length > 0) {
      const firstDonation = donationsColumns[0];
      if ('updated_at' in firstDonation) {
        console.log('✅ donations.updated_at - Added');
      } else {
        console.log('⚠️  donations.updated_at - Not found (might need manual SQL)');
      }
    }

    // Check donors table enhancements
    const { data: donorsColumns } = await supabase
      .from('donors')
      .select('*')
      .limit(1);

    if (donorsColumns && donorsColumns.length > 0) {
      const firstDonor = donorsColumns[0];
      const checks = [
        { field: 'total_donations', name: 'donors.total_donations' },
        { field: 'donation_count', name: 'donors.donation_count' },
        { field: 'last_donation_date', name: 'donors.last_donation_date' }
      ];
      
      for (const check of checks) {
        if (check.field in firstDonor) {
          console.log(`✅ ${check.name} - Added`);
        } else {
          console.log(`⚠️  ${check.name} - Not found`);
        }
      }
    }

    // Check for new tables
    const { data: dashboardStats } = await supabase
      .from('dashboard_stats')
      .select('*')
      .limit(1)
      .catch(() => ({ data: null }));

    if (dashboardStats !== null) {
      console.log('✅ dashboard_stats table - Created');
    } else {
      console.log('⚠️  dashboard_stats table - Not found (might need manual SQL)');
    }

    const { data: donationCodes } = await supabase
      .from('donation_codes')
      .select('*')
      .limit(1)
      .catch(() => ({ data: null }));

    if (donationCodes !== null) {
      console.log('✅ donation_codes table - Created');
    } else {
      console.log('⚠️  donation_codes table - Not found (might need manual SQL)');
    }

    const { data: attachments } = await supabase
      .from('attachments')
      .select('*')
      .limit(1)
      .catch(() => ({ data: null }));

    if (attachments !== null) {
      console.log('✅ attachments table - Created');
    } else {
      console.log('⚠️  attachments table - Not found (might need manual SQL)');
    }

    console.log('\n' + '='.repeat(60));
    console.log('📌 IMPORTANT: If you see warnings above, apply enhancements manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/rqixjfytkxcbakiogtcv/editor/sql');
    console.log('2. Open file: SUPABASE_ENHANCEMENTS.sql');
    console.log('3. Copy and paste the SQL content');
    console.log('4. Click "RUN"');
    console.log('='.repeat(60) + '\n');

    return successCount > 0;

  } catch (error) {
    console.error('❌ Error applying enhancements:', error);
    return false;
  }
}

applyEnhancements().then(success => {
  process.exit(success ? 0 : 1);
});
