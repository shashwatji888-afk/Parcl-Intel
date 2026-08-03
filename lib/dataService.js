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

    buyers.forEach((b) => {
      const cId = b.predicted_cluster_id || 'C1';
      if (cId === 'C1') c1Count++;
      else if (cId === 'C2') c2Count++;
      else if (cId === 'C3') c3Count++;
      else if (cId === 'C4') c4Count++;

      if (b.loan_applied) loanCount++;
      else cashCount++;

      totalSatScore += parseFloat(b.satisfaction_score || 8.0);
    });

    const c1Pct = Math.round((c1Count / totalBuyers) * 100) || 0;
    const c2Pct = Math.round((c2Count / totalBuyers) * 100) || 0;
    const c3Pct = Math.round((c3Count / totalBuyers) * 100) || 0;
    const c4Pct = Math.round((c4Count / totalBuyers) * 100) || 0;

    const avgSatScore = (totalSatScore / totalBuyers).toFixed(1);
    const cashPct = Math.round((cashCount / totalBuyers) * 100);

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
    };
  } catch (err) {
    console.warn('Failed to fetch live buyers from Supabase:', err);
    return getFallbackMetrics();
  }
}

function getFallbackMetrics() {
  return {
    totalBuyers: 16,
    formattedTotalBuyers: '16',
    c1Count: 5,
    c1Pct: 31,
    c2Count: 4,
    c2Pct: 25,
    c3Count: 3,
    c3Pct: 19,
    c4Count: 4,
    c4Pct: 25,
    avgSatScore: '8.9',
    cashPct: 75,
    isLive: false,
    rawBuyers: [],
  };
}
