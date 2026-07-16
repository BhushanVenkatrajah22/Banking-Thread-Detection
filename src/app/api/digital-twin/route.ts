import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const dept = searchParams.get('dept') || 'All';
    const drift = searchParams.get('drift') || 'All'; // All, High (>50%), Shifting (25-50%), Normal (<25%)

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { id: { contains: search } }
      ];
    }

    if (dept !== 'All') {
      whereClause.department = { name: dept };
    }

    if (drift !== 'All') {
      if (drift === 'High') {
        whereClause.driftScore = { gte: 50 };
      } else if (drift === 'Shifting') {
        whereClause.driftScore = { gte: 25, lt: 50 };
      } else if (drift === 'Normal') {
        whereClause.driftScore = { lt: 25 };
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
      role: emp.role,
      department: emp.department?.name || 'Unknown',
      driftScore: emp.driftScore,
      trustScore: emp.trustScore,
      baselineWorkingHours: { start: emp.baselineStart, end: emp.baselineEnd },
    }));

    return NextResponse.json({ employees: results });

  } catch (error: any) {
    console.error('Digital twin list API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
