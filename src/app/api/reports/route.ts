import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { employeeId, sections, format } = await request.json();

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: { select: { name: true } },
        activities: { orderBy: { timestamp: 'desc' } },
        twinProfile: true
      }
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }

    // Compile report response
    const compiledData: any = {
      title: `Behavioral Security Audit Report - ${employee.name}`,
      refCode: `SEC-AUD-${employee.id}`,
      timestamp: new Date().toISOString(),
      format,
      employeeInfo: {
        name: employee.name,
        id: employee.id,
        role: employee.role,
        department: employee.department?.name || 'Unknown',
        email: employee.email
      }
    };

    if (sections.summary) {
      compiledData.twinSummary = employee.aiTwinSummary;
    }

    if (sections.evidence) {
      compiledData.behaviorDNA = employee.twinProfile ? JSON.parse(employee.twinProfile.behaviorDNA) : [];
    }

    if (sections.timeline) {
      compiledData.recentLogs = employee.activities.map(log => ({
        description: log.description,
        timestamp: log.timestamp.toISOString(),
        severity: log.severity,
        anomaly: log.anomaly
      }));
    }

    if (sections.recommendations) {
      compiledData.playbook = employee.predictionRisk >= 70
        ? 'Isolate employee workstation WS-TRD-45. Block Active Directory VPN tunnels. Escalate to HR compliance panel.'
        : 'Align continuous digital twin match weights. Standard monitoring checks.';
    }

    return NextResponse.json({ report: compiledData });

  } catch (error: any) {
    console.error('Reports API Error:', error);
    return NextResponse.json({ error: 'Report compilation failure.' }, { status: 500 });
  }
}
