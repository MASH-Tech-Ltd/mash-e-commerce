'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function FloatingCart() {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link href="/checkout" className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col cursor-pointer drop-shadow-2xl">
      <div className="bg-primary text-white p-3 rounded-t-lg flex flex-col items-center justify-center border border-primary">
        <ShoppingCart size={24} className="mb-1" />
        <span className="text-xs font-bold whitespace-nowrap">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
      </div>
      <div className="bg-white text-primary p-2 rounded-b-lg border-b border-l border-r border-primary text-center">
        <span className="text-xs font-bold whitespace-nowrap">BDT {totalPrice}</span>
      </div>
    </Link>
  );
}
