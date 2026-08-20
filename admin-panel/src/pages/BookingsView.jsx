import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, Search } from 'lucide-react';
import { updateBookingStatus } from '../services/api';

export default function BookingsView({ bookings, setBookings }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const handleUpdateStatus = async (id, newStatus) => {
    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
    // Persist to MongoDB
    await updateBookingStatus(id, newStatus);
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === 'all' ? true : b.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Service Bookings ({bookings.length})</h3>
          <p className="text-xs text-slate-400">Manage incoming service requests and dispatch status</p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/40">
                <th className="py-4 px-6">Booking Info</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Date & Slot</th>
                <th className="py-4 px-4">Address</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Update Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono font-bold text-yellow-400">{b._id}</div>
                    <div className="font-bold text-white text-sm mt-0.5">{b.serviceName}</div>
                    <div className="text-slate-400 font-bold mt-1">₹{b.amount}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white">{b.customerName}</div>
                    <div className="text-slate-400 text-[11px]">{b.customerPhone}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar size={13} className="text-slate-500" />
                      {b.date}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                      <Clock size={13} className="text-slate-500" />
                      {b.timeSlot}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-start gap-1 text-slate-300">
                      <MapPin size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{b.address}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : b.status === 'completed'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : b.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                        >
                          Complete
                        </button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                          className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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
