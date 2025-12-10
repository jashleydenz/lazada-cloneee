'use client';

import { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state: any) => state.addItem);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<{[key: string]: string}>({});

  const handleAddToCart = () => {
    if (product) {
      const productWithVariations = {
        ...product,
        quantity,
        selectedVariations: selectedVariations,
        // Create a unique identifier for cart items with different variations
        cartId: `${product.id || product._id}-${JSON.stringify(selectedVariations)}`
      };
      addItem(productWithVariations);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const productWithVariations = {
        ...product,
        quantity,
        selectedVariations: selectedVariations,
        cartId: `${product.id || product._id}-${JSON.stringify(selectedVariations)}`
      };
      addItem(productWithVariations);
      router.push('/cart');
    }
  };

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          
          // First, try to load from localStorage
          const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const localProduct = localProducts.find((p: any) => 
            (p.id === productId || p._id === productId) && p.status === 'active'
          );
          
          if (localProduct) {
            setProduct(localProduct);
            if (localProduct.images && localProduct.images.length > 0) {
              setMainImage(localProduct.images[0]);
            } else if (localProduct.image && localProduct.image !== '/images/product-placeholder.png') {
              setMainImage(localProduct.image);
            }
            setError('');
            setLoading(false);
            return;
          }
          
          // If not found in localStorage, try API
          const response = await productAPI.getById(productId as string);
          setProduct(response.data);
          if (response.data.images && response.data.images.length > 0) {
            setMainImage(response.data.images[0]);
          } else if (response.data.image) {
            setMainImage(response.data.image);
          }
          setError('');
        } catch (err: any) {
          // If API fails, check localStorage one more time
          const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const localProduct = localProducts.find((p: any) => 
            (p.id === productId || p._id === productId) && p.status === 'active'
          );
          
          if (localProduct) {
            setProduct(localProduct);
            if (localProduct.images && localProduct.images.length > 0) {
              setMainImage(localProduct.images[0]);
            } else if (localProduct.image) {
              setMainImage(localProduct.image);
            }
            setError('');
          } else {
            setError(err.response?.data?.error || 'Failed to load product');
            setProduct(null);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  // Initialize selected variations when product loads
  useEffect(() => {
    if (product && product.variations) {
      const initialSelections: {[key: string]: string} = {};
      product.variations.forEach((variation: any) => {
        if (variation.options && variation.options.length > 0) {
          initialSelections[variation.name] = variation.options[0];
        }
      });
      setSelectedVariations(initialSelections);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-700 text-lg">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded mb-4 max-w-7xl mx-auto mt-8">
        <p className="font-semibold">Error: {error}</p>
        <p className="text-sm mt-2">Make sure your backend is running and the product ID is valid.</p>
      </div>
    );
  };

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images/Video */}
          <div className="bg-white rounded-lg p-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
              {mainImage && mainImage !== '/images/product-placeholder.png' ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-gray-600 font-medium">No Image</div>
                    <div className="text-sm text-gray-500">Upload product images</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((img: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${
                      mainImage === img ? 'border-2 border-orange-500' : 'border border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200"
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="bg-white rounded-lg p-6">
            {/* LazMall Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded font-bold">LazMall</span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl font-normal text-gray-900 mb-3 leading-relaxed">{product.name}</h1>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-gray-800 text-sm ml-1 font-medium">5(3739)</span>
              </div>
            </div>

            {/* Brand */}
            <div className="mb-4">
              <span className="text-gray-800 text-sm">Brand: </span>
              <Link href="#" className="text-blue-600 hover:underline text-sm">{product.brand || 'No Brand'}</Link>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-pink-600">
                  ₱{Number(product.specialPrice || product.price).toFixed(2)}
                </span>
                {product.specialPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₱{Number(product.price).toFixed(2)}
                    </span>
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-sm font-bold">
                      -{Math.round(((Number(product.price) - Number(product.specialPrice)) / Number(product.price)) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mb-6 border-t pt-4">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-gray-800 text-sm font-medium">Delivery Options:</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span className="text-gray-900">Metro Manila-Quezon City, Quezon City, Project 6</span>
                  <button className="text-blue-600 hover:underline text-sm font-medium">CHANGE</button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📦</span>
                  <span className="text-gray-900">Guaranteed by Fri, 12 Dec</span>
                </div>
                <div className="text-xs text-gray-700 pl-6">
                  Priority 48H with shipping fee ₱40.00
                </div>
              </div>
            </div>

            {/* Return & Warranty */}
            <div className="mb-6 border-t pt-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-gray-800 text-sm font-medium">Return & Warranty:</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <span>✓</span>
                <span>100% Authentic • Change of Mind • 30 Days Free Return • 7 Days Local Supplier Warranty</span>
              </div>
            </div>

            {/* Product Variations */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-6 border-t pt-4">
                {product.variations.map((variation: any, index: number) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gray-800 text-sm font-medium">{variation.name}:</span>
                      <span className="text-gray-900 font-medium">{selectedVariations[variation.name] || variation.options[0]}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {variation.options.map((option: string, optIndex: number) => (
                        <button 
                          key={optIndex}
                          onClick={() => {
                            setSelectedVariations(prev => ({
                              ...prev,
                              [variation.name]: option
                            }));
                          }}
                          className={`px-4 py-2 border-2 rounded text-sm font-medium transition-colors ${
                            selectedVariations[variation.name] === option || (!selectedVariations[variation.name] && optIndex === 0)
                              ? 'border-pink-500 text-pink-500 bg-pink-50' 
                              : 'border-gray-300 text-gray-700 bg-white hover:border-pink-300 hover:text-pink-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fallback for products without variations but with volume */}
            {(!product.variations || product.variations.length === 0) && product.volume && (
              <div className="mb-6 border-t pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-800 text-sm font-medium">Volume:</span>
                  <span className="text-gray-900 font-medium">{product.volume}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-pink-500 text-pink-500 rounded text-sm font-medium bg-pink-50">
                    {product.volume}
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6 border-t pt-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-800 text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-800 hover:bg-gray-100 text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center text-gray-900 font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-800 hover:bg-gray-100 text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleBuyNow}
                className="bg-white text-pink-600 border-2 border-pink-600 px-8 py-3 rounded font-semibold hover:bg-pink-50 flex-1"
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToCart}
                className={`px-8 py-3 rounded font-semibold flex-1 transition-colors ${
                  showAddedToCart 
                    ? 'bg-green-600 text-white' 
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {showAddedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-sm">Share</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Like</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

