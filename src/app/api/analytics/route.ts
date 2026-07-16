import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Generate analytics chart series matching Rajesh's anomalous activities
    const downloadTrendData = [
      { day: 'Mon', Standard: 180, 'Actual Downloads': 195 },
      { day: 'Tue', Standard: 210, 'Actual Downloads': 225 },
      { day: 'Wed', Standard: 190, 'Actual Downloads': 1650 }, // Anomalous Wed exfiltration
      { day: 'Thu', Standard: 200, 'Actual Downloads': 210 },
      { day: 'Fri', Standard: 220, 'Actual Downloads': 240 },
      { day: 'Sat', Standard: 45, 'Actual Downloads': 50 },
      { day: 'Sun', Standard: 30, 'Actual Downloads': 45 }
    ];

    const usbWriteData = [
      { day: 'Mon', Standard: 0, Actual: 0 },
      { day: 'Tue', Standard: 0, Actual: 0 },
      { day: 'Wed', Standard: 0, Actual: 1 }, // Rajesh Cruzer USB insertion
      { day: 'Thu', Standard: 0, Actual: 0 },
      { day: 'Fri', Standard: 0, Actual: 0 },
      { day: 'Sat', Standard: 0, Actual: 0 },
      { day: 'Sun', Standard: 0, Actual: 0 }
    ];

    const queryOverrideData = [
      { category: 'Client Portfolios', Standard: 15, Actual: 98 },
      { category: 'HR Payrolls', Standard: 2, Actual: 14 },
      { category: 'Dormant Accounts', Standard: 5, Actual: 35 },
      { category: 'VLAN Policies', Standard: 0, Actual: 2 },
      { category: 'CAB Changes', Standard: 8, Actual: 9 }
    ];

    return NextResponse.json({
      downloadTrendData,
      usbWriteData,
      queryOverrideData
    });

  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
