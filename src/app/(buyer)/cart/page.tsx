'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store';
import { cartAPI, orderAPI } from '@/lib/api';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = useCartStore((state: any) => state.items);
  const removeItem = useCartStore((state: any) => state.removeItem);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online-payment');

  const total = cartItems.reduce((sum: number, item: any) => {
    const price = Number(item.specialPrice || item.price || 0);
    return sum + (price * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Create order object for localStorage
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        total: total * 1.1, // Including tax
        shippingAddress: {
          name: 'User Name',
          phone: '1234567890',
          address: 'Sample Address',
          city: 'Sample City',
          zipCode: '12345',
        },
        paymentMethod: paymentMethod,
        status: paymentMethod === 'cod' ? 'to-ship' : 'to-pay', // COD orders go directly to ship, online payment needs payment first
        createdAt: new Date().toISOString(),
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Dispatch custom event to notify seller dashboard
      window.dispatchEvent(new CustomEvent('orderAdded', { detail: order }));

      // Clear cart
      useCartStore.getState().clearCart();
      
      alert('Order placed successfully!');
      window.location.href = '/orders';
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-900">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cartItems.map((item: any) => {
                const itemId = item._id || item.id;
                const price = Number(item.specialPrice || item.price || 0);
                return (
                  <div key={itemId} className="flex items-center gap-4 p-4 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-900 font-medium">₱{price.toFixed(2)}</p>
                      {item.specialPrice && (
                        <p className="text-sm text-gray-600 line-through">₱{Number(item.price).toFixed(2)}</p>
                      )}
                      {item.category && (
                        <p className="text-sm text-gray-700">{item.category}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 min-w-[3rem] text-center text-gray-900 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold w-24 text-right text-gray-900">₱{(price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(itemId)}
                      className="text-red-600 hover:text-red-900 px-2"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online-payment"
                    checked={paymentMethod === 'online-payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Online Payment</p>
                      <p className="text-sm text-gray-600">Credit/Debit Card, GCash, PayMaya</p>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-900">
                <span>Subtotal:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span>Tax:</span>
                <span>₱{(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span>₱{(total * 1.1).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <Link
              href="/products"
              className="block text-center mt-4 text-blue-600 hover:text-blue-900"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
  );
}
