'use client';

import React, { useState } from 'react';
import AddToCartClient from './AddToCartClient';

export default function ProductActionClient({ product, tTranslations }: { product: any, tTranslations: Record<string, string> }) {
  const isVariant = product.productType === 'VARIANT' && product.variants && product.variants.length > 0;
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const currentVariant = isVariant ? product.variants[selectedVariantIndex] : null;
  
  const displayDiscountedPrice = isVariant ? currentVariant.discountedPrice : product.discountedPrice;
  const displayOriginalPrice = isVariant ? currentVariant.originalPrice : product.originalPrice;
  const displayStock = isVariant ? currentVariant.stock : product.stock;

  const t = (key: string) => tTranslations[key] || key;

  return (
    <div>
      {/* Variants Selector */}
      {isVariant && (
        <div className="mb-6">
          <div className="text-sm font-bold text-gray-900 mb-3">Options</div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedVariantIndex(index)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                  selectedVariantIndex === index 
                    ? 'border-[#7c3aed] bg-[#f9f5ff] text-[#7c3aed]' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {variant.variantName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <div className="text-3xl font-bold text-gray-900 tracking-tight">
          {displayDiscountedPrice.toLocaleString()} {t('bdt')}
        </div>
        
        {displayOriginalPrice > displayDiscountedPrice && (
          <>
            <div className="text-lg text-gray-400 line-through font-medium">
              {displayOriginalPrice.toLocaleString()} {t('bdt')}
            </div>
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              {t('save')} {(displayOriginalPrice - displayDiscountedPrice).toLocaleString()} {t('bdt')}
            </div>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        {displayStock > 0 ? (
          <span className="font-medium text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {t('inStock')} ({displayStock})
          </span>
        ) : (
          <span className="font-medium text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {t('outOfStock')}
          </span>
        )}
      </div>

      {/* Add to Cart */}
      <AddToCartClient product={product} selectedVariant={currentVariant} />
    </div>
  );
}
