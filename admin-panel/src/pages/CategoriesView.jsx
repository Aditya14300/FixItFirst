import React, { useState } from 'react';
import { Plus, Grid, Trash2, Edit3, X, Check, Wrench, Zap, Wind, Tv, Hammer, Sparkles } from 'lucide-react';
import { createCategory } from '../services/api';

export default function CategoriesView({ categories, setCategories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Wrench');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = await createCategory({ name, description, icon });
    setCategories((prev) => [...prev, newCat]);
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'electrical':
      case 'zap':
        return Zap;
      case 'ac repair':
      case 'wind':
        return Wind;
      case 'appliance':
      case 'tv':
        return Tv;
      case 'carpentry':
      case 'hammer':
        return Hammer;
      case 'cleaning':
      case 'sparkles':
        return Sparkles;
      default:
        return Wrench;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Service Categories ({categories.length})</h3>
          <p className="text-xs text-slate-400">Manage repair categories shown across mobile app and web</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-yellow-400/10 hover:bg-yellow-300 transition-all"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComponent = getCategoryIcon(cat.icon || cat.name);
          return (
            <div
              key={cat._id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center">
                    <IconComponent size={24} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase">
                    Active
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mt-4">{cat.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">ID: {cat._id}</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-800/60 text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h4 className="text-lg font-bold text-white">Add New Category</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Painting & Waterproofing"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of services in this category"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 text-slate-950 text-sm font-bold shadow-lg shadow-yellow-400/10 hover:bg-yellow-300"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
