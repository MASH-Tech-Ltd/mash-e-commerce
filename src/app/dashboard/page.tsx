'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const fetchStats = async () => {
    try {
      // Fetch Products
      const productsRes = await api.get('/products/my-products?page=1&limit=1');
      const totalProducts = productsRes.data?.meta?.total || 0;

      // Fetch Orders
      const ordersRes = await api.get('/orders/my-orders');
      const orders = ordersRes.data?.data || [];
      const totalOrders = orders.length;
      
      // Calculate Revenue (only from confirmed/delivered orders ideally, but we'll sum all for now)
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Overview</h2>
          <p className="text-gray-500">Welcome to your store dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Products</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalProducts}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-1">Revenue</p>
          <h3 className="text-3xl font-bold text-gray-900">Tk {stats.totalRevenue.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}
