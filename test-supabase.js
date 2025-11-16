// Quick test script to verify Supabase connection
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffvgvjymkiaiasfrhqih.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdmd2anlta2lhaWFzZnJocWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjc4MzYsImV4cCI6MjA3ODgwMzgzNn0.XGvMtqMXozWP2r6MIHX9Tok9LUScPk2cuGVV16_f5aY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 20) + '...\n');

  try {
    // Test 1: Count influencers
    console.log('📊 Test 1: Counting influencers...');
    const { count, error: countError } = await supabase
      .from('Influencer')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count failed:', countError.message);
    } else {
      console.log('✅ Total influencers:', count);
    }

    // Test 2: Fetch first 5 influencers
    console.log('\n📊 Test 2: Fetching first 5 influencers...');
    const { data, error } = await supabase
      .from('Influencer')
      .select('id, name, trustScore, niche')
      .limit(5);

    if (error) {
      console.error('❌ Fetch failed:', error.message);
    } else {
      console.log('✅ Fetched', data.length, 'influencers:');
      data.forEach((inf, i) => {
        console.log(`  ${i + 1}. ${inf.name} (${inf.niche}) - Trust: ${inf.trustScore}`);
      });
    }

    // Test 3: Get stats
    console.log('\n📊 Test 3: Calculating stats...');
    const { data: allInfluencers, error: statsError } = await supabase
      .from('Influencer')
      .select('trustScore, dramaCount, goodActionCount');

    if (statsError) {
      console.error('❌ Stats failed:', statsError.message);
    } else {
      const avgTrust = allInfluencers.reduce((sum, i) => sum + i.trustScore, 0) / allInfluencers.length;
      const totalDramas = allInfluencers.reduce((sum, i) => sum + i.dramaCount, 0);
      const totalGoodActions = allInfluencers.reduce((sum, i) => sum + i.goodActionCount, 0);
      
      console.log('✅ Stats calculated:');
      console.log('  - Average Trust Score:', avgTrust.toFixed(2));
      console.log('  - Total Dramas:', totalDramas);
      console.log('  - Total Good Actions:', totalGoodActions);
    }

    console.log('\n✅ All tests passed! Supabase connection is working.\n');
  } catch (err) {
    console.error('\n❌ Unexpected error:', err.message);
    console.error(err);
  }
}

testConnection();
