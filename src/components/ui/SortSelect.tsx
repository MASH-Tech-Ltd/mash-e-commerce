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
    params.set('page', '1'); // Reset to page 1 on sort
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort By:</label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="border border-gray-200 rounded-md py-1.5 px-3 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
      >
        <option value="customized">Customized</option>
        <option value="brand">By Brand</option>
        <option value="newest">Display newest items first</option>
        <option value="price_asc">Low to High (Price)</option>
        <option value="price_desc">High to Low (Price)</option>
        <option value="discount_desc">High to Low (Discount)</option>
      </select>
    </div>
  );
}
