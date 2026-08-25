const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://kznbfbtpxvfbikdsdtlk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QkWWZ2Vcs0jzY2A6UBGW8Q_MC45Hgfb';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedMarkets() {
  const dataPath = path.join(__dirname, '..', 'lib', 'marketData.json');
  const marketRecords = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Loaded ${marketRecords.length} market records from JSON.`);

  // Check if markets table exists
  const { data, error } = await supabase.from('markets').select('id').limit(1);

  if (error) {
    console.error('Error querying markets table in Supabase:', error.message);
    console.log('\n--- HOW TO CREATE THE TABLE IN SUPABASE SQL EDITOR ---');
    console.log(`
CREATE TABLE public.markets (
  id SERIAL PRIMARY KEY,
  parcl_id VARCHAR(50),
  name VARCHAR(255),
  location_type VARCHAR(50),
  total_listings INTEGER,
  motivated_seller_index_value NUMERIC,
  motivated_seller_index_label VARCHAR(50),
  pct_listings_with_price_cuts NUMERIC,
  unrealized_loss_pct NUMERIC,
  price_change_1y VARCHAR(50),
  fin_pct_all_cash VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.markets FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.markets FOR INSERT WITH CHECK (true);
    `);
    return;
  }

  console.log('markets table found! Seeding records in batches...');
  const batchSize = 100;
  for (let i = 0; i < marketRecords.length; i += batchSize) {
    const batch = marketRecords.slice(i, i + batchSize).map((m) => ({
      parcl_id: m.id,
      name: m.name,
      location_type: m.locationType,
      total_listings: m.totalListings,
      motivated_seller_index_value: m.msi,
      motivated_seller_index_label: m.msiLabel,
      pct_listings_with_price_cuts: parseFloat(m.priceCutsPct),
      unrealized_loss_pct: parseFloat(m.unrealizedLoss),
      price_change_1y: m.priceChange1y,
      fin_pct_all_cash: m.cashPct
    }));

    const { error: insertErr } = await supabase.from('markets').upsert(batch, { onConflict: 'parcl_id' });
    if (insertErr) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, insertErr.message);
    } else {
      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} items)`);
    }
  }

  console.log('Seeding complete!');
}

seedMarkets();
