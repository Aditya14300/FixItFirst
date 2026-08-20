import React from 'react';
import { DollarSign, CalendarCheck, Users, UserCheck, TrendingUp, ArrowUpRight, Clock, CheckCircle2, Shield } from 'lucide-react';

export default function DashboardView({ bookings, services, categories, users, setActiveTab }) {
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  // Separate Customers and Technicians
  const customers = users.filter((u) => u.role !== 'technician' && u.role !== 'admin');
  const technicians = users.filter((u) => u.role === 'technician');

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+18.4%',
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Total Bookings',
      value: bookings.length.toString(),
      change: '+12.5%',
      icon: CalendarCheck,
      color: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-400/30',
      textColor: 'text-yellow-400',
    },
    {
      title: 'Registered Customers',
      value: (customers.length > 0 ? customers.length : users.length).toString(),
      change: '+15 New',
      icon: Users,
      color: 'from-purple-500/20 to-indigo-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      title: 'Field Technicians',
      value: (technicians.length > 0 ? technicians.length : 1).toString(),
      change: '100% Active',
      icon: UserCheck,
      color: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-br ${kpi.color} border ${kpi.borderColor} backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl bg-slate-950/60 ${kpi.textColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-3xl font-black text-white tracking-tight">{kpi.value}</h3>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp size={14} />
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Recent Bookings & Technicians Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Service Bookings</h3>
              <p className="text-xs text-slate-400">Live order status from mobile app & web</p>
            </div>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 px-2">Booking ID</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Service</th>
                  <th className="pb-3 px-2">Date & Time</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-300">{booking._id}</td>
                    <td className="py-3.5 px-2">
                      <div className="font-bold text-white">{booking.customerName}</div>
                      <div className="text-[10px] text-slate-400">{booking.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-2 font-medium text-slate-300">{booking.serviceName}</td>
                    <td className="py-3.5 px-2 text-slate-400">
                      <div>{booking.date}</div>
                      <div className="text-[10px]">{booking.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : booking.status === 'completed'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle2 size={12} />}
                        {booking.status === 'pending' && <Clock size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold text-white">₹{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dedicated Technicians Overview Side Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Technicians App Roster</h3>
              <p className="text-xs text-slate-400">Field specialists & active jobs</p>
            </div>
            <button
              onClick={() => setActiveTab('technicians')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {(technicians.length > 0
              ? technicians
              : [
                  { _id: 't1', name: 'Suresh Kumar', phone: '9123456789', role: 'technician', specialization: 'AC & Electrical', rating: '4.9 ★' },
                  { _id: 't2', name: 'Vikram Singh', phone: '9876501234', role: 'technician', specialization: 'Plumbing & Appliances', rating: '4.8 ★' },
                ]
            ).map((tech) => (
              <div key={tech._id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                    <p className="text-[11px] text-cyan-400 font-semibold">{tech.specialization || 'Home Repair Expert'}</p>
                    <p className="text-[10px] text-slate-400">{tech.phone}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Online
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
