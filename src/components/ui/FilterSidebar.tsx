'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface FilterSidebarProps {
  categoryId: string;
  availableBrands?: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ categoryId, availableBrands = [], isOpen, onClose }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');

  const applyFilters = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (search) params.set('search', search);
    if (brand) params.set('brand', brand);
    if (inStock) params.set('inStock', 'true');
    onClose();
    router.push(`/category/${categoryId}?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setBrand('');
    setInStock(false);
    onClose();
    router.push(`/category/${categoryId}`);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto
        md:sticky md:translate-x-0 md:w-auto md:z-auto md:inset-y-auto md:left-auto md:overflow-y-visible
        bg-white p-6 rounded-none md:rounded-xl shadow-2xl md:shadow-sm border-r md:border border-gray-100 h-full md:h-fit top-0 md:top-24 transition-transform duration-300
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-900 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={applyFilters} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
            <input
              type="text"
              placeholder="e.g. Pro, Ultra"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (Tk)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {availableBrands.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
              <div className="flex flex-wrap gap-2">
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(brand === b ? '' : b)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      brand === b
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary bg-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="inStock" className="text-sm font-semibold text-gray-700 cursor-pointer">
              In Stock Only
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary text-white font-semibold py-2 rounded-md text-sm transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-md text-sm transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
