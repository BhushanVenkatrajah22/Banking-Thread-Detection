'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Cpu, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Database,
  Download,
  Lock,
  UserCheck,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  LineChart,
  Line, 
  Area,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useEffect } from 'react';

export default function DigitalTwinDetailsPage() {
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [compareMetric, setCompareMetric] = useState<'hours' | 'database' | 'files'>('hours');

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/api/digital-twin/${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setEmployee(data.twin || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
        <span className="text-xs text-slate-500 font-semibold">Comparing learned digital twins...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800">Digital Twin not found</h3>
        <p className="text-sm text-slate-500 mt-2">The employee ID {employeeId} does not exist.</p>
        <Link href="/dashboard/digital-twins" className="text-[#2563EB] hover:underline text-xs mt-4 inline-block font-bold">
          Return to Twins list
        </Link>
      </div>
    );
  }

  // Graph 1: 30-Day Behavior Drift Chart data
  const driftHistoryData = (employee.weeklyPattern as number[]).map((risk: number, index: number) => {
    // Generate some deterministic fluctuations around employee metrics
    const baseDrift = Math.max(5, employee.driftScore + (index - 3) * 4);
    const peerAverage = 8;
    return {
      day: `Day ${index * 5 + 1}`,
      'Individual Drift': baseDrift,
      'Peer Average': peerAverage
    };
  });

  // Graph 2: Typical Hourly Activity levels (mock values for comparison)
  // Let's customize base on employee risk. If Karthikeyan (EMP001), high off-hours activity.
  const isHighRisk = employee.predictionRisk >= 70;
  
  const hourlyActivityData = Array.from({ length: 24 }).map((_: unknown, hour: number) => {
    // Standard baseline is 9 AM to 6 PM (index 9 to 18)
    const isWorkingHour = hour >= 9 && hour <= 18;
    
    // Baseline probability
    const baseline = isWorkingHour ? (50 + (hour % 3) * 15) : (1 + (hour % 4) * 2);
    
    // Actual probability today
    let actual = isWorkingHour ? (45 + (hour % 3) * 10) : (1 + (hour % 4));
    
    if (isHighRisk && hour >= 2 && hour <= 5) {
      // High anomalous off-hours activity
      actual = 75;
    } else if (isHighRisk && hour >= 20 && hour <= 23) {
      actual = 55;
    } else if (employee.predictionRisk >= 35 && hour >= 19 && hour <= 21) {
      // Medium anomalous off-hours
      actual = 35;
    }

    return {
      hour: `${String(hour).padStart(2, '0')}:00`,
      'Baseline (Learned)': baseline,
      'Actual (Today)': actual
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/dashboard/digital-twins" 
          className="text-xs text-slate-500 hover:text-[#2563EB] font-bold flex items-center gap-1 bg-white border border-[#E2E8F0] w-fit px-3 py-1.5 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Twins Directory</span>
        </Link>
      </div>

      {/* Profile Header */}
      <div className="premium-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xl shrink-0">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A]">AI Digital Twin: {employee.name}</h2>
              <span className="text-[10px] bg-[#2563EB]/10 text-[#2563EB] font-bold px-2 py-0.5 rounded">
                Active Continuous Learning
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Role: {employee.role} | Department: {employee.department} | Twin ID: TW-{employee.id}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left metrics panel, Right comparison visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Twin DNA Status */}
        <div className="space-y-6">
          {/* Similarity & Status summary */}
          <div className="premium-card p-5 space-y-5">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
              Twin Similarity Index
            </h3>

            {/* Circular score simulation */}
            <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Circle indicator */}
                <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#E2E8F0" 
                    strokeWidth="6" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke={employee.driftScore >= 50 ? '#EF4444' : '#10B981'} 
                    strokeWidth="7" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (100 - employee.driftScore)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#0F172A]">{100 - employee.driftScore}%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DNA Match</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <span className={`text-xs font-bold ${
                  employee.driftScore >= 50 ? 'text-[#EF4444]' : 'text-[#10B981]'
                }`}>
                  {employee.driftScore >= 50 
                    ? 'Critical Behavior Drift Alert' 
                    : employee.driftScore >= 25 
                      ? 'Moderate Baseline Shifts' 
                      : 'Twin Baseline Synchronized'
                  }
                </span>
                <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed px-2">
                  Learned baseline models compared against last 72 hours of endpoint activity.
                </p>
              </div>
            </div>
          </div>

          {/* AI Model Summary and explainable text */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
              AI Twin Baseline Summary
            </h3>
            
            <div className="text-xs text-slate-500 space-y-3 font-medium leading-relaxed">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg">
                <span className="font-bold text-[#0F172A] block mb-1">Weekly Working Hour Pattern</span>
                <span>Typically logged in {employee.baselineWorkingHours.start} to {employee.baselineWorkingHours.end}. Monday through Friday. Weekend logins historically: 0.2%.</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg">
                <span className="font-bold text-[#0F172A] block mb-1">Typical Data Access Bounds</span>
                <span>Database read transactions averages: 12-45 per day. Large downloads limited to department folders. USB interfaces: Zero active writes over last 365 days.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Behavior Drift Chart */}
          <div className="premium-card p-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Continuous Behavior Drift (Last 30 Days)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Variance match score compared against peer averages in {employee.department}</p>
              </div>
            </div>

            <div className="h-60 mt-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={driftHistoryData} margin={{ left: -25, right: 5, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="Individual Drift" 
                    stroke={employee.driftScore >= 50 ? '#EF4444' : '#2563EB'} 
                    strokeWidth={3} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Peer Average" 
                    stroke="#94A3B8" 
                    strokeDasharray="4 4"
                    strokeWidth={1.5} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hour-by-Hour Activity Comparison */}
          <div className="premium-card p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Activity Hour-by-Hour Profile Comparison</h3>
                <p className="text-xs text-slate-500 mt-0.5">Learned activity weights compared against today\'s session logs</p>
              </div>
            </div>

            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourlyActivityData} margin={{ left: -25, right: 5, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Bar 
                    dataKey="Baseline (Learned)" 
                    fill="#3B82F6" 
                    opacity={0.35}
                    radius={[2, 2, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Actual (Today)" 
                    stroke={employee.driftScore >= 50 ? '#EF4444' : '#2563EB'} 
                    strokeWidth={2.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}