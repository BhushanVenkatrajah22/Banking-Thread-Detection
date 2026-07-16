'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Eye, 
  Cpu, 
  ChevronLeft, 
  ChevronRight,
  User,
  MoreVertical,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useEffect } from 'react';

export default function EmployeeDirectoryPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      search: searchTerm,
      dept: deptFilter,
      risk: riskFilter,
      status: statusFilter
    });
    fetch(`/api/employees?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchTerm, deptFilter, riskFilter, statusFilter]);

  // Department List
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

  // Pagination Logic
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return employees.slice(startIdx, startIdx + itemsPerPage);
  }, [employees, currentPage]);

  const filteredEmployees = employees;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDeptFilter('All');
    setRiskFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage {employees.length} digital twin baselines and behavioral status.
          </p>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-xs text-slate-500 hover:text-[#2563EB] font-bold border border-[#E2E8F0] px-3.5 py-2 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Filters Control bar */}
      <div className="premium-card p-4 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, ID or title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Department</span>
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB] transition-colors"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Risk State</span>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB] transition-colors"
            >
              <option value="All">All Risks</option>
              <option value="High">High Risk (&gt;70%)</option>
              <option value="Medium">Medium Risk (35%-70%)</option>
              <option value="Low">Low Risk (&lt;35%)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Session</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2563EB] transition-colors"
            >
              <option value="All">All States</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/50 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-5 font-semibold">Employee ID</th>
                <th className="py-3 px-5 font-semibold">Name</th>
                <th className="py-3 px-5 font-semibold">Department</th>
                <th className="py-3 px-5 font-semibold">Session Status</th>
                <th className="py-3 px-5 font-semibold text-center">Behavior Drift</th>
                <th className="py-3 px-5 font-semibold text-center">Trust Score</th>
                <th className="py-3 px-5 font-semibold text-center">Risk Score</th>
                <th className="py-3 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-500 font-semibold">{emp.id}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center font-bold text-xs">
                          {emp.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-600">{emp.department}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          emp.status === 'online' ? 'bg-[#10B981]' : 'bg-slate-300'
                        }`} />
                        <span className="capitalize font-semibold text-slate-600">{emp.status}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`font-bold ${
                          emp.driftScore >= 50 ? 'text-[#EF4444]' : emp.driftScore >= 25 ? 'text-amber-600' : 'text-[#1E293B]'
                        }`}>
                          {emp.driftScore}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              emp.driftScore >= 50 ? 'bg-[#EF4444]' : emp.driftScore >= 25 ? 'bg-amber-500' : 'bg-[#2563EB]'
                            }`}
                            style={{ width: `${emp.driftScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-center font-bold">
                      <span className={`${
                        emp.trustScore < 40 ? 'text-[#EF4444]' : emp.trustScore < 70 ? 'text-amber-600' : 'text-[#10B981]'
                      }`}>
                        {emp.trustScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-bold">
                      <span className={`${
                        emp.predictionRisk >= 70 ? 'text-[#EF4444]' : emp.predictionRisk >= 35 ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {emp.predictionRisk}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dashboard/employees/${emp.id}`}
                          className="text-slate-600 hover:text-[#2563EB] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/dashboard/digital-twins/${emp.id}`}
                          className="text-slate-600 hover:text-[#10B981] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                          title="View Digital Twin"
                        >
                          <Cpu className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No active employees match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination footer */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#E2E8F0] flex justify-between items-center text-xs text-slate-500 font-medium select-none bg-[#F8FAFC]/50">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-lg border font-bold flex items-center justify-center cursor-pointer transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                      : 'bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
