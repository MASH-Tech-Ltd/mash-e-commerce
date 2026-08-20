'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';

export default function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentView = searchParams.get('view') || 'grid';

  const handleViewChange = (view: 'grid' | 'list') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1 bg-white">
      <button
        onClick={() => handleViewChange('grid')}
        className={`p-1.5 rounded-sm transition-colors ${currentView === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleViewChange('list')}
        className={`p-1.5 rounded-sm transition-colors ${currentView === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        aria-label="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
