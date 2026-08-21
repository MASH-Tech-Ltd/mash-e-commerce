'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';
import api from '@/utils/api';

export default function Navbar() {
  const [storeName, setStoreName] = useState('Store Admin');

  const fetchStoreName = async () => {
    try {
      const res = await api.get('/store/my-store');
      if (res.data.status === 'ok' || res.data.success) {
        if (res.data.data.name) {
          setStoreName(res.data.data.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch store info for navbar', error);
    }
  };

  useEffect(() => {
    fetchStoreName();
    
    // Listen for custom event from settings page to update instantly
    window.addEventListener('storeUpdated', fetchStoreName);
    return () => window.removeEventListener('storeUpdated', fetchStoreName);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products or orders..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{storeName}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
