import React, { useState } from 'react';
import { Users, Phone, Mail, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

export default function CustomersView({ users = [] }) {
  const [filterRole, setFilterRole] = useState('all');

  const customersOnly = users.filter((u) => u.role === 'customer' || !u.role);
  const adminsOnly = users.filter((u) => u.role === 'admin');
  const techOnly = users.filter((u) => u.role === 'technician');

  const displayUsers = users.filter((u) => {
    if (filterRole === 'customers') return u.role === 'customer' || !u.role;
    if (filterRole === 'admins') return u.role === 'admin';
    if (filterRole === 'technicians') return u.role === 'technician';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Database Users & Accounts ({users.length})</h3>
          <p className="text-xs text-slate-400">Real-time user directory synchronized with MongoDB Atlas</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'all'
                ? 'bg-yellow-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilterRole('customers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'customers'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customers ({customersOnly.length})
          </button>
          <button
            onClick={() => setFilterRole('admins')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'admins'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admins ({adminsOnly.length})
          </button>
          <button
            onClick={() => setFilterRole('technicians')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterRole === 'technicians'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Techs ({techOnly.length})
          </button>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/40">
                <th className="py-4 px-6">User Name</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Email Address</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-6 text-right">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {displayUsers.map((c) => {
                const isTech = c.role === 'technician';
                const isAdmin = c.role === 'admin';

                return (
                  <tr key={c._id || c.phone} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full border flex items-center justify-center font-bold text-sm ${
                            isAdmin
                              ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                              : isTech
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                          }`}
                        >
                          {c.name ? c.name.substring(0, 1).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{c.name || 'Anonymous User'}</h4>
                          <p className="text-slate-500 text-[11px]">ID: {c._id || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Phone size={13} className="text-yellow-400" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail size={13} className="text-slate-500" />
                        {c.email || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isAdmin
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : isTech
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {isAdmin ? <ShieldCheck size={11} /> : isTech ? <UserCheck size={11} /> : null}
                        {c.role || 'customer'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-400">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Live Account'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {displayUsers.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto text-slate-600 mb-2" size={32} />
              <p className="text-sm font-bold text-slate-300">No matching user accounts found</p>
              <p className="text-xs text-slate-500 mt-1">Users registered via Website or Mobile App will appear here in real-time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
