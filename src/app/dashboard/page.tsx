'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
  Info,
  ExternalLink,
  Lock,
  Download,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { generateMockDatabase, getLiveActivities, getDailyInsights, getDepartmentMetrics } from '@/data/mockData';

export default function DashboardPage() {
  const { employees, predictions } = generateMockDatabase();
  const liveActivities = getLiveActivities();
  const dailyInsights = getDailyInsights();
  const departmentMetrics = getDepartmentMetrics();

  // Metrics calculations
  const totalEmployees = employees.length;
  const onlineCount = employees.filter(e => e.status === 'online').length;
  const highRiskCount = predictions.filter(p => p.probability >= 70).length;
  const avgTrustScore = (employees.reduce((acc, curr) => acc + curr.trustScore, 0) / totalEmployees).toFixed(1);
  const threatsPrevented = 14;

  // Chart 1 data: Risk distribution brackets
  const riskDistribution = [
    { range: '0-20% (Low)', count: employees.filter(e => e.predictionRisk <= 20).length },
    { range: '21-40% (Mild)', count: employees.filter(e => e.predictionRisk > 20 && e.predictionRisk <= 40).length },
    { range: '41-60% (Medium)', count: employees.filter(e => e.predictionRisk > 40 && e.predictionRisk <= 60).length },
    { range: '61-80% (Elevated)', count: employees.filter(e => e.predictionRisk > 60 && e.predictionRisk <= 80).length },
    { range: '81-100% (High)', count: employees.filter(e => e.predictionRisk > 80).length },
  ];

  // Chart 2 data: Trust score distribution
  const trustScoresChart = [
    { name: 'Critical (<30)', value: employees.filter(e => e.trustScore < 30).length, color: '#EF4444' },
    { name: 'Substandard (30-60)', value: employees.filter(e => e.trustScore >= 30 && e.trustScore < 60).length, color: '#F59E0B' },
    { name: 'Healthy (60-90)', value: employees.filter(e => e.trustScore >= 60 && e.trustScore < 90).length, color: '#2563EB' },
    { name: 'Excellent (90+)', value: employees.filter(e => e.trustScore >= 90).length, color: '#10B981' }
  ];

  const categoryIcons: Record<string, any> = {
    usb: Lock,
    file: Download,
    database: Database,
    login: UserCheck,
    privilege: ShieldCheck
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome & AI Notification Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E2E8F0] p-6 rounded-xl premium-shadow">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            Welcome back, SOC Manager Anjali
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Predictive threat vectors are actively synced. No new security breaches occurred.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#2563EB]/5 border border-[#2563EB]/15 text-[#2563EB] px-3.5 py-2 rounded-lg text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>3 Twin Anomalies Identified — Active Interception Recommended</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Employees */}
        <div className="premium-card p-5 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Employees</span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-3.5">
            <span className="text-3xl font-extrabold text-[#0F172A]">{totalEmployees}</span>
            <span className="text-[10px] text-slate-400 block mt-1 font-medium">Digital Twins Created</span>
          </div>
        </div>

        {/* Employees Online */}
        <div className="premium-card p-5 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employees Online</span>
            <UserCheck className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mt-3.5">
            <span className="text-3xl font-extrabold text-[#0F172A]">{onlineCount}</span>
            <span className="text-[10px] text-[#10B981] font-semibold block mt-1">62% Session Activity Ratio</span>
          </div>
        </div>

        {/* High Risk Employees */}
        <div className="premium-card p-5 flex flex-col justify-between min-h-[120px] border-l-4 border-l-[#EF4444]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#EF4444] uppercase tracking-wider">Predicted High Risk</span>
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div className="mt-3.5">
            <span className="text-3xl font-extrabold text-[#EF4444]">{highRiskCount}</span>
            <span className="text-[10px] text-slate-500 block mt-1 font-medium">Risk Score &gt; 70%</span>
          </div>
        </div>

        {/* Average Trust Score */}
        <div className="premium-card p-5 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Trust Score</span>
            <TrendingUp className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div className="mt-3.5">
            <span className="text-3xl font-extrabold text-[#0F172A]">{avgTrustScore}%</span>
            <span className="text-[10px] text-[#2563EB] font-semibold block mt-1 flex items-center gap-0.5">
              <span>Stable baseline</span>
            </span>
          </div>
        </div>

        {/* Threats Prevented */}
        <div className="premium-card p-5 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Threats Prevented</span>
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="mt-3.5">
            <span className="text-3xl font-extrabold text-[#0F172A]">{threatsPrevented}</span>
            <span className="text-[10px] text-[#10B981] font-semibold block mt-1">This Quarter</span>
          </div>
        </div>
      </div>

      {/* AI Insights & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 premium-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2563EB]" />
              <span>AI Security Daily Insights</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Updated Live</span>
          </div>
          <div className="mt-4 space-y-4">
            {dailyInsights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-lg border flex gap-3 text-xs leading-relaxed ${
                  insight.severity === 'high' 
                    ? 'bg-[#EF4444]/5 border-[#EF4444]/15 text-[#1E293B]' 
                    : 'bg-[#2563EB]/5 border-[#2563EB]/15 text-[#1E293B]'
                }`}
              >
                <Info className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${
                  insight.severity === 'high' ? 'text-[#EF4444]' : 'text-[#2563EB]'
                }`} />
                <div>
                  <h4 className="font-bold text-[#0F172A]">{insight.title}</h4>
                  <p className="mt-1 text-slate-600 font-medium">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score Distribution Chart */}
        <div className="premium-card p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#0F172A]">Employee Trust Distribution</h3>
          </div>
          <div className="h-44 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trustScoresChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {trustScoresChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Chart Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 mt-2">
            {trustScoresChart.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
                <span className="truncate">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Distribution Chart */}
        <div className="lg:col-span-2 premium-card p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F172A]">Predicted Risk Distribution Index</h3>
            <span className="text-xs text-[#2563EB] font-semibold">100 Twin Baselines</span>
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} margin={{ left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {riskDistribution.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={idx >= 3 ? '#EF4444' : '#2563EB'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="premium-card p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F172A]">Live Activity Ticker</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
          </div>
          
          <div className="mt-4 flex-1 overflow-y-auto max-h-[250px] space-y-3.5 pr-1 custom-scrollbar">
            {liveActivities.map((act) => {
              const Icon = categoryIcons[act.type] || Info;
              return (
                <div key={act.id} className="flex gap-2.5 items-start text-xs border-b border-[#F8FAFC] pb-2">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    act.severity === 'high' 
                      ? 'bg-[#EF4444]/10 text-[#EF4444]' 
                      : act.severity === 'medium'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-[#2563EB]/10 text-[#2563EB]'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#0F172A] truncate">{act.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{act.time}</span>
                    </div>
                    <p className="text-slate-500 font-medium mt-0.5 leading-normal">{act.msg}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Predictions Summary List */}
      <div className="premium-card p-5">
        <div className="pb-4 border-b border-[#E2E8F0] flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Active Predictive Insider Threat Warnings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Flagged behaviors deviating from learned Digital Twin baselines</p>
          </div>
          <Link 
            href="/dashboard/predictions" 
            className="text-xs text-[#2563EB] font-bold flex items-center gap-1.5 hover:underline"
          >
            <span>Prediction Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 pb-2.5 font-semibold">Employee</th>
                <th className="py-2.5 pb-2.5 font-semibold">Department</th>
                <th className="py-2.5 pb-2.5 font-semibold text-center">Prediction Probability</th>
                <th className="py-2.5 pb-2.5 font-semibold text-center">Confidence</th>
                <th className="py-2.5 pb-2.5 font-semibold">Estimated Time Window</th>
                <th className="py-2.5 pb-2.5 font-semibold">Predicted Vector</th>
                <th className="py-2.5 pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {predictions.slice(0, 3).map((pred) => (
                <tr key={pred.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-[#0F172A]">{pred.employeeName}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{pred.role}</div>
                  </td>
                  <td className="py-3.5 font-medium text-slate-600">{pred.department}</td>
                  <td className="py-3.5 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-[#EF4444]/10 text-[#EF4444]">
                      {pred.probability}%
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-bold text-slate-700">{pred.confidence}%</td>
                  <td className="py-3.5 text-slate-500 font-semibold">{pred.timeWindow}</td>
                  <td className="py-3.5">
                    <span className="font-bold text-[#0F172A]">{pred.attackType}</span>
                    <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      pred.businessImpact === 'Critical' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-amber-500 text-white'
                    }`}>
                      {pred.businessImpact}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <Link 
                        href={`/dashboard/digital-twins/${pred.employeeId}`}
                        title="View Digital Twin"
                        className="text-[#2563EB] hover:bg-[#2563EB]/5 p-1 rounded-md transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/dashboard/investigation/${pred.employeeId === 'EMP001' ? 'CASE-2026-001' : 'CASE-2026-002'}`}
                        className="bg-[#2563EB] text-white hover:bg-blue-600 px-3 py-1.5 rounded-md font-bold transition-all text-[11px]"
                      >
                        Investigate
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
