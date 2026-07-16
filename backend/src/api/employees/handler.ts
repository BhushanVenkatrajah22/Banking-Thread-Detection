import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const dept = searchParams.get('dept') || 'All';
    const risk = searchParams.get('risk') || 'All';
    const status = searchParams.get('status') || 'All';

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { id: { contains: search } },
        { role: { contains: search } }
      ];
    }

    if (dept !== 'All') {
      whereClause.department = { name: dept };
    }

    if (status !== 'All') {
      whereClause.status = status.toLowerCase();
    }

    if (risk !== 'All') {
      if (risk === 'High') {
        whereClause.predictionRisk = { gte: 70 };
      } else if (risk === 'Medium') {
        whereClause.predictionRisk = { gte: 35, lt: 70 };
      } else if (risk === 'Low') {
        whereClause.predictionRisk = { lt: 35 };
      }
    }

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: { department: { select: { name: true } } },
      orderBy: { name: 'asc' }
    });

    const results = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department?.name || 'Unknown',
      status: emp.status,
      driftScore: emp.driftScore,
      trustScore: emp.trustScore,
      predictionRisk: emp.predictionRisk,
      aiTwinSummary: emp.aiTwinSummary,
      anomaliesCount: emp.anomaliesCount
    }));

    return NextResponse.json({ employees: results });

  } catch (error: any) {
    console.error('Employees API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
