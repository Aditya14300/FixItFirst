import React from 'react';
import { LayoutDashboard, Grid, Wrench, CalendarCheck, Users, UserCheck, ChevronRight } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'categories', label: 'Categories', icon: Grid, badge: null },
    { id: 'services', label: 'Services Catalog', icon: Wrench, badge: null },
    { id: 'bookings', label: 'Bookings & Orders', icon: CalendarCheck, badge: 'LIVE' },
    { id: 'customers', label: 'Customers', icon: Users, badge: null },
    { id: 'technicians', label: 'Technicians Roster', icon: UserCheck, badge: 'PRO' },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center p-1 overflow-hidden shrink-0">
          <img
            src="https://res.cloudinary.com/dmsgeia9g/image/upload/v1782974140/logo_e536po.png"
            alt="FixitFirst"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-lg font-black text-white tracking-tight leading-none">
            Fixit<span className="text-yellow-400">First</span>
          </h1>
          <p className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase mt-1">
            ADMIN PORTAL
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-400/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isActive
                    ? 'bg-slate-950/20 text-slate-950 border-slate-950/30'
                    : 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30'
                }`}>
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight size={16} className="text-slate-950" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Banner */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-white">MongoDB Live Sync</p>
              <p className="text-[10px] text-slate-400">Auto-refresh active</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
