"use client";
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategorySlider({ children }: { children: React.ReactNode }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 400; // Adjust scroll distance
      sliderRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="relative group/slider flex items-center">
      <button 
        onClick={() => scroll('left')} 
        className="absolute -left-4 z-10 bg-white shadow-lg p-2.5 rounded-full border border-gray-100 text-gray-600 hover:text-green-600 hover:scale-110 opacity-0 group-hover/slider:opacity-100 transition-all duration-300"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <div 
        id="category-slider-track"
        ref={sliderRef} 
        className="flex gap-8 overflow-x-auto py-8 px-4 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth snap-x snap-mandatory"
      >
        {children}
      </div>

      <button 
        onClick={() => scroll('right')} 
        className="absolute -right-4 z-10 bg-white shadow-lg p-2.5 rounded-full border border-gray-100 text-gray-600 hover:text-green-600 hover:scale-110 opacity-0 group-hover/slider:opacity-100 transition-all duration-300"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
