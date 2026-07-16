'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Clock, 
  ShieldAlert, 
  Cpu, 
  History, 
  FileSearch,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Download,
  Database,
  Lock,
  UserCheck,
  Network
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useEffect } from 'react';

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'anomalies' | 'logs'>('overview');

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    fetch(`/api/employees/${employeeId}`)
      .then(res => res.json())
      .then(data => {
        setEmployee(data.employee || null);
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
        <span className="text-xs text-slate-500 font-semibold">Loading profile parameters...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800">Employee not found</h3>
        <p className="text-sm text-slate-500 mt-2">The employee ID {employeeId} does not exist in the database.</p>
        <Link href="/dashboard/employees" className="text-[#2563EB] hover:underline text-xs mt-4 inline-block font-bold">
          Return to directory
        </Link>
      </div>
    );
  }

  // Risk pattern data format for charts
  const riskTrendData = (employee.weeklyPattern as number[]).map((risk: number, index: number) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    Risk: risk
  }));

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'usb': return 'bg-red-100 text-[#EF4444] border-red-200';
      case 'database': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'file': return 'bg-blue-100 text-[#2563EB] border-blue-200';
      case 'login': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'privilege': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'usb': return Lock;
      case 'database': return Database;
      case 'file': return Download;
      case 'login': return UserCheck;
      case 'privilege': return ShieldAlert;
      default: return Network;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          href="/dashboard/employees" 
          className="text-xs text-slate-500 hover:text-[#2563EB] font-bold flex items-center gap-1 bg-white border border-[#E2E8F0] w-fit px-3 py-1.5 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* Header Profile Summary */}
      <div className="premium-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {employee.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <span>{employee.name}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${
                employee.status === 'online' ? 'bg-[#10B981]' : 'bg-slate-300'
              }`} title={employee.status === 'online' ? 'Session Online' : 'Session Offline'} />
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold mt-1">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {employee.role}
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {employee.department}
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="font-mono">{employee.id}</span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href={`/dashboard/digital-twins/${employee.id}`}
            className="bg-[#2563EB]/5 hover:bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Analyze Digital Twin</span>
          </Link>
          {employee.predictionRisk >= 40 && (
            <Link
              href={`/dashboard/investigation/${employee.id === 'EMP001' ? 'CASE-2026-001' : employee.id === 'EMP002' ? 'CASE-2026-002' : ''}`}
              className="bg-[#EF4444] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSearch className="w-4 h-4" />
              <span>Open Case File</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid structure: Left profile details, Right analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card and metadata */}
        <div className="space-y-6">
          
          {/* Metadata information card */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">Metadata Details</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email
                </span>
                <span className="text-[#0F172A] font-medium truncate max-w-[180px]">{employee.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Shift Baseline
                </span>
                <span className="text-[#0F172A] font-semibold">
                  {employee.baselineWorkingHours.start} - {employee.baselineWorkingHours.end}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Actual Hours
                </span>
                <span className="text-[#0F172A] font-semibold">
                  {employee.currentWorkingHours.start} - {employee.currentWorkingHours.end}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Anomalies Detected</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  employee.anomaliesCount > 0 ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#10B981]/10 text-[#10B981]'
                }`}>
                  {employee.anomaliesCount} Events
                </span>
              </div>
            </div>
          </div>

          {/* Behavior baseline indicators */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">Behavior Twin Summary</h3>
            <div className="text-xs text-slate-500 leading-relaxed font-medium bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg">
              {employee.aiTwinSummary}
            </div>
            
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DNA Characteristics</span>
              <div className="flex flex-wrap gap-1.5">
                {(employee.behaviorDNA as string[]).map((dna: string, idx: number) => (
                  <span key={idx} className="bg-slate-100 text-[#0F172A] font-semibold text-[10px] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
                    {dna}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Tabs and Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Scores and Weekly Risk trend chart */}
          <div className="premium-card p-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0F172A]">Digital Twin Baseline Variance</h3>
              <span className="text-xs font-semibold text-slate-500">Risk vs Trust Dynamics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {/* Trust Score */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Trust Rating</span>
                <span className={`text-2xl font-extrabold block mt-2 ${
                  employee.trustScore < 40 ? 'text-[#EF4444]' : employee.trustScore < 70 ? 'text-amber-600' : 'text-[#10B981]'
                }`}>
                  {employee.trustScore}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Based on behavioral patterns</span>
              </div>

              {/* Prediction Risk Score */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prediction Risk Score</span>
                <span className={`text-2xl font-extrabold block mt-2 ${
                  employee.predictionRisk >= 70 ? 'text-[#EF4444]' : employee.predictionRisk >= 35 ? 'text-amber-600' : 'text-slate-600'
                }`}>
                  {employee.predictionRisk}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Probability of active threat</span>
              </div>

              {/* Behavior Drift Score */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Behavior Drift Score</span>
                <span className={`text-2xl font-extrabold block mt-2 ${
                  employee.driftScore >= 50 ? 'text-[#EF4444]' : employee.driftScore >= 25 ? 'text-amber-600' : 'text-slate-600'
                }`}>
                  {employee.driftScore}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Baseline variance margin</span>
              </div>
            </div>

            {/* Recharts Area graph showing weekly risk pattern */}
            <div className="mt-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Weekly Prediction Risk Trend</span>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskTrendData} margin={{ left: -25, right: 5, top: 5, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={employee.predictionRisk >= 70 ? '#EF4444' : '#2563EB'} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={employee.predictionRisk >= 70 ? '#EF4444' : '#2563EB'} stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 8, fontSize: 11 }} />
                    <Area 
                      type="monotone" 
                      dataKey="Risk" 
                      stroke={employee.predictionRisk >= 70 ? '#EF4444' : '#2563EB'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRisk)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity Logs & Anomaly tabs */}
          <div className="premium-card p-5">
            <div className="flex border-b border-[#E2E8F0] gap-4 mb-4 text-xs font-bold text-slate-500">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 px-1 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'overview' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent hover:text-slate-800'
                }`}
              >
                Anomalies & Events ({employee.anomaliesCount})
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`pb-2.5 px-1 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'logs' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent hover:text-slate-800'
                }`}
              >
                All Activity Logs
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'overview' ? (
                // Display anomalies only
                employee.recentLogs.filter((l: any) => l.anomaly).length > 0 ? (
                  employee.recentLogs.filter((l: any) => l.anomaly).map((log: any) => {
                    const Icon = getCategoryIcon(log.category);
                    return (
                      <div key={log.id} className="p-3.5 border border-[#E2E8F0] rounded-xl flex gap-3.5 items-start text-xs bg-[#EF4444]/5 hover:bg-[#EF4444]/10 transition-colors">
                        <div className={`p-2 rounded-lg border ${getCategoryColor(log.category)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                              {log.category} anomaly
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed">{log.description}</p>
                          <span className="inline-block mt-1 font-bold text-[9px] text-[#EF4444] uppercase tracking-wider">
                            Severity: {log.severity}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 font-medium">
                    No anomaly alerts associated with this digital twin.
                  </div>
                )
              ) : (
                // Display all logs
                employee.recentLogs.map((log: any) => {
                  const Icon = getCategoryIcon(log.category);
                  return (
                    <div key={log.id} className="p-3.5 border border-[#E2E8F0] rounded-xl flex gap-3.5 items-start text-xs hover:bg-[#F8FAFC] transition-colors">
                      <div className={`p-2 rounded-lg border ${
                        log.anomaly ? getCategoryColor(log.category) : 'bg-slate-50 text-slate-500 border-slate-150'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                            {log.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">{log.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`font-bold text-[9px] uppercase tracking-wider ${
                            log.severity === 'high' ? 'text-[#EF4444]' : 'text-slate-500'
                          }`}>
                            Severity: {log.severity}
                          </span>
                          {log.anomaly && (
                            <span className="text-[9px] font-bold bg-[#EF4444]/10 text-[#EF4444] px-1.5 py-0.2 rounded uppercase">
                              Anomaly Flagged
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
