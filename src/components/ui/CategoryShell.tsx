'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import SortSelect from './SortSelect';
import ViewToggle from './ViewToggle';
import Pagination from './Pagination';
import ProductCard from './ProductCard';

interface CategoryShellProps {
  categorySlug: string;
  categoryName: string;
  availableBrands: string[];
  products: any[];
  pagination: { total: number; page: number; totalPages: number };
  currentPage: number;
  totalPages: number;
  viewMode: string;
}

export default function CategoryShell({
  categorySlug,
  categoryName,
  availableBrands,
  products,
  pagination,
  currentPage,
  totalPages,
  viewMode,
}: CategoryShellProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col md:grid md:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="contents md:block">
        <FilterSidebar
          categoryId={categorySlug}
          availableBrands={availableBrands}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
      </aside>

      {/* Product Grid */}
      <section className="flex flex-col h-full">
        {/* Toolbar row */}
        <div className="mb-6 flex justify-between items-center gap-2 border-b border-gray-100 pb-4">
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight truncate min-w-0">
            {categoryName}
          </h2>
          <div className="flex items-center gap-1 shrink-0">
            {/* Filter icon – mobile only */}
            <button
              onClick={() => setFilterOpen(true)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              title="Open Filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>

            <div className="flex items-center gap-1 border border-gray-200 rounded-md py-0.5 px-1.5 bg-gray-50">
              <SortSelect />
              <div className="h-4 w-px bg-gray-200" />
              <ViewToggle />
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 font-medium">
            No products match your filters.
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className={
              viewMode === 'list'
                ? 'flex flex-col gap-4 mb-10'
                : 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10'
            }>
              {products.map((product: any) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  isList={viewMode === 'list'}
                />
              ))}
            </div>

            {totalPages > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
