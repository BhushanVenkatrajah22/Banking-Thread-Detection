import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const alerts = await prisma.threatAlert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const results = alerts.map(alt => ({
      id: alt.id,
      title: alt.title,
      desc: alt.description,
      severity: alt.severity,
      time: alt.time,
      unread: alt.unread
    }));

    return NextResponse.json({ notifications: results });

  } catch (error: any) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'markAllRead') {
      await prisma.threatAlert.updateMany({
        where: { unread: true },
        data: { unread: false }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

  } catch (error: any) {
    console.error('Notifications update error:', error);
    return NextResponse.json({ error: 'Database update failed.' }, { status: 500 });
  }
}
