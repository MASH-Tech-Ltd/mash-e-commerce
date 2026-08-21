import { headers } from 'next/headers';
import Link from 'next/link';
import { Laptop, Cpu, Smartphone, Speaker, Wind, Tv, Gamepad2, Printer, Camera, Component } from 'lucide-react';
import Footer from '../components/layout/Footer';
import CategorySlider from '../components/ui/CategorySlider';
import ProductCard from '../components/ui/ProductCard';
import { getTranslation, TranslationKeys } from '@/utils/translations';

async function getTheme() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/themes/get-theme`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/products/get-all-product?limit=50&status=ACTIVE`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data?.data || json?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

async function getCategories() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/categories/get-all-category`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json?.data?.data || json?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('laptop') || n.includes('computer') || n.includes('pc')) return <Laptop className="w-8 h-8" />;
  if (n.includes('processor') || n.includes('cpu') || n.includes('chip')) return <Cpu className="w-8 h-8" />;
  if (n.includes('mobile') || n.includes('phone') || n.includes('smartphone')) return <Smartphone className="w-8 h-8" />;
  if (n.includes('speaker') || n.includes('audio') || n.includes('sound')) return <Speaker className="w-8 h-8" />;
  if (n.includes('ac') || n.includes('air') || n.includes('cooling')) return <Wind className="w-8 h-8" />;
  if (n.includes('tv') || n.includes('television') || n.includes('display')) return <Tv className="w-8 h-8" />;
  if (n.includes('game') || n.includes('gaming') || n.includes('console')) return <Gamepad2 className="w-8 h-8" />;
  if (n.includes('print') || n.includes('printer')) return <Printer className="w-8 h-8" />;
  if (n.includes('camera') || n.includes('photo') || n.includes('lens')) return <Camera className="w-8 h-8" />;
  return <Component className="w-8 h-8" />;
};

export default async function Home() {
  const [products, categories, theme] = await Promise.all([
    getProducts(),
    getCategories(),
    getTheme(),
  ]);

  const language = theme?.language || 'en';
  const t = (key: TranslationKeys) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Banners */}
      {theme?.banners && theme.banners.length > 0 && (
        <div className="w-full overflow-hidden bg-white pt-2 md:pt-6 pb-2">
          <div className="max-w-[1400px] mx-auto md:px-6">
            {/* Mobile: full-width banner, no crop */}
            <div className="block md:hidden w-full overflow-hidden">
              <img
                src={theme.banners[0].secure_url}
                alt="Banner"
                className="w-full h-auto object-contain block"
              />
            </div>
            {/* Desktop: scrollable banners */}
            <div className="hidden md:flex gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {theme.banners.map((banner: any, idx: number) => (
                <div key={idx} className="snap-center flex-shrink-0 w-full aspect-[1200/250] rounded-2xl overflow-hidden shadow-sm bg-gray-50">
                  <img
                    src={banner.secure_url}
                    alt={`Banner ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Categories */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-3 md:px-6">
            <div className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100">
              <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight">{t('topCategories')}</h2>
              <Link href="/categories" className="text-xs md:text-sm font-semibold text-primary hover:opacity-80 transition-opacity">{t('seeAllCategories')}</Link>
            </div>
            
            <CategorySlider>
              {categories.map((cat: any) => (
                <Link href={`/category/${cat.slug || cat._id}`} key={cat._id} className="flex flex-col items-center justify-center gap-1 sm:gap-3 min-w-[60px] sm:min-w-[100px] snap-start cursor-pointer group">
                  <div className="text-gray-600 group-hover:text-green-600 group-hover:-translate-y-1 transition-all duration-300 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-50 rounded-full overflow-hidden">
                    {cat.image?.secure_url ? (
                      <img src={cat.image.secure_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(cat.name)
                    )}
                  </div>
                  <span className="text-[9px] sm:text-xs font-bold text-gray-900 text-center uppercase tracking-wide group-hover:text-green-600 transition-colors leading-tight max-w-[60px] sm:max-w-[100px] line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </CategorySlider>
          </div>
        </div>
      )}

      <main id="home-main" className="max-w-[1400px] mx-auto px-6 py-12">
        <section>
          <div className="flex items-center justify-between mb-8 bg-black text-white px-6 py-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold tracking-wider uppercase">{t('collections')}</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-32 text-gray-500 font-medium">
              No products found in collections.
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
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
