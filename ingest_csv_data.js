const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://kznbfbtpxvfbikdsdtlk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QkWWZ2Vcs0jzY2A6UBGW8Q_MC45Hgfb';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function startUpload() {
  console.log('🔗 Connected to Supabase Project:', SUPABASE_URL);

  const rawCsvPath = path.join(__dirname, 'raw_buyers_data.csv');
  if (!fs.existsSync(rawCsvPath)) {
    console.error('File not found:', rawCsvPath);
    return;
  }

  const csvContent = fs.readFileSync(rawCsvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const rowsToInsert = [];

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

    const isLoan = (loanAppliedRaw.toLowerCase() === 'yes' || loanAppliedRaw === 'true');
    const satScore = parseFloat(satScoreRaw) || 3.0;

    // Classification per PRD:
    let clusterId = 'C1';
    let clusterName = 'Global Investor';

    if (clientType.toLowerCase() === 'company') {
      clusterId = 'C3';
      clusterName = 'Corporate Buyer';
    } else if (isLoan && acquisitionPurpose.toLowerCase() === 'home') {
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
    } else if (isLoan) {
      clusterId = 'C2';
      clusterName = 'First-Time Buyer';
    } else {
      clusterId = 'C1';
      clusterName = 'Global Investor';
    }

    rowsToInsert.push({
      client_type: clientType === 'Company' ? 'Corporate' : 'Individual',
      gender: gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other',
      country: country || 'United States',
      region: region || 'California',
      acquisition_purpose: acquisitionPurpose === 'Home' ? 'Personal Use' : 'Investment',
      loan_applied: isLoan,
      referral_channel: referralChannel || 'Website',
      satisfaction_score: satScore,
      predicted_cluster_id: clusterId,
      predicted_cluster_name: clusterName,
    });
  }

  console.log(`Parsed ${rowsToInsert.length} records.`);

  // 1. Clear old records
  console.log('Clearing old records from public.buyers...');
  const { error: delErr } = await supabase
    .from('buyers')
    .delete()
    .neq('predicted_cluster_id', 'NON_EXISTENT_ID');

  if (delErr) {
    console.log('Delete status:', delErr.message);
  } else {
    console.log('Cleared old records.');
  }

  // 2. Batch insert in chunks of 50
  const CHUNK_SIZE = 50;
  let successCount = 0;

  for (let i = 0; i < rowsToInsert.length; i += CHUNK_SIZE) {
    const chunk = rowsToInsert.slice(i, i + CHUNK_SIZE);
    const { error: insErr } = await supabase.from('buyers').insert(chunk);
    if (insErr) {
      console.error(`Error on chunk ${i}:`, insErr.message);
    } else {
      successCount += chunk.length;
      process.stdout.write(`\rUploaded ${successCount}/${rowsToInsert.length} records to Supabase...`);
    }
  }

  console.log('\nUpload complete! Verification count:', successCount);
}

startUpload().catch(console.error);
