'use client';

import React from 'react';
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
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Building,
  CheckCircle,
  Briefcase,
  ExternalLink,
  Target
} from 'lucide-react';
import { getDepartmentMetrics } from '@/data/mockData';

export default function ExecutiveDashboardPage() {
  const departmentMetrics = getDepartmentMetrics();

  // Overall firm-wide behavior safety rating (CISO score)
  const securityScore = 88;

  // Impact distribution data
  const impactDistribution = [
    { name: 'Critical Impact', value: 2, color: '#EF4444' }, // Karthikeyan, Meenakshi
    { name: 'High Impact', value: 1, color: '#F59E0B' }, // Senthil
    { name: 'Medium Impact', value: 5, color: '#2563EB' },
    { name: 'Low Impact', value: 92, color: '#10B981' }
  ];

  // Weekly Security Score Trend for CISO
  const securityTrendData = [
    { week: 'Wk 24', Score: 82 },
    { week: 'Wk 25', Score: 84 },
    { week: 'Wk 26', Score: 85 },
    { week: 'Wk 27', Score: 87 },
    { week: 'Wk 28', Score: 88 }
  ];

  const executiveRecommendations = [
    {
      id: 1,
      target: 'Treasury & Markets Operations',
      finding: 'Anomalous trading hours session shift (+6 hours) coupled with unauthorized bulk client ledger exports.',
      action: 'Enforce local storage block rules and network VLAN isolation on Dealer terminals.'
    },
    {
      id: 2,
      target: 'IT Database Management',
      finding: 'Manual database audit process (syslogd daemon) terminated outside change-control window.',
      action: 'Enforce dual-administrator keys requirement for auditing process termination.'
    },
    {
      id: 3,
      target: 'Retail Branch Override Rights',
      finding: 'Single-credential balance overrides occurring repeatedly on dormant savings accounts.',
      action: 'Require secondary compliance approval for all ledger overrides above ₹10,00,000.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">CISO Executive Board</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          High-level behavior risk analysis, departmental alignment, and strategic risk interventions.
        </p>
      </div>

      {/* Main Row: Security Score Gauge & Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Security Rating Gauge */}
        <div className="lg:col-span-4 premium-card p-5 flex flex-col justify-between items-center text-center">
          <h3 className="font-bold text-sm text-[#0F172A] w-full text-left border-b border-[#E2E8F0] pb-2.5">
            Firm Security Rating
          </h3>
          
          <div className="py-6 flex flex-col items-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#2563EB" 
                  strokeWidth="7" 
                  fill="transparent" 
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * securityScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-[#0F172A]">{securityScore}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Out of 100</span>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full">
                Guarded Security State
              </span>
              <p className="text-[11px] text-slate-500 mt-2 font-medium px-4 leading-relaxed">
                Overall organization risk rating. A score above 85 indicates robust controls and low behavior drift profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Score Trend */}
        <div className="lg:col-span-8 premium-card p-5 flex flex-col justify-between">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
            Firm Security Trend (Weekly Baseline)
          </h3>
          <div className="h-52 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={securityTrendData} margin={{ left: -25, right: 5, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                <Line 
                  type="monotone" 
                  dataKey="Score" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Second Row: Department Risk Chart & Business Impact Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Risk chart */}
        <div className="lg:col-span-8 premium-card p-5">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
            Department Behavior Risk Averages
          </h3>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentMetrics} margin={{ left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="risk" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {departmentMetrics.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={entry.risk >= 60 ? '#EF4444' : entry.risk >= 30 ? '#F59E0B' : '#2563EB'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Impact Distribution */}
        <div className="lg:col-span-4 premium-card p-5 flex flex-col justify-between">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
            Business Impact Assessment
          </h3>
          
          <div className="h-44 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impactDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {impactDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 mt-2">
            {impactDistribution.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
                <span className="truncate">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Third Row: CISO Strategic Interventions */}
      <div className="premium-card p-5">
        <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-3">
          CISO Strategic Recommendations
        </h3>
        
        <div className="mt-4 space-y-4">
          {executiveRecommendations.map((rec) => (
            <div key={rec.id} className="p-4 border border-[#E2E8F0] rounded-xl flex gap-3 text-xs leading-relaxed hover:bg-[#F8FAFC]/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#2563EB] flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#0F172A]">{rec.target}</h4>
                  <span className="text-[9px] bg-[#EF4444]/10 text-[#EF4444] font-bold px-1.5 py-0.2 rounded uppercase">
                    Risk Found
                  </span>
                </div>
                <p className="text-slate-500 font-semibold">{rec.finding}</p>
                <div className="pt-2 text-[#2563EB] font-bold flex items-center gap-1">
                  <span>Action:</span>
                  <span className="text-[#0F172A]">{rec.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
