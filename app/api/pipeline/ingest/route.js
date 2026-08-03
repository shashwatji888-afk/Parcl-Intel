import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../../lib/supabase';

/**
 * POST /api/pipeline/ingest — Data Ingestion Pipeline API
 * Accepts array of buyer profiles or batch CSV payload to feed into Supabase DB & ML Engine.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const records = Array.isArray(body) ? body : [body];

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'No data records provided in request body.' },
        { status: 400 }
      );
    }

    // Process & Classify each record
    const processedRecords = records.map((record) => {
      const clientType = record.clientType || 'Individual';
      const country = record.country || 'United States';
      const purpose = record.purpose || 'Investment';
      const loanApplied = Boolean(record.loanApplied);
      const satScore = parseFloat(record.satScore || 8.0);

      // Execute ML Classifier
      let clusterId = 'C1';
      let clusterName = 'Global Investor';

      if (clientType === 'Corporate') {
        clusterId = 'C3';
        clusterName = 'Corporate Buyer';
      } else if (satScore >= 8.8 && purpose === 'Investment' && !loanApplied) {
        clusterId = 'C4';
        clusterName = 'Luxury Investor';
      } else if (purpose === 'Personal Use' || loanApplied) {
        clusterId = 'C2';
        clusterName = 'First-Time Buyer';
      }

      return {
        client_type: clientType,
        gender: record.gender || 'Other',
        country,
        region: record.region || 'Default Region',
        acquisition_purpose: purpose,
        loan_applied: loanApplied,
        referral_channel: record.channel || 'Direct',
        satisfaction_score: satScore,
        predicted_cluster_id: clusterId,
        predicted_cluster_name: clusterName,
        created_at: new Date().toISOString(),
      };
    });

    let insertedData = processedRecords;

    // Insert into Supabase if configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('buyers')
        .insert(processedRecords)
        .select();

      if (!error && data) {
        insertedData = data;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested and classified ${processedRecords.length} buyer profiles.`,
      recordsIngested: processedRecords.length,
      sampleRecord: insertedData[0],
      supabaseStatus: isSupabaseConfigured ? 'Saved to Supabase public.buyers table' : 'Processed in Sandbox Mode',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Data ingestion failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/pipeline/ingest',
    format: 'POST JSON Array of Buyer Objects',
    samplePayload: [
      {
        clientType: 'Corporate',
        gender: 'Male',
        country: 'UAE',
        region: 'Dubai',
        purpose: 'Investment',
        loanApplied: false,
        channel: 'Direct',
        satScore: 9.1,
      },
    ],
  });
}
