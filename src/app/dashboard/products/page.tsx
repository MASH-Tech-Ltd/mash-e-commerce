'use client';

import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, PackageSearch, Tag, Search, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Pagination & Filtering state
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    originalPrice: '',
    discountedPrice: '',
    badgeText: '',
    categoryId: '',
    features: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/my-categories');
      if (res.data.status === 'ok' || res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: meta.limit.toString(),
        search,
        sortBy,
        sortOrder
      }).toString();

      const res = await api.get(`/products/my-products?${query}`);
      if (res.data.status === 'ok' || res.data.success) {
        setProducts(res.data.data);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy, sortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select a product image");
      return;
    }

    setIsLoading(true);
    try {
      const saveAmount = Number(formData.originalPrice) - Number(formData.discountedPrice);
      
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('originalPrice', formData.originalPrice);
      formPayload.append('discountedPrice', formData.discountedPrice);
      formPayload.append('saveAmount', saveAmount.toString());
      if (formData.badgeText) formPayload.append('badgeText', formData.badgeText);
      formPayload.append('categoryId', formData.categoryId);
      if (formData.features) {
        const featuresArray = formData.features.split('\n').filter(f => f.trim() !== '');
        formPayload.append('features', JSON.stringify(featuresArray));
      }
      formPayload.append('image', imageFile);

      const res = await api.post('/products/create-product', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.status === 'ok' || res.data.success) {
        toast.success('Product created successfully!');
        setIsModalOpen(false);
        setFormData({ title: '', originalPrice: '', discountedPrice: '', badgeText: '', categoryId: '', features: '' });
        setImageFile(null);
        fetchProducts();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errorMessages?.[0]?.message || 'Failed to create product';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500">Manage your store inventory.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt" className="bg-white">Date Added</option>
              <option value="title" className="bg-white">Product Title</option>
              <option value="originalPrice" className="bg-white">Original Price</option>
              <option value="discountedPrice" className="bg-white">Discounted Price</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <select 
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc" className="bg-white">Descending</option>
              <option value="asc" className="bg-white">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Product Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product: any) => (
              <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {product.image?.secure_url ? (
                      <img src={product.image.secure_url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{product.title}</p>
                  {product.badgeText && <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full">{product.badgeText}</span>}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
                    <Tag className="w-3 h-3 text-emerald-500" />
                    {product.categoryId?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-600">৳{product.discountedPrice?.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 line-through">৳{product.originalPrice?.toFixed(2)}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400">
                  <PackageSearch className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  No products found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        {meta.total > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{products.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium text-gray-900">{meta.total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={meta.page === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-sm font-medium text-gray-700 px-4">
                Page {meta.page} of {meta.totalPages}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-gray-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Product</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Product Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="Gaming Laptop" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Original Price (৳)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="999.99" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Discounted Price (৳)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="899.99" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Badge Text (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.badgeText}
                    onChange={(e) => setFormData({...formData, badgeText: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="e.g. Hot Deal" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="" disabled className="bg-white text-gray-400">Select a category</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id} className="bg-white text-gray-900">{cat.name}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-amber-500 mt-1">Please create a category first before adding products.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Product Features / Description</label>
                <textarea 
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]" 
                  placeholder="Enter features one per line (e.g. Input Voltage 9V/12V)" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Product Image (Cloudinary)</label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  {imageFile ? (
                    <div className="text-center">
                      <p className="text-emerald-600 font-medium">{imageFile.name}</p>
                      <p className="text-gray-500 text-xs mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-emerald-500 transition-colors mb-2" />
                      <p className="text-gray-500 text-sm">Click to upload image</p>
                      <p className="text-gray-400 text-xs mt-1">JPEG, PNG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors font-medium">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isLoading || categories.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl transition-colors font-medium shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Save Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
