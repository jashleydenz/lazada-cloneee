'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function OrderManagementPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('to-pack');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      try {
        setLoading(true);
        // Load orders from localStorage (these are buyer orders)
        const buyerOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Sort orders by date (newest first)
        const sortedOrders = buyerOrders.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Listen for storage changes to update orders in real-time
    const handleStorageChange = () => {
      fetchOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when orders are added
    window.addEventListener('orderAdded', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orderAdded', handleStorageChange);
    };
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      // Get current orders from localStorage
      const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Update the specific order's status
      const updatedOrders = currentOrders.map((order: any) => {
        if ((order._id || order.id) === orderId) {
          return { ...order, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return order;
      });
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Update local state
      setOrders(updatedOrders.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      
      // Dispatch event to notify buyer side
      window.dispatchEvent(new CustomEvent('orderStatusUpdated', { 
        detail: { orderId, newStatus } 
      }));
      
      alert(`Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-pay': return 'bg-red-100 text-red-800';
      case 'to-ship': return 'bg-yellow-100 text-yellow-800';
      case 'to-receive': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refund': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'to-ship';
      case 'to-pay': return 'to-ship';
      case 'to-ship': return 'to-receive';
      case 'to-receive': return 'completed';
      default: return null;
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unpaid', label: 'Unpaid' },
    { id: 'to-ship', label: 'To Ship' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'failed-delivery', label: 'Failed Delivery' },
    { id: 'cancellation', label: 'Cancellation' },
    { id: 'return-or-refund', label: 'Return Or Refund' },
  ];

  const subTabs = [
    { id: 'to-pack', label: 'To Pack', icon: '📦' },
    { id: 'to-arrange', label: 'To Arrange Shipment', icon: '📋' },
    { id: 'to-handover', label: 'To Handover', icon: '🚚' },
  ];

  const printStatusFilters = [
    'AWB Unprinted',
    'AWB Printed',
    'Packing List Unprinted',
    'Packing List Printed',
    'Pick List Unprinted',
    'Pick List Printed',
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/seller-dashboard" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-700 font-medium">Order Management</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            
            {/* Info Badges */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Cancellation Rate</span>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
                <span className="text-gray-800 font-medium">&lt;()</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">PNR</span>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
                <span className="text-gray-800 font-medium">&lt;()</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">FFR</span>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
                <span className="text-gray-800 font-medium">&lt;()</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">FFR+</span>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
                <span className="text-gray-800 font-medium">&lt;()</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
              </div>
            </div>
          </div>
          
          {/* Info Message */}
          <div className="mt-3 text-xs text-gray-600">
            We will provide information after you have set "Ready to Ship" status for your parcels
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-white border-b border-gray-200 px-8">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Tabs - Only show for To Ship */}
        {activeTab === 'to-ship' && (
          <div className="bg-white px-8 py-4 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
              {subTabs.map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id)}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-lg border-2 transition-all ${
                    activeSubTab === subTab.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{subTab.icon}</span>
                  <span className="font-medium">{subTab.label}</span>
                </button>
              ))}
            </div>
            {activeSubTab === 'to-handover' && (
              <div className="mt-4">
                <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Go to Logistics Center to Overview Handover
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Filters Section - Light Gray Background */}
        <div className="bg-gray-100 px-8 py-6">
          {/* Order Date Filter - Only show for All tab */}
          {activeTab === 'all' && (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Order Date:</span>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Today
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Yesterday
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Last 7 days
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Last 30 days
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Custom
                </button>
                <input
                  type="text"
                  placeholder="Start Date"
                  className="px-4 py-1.5 text-sm text-gray-400 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  className="px-4 py-1.5 text-sm text-gray-400 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Order Type Filter - Only show for All tab */}
          {activeTab === 'all' && (
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Order Type:</span>
                <button className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  All
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Normal
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Pre Sale
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Coupon
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  O2O
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Store Pickup
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Pre Order(by days)
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Pre Order(by date)
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Superlink
                </button>
                <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Installation
                </button>
              </div>
            </div>
          )}

          {/* Fulfillment SLA - Only show for To Ship */}
          {activeTab === 'to-ship' && (
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">New</span>
                <span className="text-sm font-medium text-gray-700">Fulfillment SLA:</span>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                  About to Breach SLA(0)
                  <span className="text-gray-400">ⓘ</span>
                </button>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                  SLA Breached(0)
                  <span className="text-gray-400">ⓘ</span>
                </button>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                  TTS SLA Extended(0)
                  <span className="text-gray-400">ⓘ</span>
                </button>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                  Expedite Requested(0)
                  <span className="text-gray-400">ⓘ</span>
                </button>
              </div>
            </div>
          )}

          {/* Print Status - Only show for To Ship */}
          {activeTab === 'to-ship' && (
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Print Status:</span>
                {printStatusFilters.map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pickup Status - Only show for To Handover */}
          {activeTab === 'to-ship' && activeSubTab === 'to-handover' && (
            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Pickup Status:</span>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  New
                </button>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Late Pickup
                </button>
                <button className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Failed pickup
                </button>
              </div>
            </div>
          )}

          {/* Search Filters */}
          {activeTab === 'all' ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Order Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Tracking Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
              >
                More
                <svg 
                  className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ) : activeTab === 'to-ship' && activeSubTab === 'to-pack' ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Order Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <select className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>First Mile 3PL</option>
              </select>

              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
              >
                More
                <svg 
                  className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ) : activeTab === 'to-ship' && activeSubTab === 'to-arrange' ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Order Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Tracking Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <select className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>First Mile 3PL</option>
              </select>

              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
              >
                More
                <svg 
                  className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Order Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 max-w-xs relative">
                <input
                  type="text"
                  placeholder="Tracking Number"
                  className="w-full px-4 py-2 pr-20 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <select className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>First Mile 3PL</option>
              </select>

              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
              >
                More
                <svg 
                  className={`w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="bg-white px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-600">Page 1, 1 - {orders.length} of {orders.length} items</span>
              </label>
              {activeTab === 'to-ship' && activeSubTab === 'to-pack' && (
                <>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Pack & Print
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Print Pick List
                  </button>
                </>
              )}
              {activeTab === 'to-ship' && activeSubTab === 'to-arrange' && (
                <>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Arrange Shipment
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Print AWB
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Import & Export
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </>
              )}
              {activeTab === 'to-ship' && activeSubTab === 'to-handover' && (
                <>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Print AWB
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                    Export
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </>
              )}
              {activeTab === 'all' && (
                <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Export
                  <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort By</span>
              <select className="px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {activeTab === 'to-ship' ? (
                  <>
                    <option>Shortest SLA First</option>
                    <option>Longest SLA First</option>
                    <option>Newest First</option>
                    <option>Oldest First</option>
                  </>
                ) : (
                  <>
                    <option>Newest Order Created</option>
                    <option>Oldest Order Created</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white mx-8 my-6 rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="text-gray-400 text-lg">Loading orders...</div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const orderId = order._id || order.id;
                  const firstItem = order.items[0];
                  const totalItems = order.items.length;
                  
                  return (
                    <tr key={orderId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            {firstItem.images && firstItem.images.length > 0 ? (
                              <img 
                                src={firstItem.images[0]} 
                                alt={firstItem.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{firstItem.name}</p>
                            <p className="text-sm text-gray-600">Order #{orderId}</p>
                            {totalItems > 1 && (
                              <p className="text-xs text-gray-500">+{totalItems - 1} more items</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-gray-900">
                          ₱{Number(order.total || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.shippingAddress?.name || 'Customer'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.shippingAddress?.address || 'Address not provided'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.shippingAddress?.city || ''} {order.shippingAddress?.zipCode || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status === 'to-pay' ? 'To Pay' :
                           order.status === 'to-ship' ? 'To Ship' :
                           order.status === 'to-receive' ? 'To Receive' :
                           order.status === 'completed' ? 'Completed' :
                           order.status === 'cancelled' ? 'Cancelled' :
                           order.status === 'refund' ? 'Refund' :
                           order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                              View Details
                            </button>
                          </div>
                          
                          {/* Status Update Buttons */}
                          <div className="flex flex-wrap gap-1">
                            {getNextStatus(order.status) && (
                              <button 
                                onClick={() => updateOrderStatus(orderId, getNextStatus(order.status)!)}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Mark as {getNextStatus(order.status) === 'to-ship' ? 'To Ship' :
                                         getNextStatus(order.status) === 'to-receive' ? 'To Receive' :
                                         getNextStatus(order.status) === 'completed' ? 'Completed' : 
                                         getNextStatus(order.status)}
                              </button>
                            )}
                            
                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                              <button 
                                onClick={() => updateOrderStatus(orderId, 'cancelled')}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Cancel
                              </button>
                            )}
                            
                            {(order.status === 'completed' || order.status === 'cancelled') && (
                              <button 
                                onClick={() => updateOrderStatus(orderId, 'refund')}
                                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="text-gray-300 text-4xl font-light">No Orders Yet</div>
                    <p className="text-gray-500 mt-2">Orders from customers will appear here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-medium text-sm">
                1
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-20 bg-white border-l border-gray-200 flex flex-col items-center py-6 gap-4 flex-shrink-0">
        <button className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </button>

        <button className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition">
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition">
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </button>

        <button className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex-1"></div>

        <Link href="/seller-login" className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition rounded-lg">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Link>

        <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition rounded-lg">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
