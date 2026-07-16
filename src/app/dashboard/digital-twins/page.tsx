'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  AlertTriangle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useEffect } from 'react';

export default function DigitalTwinsPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [driftFilter, setDriftFilter] = useState('All'); // All, High (>50%), Normal (<25%), Shifting (25-50%)

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      search: searchTerm,
      dept: deptFilter,
      drift: driftFilter
    });
    fetch(`/api/digital-twin?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchTerm, deptFilter, driftFilter]);

  const departments = [
    'All',
    'Treasury & Markets',
    'Wealth Management',
    'Retail Banking',
    'IT & Cybersecurity',
    'Operations',
    'Human Resources',
    'Legal & Compliance'
  ];

  const filteredEmployees = employees;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
        <span className="text-xs text-slate-500 font-semibold">Synchronizing employee behavior twins...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">AI Digital Twins Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare active employee session vectors against learned behavioral DNA baselines.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#10B981]/5 border border-[#10B981]/15 text-[#10B981] px-3.5 py-2 rounded-lg text-xs font-semibold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>100 twins synchronized in real-time</span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="premium-card p-4 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search digital twins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Department</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB] transition-colors"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Twin State</span>
            <select
              value={driftFilter}
              onChange={(e) => setDriftFilter(e.target.value)}
              className="bg-white border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB] transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="Normal">Aligned (&lt;25% drift)</option>
              <option value="Shifting">Shifting (25%-50% drift)</option>
              <option value="High">Drift Warning (&gt;50% drift)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Twins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => {
            const hasHighDrift = emp.driftScore >= 50;
            const hasMediumDrift = emp.driftScore >= 25 && emp.driftScore < 50;

            return (
              <div 
                key={emp.id} 
                className={`premium-card p-5 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all duration-200 ${
                  hasHighDrift 
                    ? 'border-l-4 border-l-[#EF4444]' 
                    : hasMediumDrift 
                      ? 'border-l-4 border-l-amber-500' 
                      : 'border-l-4 border-l-[#10B981]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/5 border border-[#2563EB]/15 flex items-center justify-center">
                        <Cpu className={`w-4 h-4 ${hasHighDrift ? 'text-[#EF4444]' : 'text-[#2563EB]'}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#0F172A] truncate max-w-[150px]">{emp.name}</h3>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">{emp.id}</span>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hasHighDrift 
                        ? 'bg-[#EF4444]/10 text-[#EF4444]' 
                        : hasMediumDrift 
                          ? 'bg-amber-500/10 text-amber-600' 
                          : 'bg-[#10B981]/10 text-[#10B981]'
                    }`}>
                      {hasHighDrift ? 'Drift Alert' : hasMediumDrift ? 'Mild Drift' : 'Synced'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Department</span>
                      <span className="font-medium text-slate-700">{emp.department}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Baseline Shift
                      </span>
                      <span className="font-semibold text-[#0F172A]">
                        {emp.baselineWorkingHours.start} - {emp.baselineWorkingHours.end}
                      </span>
                    </div>

                    {/* Behavior Match Meter */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase tracking-wider">DNA Similarity Match</span>
                        <span className={hasHighDrift ? 'text-[#EF4444]' : 'text-[#10B981]'}>
                          {100 - emp.driftScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            hasHighDrift ? 'bg-[#EF4444]' : hasMediumDrift ? 'bg-amber-500' : 'bg-[#10B981]'
                          }`}
                          style={{ width: `${100 - emp.driftScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex justify-end">
                  <Link
                    href={`/dashboard/digital-twins/${emp.id}`}
                    className="text-xs text-[#2563EB] hover:text-blue-700 font-bold flex items-center gap-1 group cursor-pointer"
                  >
                    <span>Analyze DNA Baseline</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium text-xs">
            No active digital twins matching the criteria were found.
          </div>
        )}
      </div>

    </div>
  );
}
