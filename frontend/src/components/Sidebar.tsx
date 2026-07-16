'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Users, 
  Cpu, 
  AlertTriangle, 
  SearchCode, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Search,
  Bell,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: ShieldAlert },
    { name: 'Employees', path: '/dashboard/employees', icon: Users },
    { name: 'Digital Twins', path: '/dashboard/digital-twins', icon: Cpu },
    { name: 'Threat Predictions', path: '/dashboard/predictions', icon: AlertTriangle, badge: '3' },
    { name: 'Investigation', path: '/dashboard/investigation', icon: SearchCode, badge: '2' },
    { name: 'AI Copilot', path: '/dashboard/copilot', icon: MessageSquare },
    { name: 'Executive Dashboard', path: '/dashboard/executive', icon: BarChart3 },
    { name: 'Analytics', path: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-300 ease-in-out premium-shadow z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col font-sans">
              <span className="font-bold text-[#0F172A] leading-none text-base">SecureMind AI</span>
              <span className="text-[10px] text-[#2563EB] font-semibold tracking-wider uppercase mt-0.5">Predict. Prevent</span>
            </div>
          )}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-[#1E293B] cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Search Input (Only when not collapsed) */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Quick search (e.g. Karthikeyan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#1E293B] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
        </div>
      )}

      {/* Menu Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        {menuItems.map((item: any) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive 
                  ? 'bg-[#2563EB] text-white shadow-sm' 
                  : 'text-[#1E293B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#1E293B] group-hover:text-[#2563EB]'}`} />
                {!collapsed && <span>{item.name}</span>}
              </div>
              
              {!collapsed && item.badge && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-white text-[#2563EB]' 
                    : item.badge === '3' 
                      ? 'bg-[#EF4444]/10 text-[#EF4444]' 
                      : 'bg-[#2563EB]/10 text-[#2563EB]'
                }`}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <div className="w-2 h-2 rounded-full bg-[#EF4444] absolute right-4"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session profile bottom */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-semibold text-sm shrink-0">
              AG
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-[#0F172A] truncate">Abirami Ganesan</span>
                <span className="text-xs text-slate-500 truncate">SOC Manager</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Link href="/login" title="Logout" className="text-slate-400 hover:text-[#EF4444] transition-colors p-1 rounded-md hover:bg-slate-100">
              <LogOut className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
