import React from 'react';
import CartClient from './CartClient';
import Footer from '../../components/layout/Footer';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <CartClient />
      <Footer />
    </div>
  );
}
