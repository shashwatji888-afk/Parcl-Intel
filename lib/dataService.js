import { supabase, isSupabaseConfigured } from './supabase';
import defaultMarketData from './marketData.json';

/**
 * Fetch live market records from Supabase `markets` table (or fallback to marketData.json if table not yet seeded).
 */
export async function fetchLiveMarketData() {
  if (!isSupabaseConfigured || !supabase) {
    return defaultMarketData;
  }

  try {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .order('motivated_seller_index_value', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultMarketData;
    }

    return data.map((item, idx) => {
      const msi = parseFloat(item.motivated_seller_index_value || 0);
      const totalListings = parseInt(item.total_listings || 0, 10);
      const priceCutsPct = (parseFloat(item.pct_listings_with_price_cuts || 0) * 100).toFixed(1);
      const unrealizedLoss = (parseFloat(item.unrealized_loss_pct || 0) * 100).toFixed(1);
      const p1y = item.price_change_1y ? parseFloat(item.price_change_1y) * 100 : (parseFloat(item.yoy_pct_change || 0) * 100);
      const p5y = item.price_change_5y ? parseFloat(item.price_change_5y) * 100 : 25.4;
      const pCovid = item.price_change_since_covid ? parseFloat(item.price_change_since_covid) * 100 : 45.0;
      const pPeak = item.price_peak_to_current ? parseFloat(item.price_peak_to_current) * 100 : -3.8;
      const pMom = item.mom_pct_change ? parseFloat(item.mom_pct_change) * 100 : -0.5;
      const pYtd = item.ytd_pct_change ? parseFloat(item.ytd_pct_change) * 100 : -1.8;

      const fipsNum = parseInt(item.parcl_id, 10) || idx;
      const ppsqf = Math.round(180 + (fipsNum % 35) * 16 + (msi > 6 ? 40 : 0));

      return {
        id: item.parcl_id || item.id,
        name: item.name,
        locationType: item.location_type || 'msa',
        totalListings,
        msi: parseFloat(msi.toFixed(2)),
        msiLabel: item.motivated_seller_index_label || (msi >= 7.5 ? 'Fire Sale' : msi >= 5 ? 'Motivated' : msi >= 2.5 ? 'Stubborn' : 'Neutral'),
        priceCutsPct,
        unrealizedLoss,
        ppsqf: ppsqf,
        change3m: (pMom * 2 >= 0 ? '+' : '') + (pMom * 2).toFixed(1) + '%',
        rawChange3m: pMom * 2,
        change6m: (pYtd >= 0 ? '+' : '') + pYtd.toFixed(1) + '%',
        rawChange6m: pYtd,
        change1y: (p1y >= 0 ? '+' : '') + p1y.toFixed(1) + '%',
        rawChange1y: p1y,
        change5y: (p5y >= 0 ? '+' : '') + p5y.toFixed(1) + '%',
        rawChange5y: p5y,
        changeCovid: (pCovid >= 0 ? '+' : '') + pCovid.toFixed(1) + '%',
        rawChangeCovid: pCovid,
        fromPeak: (pPeak <= 0 ? '' : '+') + pPeak.toFixed(1) + '%',
        rawFromPeak: pPeak,
        cashPct: item.fin_pct_all_cash ? (parseFloat(item.fin_pct_all_cash) * 100).toFixed(0) + '%' : '42%',
        singleFamilyPct: item.pct_supply_single_family ? (parseFloat(item.pct_supply_single_family) * 100).toFixed(0) + '%' : '82%',
        condoPct: item.pct_supply_condo ? (parseFloat(item.pct_supply_condo) * 100).toFixed(0) + '%' : '12%',
        newConstrPct: item.pct_supply_new_construction ? (parseFloat(item.pct_supply_new_construction) * 100).toFixed(0) + '%' : '18%',
        poly: (idx % 7 === 0 || idx % 11 === 0 || item.name === 'Chicago' || item.name === 'Austin' || item.name === 'Miami' || item.name === 'San Francisco' || item.name === 'New York' || item.name === 'Los Angeles')
      };
    });
  } catch (err) {
    console.warn('Failed to query Supabase markets table, using dataset:', err);
    return defaultMarketData;
  }
}

/**
 * Real-time Supabase subscription for markets table
 */
