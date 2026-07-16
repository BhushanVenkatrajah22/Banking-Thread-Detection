import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'All'; // All, open, under_review, resolved

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { id: { contains: search } },
        { employeeName: { contains: search } },
        { department: { contains: search } }
      ];
    }

    if (status !== 'All') {
      whereClause.status = status;
    }

    const cases = await prisma.investigationReport.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { employee: { select: { role: true } } }
    });

    const results = cases.map(item => {
      let evidence = [];
      try {
        evidence = JSON.parse(item.evidence);
      } catch (err) {
        evidence = [item.evidence];
      }

      return {
        id: item.id,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        role: item.employee?.role || 'Staff',
        department: item.department,
        severity: item.severity,
        status: item.status,
        assignedTo: item.assignedTo,
        createdAt: item.createdAt.toISOString(),
        description: item.description,
        evidence
      };
    });

    return NextResponse.json({ investigations: results });

  } catch (error: any) {
    console.error('Investigations fetch error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
