import { headers } from 'next/headers';
import Link from 'next/link';
import { Laptop, Cpu, Smartphone, Speaker, Wind, Tv, Gamepad2, Printer, Camera, Component } from 'lucide-react';
import Footer from '../components/layout/Footer';
import CategorySlider from '../components/ui/CategorySlider';
import ProductCard from '../components/ui/ProductCard';
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

async function getProducts() {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/products/get-all-product?limit=50&status=ACTIVE`, { cache: 'no-store' });
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
    const res = await fetch(`http://localhost:8000/api/v1/categories/get-all-category`, { cache: 'no-store' });
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
      {/* Top Categories */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">{t('topCategories')}</h2>
              <Link href="/categories" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">{t('seeAllCategories')}</Link>
            </div>
            
            <CategorySlider>
              {categories.map((cat: any) => (
                <Link href={`/category/${cat.slug || cat._id}`} key={cat._id} className="flex flex-col items-center justify-center gap-2 sm:gap-3 min-w-[80px] sm:min-w-[120px] snap-start cursor-pointer group">
                  <div className="text-gray-600 group-hover:text-green-600 group-hover:-translate-y-1 transition-all duration-300 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-50 rounded-full overflow-hidden">
                    {cat.image?.secure_url ? (
                      <img src={cat.image.secure_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      getCategoryIcon(cat.name)
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-900 text-center uppercase tracking-wide group-hover:text-green-600 transition-colors">
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
