import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { 
        department: { select: { name: true } },
        activities: { orderBy: { timestamp: 'desc' } },
        twinProfile: true
      }
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }

    // Parse twin arrays
    const behaviorDNA = employee.twinProfile ? JSON.parse(employee.twinProfile.behaviorDNA) : [];
    const weeklyPattern = employee.twinProfile ? JSON.parse(employee.twinProfile.weeklyPattern) : [];
    const monthlyPattern = employee.twinProfile ? JSON.parse(employee.twinProfile.monthlyPattern) : [];

    const result = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department?.name || 'Unknown',
      status: employee.status,
      baselineWorkingHours: { start: employee.baselineStart, end: employee.baselineEnd },
      currentWorkingHours: { start: employee.currentStart, end: employee.currentEnd },
      driftScore: employee.driftScore,
      trustScore: employee.trustScore,
      predictionRisk: employee.predictionRisk,
      behaviorDNA,
      weeklyPattern,
      monthlyPattern,
      recentLogs: employee.activities.map(log => ({
        id: log.id,
        timestamp: log.timestamp.toISOString(),
        category: log.category,
        description: log.description,
        severity: log.severity,
        anomaly: log.anomaly
      })),
      aiTwinSummary: employee.aiTwinSummary,
      anomaliesCount: employee.anomaliesCount
    };

    return NextResponse.json({ employee: result });

  } catch (error: any) {
    console.error('Employee dynamic fetch API error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
