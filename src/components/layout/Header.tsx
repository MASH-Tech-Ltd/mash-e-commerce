import React from 'react';
import Link from 'next/link';
import HeaderCartIcon from '../ui/HeaderCartIcon';
import GlobalSearch from '../ui/GlobalSearch';

export default async function Header() {
  return (
    <header id="main-header" className="bg-white border-b border-gray-100 py-4 sm:py-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Top Row on Mobile: Logo + Mobile Nav */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase">
              Electronics Store
            </h1>
          </Link>
          
          <nav className="flex md:hidden items-center gap-4 font-semibold text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <HeaderCartIcon />
          </nav>
        </div>

        {/* Search Bar - Full width on mobile, centered on desktop */}
        <div className="w-full md:flex-1 md:max-w-xl">
          <GlobalSearch />
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <HeaderCartIcon />
        </nav>

      </div>
    </header>
  );
}
