'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { Truck } from 'lucide-react';

export default function CourierSettingsPage() {
  const [formData, setFormData] = useState({
    insideDhaka: 60,
    outsideDhaka: 120,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourierCharge();
  }, []);

  const fetchCourierCharge = async () => {
    try {
      const res = await api.get('/courier/my-charges');
      if (res.data.success || res.data.status === 'ok') {
        const { insideDhaka, outsideDhaka } = res.data.data;
        setFormData({ insideDhaka, outsideDhaka });
      }
    } catch (error) {
      toast.error('Failed to load courier charges');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value) || 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch('/courier/update-charges', formData);
      if (res.data.success || res.data.status === 'ok') {
        toast.success('Courier charges updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update courier charges');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-400" />
            Courier Settings
          </h2>
          <p className="text-slate-400">Manage your delivery charges for customers.</p>
        </div>
      </div>

      <div className="dark-glass rounded-2xl border border-slate-700/50 shadow-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inside Dhaka */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Inside Dhaka Charge (BDT)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-bold">Tk</span>
                </div>
                <input 
                  type="number" 
                  name="insideDhaka"
                  value={formData.insideDhaka}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Delivery charge applied when customer selects "Inside Dhaka".</p>
            </div>

            {/* Outside Dhaka */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Outside Dhaka Charge (BDT)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-bold">Tk</span>
                </div>
                <input 
                  type="number" 
                  name="outsideDhaka"
                  value={formData.outsideDhaka}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Delivery charge applied when customer selects "Outside Dhaka".</p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-700/50 flex justify-end">
            <button 
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
