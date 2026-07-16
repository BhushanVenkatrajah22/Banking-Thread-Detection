'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timeString, setTimeString] = useState('10:05:48 AM');

  // Hardcode date matching user's locale (July 16, 2026)
  const dateString = 'Thursday, July 16, 2026';

  useEffect(() => {
    // Tick clock locally relative to starting time
    let sec = 48;
    let min = 5;
    let hr = 10;
    
    const interval = setInterval(() => {
      sec++;
      if (sec >= 60) { sec = 0; min++; }
      if (min >= 60) { min = 0; hr++; }
      if (hr > 12) { hr = 1; }
      
      const pad = (n: number) => String(n).padStart(2, '0');
      setTimeString(`${pad(hr)}:${pad(min)}:${pad(sec)} AM`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    if (pathname.startsWith('/dashboard/employees')) {
      if (pathname.split('/').length > 3) return 'Employee Security Profile';
      return 'Employee Directory';
    }
    if (pathname.startsWith('/dashboard/digital-twins')) {
      if (pathname.split('/').length > 3) return 'AI Digital Twin Visualizer';
      return 'AI Digital Twins Directory';
    }
    if (pathname.startsWith('/dashboard/predictions')) return 'Threat Predictions Panel';
    if (pathname.startsWith('/dashboard/investigation')) {
      if (pathname.split('/').length > 3) return 'Active Investigation File';
      return 'Investigation Center';
    }
    if (pathname === '/dashboard/copilot') return 'AI Security Copilot';
    if (pathname === '/dashboard/executive') return 'CISO Executive Board';
    if (pathname === '/dashboard/analytics') return 'Behavioral Analytics';
    if (pathname === '/dashboard/reports') return 'Security Report Generator';
    if (pathname === '/dashboard/settings') return 'System Configuration';
    return 'SecureMind AI Platform';
  };

  const mockNotifications = [
    { id: 1, title: 'CRITICAL: Data Exfiltration Risk', desc: 'Rajesh Kumar behavior drift is 78% (USB insertion detected).', time: '2 mins ago', unread: true },
    { id: 2, title: 'HIGH: Database Logging Terminated', desc: 'syslogd daemon stopped by admin priya.sharma.', time: '14 mins ago', unread: true },
    { id: 3, title: 'INFO: Settings updated', desc: 'Risk sensitivity threshold updated to 85% for Retail.', time: '1 hour ago', unread: false }
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 z-10 shrink-0 select-none">
      {/* Page Title & Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[#0F172A]">{getPageTitle()}</h1>
        <div className="hidden md:flex items-center gap-1.5 bg-[#10B981]/10 text-[#10B981] px-2.5 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Protection</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Date and Time */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 bg-[#F8FAFC] px-3.5 py-1.5 rounded-lg border border-[#E2E8F0]">
          <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{dateString}</span>
          <span className="text-[#E2E8F0] font-light">|</span>
          <span className="font-mono text-[#0F172A] font-semibold">{timeString}</span>
        </div>

        {/* System State Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs bg-[#2563EB]/10 text-[#2563EB] px-3 py-1.5 rounded-lg font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Twin Baseline Synced</span>
        </div>

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-[#1E293B] relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EF4444]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-2 py-3 overflow-hidden">
              <div className="flex items-center justify-between px-3 pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-[#0F172A]">Security Notifications</span>
                <span className="text-[11px] text-[#2563EB] font-semibold hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="mt-1 divide-y divide-slate-50">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-[#F8FAFC] transition-colors rounded-lg">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`font-semibold text-xs ${notif.unread ? 'text-[#0F172A]' : 'text-slate-500'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[9px] text-slate-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center mt-2">
                <Link href="/dashboard/investigation" onClick={() => setShowNotifications(false)} className="text-xs text-[#2563EB] font-semibold hover:underline">
                  View Investigation Center
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 hover:bg-[#F8FAFC] p-1.5 rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
              AG
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-1.5 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-[#0F172A]">Anjali Gupta</p>
                <p className="text-[10px] text-slate-500 truncate">anjali.gupta@securemind.bank</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg">
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Account Settings</span>
                </Link>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg text-left cursor-pointer">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Documentation</span>
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1.5">
                <Link href="/login" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-[#EF4444] hover:bg-red-50 rounded-lg">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
