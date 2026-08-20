'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/context/LanguageContext';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { t } = useTranslation();

  return (
    <>
      <main className="max-w-[1400px] mx-auto px-6 py-12 flex-1 w-full">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('yourCartIsEmpty')}</h2>
            <p className="text-gray-500 mb-8 max-w-md">{t('browseProducts')}</p>
            <Link 
              href="/" 
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary transition-colors shadow-md"
            >
              {t('startShopping')}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{t('cartItems')} ({totalItems})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-gray-50 transition-colors">
                    <div className="w-24 h-24 bg-[#F8F9FA] rounded-md border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-1 flex flex-col w-full text-center sm:text-left">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{item.title}</h3>
                      <div className="text-lg font-bold text-[#D3100B]">{item.price.toLocaleString()} {t('bdt')}</div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="w-12 text-center font-semibold text-gray-900 text-sm">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-96 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('subtotal')} ({totalItems} {t('items')})</span>
                    <span className="font-semibold text-gray-900">{totalPrice.toLocaleString()} {t('bdt')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('shipping')}</span>
                    <span className="font-semibold text-gray-900">{t('calculatedAtCheckout')}</span>
                  </div>
                  <div className="h-px bg-gray-100 w-full my-2"></div>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>{t('total')}</span>
                    <span className="text-[#D3100B]">{totalPrice.toLocaleString()} {t('bdt')}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  {t('proceedToCheckout')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
