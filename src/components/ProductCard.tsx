'use client';

import { useCartStore } from '@/store';
import Link from 'next/link';
import Image from 'next/image';

export function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((state: any) => state.addItem);

  const showLazMall = product.category === 'Electronics';
  const showTop = (product.discount || 0) >= 30;
  const showVoucher = (product.discount || 0) >= 35;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <div className="relative mb-4 bg-gray-200 rounded overflow-hidden h-48 flex items-center justify-center">
        {product.image && product.image !== '/images/product-placeholder.png' ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-2">
          {showLazMall && (
            <span className="bg-pink-600 text-white text-[10px] px-2 py-1 rounded">LazMall</span>
          )}
          {showTop && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded">TOP</span>
          )}
          {showVoucher && (
            <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded">Voucher</span>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900">{product.name}</h3>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xl font-bold text-red-600">₱{Number(product.price).toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ₱{Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
        {product.discount && (
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-sm">★★★★☆</span>
        <span className="text-xs text-gray-600">{product.reviews?.length || 0} reviews</span>
        {typeof product.sold === 'number' && (
          <span className="text-xs text-gray-600 ml-2">{product.sold} sold</span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => addItem(product)}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Add to Cart
        </button>
        <Link
          href={`/products/${product._id || product.id}`}
          className="flex-1 bg-gray-200 text-gray-900 py-2 rounded hover:bg-gray-300 text-center"
        >
          View
        </Link>
      </div>
    </div>
  );
}
