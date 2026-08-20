import Link from 'next/link';
import FilterSidebar from '../../../components/ui/FilterSidebar';
import SortSelect from '../../../components/ui/SortSelect';
import ViewToggle from '../../../components/ui/ViewToggle';
import Pagination from '../../../components/ui/Pagination';
import ProductCard from '../../../components/ui/ProductCard';
import Footer from '../../../components/layout/Footer';

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
  const categorySlug = decodeURIComponent(resolvedParams.slug);

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
  
  const availableBrands = Array.from(new Set(products.map((p: any) => typeof p.brand === 'string' ? p.brand : p.brand?.name).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center text-xs text-gray-500 font-semibold gap-2">
          <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.99 9a.75.75 0 11-1.06 1.06l-4.635-4.643V20.25a.75.75 0 01-.75.75h-3.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5H3.75a.75.75 0 01-.75-.75V11.25l-2.025 2.025a.75.75 0 11-1.06-1.06l8.99-9zM12 5.093l-6.75 6.756v8.401h2.25v-4.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v4.5h2.25v-8.401L12 5.093z" />
            </svg>
            Home
          </Link>
          <span>&rarr;</span>
          <span className="text-gray-900">{category?.name || 'Category'}</span>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        
        {/* Sidebar */}
        <aside>
          <FilterSidebar categoryId={categoryId} availableBrands={availableBrands} />
        </aside>

        {/* Product Grid */}
        <section className="flex flex-col h-full">
          <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {category?.name || 'Category'}
            </h2>
            <div className="flex items-center gap-4 border border-gray-200 rounded-md py-1 px-3 bg-gray-50">
              <div className="text-sm font-semibold text-gray-500 mr-2">
                {pagination.total} Products Found
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <SortSelect />
              <div className="h-4 w-px bg-gray-300"></div>
              <ViewToggle />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 font-medium">
              No products match your filters.
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className={
                resolvedSearchParams.view === 'list' 
                  ? "flex flex-col gap-4 mb-10" 
                  : "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10"
              }>
                {products.map((product: any) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    isList={resolvedSearchParams.view === 'list'} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
