import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const predictions = await prisma.riskPrediction.findMany({
      orderBy: { probability: 'desc' },
      include: { 
        employee: { 
          select: { 
            name: true, 
            role: true, 
            department: { select: { name: true } } 
          } 
        } 
      }
    });

    const results = predictions.map(pred => {
      let explainableAI = [];
      try {
        explainableAI = JSON.parse(pred.explainableAI);
      } catch (err) {
        explainableAI = [pred.explainableAI];
      }

      return {
        id: pred.id,
        employeeId: pred.employeeId,
        employeeName: pred.employee?.name || 'Unknown',
        role: pred.employee?.role || 'Staff',
        department: pred.employee?.department?.name || 'None',
        probability: pred.probability,
        confidence: pred.confidence,
        timeWindow: pred.timeWindow,
        attackType: pred.attackType,
        businessImpact: pred.businessImpact,
        explainableAI,
        status: pred.status,
        detectedAt: pred.detectedAt.toISOString()
      };
    });

    return NextResponse.json({ predictions: results });

  } catch (error: any) {
    console.error('Predictions API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
