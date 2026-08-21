'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Tags, 
  ShoppingCart,
  Settings,
  LogOut 
} from 'lucide-react';
import api from '@/utils/api';

export default function Sidebar() {
  const pathname = usePathname();
  const [storeName, setStoreName] = useState('Shop Dashboard');

  const fetchStoreName = async () => {
    try {
      const res = await api.get('/store/my-store');
      if (res.data.status === 'ok' || res.data.success) {
        if (res.data.data.name) {
          setStoreName(res.data.data.name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch store info for sidebar', error);
    }
  };

  useEffect(() => {
    fetchStoreName();
    
    // Listen for custom event from settings page to update instantly
    window.addEventListener('storeUpdated', fetchStoreName);
    return () => window.removeEventListener('storeUpdated', fetchStoreName);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: PackageSearch },
    { name: 'Categories', path: '/dashboard/categories', icon: Tags },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
  ];

  const handleLogout = () => {
    localStorage.removeItem('tenantAccessToken');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent truncate w-full">
          {storeName}
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link 
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
