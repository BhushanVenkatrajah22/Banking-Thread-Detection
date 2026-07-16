import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { copilotInference } from '@/data/mockData';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message query is required.' }, { status: 400 });
    }

    // Query SQLite database to pass current list into the inference engine
    const employees = await prisma.employee.findMany();
    const predictions = await prisma.riskPrediction.findMany();

    // Run inference helper
    const result = copilotInference(message, employees as any, predictions as any);

    return NextResponse.json({ 
      response: result.response,
      references: result.references || []
    });

  } catch (error: any) {
    console.error('AI API Route Error:', error);
    return NextResponse.json({ error: 'AI inference service failed.' }, { status: 500 });
  }
}
