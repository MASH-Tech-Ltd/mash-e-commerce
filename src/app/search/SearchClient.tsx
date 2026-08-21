'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../../components/ui/ProductCard';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query.trim()) return;
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(
          `${apiUrl}/products/get-all-product?search=${encodeURIComponent(query)}&limit=50&status=ACTIVE`,
          { cache: 'no-store' }
        );
        const json = await res.json();
        const data = json?.data?.data || json?.data || [];
        setProducts(Array.isArray(data) ? data : []);
        setTotal(json?.data?.meta?.total || (Array.isArray(data) ? data.length : 0));
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center text-xs text-gray-500 font-semibold gap-2">
          <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-4.635-4.643V20.25a.75.75 0 01-.75.75h-3.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5H3.75a.75.75 0 01-.75-.75V11.25l-2.025 2.025a.75.75 0 11-1.06-1.06l8.99-9zM12 5.093l-6.75 6.756v8.401h2.25v-4.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v4.5h2.25v-8.401L12 5.093z" />
            </svg>
            Home
          </Link>
          <span>&rarr;</span>
          <span className="text-gray-900">Search</span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-10 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {query ? (
              <span>Search results for <span className="text-primary">"{query}"</span></span>
            ) : (
              <span>Search Products</span>
            )}
          </h1>
          {!isLoading && query && (
            <p className="text-sm text-gray-500 mt-2">{total} product{total !== 1 ? 's' : ''} found</p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Searching...</p>
          </div>
        ) : !query ? (
          <div className="text-center py-32 bg-white rounded-xl border border-gray-100 text-gray-500 font-medium">
            Type something in the search bar to find products.
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl font-bold text-gray-700 mb-2">No results found</p>
            <p className="text-gray-500">No products match "{query}"</p>
            <Link href="/" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {products.map((product: any) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
