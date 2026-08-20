import React from 'react';
import { UserCheck, Shield, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function UsersView({ users }) {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Registered Users & Technicians ({users.length})</h3>
          <p className="text-xs text-slate-400">View customer profiles and assigned field technicians</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/40">
                <th className="py-4 px-6">User Info</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">System Role</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Account Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                        {u.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{u.name}</h4>
                        <p className="text-slate-400 text-[11px]">ID: {u._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Phone size={13} className="text-yellow-400" />
                      {u.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                      <Mail size={13} className="text-slate-500" />
                      {u.email}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : u.role === 'technician'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-xs font-bold text-slate-400">Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
