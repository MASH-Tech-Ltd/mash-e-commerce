import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import ProductActions from '@/components/ui/ProductActions';
import Link from 'next/link';
import FloatingButtons from '@/components/ui/FloatingButtons';

async function getProduct(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/products/get-product/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
            <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back to home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <Sidebar />
        
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-10">
          
          {/* Left: Product Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center border border-gray-100 rounded-lg  bg-gray-50 relative">
            {product.badgeText && (
               <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded z-10 uppercase tracking-wider shadow-sm">
                 {product.badgeText}
               </div>
            )}
            <img 
              src={typeof product.image === 'string' ? product.image : product.image?.secure_url} 
              alt={product.title} 
              className="w-full h-auto object-cover max-h-[500px] border border-gray-100 rounded-lg" 
            />
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-black text-[#ff0000]">Tk {product.discountedPrice}</span>
              <span className="text-lg text-gray-400 line-through font-semibold">Tk {product.originalPrice}</span>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-2">Product Description:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                 {product.features && product.features.length > 0 ? (
                   product.features.map((feature: string, idx: number) => (
                     <li key={idx}>👉 {feature}</li>
                   ))
                 ) : (
                   <>
                     <li>👉 Original Product</li>
                     <li>👉 Good Quality</li>
                     <li>👉 Value for money</li>
                   </>
                 )}
              </ul>
            </div>

            <ProductActions product={product} />

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Category:</span> {product.categoryId?.name || 'Uncategorized'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
