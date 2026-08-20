'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1">
      <label htmlFor="sort" className="text-xs font-medium text-gray-500 whitespace-nowrap hidden sm:block">Sort:</label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="border border-gray-300 rounded-md bg-transparent py-1 pr-6 pl-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer appearance-auto"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
        <option value="discount_desc">Discount ↓</option>
        <option value="brand">Brand</option>
      </select>
    </div>
  );
}
