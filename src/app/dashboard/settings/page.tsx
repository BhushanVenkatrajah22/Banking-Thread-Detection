'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Bell, 
  Database, 
  Cpu, 
  Moon, 
  KeyRound, 
  CheckCircle2, 
  Save,
  HelpCircle
} from 'lucide-react';

export default function SettingsPage() {
  // Risk thresholds
  const [sensitivity, setSensitivity] = useState(70);
  const [learningWindow, setLearningWindow] = useState('30d');
  
  // Alerts
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    webhook: true,
    sms: false
  });

  // AI keys
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 1000);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">System Configuration</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure baseline algorithms sensitivity, security reporting hooks, and LLM credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold">
        
        {/* Risk Thresholds Card */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-[#2563EB]" />
            <span>Behavior Prediction Thresholds</span>
          </h3>

          <div className="space-y-4">
            {/* Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#0F172A]">Anomalous Drift Risk Threshold</span>
                <span className="font-extrabold text-[#2563EB]">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <span className="text-[10px] text-slate-400 block font-medium">
                Predictions exceeding this probability will trigger automatic Incident Case Files in the SOC.
              </span>
            </div>

            {/* Learning Windows dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#0F172A]">Digital Twin Baseline Learning Window</label>
                <select
                  value={learningWindow}
                  onChange={(e) => setLearningWindow(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="14d">14 Days (Fast drift response)</option>
                  <option value="30d">30 Days (Standard baseline learning)</option>
                  <option value="90d">90 Days (Thorough behavior mapping)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Preferences */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-[#2563EB]" />
            <span>SOC Alert Notification Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email alerts */}
            <div className="p-3 border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[#0F172A] block">Email Incident Dispatch</span>
                <span className="text-[9px] text-slate-400 font-medium">Send detailed PDFs to SOC managers</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => toggleNotif('email')}
                className="w-4.5 h-4.5 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
            </div>

            {/* Webhook alerts */}
            <div className="p-3 border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[#0F172A] block">SIEM Webhook Integration</span>
                <span className="text-[9px] text-slate-400 font-medium">Forward JSON schemas to Splunk/Sentinel</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.webhook}
                onChange={() => toggleNotif('webhook')}
                className="w-4.5 h-4.5 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Integration placeholders */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <KeyRound className="w-4.5 h-4.5 text-[#2563EB]" />
            <span>AI Model Integration Keys</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#0F172A]">AI Language Engine Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#2563EB]"
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                <option value="openai-gpt4o">OpenAI GPT-4o Engine</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet API</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#0F172A]">API Auth Authorization Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Light theme authorization override note */}
        <div className="premium-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] border-b border-[#E2E8F0] pb-2.5 flex items-center gap-2">
            <Moon className="w-4.5 h-4.5 text-slate-400" />
            <span>Interface Mode Settings</span>
          </h3>

          <div className="p-4 bg-[#2563EB]/5 border border-[#2563EB]/15 rounded-xl flex gap-3 text-xs leading-relaxed">
            <HelpCircle className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#0F172A] block">Theme Constraint Standard</span>
              <p className="text-slate-600 font-semibold">
                This workstation terminal conforms to banking light mode protocols. Dark Mode overrides are disabled by authorization guidelines to prevent eye fatigue on low-light control desks.
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? (
              <span>Saving parameters...</span>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Configuration Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                <span>Save Parameters</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
