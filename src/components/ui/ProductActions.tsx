'use client';

import React, { useState } from 'react';
import { ShoppingCart, Zap, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface ProductActionsProps {
  product: {
    _id?: string;
    id?: string;
    title: string;
    discountedPrice: number;
    image: any;
    tenantId: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCart();
  const productId = product._id || product.id;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart({
      id: String(productId),
      productId: String(productId),
      title: product.title,
      price: product.discountedPrice,
      image: (typeof product.image === 'string' ? product.image : product.image?.secure_url) || '',
      tenantId: product.tenantId
    }, quantity);
  };

  const handleOrderNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <>
      <div className="flex items-center space-x-4 mb-6 w-32">
        <button onClick={handleDecrease} className="w-10 h-10 border border-primary text-primary flex items-center justify-center rounded hover:bg-gray-50">
          <Minus size={18} />
        </button>
        <span className="font-bold text-gray-900 flex-1 text-center">{quantity}</span>
        <button onClick={handleIncrease} className="w-10 h-10 border border-primary text-primary flex items-center justify-center rounded hover:bg-gray-50">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-primary text-primary rounded hover:bg-gray-50 transition-colors font-bold"
        >
          <ShoppingCart size={20} />
          <span>কার্টে যোগ করুন</span>
        </button>
        <button 
          onClick={handleOrderNow}
          className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary text-white rounded hover:bg-primary transition-colors font-bold shadow-md"
        >
          <Zap size={20} />
          <span>অর্ডার করুন</span>
        </button>
      </div>
    </>
  );
}
