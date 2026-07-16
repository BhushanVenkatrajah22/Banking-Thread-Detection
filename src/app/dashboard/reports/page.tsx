'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Cpu, 
  Settings, 
  CheckSquare, 
  Square,
  ArrowRight,
  FileCheck,
  Loader,
  CheckCircle,
  AlertTriangle,
  Download
} from 'lucide-react';
import { generateMockDatabase } from '@/data/mockData';

export default function ReportsPage() {
  const { employees } = generateMockDatabase();
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [sections, setSections] = useState({
    summary: true,
    evidence: true,
    timeline: true,
    recommendations: true,
    signature: true
  });
  const [reportFormat, setReportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];

  const handleSectionToggle = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCompile = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Security Reports Generator</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Compile certified compliance logs, behavioral DNA drifts, and intervention summaries for audit boards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Report configuration form (5 columns on lg) */}
        <div className="lg:col-span-5 premium-card p-5 space-y-5">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Report Configuration</span>
          </h3>

          <form onSubmit={handleCompile} className="space-y-4 text-xs font-semibold">
            {/* Select Employee */}
            <div className="space-y-1.5">
              <label className="text-[#0F172A]">Target Subject</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#2563EB]"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id} — {emp.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist of sections */}
            <div className="space-y-2 pt-1">
              <span className="text-[#0F172A] block mb-2">Sections to Compile</span>
              
              <div className="space-y-2">
                {/* 1 */}
                <button
                  type="button"
                  onClick={() => handleSectionToggle('summary')}
                  className="flex items-center gap-2.5 text-slate-650 cursor-pointer font-semibold select-none"
                >
                  {sections.summary ? (
                    <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                  <span>Behavioral Digital Twin Summary</span>
                </button>
                {/* 2 */}
                <button
                  type="button"
                  onClick={() => handleSectionToggle('evidence')}
                  className="flex items-center gap-2.5 text-slate-650 cursor-pointer font-semibold select-none"
                >
                  {sections.evidence ? (
                    <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                  <span>Behavior DNA Drift &amp; Evidence Files</span>
                </button>
                {/* 3 */}
                <button
                  type="button"
                  onClick={() => handleSectionToggle('timeline')}
                  className="flex items-center gap-2.5 text-slate-650 cursor-pointer font-semibold select-none"
                >
                  {sections.timeline ? (
                    <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                  <span>Historical Behavior Timeline Logs</span>
                </button>
                {/* 4 */}
                <button
                  type="button"
                  onClick={() => handleSectionToggle('recommendations')}
                  className="flex items-center gap-2.5 text-slate-650 cursor-pointer font-semibold select-none"
                >
                  {sections.recommendations ? (
                    <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                  <span>Mitigation &amp; Preventive Action Recommendations</span>
                </button>
                {/* 5 */}
                <button
                  type="button"
                  onClick={() => handleSectionToggle('signature')}
                  className="flex items-center gap-2.5 text-slate-650 cursor-pointer font-semibold select-none"
                >
                  {sections.signature ? (
                    <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                  <span>Compliance Officer Sign-off Block</span>
                </button>
              </div>
            </div>

            {/* Select Export Format */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[#0F172A] block mb-1">Audit Export Format</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="format"
                    checked={reportFormat === 'pdf'}
                    onChange={() => setReportFormat('pdf')}
                    className="text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>PDF Document (Bank standard)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="format"
                    checked={reportFormat === 'csv'}
                    onChange={() => setReportFormat('csv')}
                    className="text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Structured CSV Data</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={generating}
              className="w-full bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 pt-3 mt-4 cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Compiling report files...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Compile &amp; Download Document</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Dynamic Document Preview (7 columns on lg) */}
        <div className="lg:col-span-7 premium-card p-6 min-h-[500px] flex flex-col justify-between bg-white relative border border-slate-300 shadow-lg">
          {/* Circular watermark decoration for banker look */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
            <FileText className="w-96 h-96" />
          </div>

          <div className="space-y-6 z-10">
            {/* Report Document Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div className="space-y-1">
                <div className="font-mono text-[9px] text-slate-400 font-bold uppercase">Classification: SECURE_INTERNAL</div>
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">SECUREMIND AI PLATFORM AUDIT LOG</h3>
              </div>
              <div className="text-right text-[10px] text-slate-500 font-semibold font-mono">
                <div>DATE: 2026-07-16</div>
                <div>CASE REF: RPT-{selectedEmployee.id}</div>
              </div>
            </div>

            {/* Selected Subject info summary */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Subject Name</span>
                <span className="font-bold text-[#0F172A]">{selectedEmployee.name}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Subject ID</span>
                <span className="font-mono font-bold text-slate-650">{selectedEmployee.id}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Corporate Role</span>
                <span className="font-medium text-slate-700">{selectedEmployee.role}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Department</span>
                <span className="font-semibold text-[#0F172A]">{selectedEmployee.department}</span>
              </div>
            </div>

            {/* Preview Sections block dynamically rendering based on checklist */}
            <div className="space-y-4 text-xs">
              {/* 1 */}
              {sections.summary && (
                <div className="space-y-1 leading-relaxed">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1">
                    1. AI Digital Twin Baseline Summary
                  </h4>
                  <p className="text-slate-600 font-semibold italic">{selectedEmployee.aiTwinSummary}</p>
                </div>
              )}

              {/* 2 */}
              {sections.evidence && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1">
                    2. Behavior DNA Drift Characteristics
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedEmployee.behaviorDNA.map((dna, idx) => (
                      <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px]">
                        {dna}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3 */}
              {sections.timeline && (
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1">
                    3. Behavior Anomaly Timeline Logs
                  </h4>
                  <div className="space-y-1.5 pt-1 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedEmployee.recentLogs.map((log) => (
                      <div key={log.id} className="flex justify-between gap-4 font-semibold text-[10px] text-slate-500">
                        <span className="text-slate-800 truncate">{log.description}</span>
                        <span className="shrink-0 font-mono text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4 */}
              {sections.recommendations && (
                <div className="space-y-1 leading-relaxed">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1">
                    4. Strategic Interventions Playbook
                  </h4>
                  <p className="text-slate-500 font-semibold">
                    {selectedEmployee.predictionRisk >= 70 
                      ? 'Deploy emergency containment. Quarantines workspace credentials immediately. Limit file transfer logs.'
                      : 'Maintain daily behavioral matching alerts. Subject is currently within normal safety parameters.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Report Document Footer */}
          {sections.signature && (
            <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-500 font-mono z-10 select-none">
              <div>
                <div>COMPILE ENGINE: SECUREMIND_v2</div>
                <div>AUTOGENERATED COMPLIANCE STAMP</div>
              </div>
              <div className="text-right">
                <div className="border-b border-slate-450 w-36 h-8"></div>
                <div className="mt-1 font-bold">AUTHORIZED COMPLIANCE SIGN-OFF</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
