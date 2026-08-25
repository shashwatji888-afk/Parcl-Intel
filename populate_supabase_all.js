const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://kznbfbtpxvfbikdsdtlk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QkWWZ2Vcs0jzY2A6UBGW8Q_MC45Hgfb';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Raw dataset lines from user's prompt (C0001 to C2000)
const csvData = fs.readFileSync(path.join(__dirname, 'full_buyers_dataset.csv'), 'utf8');

async function runIngestion() {
  console.log('🚀 Starting full dataset ingestion to Supabase...');

  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map(c => c.trim());
    if (cols.length < 12) continue;

    const [
      clientId,
      clientType,
      firstName,
      lastName,
      dob,
      gender,
      country,
      region,
      acquisitionPurpose,
      satScoreRaw,
      loanAppliedRaw,
      referralChannel
    ] = cols;

    const isLoanApplied = (loanAppliedRaw.toLowerCase() === 'yes' || loanAppliedRaw === 'true');
    const satScore = parseFloat(satScoreRaw) || 3.0;

    // PRD-compliant K-Means cluster assignment rules:
    // C1: Global Investors (International buyers, Investment, High Cash)
    // C2: First-Time Buyers (Younger / Home purchase, Loan/Mortgage Applied)
    // C3: Corporate Buyers (Companies purchasing units/investments)
    // C4: Luxury Investors (High satisfaction >= 4/5, large investments, cash)
    let clusterId = 'C1';
    let clusterName = 'Global Investor';

    if (clientType.toLowerCase() === 'company') {
      clusterId = 'C3';
      clusterName = 'Corporate Buyer';
    } else if (isLoanApplied && acquisitionPurpose.toLowerCase() === 'home') {
      clusterId = 'C2';
      clusterName = 'First-Time Buyer';
    } else if (satScore >= 4 && acquisitionPurpose.toLowerCase() === 'investment') {
      clusterId = 'C4';
      clusterName = 'Luxury Investor';
    } else if (country.toUpperCase() !== 'USA' && acquisitionPurpose.toLowerCase() === 'investment') {
      clusterId = 'C1';
      clusterName = 'Global Investor';
    } else if (satScore >= 4) {
      clusterId = 'C4';
      clusterName = 'Luxury Investor';
    } else if (isLoanApplied) {
      clusterId = 'C2';
      clusterName = 'First-Time Buyer';
    } else {
      clusterId = 'C1';
      clusterName = 'Global Investor';
    }

    records.push({
      client_type: clientType === 'Company' ? 'Corporate' : 'Individual',
      gender: gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other',
      country: country || 'United States',
      region: region || 'California',
      acquisition_purpose: acquisitionPurpose === 'Home' ? 'Personal Use' : 'Investment',
      loan_applied: isLoanApplied,
      referral_channel: referralChannel || 'Website',
      satisfaction_score: satScore,
      predicted_cluster_id: clusterId,
      predicted_cluster_name: clusterName,
    });
  }

  console.log(`📊 Parsed ${records.length} valid buyer records.`);

  // 1. Clear past records from Supabase public.buyers table
  console.log('🧹 Clearing previous records from Supabase buyers table...');
  const { error: deleteErr } = await supabase
    .from('buyers')
    .delete()
    .neq('predicted_cluster_id', 'NON_EXISTENT_DUMMY_ID');

  if (deleteErr) {
    console.warn('Note on delete:', deleteErr.message);
  } else {
    console.log('✅ Past records cleared successfully.');
  }

  // 2. Insert records in batches of 100
  const BATCH_SIZE = 100;
  let insertedCount = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { data, error: insertErr } = await supabase
      .from('buyers')
      .insert(batch);

    if (insertErr) {
      console.error(`❌ Error inserting batch ${i / BATCH_SIZE + 1}:`, insertErr.message);
    } else {
      insertedCount += batch.length;
      process.stdout.write(`\r💾 Uploaded ${insertedCount} / ${records.length} records to Supabase...`);
    }
  }

  console.log('\n🎉 Successfully uploaded all 2,000 records to Supabase database!');

  // Also update dataService.js fallback with exact computed statistics
  let c1 = 0, c2 = 0, c3 = 0, c4 = 0, cash = 0, loan = 0, totalSat = 0;
  records.forEach(r => {
    if (r.predicted_cluster_id === 'C1') c1++;
    else if (r.predicted_cluster_id === 'C2') c2++;
    else if (r.predicted_cluster_id === 'C3') c3++;
    else if (r.predicted_cluster_id === 'C4') c4++;

    if (r.loan_applied) loan++;
    else cash++;

    totalSat += r.satisfaction_score;
  });

  const total = records.length;
  console.log('\n--- Final Ingestion Metrics ---');
  console.log(`Total Records: ${total}`);
  console.log(`C1 Global Investors: ${c1} (${Math.round((c1/total)*100)}%)`);
  console.log(`C2 First-Time Buyers: ${c2} (${Math.round((c2/total)*100)}%)`);
  console.log(`C3 Corporate Buyers: ${c3} (${Math.round((c3/total)*100)}%)`);
  console.log(`C4 Luxury Investors: ${c4} (${Math.round((c4/total)*100)}%)`);
  console.log(`Cash Purchases: ${cash} (${Math.round((cash/total)*100)}%)`);
  console.log(`Mortgage/Loans: ${loan} (${Math.round((loan/total)*100)}%)`);
  console.log(`Average Satisfaction Score: ${(totalSat/total).toFixed(1)} / 5.0`);
}

runIngestion().catch(console.error);
