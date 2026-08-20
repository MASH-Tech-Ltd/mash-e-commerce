'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';

export default function AddToCartClient({ product, selectedVariant }: { product: any, selectedVariant?: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const { t } = useTranslation();

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const currentPrice = selectedVariant ? selectedVariant.discountedPrice : (product.discountedPrice || product.price);

  const handleAddToCart = () => {
    const productId = product._id || product.id;
    // Composite ID: for variants use productId__variantName so each variant is a separate cart row
    const cartId = selectedVariant
      ? `${productId}__${selectedVariant.variantName}`
      : productId;

    addToCart({
      id: cartId,
      productId,
      variantName: selectedVariant ? selectedVariant.variantName : undefined,
      title: selectedVariant ? `${product.title} - ${selectedVariant.variantName}` : product.title,
      price: currentPrice,
      image: product.images?.[0]?.secure_url || product.images?.[0]?.url || 'https://placehold.co/400',
      tenantId: product.tenantId || 'main',
    }, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
      <div className="flex items-center border border-[#7c3aed] rounded overflow-hidden h-8 w-22 text-[#7c3aed]">
        <button 
          onClick={handleDecrease}
          className="w-7 h-full flex items-center justify-center hover:bg-[#f9f5ff] transition-colors font-bold text-base"
        >
          -
        </button>
        <div className="flex-1 text-center text-xs font-semibold text-gray-900 border-x border-[#7c3aed] py-1.5">
          {quantity}
        </div>
        <button 
          onClick={handleIncrease}
          className="w-7 h-full flex items-center justify-center hover:bg-[#f9f5ff] transition-colors font-bold text-base"
        >
          +
        </button>
      </div>
      <button 
        onClick={handleAddToCart}
        className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-2 px-5 rounded text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        {t('addToCart')}
      </button>
      <button 
        onClick={handleBuyNow}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        {t('buyNow')}
      </button>
    </div>
  );
}
