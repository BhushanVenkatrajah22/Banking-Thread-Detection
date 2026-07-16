import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const caseFile = await prisma.investigationReport.findUnique({
      where: { id },
      include: { 
        employee: { 
          include: { 
            activities: { orderBy: { timestamp: 'desc' } } 
          } 
        } 
      }
    });

    if (!caseFile) {
      return NextResponse.json({ error: 'Case file not found.' }, { status: 404 });
    }

    let evidence = [];
    let notes = [];
    try {
      evidence = JSON.parse(caseFile.evidence);
    } catch (e) {
      evidence = [caseFile.evidence];
    }
    try {
      notes = JSON.parse(caseFile.notes);
    } catch (e) {
      notes = [caseFile.notes];
    }

    const result = {
      id: caseFile.id,
      employeeId: caseFile.employeeId,
      employeeName: caseFile.employeeName,
      role: caseFile.employee?.role || 'Staff',
      department: caseFile.department,
      severity: caseFile.severity,
      status: caseFile.status,
      assignedTo: caseFile.assignedTo,
      createdAt: caseFile.createdAt.toISOString(),
      description: caseFile.description,
      evidence,
      aiExplanation: caseFile.aiExplanation,
      notes,
      timeline: caseFile.employee?.activities.map(log => ({
        id: log.id,
        timestamp: log.timestamp.toISOString(),
        category: log.category,
        description: log.description,
        severity: log.severity,
        anomaly: log.anomaly
      })) || []
    };

    return NextResponse.json({ caseFile: result });

  } catch (error: any) {
    console.error('Case detail API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const caseFile = await prisma.investigationReport.findUnique({
      where: { id }
    });

    if (!caseFile) {
      return NextResponse.json({ error: 'Case file not found.' }, { status: 404 });
    }

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status;
    }

    if (body.notes) {
      updateData.notes = JSON.stringify(body.notes);
    }

    // Update session indicators if account quarantine requested
    if (body.accountLocked !== undefined) {
      await prisma.employee.update({
        where: { id: caseFile.employeeId },
        data: { 
          status: body.accountLocked ? 'offline' : 'online',
          driftScore: body.accountLocked ? 0 : undefined 
        }
      });
    }

    const updatedCase = await prisma.investigationReport.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, caseFile: updatedCase });

  } catch (error: any) {
    console.error('Case update API Error:', error);
    return NextResponse.json({ error: 'Database update failed.' }, { status: 500 });
  }
}
