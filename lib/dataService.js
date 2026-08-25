import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Data Service — fetches live data metrics from Supabase public.buyers table
 */
export async function fetchLiveBuyerMetrics() {
  if (!isSupabaseConfigured) {
    return getFallbackMetrics();
  }

  try {
    const { data: buyers, error } = await supabase
      .from('buyers')
      .select('*');

    if (error || !buyers || buyers.length === 0) {
      console.warn('Supabase buyers query returned no records or RLS blocked. Using fallback.', error);
      return getFallbackMetrics();
    }

    const totalBuyers = buyers.length;

    // Count records per cluster
    let c1Count = 0;
    let c2Count = 0;
    let c3Count = 0;
    let c4Count = 0;

    let loanCount = 0;
    let cashCount = 0;
    let totalSatScore = 0;

    // Aggregate regional stats
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
  } catch (err) {
    console.warn('Failed to fetch live buyers from Supabase:', err);
    return getFallbackMetrics();
  }
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
