'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MyIncomePage() {
  const [activeTab, setActiveTab] = useState('income-overview');
  const [reportType, setReportType] = useState('weekly');
  const [releaseTab, setReleaseTab] = useState('to-release');
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [toReleaseAmount, setToReleaseAmount] = useState(0);

  useEffect(() => {
    const loadIncomeData = () => {
      try {
        // Load orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Filter completed orders
        const completed = allOrders.filter((order: any) => order.status === 'completed');
        
        // Filter orders ready to be released (to-receive status)
        const toRelease = allOrders.filter((order: any) => order.status === 'to-receive');
        
        // Calculate total earnings from completed orders
        const earnings = completed.reduce((sum: number, order: any) => {
          return sum + Number(order.total || 0);
        }, 0);
        
        // Calculate amount to be released
        const releaseAmount = toRelease.reduce((sum: number, order: any) => {
          return sum + Number(order.total || 0);
        }, 0);
        
        setCompletedOrders(completed);
        setTotalEarnings(earnings);
        setToReleaseAmount(releaseAmount);
      } catch (error) {
        console.error('Failed to load income data:', error);
      }
    };

    loadIncomeData();
    
    // Listen for order status updates
    const handleOrderUpdate = () => {
      loadIncomeData();
    };
    
    window.addEventListener('orderStatusUpdated', handleOrderUpdate);
    window.addEventListener('storage', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('orderStatusUpdated', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
    };
  }, []);

  const tabs = [
    { id: 'income-overview', label: 'Income Overview' },
    { id: 'income-statement', label: 'Income Statement' },
    { id: 'income-details', label: 'Income Details' },
    { id: 'my-invoice', label: 'My Invoice' },
    { id: 'wht-certificate', label: 'WHT Certificate' },
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
            <span className="text-gray-400">›</span>
            <span className="text-gray-700 font-medium">My Income</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">My Income</h1>
        </div>

        {/* Tabs */}
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

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 px-8 py-4 mx-8 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">i</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Dear Seller, please note that there may be a system delay affecting the automated updates of your seller statement. If you notice that your statement is not up to date, kindly reach out to our Partner Support Team for assistance.
                <Link href="#" className="text-blue-600 hover:underline ml-1">Contact PSC</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {activeTab === 'income-overview' && (
            <div className="space-y-8">
              {/* Top Section - Income Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Income Overview */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Income Overview</h2>
                      <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                        Manage My Balance
                      </button>
                    </div>

                    {/* To Release Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-sm font-medium text-gray-700">To Release</h3>
                        <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">i</span>
                        </div>
                      </div>

                      <div className="text-3xl font-bold text-blue-600 mb-6">₱ {toReleaseAmount.toFixed(2)}</div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Orders to be delivered</span>
                            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">i</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-blue-600">₱ {toReleaseAmount.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Total Completed Orders</span>
                            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">i</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-green-600">₱ {totalEarnings.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Available Balance</span>
                            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">i</span>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-green-600">₱ {totalEarnings.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Income Report */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Income Report</h3>
                        <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">i</span>
                        </div>
                      </div>
                      <Link href="#" className="text-sm text-blue-600 hover:underline">
                        More ›
                      </Link>
                    </div>

                    {/* Report Type Tabs */}
                    <div className="flex gap-1 mb-6">
                      <button
                        onClick={() => setReportType('weekly')}
                        className={`px-3 py-1.5 text-sm rounded ${
                          reportType === 'weekly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Weekly Report
                      </button>
                      <button
                        onClick={() => setReportType('monthly')}
                        className={`px-3 py-1.5 text-sm rounded ${
                          reportType === 'monthly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Monthly Report
                      </button>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">No data available</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600">₱ {totalEarnings.toFixed(2)}</span>
                      <p className="text-xs text-gray-500 mt-1">Total Earnings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Income Details */}
              <div className="bg-white rounded-lg shadow">
                {/* Sub-tabs for To Release / Released */}
                <div className="border-b border-gray-200 px-6">
                  <div className="flex gap-6">
                    <button 
                      onClick={() => setReleaseTab('to-release')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                        releaseTab === 'to-release'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      To Release
                    </button>
                    <button 
                      onClick={() => setReleaseTab('released')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                        releaseTab === 'released'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Released
                    </button>
                  </div>
                </div>

                {/* Filters Section */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Order Creation Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Creation Date</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Start Date"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="End Date"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Release Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Release Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Please Select</option>
                        <option>Pending</option>
                        <option>Released</option>
                        <option>On Hold</option>
                      </select>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                      <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100">
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Order Search */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order No/Order ID</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by Order No or Order ID"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Actions */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total: {completedOrders.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 flex items-center gap-1">
                      Download
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">i</span>
                    </div>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Creation Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            Est Release Amount
                            <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">i</span>
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Release Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedOrders.length > 0 ? (
                        completedOrders.map((order) => {
                          const orderId = order._id || order.id;
                          const orderDate = new Date(order.createdAt).toLocaleDateString();
                          const completedDate = order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : orderDate;
                          
                          return (
                            <tr key={orderId} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">Order #{orderId}</div>
                                <div className="text-xs text-gray-600">
                                  {order.items.map((item: any, index: number) => (
                                    <div key={index}>{item.name} (x{item.quantity})</div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{orderDate}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Completed
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">₱ {Number(order.total || 0).toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{completedDate}</div>
                              </td>
                              <td className="px-6 py-4">
                                <button className="text-blue-600 hover:text-blue-900 text-sm">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-32 text-center">
                            <div className="text-gray-400 text-lg">No Completed Orders Yet</div>
                            <p className="text-gray-500 mt-2">Completed orders will appear here</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Total: {completedOrders.length}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Items per page:</span>
                      <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm text-gray-400 border border-gray-300 rounded cursor-not-allowed">
                      ‹ Previous
                    </button>
                    <button className="w-8 h-8 bg-blue-600 text-white rounded text-sm font-medium">
                      1
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-400 border border-gray-300 rounded cursor-not-allowed">
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Other tabs content placeholder */}
          {activeTab !== 'income-overview' && (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">Coming Soon</div>
                <p className="text-gray-500">This section is under development</p>
              </div>
            </div>
          )}
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