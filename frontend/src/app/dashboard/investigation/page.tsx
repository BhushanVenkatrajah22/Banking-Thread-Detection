'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileSearch, 
  Search, 
  SlidersHorizontal, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  PlusCircle,
  UserCheck
} from 'lucide-react';
import { useEffect } from 'react';

export default function InvestigationCenterPage() {
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'open' | 'under_review' | 'resolved'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      search: searchTerm,
      status: statusFilter
    });
    fetch(`/api/investigation?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setInvestigations(data.investigations || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchTerm, statusFilter]);

  const filteredCases = investigations;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
        <span className="text-xs text-slate-500 font-semibold">Loading active cases logs...</span>
      </div>
    );
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-[#EF4444]/10 text-[#EF4444] border-red-200';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-[#2563EB]/10 text-[#2563EB] border-blue-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return 'bg-[#EF4444]/5 text-[#EF4444] border border-[#EF4444]/10';
      case 'under_review': return 'bg-amber-500/5 text-amber-600 border border-amber-500/10';
      case 'resolved': return 'bg-[#10B981]/5 text-[#10B981] border border-[#10B981]/10';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Investigation Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit case files, evidentiary logs, and execute preventive network isolations.
          </p>
        </div>
        <button className="bg-[#2563EB] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
          <PlusCircle className="w-4 h-4" />
          <span>Initiate Manual Audit</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="premium-card p-4 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by case code, employee or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Status filters buttons */}
        <div className="flex gap-2">
          {['All', 'open', 'under_review', 'resolved'].map((status: any) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-white border-[#E2E8F0] text-slate-600 hover:bg-[#F8FAFC]'
              }`}
            >
              {status === 'All' ? 'All Cases' : status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Case Files List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.length > 0 ? (
          filteredCases.map((item: any) => (
            <div key={item.id} className="premium-card p-5 flex flex-col justify-between hover:border-slate-350 transition-colors">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{item.id}</span>
                    <h3 className="font-bold text-base text-[#0F172A] mt-0.5">{item.employeeName}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{item.role} • {item.department}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusStyle(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getSeverityStyle(item.severity)}`}>
                      {item.severity.toUpperCase()} Priority
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 text-xs font-medium text-slate-500 leading-relaxed">
                  <span className="font-bold text-[#0F172A] block mb-1">Case Summary</span>
                  <p>{item.description}</p>
                </div>

                {/* Assigned To */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-semibold bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Assigned:</span>
                  </span>
                  <span className="text-[#0F172A] font-bold">{item.assignedTo}</span>
                </div>
              </div>

              {/* Action Link footer */}
              <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                </span>
                
                <Link
                  href={`/dashboard/investigation/${item.id}`}
                  className="text-xs text-[#2563EB] hover:text-blue-700 font-bold flex items-center gap-1 group cursor-pointer"
                >
                  <span>Open Case file</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium text-xs">
            No active investigation cases matching the filters.
          </div>
        )}
      </div>

    </div>
  );
}
