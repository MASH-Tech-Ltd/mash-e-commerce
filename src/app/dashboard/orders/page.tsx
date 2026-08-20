'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, Search, Filter, MoreVertical, CheckCircle2, Clock, XCircle, Truck, Eye, Edit2, Trash2 } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Action dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalType, setModalType] = useState<'details' | 'status' | 'edit' | 'delete' | null>(null);
  
  // Edit states
  const [newStatus, setNewStatus] = useState('');
  const [editItems, setEditItems] = useState<any[]>([]);

  // Handle clicking outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data.status === 'ok' || res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-600"><Clock size={12}/> Pending</span>;
      case 'confirmed': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-600"><CheckCircle2 size={12}/> Confirmed</span>;
      case 'shipped': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-600"><Truck size={12}/> Shipped</span>;
      case 'delivered': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-600"><CheckCircle2 size={12}/> Delivered</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-medium text-rose-600"><XCircle size={12}/> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">{status}</span>;
    }
  };

  const openModal = (order: any, type: typeof modalType) => {
    setSelectedOrder(order);
    setModalType(type);
    setActiveDropdown(null);
    if (type === 'status') setNewStatus(order.status);
    if (type === 'edit') setEditItems(JSON.parse(JSON.stringify(order.items)));
  };

  const handleUpdateStatus = async () => {
    try {
      await api.patch(`/orders/update-order/${selectedOrder._id}`, { status: newStatus });
      toast.success('Order status updated!');
      setModalType(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateItems = async () => {
    try {
      if (editItems.length === 0) {
        toast.error('Order must have at least one item');
        return;
      }
      const newTotal = editItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await api.patch(`/orders/update-order/${selectedOrder._id}`, { items: editItems, totalPrice: newTotal });
      toast.success('Order items updated!');
      setModalType(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update items');
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await api.delete(`/orders/delete-order/${selectedOrder._id}`);
      toast.success('Order deleted successfully');
      setModalType(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const updateItemQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...editItems];
    updated[index].quantity = newQty;
    setEditItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = [...editItems];
    updated.splice(index, 1);
    setEditItems(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-500">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium">Total Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 pb-20">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">Loading orders...</td>
              </tr>
            ) : orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-700 text-xs font-mono">#{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.customerPhone}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {order.items && order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <img src={item.image} alt="product" className="w-6 h-6 rounded object-cover border border-gray-200" />
                        <span className="text-xs text-gray-600">{item.quantity}x {item.title.substring(0,20)}...</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-emerald-600">Tk {order.totalPrice}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      title="View Details"
                      onClick={() => openModal(order, 'details')} 
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      title="Update Status"
                      onClick={() => openModal(order, 'status')} 
                      className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button 
                      title="Edit Items"
                      onClick={() => openModal(order, 'edit')} 
                      className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      title="Delete Order"
                      onClick={() => openModal(order, 'delete')} 
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW DETAILS MODAL */}
      {modalType === 'details' && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              {getStatusBadge(selectedOrder.status)}
            </div>
            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p><span className="font-medium text-gray-900">Order ID:</span> {selectedOrder._id}</p>
                <p><span className="font-medium text-gray-900">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Customer Info</h4>
                <p><span className="font-medium text-gray-900">Name:</span> {selectedOrder.customerName}</p>
                <p><span className="font-medium text-gray-900">Phone:</span> {selectedOrder.customerPhone}</p>
                <p><span className="font-medium text-gray-900">Address:</span> {selectedOrder.shippingAddress}</p>
                {selectedOrder.note && <p><span className="font-medium text-gray-900">Note:</span> {selectedOrder.note}</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Items Purchased</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">Tk {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="font-bold text-emerald-600 text-lg">Tk {selectedOrder.totalPrice}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setModalType(null)} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {modalType === 'status' && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-gray-200 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h3>
            <select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none mb-6 cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalType(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleUpdateStatus} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl font-medium transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ITEMS MODAL */}
      {modalType === 'edit' && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Order Items</h3>
            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
              {editItems.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm max-w-[150px] truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Tk {item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateItemQuantity(idx, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300">-</button>
                      <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateItemQuantity(idx, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300">+</button>
                    </div>
                    <button onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {editItems.length === 0 && (
                <p className="text-center text-gray-500 py-4">No items left. This order will have a total of Tk 0.</p>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="font-bold text-gray-900">New Total:</span>
              <span className="font-bold text-emerald-600 text-xl">Tk {editItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setModalType(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleUpdateItems} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl font-medium transition-colors">Save Items</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modalType === 'delete' && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-gray-200 shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Order?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete order #{selectedOrder._id.substring(selectedOrder._id.length - 6).toUpperCase()}? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setModalType(null)} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleDeleteOrder} className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-xl font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
