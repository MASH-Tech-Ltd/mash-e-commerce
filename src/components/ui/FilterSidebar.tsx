'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function FilterSidebar({ categoryId, availableBrands = [] }: { categoryId: string, availableBrands?: string[] }) {
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
    
    router.push(`/category/${categoryId}?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setBrand('');
    setInStock(false);
    router.push(`/category/${categoryId}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>
      
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
  );
}
