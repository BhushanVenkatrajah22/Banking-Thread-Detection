import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const totalEmployees = await prisma.employee.count();
    const onlineCount = await prisma.employee.count({ where: { status: 'online' } });
    
    const avgTrustResult = await prisma.employee.aggregate({
      _avg: { trustScore: true }
    });
    const avgTrustScore = (avgTrustResult._avg.trustScore || 84.7).toFixed(1);

    const highRiskCount = await prisma.riskPrediction.count({
      where: {
        probability: { gte: 70 },
        status: 'active'
      }
    });

    const alerts = await prisma.threatAlert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    
    const dailyInsights = alerts.map((alt, index) => ({
      id: index + 1,
      title: alt.title,
      desc: alt.description,
      severity: alt.severity
    }));

    const employees = await prisma.employee.findMany({ select: { predictionRisk: true, trustScore: true } });
    const riskDistribution = [
      { range: '0-20% (Low)', count: employees.filter(e => e.predictionRisk <= 20).length },
      { range: '21-40% (Mild)', count: employees.filter(e => e.predictionRisk > 20 && e.predictionRisk <= 40).length },
      { range: '41-60% (Medium)', count: employees.filter(e => e.predictionRisk > 40 && e.predictionRisk <= 60).length },
      { range: '61-80% (Elevated)', count: employees.filter(e => e.predictionRisk > 60 && e.predictionRisk <= 80).length },
      { range: '81-100% (High)', count: employees.filter(e => e.predictionRisk > 80).length }
    ];

    const trustScoresChart = [
      { name: 'Critical (<30)', value: employees.filter(e => e.trustScore < 30).length, color: '#EF4444' },
      { name: 'Substandard (30-60)', value: employees.filter(e => e.trustScore >= 30 && e.trustScore < 60).length, color: '#F59E0B' },
      { name: 'Healthy (60-90)', value: employees.filter(e => e.trustScore >= 60 && e.trustScore < 90).length, color: '#2563EB' },
      { name: 'Excellent (90+)', value: employees.filter(e => e.trustScore >= 90).length, color: '#10B981' }
    ];

    const recentActivitiesRaw = await prisma.employeeActivity.findMany({
      orderBy: { timestamp: 'desc' },
      take: 8,
      include: { employee: { select: { name: true } } }
    });

    const liveActivities = recentActivitiesRaw.map((act, index) => {
      const timeLabels = ['Just now', '5 mins ago', '12 mins ago', '25 mins ago', '1 hour ago', '2 hours ago', '3 hours ago', '4 hours ago'];
      return {
        id: act.id,
        time: timeLabels[index] || 'Today',
        type: act.category,
        name: act.employee?.name || 'Unknown',
        msg: act.description,
        severity: act.severity
      };
    });

    const predictionsRaw = await prisma.riskPrediction.findMany({
      where: { status: 'active' },
      orderBy: { probability: 'desc' },
      take: 3,
      include: { employee: { select: { name: true, role: true, department: { select: { name: true } } } } }
    });

    const activePredictions = predictionsRaw.map(pred => ({
      id: pred.id,
      employeeId: pred.employeeId,
      employeeName: pred.employee?.name || 'Unknown',
      role: pred.employee?.role || 'Staff',
      department: pred.employee?.department?.name || 'None',
      probability: pred.probability,
      confidence: pred.confidence,
      timeWindow: pred.timeWindow,
      attackType: pred.attackType,
      businessImpact: pred.businessImpact
    }));

    return NextResponse.json({
      metrics: {
        totalEmployees,
        onlineCount,
        highRiskCount,
        avgTrustScore,
        threatsPrevented: 14
      },
      dailyInsights,
      riskDistribution,
      trustScoresChart,
      liveActivities,
      activePredictions
    });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Database query failed.' }, { status: 500 });
  }
}
