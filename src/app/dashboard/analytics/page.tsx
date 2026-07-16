'use client';

import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Database, 
  Lock, 
  Clock, 
  PieChart as PieIcon,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Chart 1: Bulk File Download Trends (anomalous spike on Wednesday matching Rajesh)
  const downloadTrendData = [
    { day: 'Mon', Standard: 180, 'Actual Downloads': 195 },
    { day: 'Tue', Standard: 210, 'Actual Downloads': 225 },
    { day: 'Wed', Standard: 190, 'Actual Downloads': 1650 }, // Anomalous bulk download
    { day: 'Thu', Standard: 200, 'Actual Downloads': 210 },
    { day: 'Fri', Standard: 220, 'Actual Downloads': 240 },
    { day: 'Sat', Standard: 45, 'Actual Downloads': 50 },
    { day: 'Sun', Standard: 30, 'Actual Downloads': 45 }
  ];

  // Chart 2: USB Write Access Volume Histograms (peak Wednesday)
  const usbWriteData = [
    { day: 'Mon', Standard: 0, Actual: 0 },
    { day: 'Tue', Standard: 0, Actual: 0 },
    { day: 'Wed', Standard: 0, Actual: 1 }, // Rajesh Cruzer USB insertion
    { day: 'Thu', Standard: 0, Actual: 0 },
    { day: 'Fri', Standard: 0, Actual: 0 },
    { day: 'Sat', Standard: 0, Actual: 0 },
    { day: 'Sun', Standard: 0, Actual: 0 }
  ];

  // Chart 3: System Access Overrides by category
  const queryOverrideData = [
    { category: 'Client Portfolios', Standard: 15, Actual: 98 },
    { category: 'HR Payrolls', Standard: 2, Actual: 14 },
    { category: 'Dormant Accounts', Standard: 5, Actual: 35 },
    { category: 'VLAN Policies', Standard: 0, Actual: 2 },
    { category: 'CAB Changes', Standard: 8, Actual: 9 }
  ];

  // Mock Login Heatmap Grid (7 days x 24 hours). We can draw a 7x24 grid.
  // We will highlight off-hours logins (e.g. Wednesday 3 AM)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // We'll generate a grid of intensities
  const getHeatmapColor = (day: string, hour: number) => {
    // Standard working hours are 9 to 18 (index 9 to 18)
    const isWorkingHour = hour >= 9 && hour <= 18;
    const isWeekend = day === 'Sat' || day === 'Sun';

    if (day === 'Wed' && hour === 3) {
      // Rajesh Kumar anomalous login Wednesday 3 AM
      return 'bg-[#EF4444] border-red-300';
    }

    if (isWeekend) {
      return hour === 14 ? 'bg-blue-100 border-blue-200' : 'bg-slate-50 border-slate-100';
    }

    if (isWorkingHour) {
      return hour % 3 === 0 ? 'bg-blue-600 border-blue-750' : 'bg-blue-400 border-blue-500';
    }

    return hour >= 21 || hour <= 6 ? 'bg-slate-100 border-slate-200' : 'bg-blue-50 border-blue-100';
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Behavioral Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep-dive behavior pattern analysis, exfiltration trends, and access profiles.
          </p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                  : 'bg-white border-[#E2E8F0] text-slate-650 hover:bg-[#F8FAFC]'
              }`}
            >
              {range.toUpperCase()} Range
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Exfiltration charts (File Download vs USB Write) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* File Download spike chart */}
        <div className="premium-card p-5">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <Download className="w-4 h-4 text-[#2563EB]" />
            <span>Firm-wide Daily Downloads Profile</span>
          </h3>
          <div className="h-60 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downloadTrendData} margin={{ left: -25, right: 5, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area 
                  type="monotone" 
                  dataKey="Actual Downloads" 
                  stroke="#EF4444" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorDownloads)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="Standard" 
                  stroke="#94A3B8" 
                  strokeDasharray="4 4"
                  strokeWidth={1.5} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* USB Write Count chart */}
        <div className="premium-card p-5">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#EF4444]" />
            <span>Firm-wide USB Connection Events</span>
          </h3>
          <div className="h-60 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usbWriteData} margin={{ left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Bar dataKey="Actual" fill="#EF4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Standard" fill="#94A3B8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Database query overrides (Histograms) */}
      <div className="premium-card p-5">
        <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
          <Database className="w-4.5 h-4.5 text-[#2563EB]" />
          <span>High-privilege Read Queries &amp; Overrides By Target Class</span>
        </h3>
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={queryOverrideData} layout="vertical" margin={{ left: 30, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="category" type="category" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
              <Bar dataKey="Actual" fill="#2563EB" radius={[0, 3, 3, 0]} />
              <Bar dataKey="Standard" fill="#E2E8F0" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Hourly Session Login Heatmap Grid */}
      <div className="premium-card p-5">
        <div className="pb-4 border-b border-[#E2E8F0] flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#2563EB]" />
              <span>Login Activity Heatmap (Hourly Grid Analysis)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Identifies anomalous off-hours access sessions across terminal endpoints</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-slate-50 border border-slate-100 rounded-sm"></span>
              <span>No Session</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-blue-100 rounded-sm"></span>
              <span>Standard Baseline</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></span>
              <span>High Activity</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-sm"></span>
              <span>Anomalous Drift Alert</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Drawing */}
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[800px] space-y-1.5">
            {/* Hours labels header */}
            <div className="flex pl-10 text-[9px] font-bold text-slate-400 select-none">
              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className="flex-1 text-center font-mono">
                  {hour === 0 ? '12a' : hour === 12 ? '12p' : hour > 12 ? `${hour-12}p` : `${hour}a`}
                </div>
              ))}
            </div>

            {/* Days rows */}
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center">
                <span className="w-10 text-xs font-bold text-[#0F172A] pr-2 select-none text-right">{day}</span>
                <div className="flex-1 flex gap-1.5 h-7">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div 
                      key={hour} 
                      title={`${day} @ ${hour}:00 — Session state weight`}
                      className={`flex-1 rounded-sm border transition-colors cursor-help ${getHeatmapColor(day, hour)}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
