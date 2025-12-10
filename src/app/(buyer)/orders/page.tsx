'use client';

import { useEffect, useState } from 'react';
import { orderAPI } from '@/lib/api';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // First, try to load from localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        if (localOrders.length > 0) {
          // Sort orders by date (newest first)
          const sortedOrders = localOrders.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedOrders);
          setLoading(false);
          return;
        }
        
        // If no local orders, try API
        const response = await orderAPI.getAll();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // If API fails, still show local orders
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const sortedOrders = localOrders.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Listen for order status updates from seller
    const handleStatusUpdate = () => {
      fetchOrders();
    };
    
    window.addEventListener('orderStatusUpdated', handleStatusUpdate);
    window.addEventListener('storage', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('orderStatusUpdated', handleStatusUpdate);
      window.removeEventListener('storage', handleStatusUpdate);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-pay': return 'bg-red-100 text-red-600';
      case 'to-ship': return 'bg-yellow-100 text-yellow-600';
      case 'to-receive': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-gray-100 text-gray-600';
      case 'refund': return 'bg-purple-100 text-purple-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'to-pay': return 'To Pay';
      case 'to-ship': return 'To Ship';
      case 'to-receive': return 'To Receive';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'refund': return 'Refund';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderId = order._id || order.id;
              return (
                <div key={orderId} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">Order ID: #{orderId}</p>
                      <p className="text-2xl font-bold text-gray-900">₱{Number(order.total || order.totalPrice || 0).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`inline-block px-4 py-2 rounded font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-800 font-medium mb-2">Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => {
                        const itemId = item._id || item.id || index;
                        const price = Number(item.specialPrice || item.price || 0);
                        return (
                          <div key={itemId} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name || item.product?.name}</p>
                              <p className="text-xs text-gray-700">Qty: {item.quantity} × ₱{price.toFixed(2)}</p>
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              ₱{(price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-700">
                        Payment: {order.paymentMethod || 'Credit Card'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">
                        Track Order
                      </button>
                      <Link
                        href={`/orders/${orderId}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-800 text-lg mb-4">No orders yet</p>
            <Link href="/products" className="text-blue-600 hover:text-blue-900">
              Start Shopping
            </Link>
          </div>
        )}
      </main>
  );
}
