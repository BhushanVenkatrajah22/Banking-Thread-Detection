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
        twinProfile: true,
        activities: { where: { anomaly: true } }
      }
    });

    if (!employee) {
      return NextResponse.json({ error: 'Digital Twin not found.' }, { status: 404 });
    }

    const behaviorDNA = employee.twinProfile ? JSON.parse(employee.twinProfile.behaviorDNA) : [];
    const weeklyPattern = employee.twinProfile ? JSON.parse(employee.twinProfile.weeklyPattern) : [];
    const monthlyPattern = employee.twinProfile ? JSON.parse(employee.twinProfile.monthlyPattern) : [];

    const result = {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      department: employee.department?.name || 'Unknown',
      driftScore: employee.driftScore,
      trustScore: employee.trustScore,
      predictionRisk: employee.predictionRisk,
      baselineWorkingHours: { start: employee.baselineStart, end: employee.baselineEnd },
      currentWorkingHours: { start: employee.currentStart, end: employee.currentEnd },
      behaviorDNA,
      weeklyPattern,
      monthlyPattern,
      aiTwinSummary: employee.aiTwinSummary
    };

    return NextResponse.json({ twin: result });

  } catch (error: any) {
    console.error('Digital twin detail API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
