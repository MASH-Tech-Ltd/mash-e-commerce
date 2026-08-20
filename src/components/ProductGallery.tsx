'use client';

import { useState, MouseEvent } from 'react';

interface ProductGalleryProps {
  images: { public_id: string; secure_url: string }[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transformOrigin, setTransformOrigin] = useState('center');
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center overflow-hidden">
        <div className="text-gray-400">No image available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 h-full items-start">
      {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-4 flex-wrap md:flex-nowrap w-full md:w-24 pb-2 md:pb-0 md:pr-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx ? 'border-gray-900 shadow-md ring-2 ring-gray-900/10' : 'border-gray-100 hover:border-gray-400 opacity-60 hover:opacity-100'
              } bg-white p-0`}
            >
              <img 
                src={img.secure_url} 
                alt={`${title} thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div 
        className="flex-1 bg-white rounded-3xl aspect-square flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative w-full cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={images[activeIndex].secure_url} 
          alt={title} 
          style={{ transformOrigin: isZoomed ? transformOrigin : 'center' }}
          className={`w-full h-full object-cover transition-transform duration-300 ease-out ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`} 
        />
      </div>
    </div>
  );
}
