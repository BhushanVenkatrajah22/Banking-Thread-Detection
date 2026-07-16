'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  FileSearch, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';
import { useEffect } from 'react';

export default function ThreatPredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPredId, setSelectedPredId] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/predictions')
      .then(res => res.json())
      .then(data => {
        const preds = data.predictions || [];
        setPredictions(preds);
        if (preds.length > 0) {
          setSelectedPredId(preds[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const selectedPrediction = predictions.find(p => p.id === selectedPredId) || predictions[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
        <span className="text-xs text-slate-500 font-semibold">Running predictive models...</span>
      </div>
    );
  }

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-[#EF4444]/10 text-[#EF4444] border-red-200';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Behavioral Threat Predictions Panel</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          AI predictions estimating insider threat vector probabilities before active incident declaration.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Predictions list (8 columns on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="premium-card p-4 bg-[#F8FAFC]/50 flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>{predictions.length} Active Predictive Warnings</span>
            <span>Sorted by Probability</span>
          </div>

          <div className="space-y-3.5">
            {predictions.map((pred) => {
              const isSelected = pred.id === selectedPredId;
              return (
                <div 
                  key={pred.id}
                  onClick={() => setSelectedPredId(pred.id)}
                  className={`premium-card p-4 cursor-pointer transition-all duration-200 text-xs flex justify-between items-center ${
                    isSelected 
                      ? 'border-[#2563EB] bg-[#2563EB]/5 shadow-sm' 
                      : 'hover:border-slate-350 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0F172A] text-sm">{pred.employeeName}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{pred.role}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                      <span className="text-[#0F172A] font-bold">{pred.attackType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {pred.timeWindow}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Probability</div>
                      <div className={`text-base font-extrabold ${
                        pred.probability >= 70 ? 'text-[#EF4444]' : 'text-amber-600'
                      }`}>
                        {pred.probability}%
                      </div>
                    </div>
                    
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-[#2563EB] translate-x-0.5' : 'text-slate-400'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Explainable AI detail panel (5 columns on lg) */}
        <div className="lg:col-span-5">
          {selectedPrediction ? (
            <div className="premium-card p-5 space-y-5">
              
              {/* Header */}
              <div className="border-b border-[#E2E8F0] pb-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Case File Analysis</span>
                    <h3 className="font-bold text-base text-[#0F172A] mt-0.5">{selectedPrediction.employeeName}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getImpactBadgeColor(selectedPrediction.businessImpact)}`}>
                    {selectedPrediction.businessImpact} Impact
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Prediction Confidence</span>
                  <span className="text-lg font-black text-[#0F172A] block mt-1">{selectedPrediction.confidence}%</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Time Window</span>
                  <span className="text-sm font-bold text-[#0F172A] block mt-1.5">{selectedPrediction.timeWindow}</span>
                </div>
              </div>

              {/* Explainable AI explanations */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Explainable AI Risk Factors</span>
                </span>
                
                <div className="space-y-2">
                  {selectedPrediction.explainableAI.map((reason, index) => (
                    <div 
                      key={index} 
                      className="p-3 border border-[#E2E8F0] rounded-lg bg-white flex gap-2.5 items-start text-xs font-semibold leading-relaxed text-slate-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] flex gap-3">
                <Link
                  href={`/dashboard/digital-twins/${selectedPrediction.employeeId}`}
                  className="flex-1 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-slate-700 py-2.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-slate-500" />
                  <span>Compare baseline</span>
                </Link>
                
                <Link
                  href={`/dashboard/investigation/${selectedPrediction.employeeId === 'EMP001' ? 'CASE-2026-001' : 'CASE-2026-002'}`}
                  className="flex-1 bg-[#2563EB] hover:bg-blue-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileSearch className="w-4 h-4" />
                  <span>Investigate Profile</span>
                </Link>
              </div>

            </div>
          ) : (
            <div className="premium-card p-5 text-center text-slate-400 font-medium text-xs">
              Select a warning to view full model details and predictions logs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
