'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  // Load products from localStorage on mount
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
    };
    
    loadProducts();
    
    // Listen for storage changes
    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  const hasProducts = products.length > 0;

  // Filter products by tab
  const filteredProducts = products.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return product.status === 'active';
    if (activeTab === 'draft') return product.status === 'draft';
    return false;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-8 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/seller-dashboard" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-700 font-medium">Manage Products</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Find Trending Opportunities
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1">
              Analysis Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1">
              Bulk Manage
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Link href="/seller-dashboard/add-product" className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1">
              <span className="text-lg">+</span>
              New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 px-8 py-4 mx-8 mt-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              For PH, During Campaign period [2025-12-11 19:30:00 ~ 2025-12-11 20:30:00] and [2025-12-11 23:30:00 ~ 2025-12-12 00:30:00] local time, these [Add, Edit Product] functions are disabled.
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Your products are not visible to buyers yet.{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Please click here to complete to-do list
              </Link>
            </p>
          </div>
        </div>
      </div>

      {!hasProducts ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-64 h-64 mb-8 relative">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Empty box illustration */}
              <ellipse cx="100" cy="150" rx="80" ry="20" fill="#E0E7FF" opacity="0.5" />
              <rect x="50" y="80" width="100" height="70" rx="8" fill="#BFDBFE" />
              <rect x="60" y="70" width="80" height="60" rx="6" fill="#93C5FD" />
              <rect x="70" y="60" width="60" height="50" rx="4" fill="#60A5FA" />
              <circle cx="140" cy="50" r="3" fill="#3B82F6" />
              <path d="M 135 45 Q 140 40 145 45" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="2,2" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Currently, you do not have any product
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            This is where you will manage your product listing Let's add new product to start selling at Lazada
          </p>

          <Link href="/seller-dashboard/add-product" className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium inline-block">
            New Product
          </Link>
        </div>
      ) : (
        /* Product List View */
        <div className="p-8">
          {/* Product Overview */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Product Overview</h2>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-gray-200">
              <div className="flex gap-6">
                {['All', 'Active', 'Inactive', 'Draft', 'Pending QC', 'Violation', 'Deleted'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                    className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.toLowerCase().replace(' ', '-')
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-700">Filter Product:</span>
                <button className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
                  Out Of Stock
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                  <div className="relative">
                    <select className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-sm text-gray-700 appearance-none pr-8 outline-none">
                      <option>Product Name</option>
                      <option>SKU</option>
                      <option>Product ID</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Please Input"
                      className="w-full px-4 py-2 bg-white text-sm text-gray-900 placeholder:text-gray-400 pr-8 outline-none min-w-[200px]"
                    />
                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                  <span className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-sm text-gray-700 whitespace-nowrap">Select Category</span>
                  <div className="relative">
                    <select className="px-4 py-2 bg-white text-sm text-gray-400 appearance-none pr-8 outline-none min-w-[150px]">
                      <option>Please Select</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                  <span className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-sm text-gray-700 whitespace-nowrap">Sort By</span>
                  <div className="relative">
                    <select className="px-4 py-2 bg-white text-sm text-gray-400 appearance-none pr-8 outline-none min-w-[150px]">
                      <option>Please Select</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                  <span className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-sm text-gray-700 whitespace-nowrap">A/B Testing</span>
                  <div className="relative">
                    <select className="px-4 py-2 bg-white text-sm text-gray-400 appearance-none pr-8 outline-none min-w-[150px]">
                      <option>Please Select</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-600">0 products selected</span>
                </label>
                <button className="px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded cursor-not-allowed">
                  Edit Special Price
                </button>
                <button className="px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded cursor-not-allowed">
                  Deactivate
                </button>
                <button className="px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded cursor-not-allowed">
                  Delete
                </button>
                <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1">
                  Export
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead className="bg-gray-50 border-t border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-32 text-center">
                      <div className="text-gray-300 text-4xl font-light">Empty Data</div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                            <div className="text-xs text-gray-400">SKU: {product.sellerSKU || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">₱{product.price}</div>
                        {product.specialPrice && (
                          <div className="text-xs text-red-500">Special: ₱{product.specialPrice}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.stock}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
