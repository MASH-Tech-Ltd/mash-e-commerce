import { headers } from 'next/headers';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import { Laptop, Cpu, Smartphone, Speaker, Wind, Tv, Gamepad2, Printer, Camera, Component } from 'lucide-react';

async function getCategories(tenantSlug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/categories/get-all-category`, { cache: 'no-store' });
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

export default async function CategoriesPage() {
  const headersList = await headers();
  const tenantSlug = headersList.get('x-tenant-slug') || 'main';

  const categories = await getCategories(tenantSlug);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center text-xs text-gray-500 font-semibold gap-2">
          <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-4.635-4.643V20.25a.75.75 0 01-.75.75h-3.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5H3.75a.75.75 0 01-.75-.75V11.25l-2.025 2.025a.75.75 0 11-1.06-1.06l8.99-9zM12 5.093l-6.75 6.756v8.401h2.25v-4.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v4.5h2.25v-8.401L12 5.093z" />
            </svg>
            Home
          </Link>
          <span>&rarr;</span>
          <span className="text-gray-900">All Categories</span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">All Categories</h1>
        
        {categories.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-xl border border-gray-100 text-gray-500 font-medium">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat: any) => (
              <Link 
                href={`/category/${cat.slug || cat._id}`} 
                key={cat._id} 
                className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 cursor-pointer group transition-all"
              >
                <div className="text-gray-600 group-hover:text-green-600 group-hover:-translate-y-2 transition-all duration-300 w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-green-50 overflow-hidden">
                  {cat.image?.secure_url ? (
                    <img src={cat.image.secure_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    getCategoryIcon(cat.name)
                  )}
                </div>
                <span className="text-sm font-bold text-gray-900 text-center uppercase tracking-wide group-hover:text-green-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
