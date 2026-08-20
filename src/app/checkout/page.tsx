import React from 'react';
import CheckoutClient from './CheckoutClient';
import Footer from '../../components/layout/Footer';

export default async function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <CheckoutClient />
      <Footer />
    </div>
  );
}
