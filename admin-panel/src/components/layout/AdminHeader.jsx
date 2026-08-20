import React from 'react';
import { Search, Bell, RefreshCw } from 'lucide-react';

export default function AdminHeader({ title, activeTab, onRefresh, isRefreshing }) {
  return (
    <header className="h-20 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <div className="flex items-center gap-2 text-xs text-yellow-400 font-bold tracking-wide uppercase">
          <span>Portal</span>
          <span>/</span>
          <span className="text-slate-400 capitalize">{activeTab}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-yellow-400' : 'text-slate-400'} />
          <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
        </button>

        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search booking, customer..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-400" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-400 p-0.5 shadow-md shadow-yellow-500/10">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-yellow-400 text-xs">
              AD
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-tight">Master Admin</p>
            <p className="text-[10px] text-slate-400 leading-tight">System Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
