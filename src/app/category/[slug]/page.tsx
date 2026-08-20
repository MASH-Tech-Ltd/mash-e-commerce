import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';
import CategoryShell from '@/components/ui/CategoryShell';
import Footer from '@/components/layout/Footer';

async function getCategories() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/categories/get-all-category`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.data || json?.data || [];
  } catch (error) {
    return [];
  }
}

async function getFilteredProducts(categoryId: string, searchParams: any) {
  try {
    const query = new URLSearchParams({ categoryId, status: 'ACTIVE' });
    if (searchParams.minPrice) query.set('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) query.set('maxPrice', searchParams.maxPrice);
    if (searchParams.search) query.set('search', searchParams.search);
    if (searchParams.page) query.set('page', searchParams.page);
    if (searchParams.limit) query.set('limit', searchParams.limit || '20');
    if (searchParams.sort) query.set('sortBy', searchParams.sort);
    if (searchParams.brand) query.set('brand', searchParams.brand);
    if (searchParams.inStock) query.set('inStock', searchParams.inStock);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/products/get-all-product?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 1 } };
    const json = await res.json();
    return json || { data: [], meta: { total: 0, page: 1, totalPages: 1 } };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, totalPages: 1 } };
  }
}

export default async function CategoryPage({ params, searchParams }: any) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  let categorySlug = resolvedParams.slug;
  try {
    categorySlug = decodeURIComponent(resolvedParams.slug);
  } catch (e) {
    // use as is
  }

  const categories = await getCategories();
  const category = categories.find((c: any) => c.slug === categorySlug || c._id === categorySlug);
  const categoryId = category?._id;

  const productResponse = categoryId
    ? await getFilteredProducts(categoryId, resolvedSearchParams)
    : { data: [], meta: { total: 0, page: 1, totalPages: 1 } };

  const products = productResponse.data || [];
  const pagination = productResponse.meta || { total: 0, page: 1, totalPages: 1 };
  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  const availableBrands = Array.from(
    new Set(products.map((p: any) => (typeof p.brand === 'string' ? p.brand : p.brand?.name)).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Breadcrumb + mobile back button */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-xs text-gray-500 font-semibold">
          {/* Back button — mobile only */}
          <BackButton href="/" className="md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors mr-1 shrink-0" />

          <Link href="/" className="hover:text-gray-900 flex items-center gap-1 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-4.635-4.643V20.25a.75.75 0 01-.75.75h-3.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5H3.75a.75.75 0 01-.75-.75V11.25l-2.025 2.025a.75.75 0 11-1.06-1.06l8.99-9zM12 5.093l-6.75 6.756v8.401h2.25v-4.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v4.5h2.25v-8.401L12 5.093z" />
            </svg>
            Home
          </Link>
          <span>→</span>
          <Link href={`/category/${categorySlug}`} className="text-gray-900 hover:underline truncate">{category?.name || 'Category'}</Link>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-12 flex-1 w-full">
        <CategoryShell
          categorySlug={resolvedParams.slug}
          categoryName={category?.name || 'Category'}
          availableBrands={availableBrands}
          products={products}
          pagination={pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          viewMode={resolvedSearchParams.view || 'grid'}
        />
      </main>

      <Footer />
    </div>
  );
}
