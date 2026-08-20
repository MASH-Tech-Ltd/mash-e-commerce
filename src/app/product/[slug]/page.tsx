import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import ProductActionClient from './ProductActionClient';
import type { Metadata, ResolvingMetadata } from 'next';
import { getTranslation, TranslationKeys } from '@/utils/translations';

async function getTheme() {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/themes/get-theme`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

async function getProduct(productSlug: string) {
  try {
    // Try by slug first, then by ID
    const res = await fetch(`http://localhost:8000/api/v1/products/get-product/${productSlug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  
  const product = await getProduct(resolvedParams.slug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  return {
    title: product.title,
    description: product.shortDescription || product.description?.substring(0, 160),
    openGraph: {
      images: product.images?.[0]?.secure_url ? [product.images[0].secure_url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const [product, theme] = await Promise.all([
    getProduct(resolvedParams.slug),
    getTheme(),
  ]);

  const language = theme?.language || 'en';
  const t = (key: TranslationKeys) => getTranslation(language, key);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <div className="max-w-[1400px] mx-auto px-6 py-3 border-b border-gray-100 flex items-center text-xs text-gray-500 font-semibold gap-2">
        <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-4.635-4.643V20.25a.75.75 0 01-.75.75h-3.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5H3.75a.75.75 0 01-.75-.75V11.25l-2.025 2.025a.75.75 0 11-1.06-1.06l8.99-9zM12 5.093l-6.75 6.756v8.401h2.25v-4.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v4.5h2.25v-8.401L12 5.093z" />
          </svg>
          {t('home')}
        </Link>
        <span>&rarr;</span>
        <span className="hover:text-gray-900 cursor-pointer">{product.categoryId?.name || 'Category'}</span>
        <span>&rarr;</span>
        <span className="text-gray-900 truncate">{product.title}</span>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl text-gray-900 mb-2">{product.title}</h1>
            <div className="text-sm text-gray-600 mb-6 pb-2 flex flex-wrap items-center gap-4">
              <span>{t('productId')}: {product.sku || product._id.slice(-6)}</span>
              <span className="text-gray-300">|</span>
              <span className="font-medium text-gray-800 flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                {product.salesCount || 0} {t('sold')}
              </span>
            </div>
            

            
            {/* Quick Overview */}
            {((product.features && product.features.length > 0) || product.isAuthentic) && (
              <div className="mb-8">
                <div className="text-sm font-bold text-gray-900 mb-2">{t('quickOverview')}</div>
                <ul className="text-sm text-gray-700 space-y-1 list-disc pl-4">
                  {product.features && product.features.map((feature: string, i: number) => (
                    <li key={`feature-${i}`}>{feature}</li>
                  ))}
                  {product.isAuthentic && (
                    <li className="font-semibold text-green-600 flex items-center gap-1.5 -ml-4 mt-2 list-none">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
                      {t('authenticProduct')}
                    </li>
                  )}
                </ul>
              </div>
            )}

            <ProductActionClient 
              product={product} 
              tTranslations={{
                bdt: t('bdt'),
                save: t('save'),
                inStock: t('inStock'),
                outOfStock: t('outOfStock')
              }} 
            />
            
            {/* Short Description */}
            {product.shortDescription && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-sm font-bold text-gray-900 mb-2">{t('shortDescription')}</div>
                <div className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.shortDescription}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-16">
          <div className="flex space-x-8 border-b border-gray-200 mb-8 px-2">
            <button className="pb-3 font-bold text-[#7c3aed] border-b-2 border-[#7c3aed] text-sm px-2 transition-all">
              {t('specifications')}
            </button>
            <button className="pb-3 font-semibold text-gray-500 hover:text-gray-800 transition-colors text-sm px-2">
              {t('reviews')}
            </button>
          </div>
          
          <div className="bg-white border-t border-gray-100 overflow-hidden mt-6">
            <div className="flex flex-col gap-8 pt-4">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec: any, groupIndex: number) => (
                  <div key={groupIndex} className="bg-white">
                    {spec.group && (
                      <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">{spec.group}</h3>
                    )}
                    <div className="divide-y divide-gray-100">
                      {spec.entries?.map((entry: any, index: number) => (
                        <div key={index} className={`grid grid-cols-1 md:grid-cols-4 p-5 text-[14px] ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-50 transition-colors rounded-lg'}`}>
                          <div className="font-normal text-gray-700 md:col-span-1">{entry.name}</div>
                          <div className="text-gray-600 md:col-span-3">{entry.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500 text-sm">
                  No specifications added yet for this product.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Description Section */}
        {product.description && (
          <div className="mt-16 max-w-[1400px]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">{t('productDescription')}</h2>
            <div 
              className="text-gray-700 text-[15px] leading-relaxed space-y-4 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h1]:text-2xl [&>h1]:font-bold [&>h2]:text-xl [&>h2]:font-bold [&>h3]:text-lg [&>h3]:font-bold"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          </div>
        )}

        {/* External Videos Section */}
        {product.videos && product.videos.length > 0 && (
          <div className="mt-12 max-w-[1400px]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">{t('productVideos')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.videos.map((video: string, index: number) => {
                let embedUrl = video;
                try {
                  const url = new URL(video);
                  if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
                    const videoId = url.hostname.includes('youtu.be') ? url.pathname.slice(1) : url.searchParams.get('v');
                    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                  }
                } catch (e) {
                  // Ignore invalid URLs
                }
                
                return (
                  <div key={index} className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <iframe 
                      src={embedUrl}
                      title={`Product Video ${index + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 mt-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center text-gray-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} ELECTRONICS STORE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
