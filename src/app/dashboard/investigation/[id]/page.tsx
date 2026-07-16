'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ShieldAlert, 
  FileText, 
  Trash2, 
  CheckCircle, 
  Lock, 
  UserX, 
  PlusCircle, 
  Save,
  Loader,
  AlertTriangle,
  History,
  FileCheck,
  Send,
  MessageSquare,
  FileDown
} from 'lucide-react';
import { generateMockDatabase } from '@/data/mockData';

import { useEffect } from 'react';

export default function InvestigationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseFile, setCaseFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Local state for interactive buttons
  const [status, setStatus] = useState<string>('open');
  const [accountLocked, setAccountLocked] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  
  // Modal for Report Generation
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportComments, setReportComments] = useState('Critical behavioral drift verified against learned digital twin. Active exfiltration vectors blocked. Workstation WS-TRD-45 quarantined.');

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/investigation/${caseId}`)
      .then(res => res.json())
      .then(data => {
        const item = data.caseFile || null;
        setCaseFile(item);
        if (item) {
          setStatus(item.status);
          setNotes(item.notes || []);
          setReportTitle(`Compliance Audit Report - ${item.employeeName}`);
          setAccountLocked(item.timeline && item.timeline[0]?.employeeStatus === 'offline');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [caseId]);

  const handleStatusChange = async (newVal: string) => {
    setStatus(newVal);
    try {
      await fetch(`/api/investigation/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newVal })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLockAccount = async () => {
    const newVal = !accountLocked;
    setAccountLocked(newVal);
    try {
      await fetch(`/api/investigation/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountLocked: newVal })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setNewNote('');
    try {
      await fetch(`/api/investigation/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setShowReportModal(false);
      }, 1500);
    }, 2000);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'open': return 'text-[#EF4444] bg-[#EF4444]/10 border-red-200';
      case 'under_review': return 'text-amber-600 bg-amber-500/10 border-amber-200';
      case 'resolved': return 'text-[#10B981] bg-[#10B981]/10 border-emerald-200';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
        <span className="text-xs text-slate-500 font-semibold">Loading case file records...</span>
      </div>
    );
  }

  if (!caseFile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800">Case file not found</h3>
        <p className="text-sm text-slate-500 mt-2">The case ID {caseId} does not exist in the database.</p>
        <Link href="/dashboard/investigation" className="text-[#2563EB] hover:underline text-xs mt-4 inline-block font-bold">
          Return to Investigation Center
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div className="flex justify-between items-center">
        <Link 
          href="/dashboard/investigation" 
          className="text-xs text-slate-500 hover:text-[#2563EB] font-bold flex items-center gap-1 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Investigation Dashboard</span>
        </Link>

        {/* Current Case Status badge */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          <select 
            value={status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-xs font-bold border px-3 py-1.5 rounded-lg focus:outline-none transition-colors ${getStatusColor(status)}`}
          >
            <option value="open">OPEN PRIORITY</option>
            <option value="under_review">UNDER REVIEW</option>
            <option value="resolved">RESOLVED / ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Case Metadata, Explanation, Timeline, Evidence (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Case Card */}
          <div className="premium-card p-6 space-y-5">
            <div className="flex justify-between items-start flex-wrap gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{caseFile.id}</span>
                <h2 className="text-xl font-bold text-[#0F172A] mt-0.5">{caseFile.employeeName}</h2>
                <p className="text-xs text-slate-500 font-semibold">{caseFile.role} • {caseFile.department}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-[#2563EB] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incident Vector</span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl">
                {caseFile.description}
              </p>
            </div>

            {/* AI Explanation */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#2563EB]" />
                <span>Explainable AI Core Diagnosis</span>
              </span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed border-l-4 border-[#2563EB] pl-4 italic">
                {caseFile.aiExplanation}
              </p>
            </div>
          </div>

          {/* Evidence Files List */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
              Collected Behavioral Evidence ({caseFile.evidence.length})
            </h3>
            <div className="space-y-2">
              {(caseFile.evidence as string[]).map((item: string, idx: number) => (
                <div key={idx} className="p-3 border border-[#E2E8F0] bg-white rounded-lg flex gap-3 items-center text-xs font-semibold text-slate-600">
                  <FileCheck className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Logs */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-[#2563EB]" />
              <span>Behavior Timeline Logs</span>
            </h3>
            
            <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-5 py-2">
              {caseFile.timeline.map((log) => (
                <div key={log.id} className="relative text-xs">
                  {/* Timeline dot */}
                  <span className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 border-white ${
                    log.severity === 'high' ? 'bg-[#EF4444]' : 'bg-[#2563EB]'
                  }`} />
                  
                  <div className="flex justify-between items-start font-semibold text-slate-400 text-[10px]">
                    <span className="uppercase">{log.category}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-[#0F172A] font-bold mt-1">{log.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Preventive Actions, Case Notes (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Center (Simulated) */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
              Mitigation Actions
            </h3>

            <div className="space-y-3">
              {/* Lock account */}
              <button
                onClick={handleLockAccount}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                  accountLocked 
                    ? 'bg-[#10B981] border-[#10B981] text-white hover:bg-emerald-600' 
                    : 'bg-white border-[#EF4444] text-[#EF4444] hover:bg-red-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <UserX className="w-4 h-4" />
                  <span>{accountLocked ? 'Account Isolated' : 'Isolate Account / VPN'}</span>
                </span>
                {accountLocked && <CheckCircle className="w-4 h-4" />}
              </button>

              {/* Escalate */}
              <button
                onClick={() => setEscalated(!escalated)}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                  escalated 
                    ? 'bg-[#2563EB] border-[#2563EB] text-white hover:bg-blue-600' 
                    : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
                  <span>{escalated ? 'Escalated to HR / Legal' : 'Escalate to HR Security'}</span>
                </span>
                {escalated && <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Notes list and input */}
          <div className="premium-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5">
              Analyst Comments
            </h3>

            {/* Note logs list */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {notes.map((note, index) => (
                <div key={index} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-600 leading-relaxed">
                  <p>{note}</p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1">SOC Analyst • Just now</span>
                </div>
              ))}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#2563EB]"
              />
              <button 
                type="submit"
                className="bg-[#2563EB] hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* REPORT GENERATOR MODAL DIALOG */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2563EB]" />
                <span>Configure Executive Security Report</span>
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Report Generated Successfully</h4>
                  <p className="text-xs text-slate-500 mt-1">Audit document has been downloaded (PDF Format).</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F172A]">Document Title</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F172A]">Executive Summary / Findings</label>
                  <textarea
                    value={reportComments}
                    onChange={(e) => setReportComments(e.target.value)}
                    rows={4}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#2563EB] leading-relaxed"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="bg-white border border-[#E2E8F0] text-slate-700 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generatingReport}
                    className="bg-[#2563EB] hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {generatingReport ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Compiling document...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>Compile &amp; Download</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