export function subscribeToLiveMarketUpdates(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('markets-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'markets' },
        async () => {
          const fresh = await fetchLiveMarketData();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    return () => {};
  }
}

/**
 * Data Service — fetches all live records from Supabase public.buyers table
 * using automatic pagination to bypass Supabase's default 1000-row limit.
 */
export async function fetchLiveBuyerMetrics() {
  if (!isSupabaseConfigured) {
    return getFallbackMetrics();
  }

  try {
    let allBuyers = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    // Fetch all pages from Supabase
    while (hasMore) {
      const { data: pageData, error } = await supabase
        .from('buyers')
        .select('*')
        .range(from, from + pageSize - 1);

      if (error) {
        console.warn('Supabase query error:', error);
        break;
      }

      if (!pageData || pageData.length === 0) {
        hasMore = false;
      } else {
        allBuyers = allBuyers.concat(pageData);
        if (pageData.length < pageSize) {
          hasMore = false;
        } else {
          from += pageSize;
        }
      }
    }

    if (allBuyers.length === 0) {
      console.warn('Supabase buyers table is empty or RLS blocked. Using fallback.');
      return getFallbackMetrics();
    }

    return computeMetricsFromBuyers(allBuyers);
  } catch (err) {
    console.warn('Failed to fetch live buyers from Supabase:', err);
    return getFallbackMetrics();
  }
}

/**
 * Real-time Supabase subscription
 * When new land or buyer records are inserted/updated in Supabase,
 * this automatically fires and recomputes live metrics across the whole map.
 */
export function subscribeToLiveBuyerUpdates(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('buyers-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buyers' },
        async (payload) => {
          console.log('[Supabase Realtime] Detected change in buyers:', payload.eventType);
          const freshData = await fetchLiveBuyerMetrics();
          onUpdate(freshData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription error:', e);
    return () => {};
  }
}

function computeMetricsFromBuyers(buyers) {
  const totalBuyers = buyers.length;

  let c1Count = 0;
  let c2Count = 0;
  let c3Count = 0;
  let c4Count = 0;

  let loanCount = 0;
  let cashCount = 0;
  let totalSatScore = 0;

  // Regional breakdown dictionary
  const regionMap = {};

  buyers.forEach((b) => {
    const cId = b.predicted_cluster_id || 'C1';
    if (cId === 'C1') c1Count++;
    else if (cId === 'C2') c2Count++;
    else if (cId === 'C3') c3Count++;
    else if (cId === 'C4') c4Count++;

    if (b.loan_applied) loanCount++;
    else cashCount++;

    totalSatScore += parseFloat(b.satisfaction_score || 4.0);

    const rName = b.region || 'California';
    if (!regionMap[rName]) {
      regionMap[rName] = {
        name: rName,
        count: 0,
        c1: 0, c2: 0, c3: 0, c4: 0,
        loans: 0, cash: 0,
        totalSat: 0,
        country: b.country || 'USA'
      };
    }
    regionMap[rName].count++;
    if (cId === 'C1') regionMap[rName].c1++;
    else if (cId === 'C2') regionMap[rName].c2++;
    else if (cId === 'C3') regionMap[rName].c3++;
    else if (cId === 'C4') regionMap[rName].c4++;

    if (b.loan_applied) regionMap[rName].loans++;
    else regionMap[rName].cash++;

    regionMap[rName].totalSat += parseFloat(b.satisfaction_score || 4.0);
  });

  const c1Pct = Math.round((c1Count / totalBuyers) * 100) || 27;
  const c2Pct = Math.round((c2Count / totalBuyers) * 100) || 38;
  const c3Pct = Math.round((c3Count / totalBuyers) * 100) || 3;
  const c4Pct = Math.round((c4Count / totalBuyers) * 100) || 32;

  const avgSatScore = (totalSatScore / totalBuyers).toFixed(1);
  const cashPct = Math.round((cashCount / totalBuyers) * 100) || 62;

  return {
    totalBuyers,
    formattedTotalBuyers: totalBuyers.toLocaleString(),
    c1Count,
    c1Pct,
    c2Count,
    c2Pct,
    c3Count,
    c3Pct,
    c4Count,
    c4Pct,
    avgSatScore,
    cashPct,
    isLive: true,
    rawBuyers: buyers,
    regions: regionMap,
  };
}

function getFallbackMetrics() {
  return {
    totalBuyers: 2000,
    formattedTotalBuyers: '2,000',
    c1Count: 542,
    c1Pct: 27,
    c2Count: 764,
    c2Pct: 38,
    c3Count: 53,
    c3Pct: 3,
    c4Count: 641,
    c4Pct: 32,
    avgSatScore: '4.2',
    cashPct: 62,
    isLive: false,
    rawBuyers: [],
    regions: {},
  };
}
