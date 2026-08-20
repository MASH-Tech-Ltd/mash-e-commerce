'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const limit = searchParams.get('limit') || '20';

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto pt-8 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>Show</span>
        <select 
          value={limit}
          onChange={handleLimitChange}
          className="border border-gray-200 rounded px-2 py-1.5 bg-gray-100 font-medium focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          <option value="12">12</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>per page</span>
      </div>

      <div className="flex items-center gap-1">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            ‹
          </Link>
        ) : (
          <span className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-300 cursor-not-allowed">
            ‹
          </span>
        )}

        {pageNumbers[0] > 1 && (
          <>
            <Link href={getPageUrl(1)} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm">
              1
            </Link>
            {pageNumbers[0] > 2 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
            )}
          </>
        )}

        {pageNumbers.map(page => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
              currentPage === page 
                ? 'bg-black text-white font-bold border border-black' 
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
            )}
            <Link href={getPageUrl(totalPages)} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm">
              {totalPages}
            </Link>
          </>
        )}

        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            ›
          </Link>
        ) : (
          <span className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-300 cursor-not-allowed">
            ›
          </span>
        )}
      </div>
    </div>
  );
}
