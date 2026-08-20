import React from 'react';
import { UserCheck, Phone, Mail, Star, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TechniciansView({ staff = [] }) {
  const techList = staff.length > 0 ? staff : [
    { _id: 't1', name: 'Suresh Kumar', phone: '9811223344', email: 'suresh.tech@fixitfirst.com', specialization: 'AC & Electrical', rating: '4.9 ★', jobsCompleted: 48, status: 'Active' },
    { _id: 't2', name: 'Vikram Singh', phone: '9822334455', email: 'vikram.tech@fixitfirst.com', specialization: 'Plumbing & Appliances', rating: '4.8 ★', jobsCompleted: 35, status: 'Active' },
    { _id: 't3', name: 'Anil Carpenter', phone: '9833445566', email: 'anil.tech@fixitfirst.com', specialization: 'Carpentry & Furniture', rating: '4.7 ★', jobsCompleted: 29, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Technicians Roster ({techList.length})</h3>
          <p className="text-xs text-slate-400">Field specialists, specializations, and job performance</p>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techList.map((tech) => (
          <div
            key={tech._id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{tech.name}</h4>
                  <p className="text-xs text-cyan-400 font-semibold">{tech.specialization || 'Home Repair Expert'}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Rating</p>
                <p className="text-sm font-bold text-yellow-400 flex items-center gap-1 mt-0.5">
                  <Star size={14} className="fill-yellow-400" />
                  {tech.rating || '4.9 ★'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Jobs Done</p>
                <p className="text-sm font-bold text-white mt-0.5">{tech.jobsCompleted || '40+ Jobs'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-500" />
                <span>{tech.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <span>{tech.email || 'technician@fixitfirst.com'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
