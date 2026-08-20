'use client';

import { useState, useEffect } from 'react';
import { Plus, Tags, Image as ImageIcon } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/my-categories');
      if (res.data.status === 'ok' || res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      if (imageFile) {
        formPayload.append('image', imageFile);
      }

      const res = await api.post('/categories/create-category', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.status === 'ok' || res.data.success) {
        toast.success('Category created successfully!');
        setIsModalOpen(false);
        setFormData({ name: '' });
        setImageFile(null);
        fetchCategories();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.errorMessages?.[0]?.message || 'Failed to create category';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Categories</h2>
          <p className="text-slate-400">Organize your products.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="dark-glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-300 text-sm border-b border-slate-700/50">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: any) => (
              <tr key={category._id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                    {category.image?.secure_url ? (
                      <img src={category.image.secure_url} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </td>
                <td className="p-4 text-white font-medium">{category.name}</td>
              </tr>
            ))}
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-slate-400">
                  <Tags className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  No categories found. Click "Add Category" to create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="dark-glass w-full max-w-md rounded-2xl border border-slate-700/50 shadow-2xl p-6 relative">
            <h3 className="text-xl font-bold text-white mb-6">Create New Category</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="e.g. Laptops" 
                  required 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Category Image (Optional)</label>
                <div className="w-full border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 transition-all cursor-pointer group relative overflow-hidden">
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
                      <p className="text-emerald-400 font-medium">{imageFile.name}</p>
                      <p className="text-slate-500 text-xs mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 transition-colors mb-2" />
                      <p className="text-slate-400 text-sm">Click to upload image</p>
                      <p className="text-slate-500 text-xs mt-1">JPEG, PNG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl transition-colors flex items-center justify-center min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Save Category'
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
