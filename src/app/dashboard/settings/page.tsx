'use client';

import { useState, useEffect } from 'react';
import { Save, Store, Globe, Image as ImageIcon } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    logo: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: ''
  });
  const [ownerData, setOwnerData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const res = await api.get('/tenants/my-store');
      if (res.data.status === 'ok' || res.data.success) {
        setFormData({
          name: res.data.data.name || '',
          domain: res.data.data.domain || '',
          logo: res.data.data.logo || '',
          contactEmail: res.data.data.contactEmail || '',
          contactPhone: res.data.data.contactPhone || '',
          contactAddress: res.data.data.contactAddress || ''
        });
        if (res.data.data.ownerId) {
          setOwnerData({
            name: res.data.data.ownerId.name || '',
            email: res.data.data.ownerId.email || ''
          });
        }
      }
    } catch (error) {
      toast.error('Failed to fetch store settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
      };
      
      // In a real application, you would handle Cloudinary upload for the logo here
      // For this implementation, we will just send the updated name
      
      const res = await api.patch('/tenants/update-store', payload);
      if (res.data.status === 'ok' || res.data.success) {
        toast.success('Store settings updated successfully!');
        
        // Broadcast an event so other components (Navbar, Sidebar) can update
        window.dispatchEvent(new Event('storeUpdated'));
      }
    } catch (error) {
      toast.error('Failed to update store settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
        <p className="text-gray-500">Manage your store's identity and basic configuration.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Store Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Enter store name"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This name will be displayed on your dashboard and storefront.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Store Domain</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={formData.domain}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-500 outline-none cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-xs text-amber-500 mt-1">Domains cannot be changed directly. Contact support to change your store domain.</p>
            </div>
            
            {/* Logo upload mockup */}
            <div className="pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 block mb-2">Store Logo (Coming Soon)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-50">
                  Upload New Logo
                </button>
              </div>
            </div>

            {/* Public Contact Details */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Public Contact Details</h3>
              <p className="text-xs text-gray-500 mb-4">These details will be displayed on the footer of your public storefront.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Contact Email</label>
                  <input 
                    type="email" 
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="store@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="+880123456789"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Store Address</label>
                  <textarea 
                    value={formData.contactAddress}
                    onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none h-24"
                    placeholder="Bahaddarhat, Chattogram"
                  />
                </div>
              </div>
            </div>

            {/* Admin Info */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Admin Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Admin Name</label>
                  <input 
                    type="text" 
                    value={ownerData.name}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 outline-none cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Admin Email</label>
                  <input 
                    type="email" 
                    value={ownerData.email}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 outline-none cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Admin details cannot be changed from here.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
