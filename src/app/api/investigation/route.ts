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
        { employee: { name: { contains: search } } },
        { employee: { department: { name: { contains: search } } } }
      ];
    }

    if (status !== 'All') {
      whereClause.status = status;
    }

    const cases = await prisma.investigationReport.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { 
        employee: { 
          include: { 
            department: { select: { name: true } } 
          } 
        } 
      }
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
        employeeName: item.employee?.name || 'Unknown',
        role: item.employee?.role || 'Staff',
        department: item.employee?.department?.name || 'Unknown',
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
