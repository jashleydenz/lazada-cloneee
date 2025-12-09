'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SellerLoginPage() {
  const [loginMethod, setLoginMethod] = useState<'voice' | 'sms'>('voice');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+63');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Seller login attempt:', { loginMethod, phoneNumber, password });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Need Help Button */}
      <button className="fixed right-0 top-22 z-40 bg-white text-gray-600 px-10 py-4 rounded-l-full shadow-md hover:shadow-lg transition flex items-center gap-1.5 text-xs font-medium border border-gray-200">
        <span className="text-sm">💬</span>
        <span>Need Help</span>
      </button>

      {/* Top Navbar - Sticky */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/seller-img/lazada-seller-logo.png" alt="Lazada Seller Center" className="h-8" />
              <div className="flex flex-col leading-tight">
                <span className="text-blue-900 font-bold text-xl">Lazada</span>
                <span className="text-blue-600 text-sm font-semibold">Seller Center</span>
              </div>
            </Link>
            <Link href="#" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <img src="/seller-img/marketplace-icon.png" alt="MarketPlace" className="w-3 h-3" />
              </div>
              <span>MarketPlace</span>
            </Link>
            <Link href="#" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <img src="/seller-img/lazglobal-icon.png" alt="LazGlobal" className="w-3 h-3" />
              </div>
              <span>LazGlobal</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 text-gray-600 text-sm">
              <img src="/seller-img/philippines-flag.png" alt="Philippines" className="w-5 h-5" />
              <span>Pilipinas</span>
              <span className="text-xs">▼</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 text-sm">
              <span>English</span>
              <span className="text-xs">▼</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-12 flex items-center gap-16">
          {/* Left Side - Hero Content */}
          <div className="flex-1 text-white pr-8">
            <h1 className="text-6xl font-bold mb-8 leading-tight">
              GROW YOUR<br />
              BUSINESS<br />
              WITH US!
            </h1>

            <div className="flex items-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-7xl font-bold mb-3">
                  80<span className="text-5xl align-top">M</span>
                </div>
                <div className="text-sm leading-relaxed">
                  Monthly Active Users<br />on Lazada
                </div>
              </div>
              <div className="text-7xl font-light opacity-50 self-center">|</div>
              <div className="text-center">
                <div className="text-7xl font-bold mb-3">
                  1<span className="text-5xl align-top">M</span>
                </div>
                <div className="text-sm leading-relaxed">
                  Products across 100+<br />countries
                </div>
              </div>
              <div className="text-7xl font-light opacity-50 self-center">|</div>
              <div className="text-center">
                <div className="text-7xl font-bold mb-3">
                  70<span className="text-5xl align-top">%</span>
                </div>
                <div className="text-sm leading-relaxed">
                  New sellers make their<br />first sale within 4<br />weeks
                </div>
              </div>
            </div>

            <button className="mt-8 text-white flex items-center gap-2 text-sm">
              <span>Scroll down to explore more</span>
              <span className="text-xl">↓</span>
            </button>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-[420px] bg-white rounded-lg shadow-2xl p-8 mr-10 mt-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create your Lazada Store now
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Already have an account?{' '}
              <Link href="/seller-login" className="text-blue-600 hover:underline font-medium">
                Click to Log in
              </Link>
            </p>

            {/* Login Method Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setLoginMethod('voice')}
                className={`pb-3 px-2 font-medium transition text-sm ${
                  loginMethod === 'voice'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Voice Call
              </button>
              <button
                onClick={() => setLoginMethod('sms')}
                className={`pb-3 px-2 font-medium transition text-sm ${
                  loginMethod === 'sms'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                SMS
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="+63">🇵🇭 +63</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+86">🇨🇳 +86</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition text-sm"
              >
                {loginMethod === 'voice' ? 'Send OTP via Voice Call' : 'Verify with SMS'}
              </button>

              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By clicking Next, you agree to these{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>,{' '}
                <a href="#" className="text-blue-600 hover:underline">Seller Instant Messaging AI Terms</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded font-medium hover:bg-gray-50 transition text-sm"
              >
                <img src="/seller-img/lazada-app-icon.png" alt="Lazada App" className="w-5 h-5" />
                <span className="text-gray-700">Lazada App</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded font-medium hover:bg-gray-50 transition text-sm"
              >
                <img src="/seller-img/google-icon.png" alt="Google" className="w-5 h-5" />
                <span className="text-gray-700">Google</span>
              </button>

              <div className="mt-4 text-center">
                <a href="#" className="text-purple-600 hover:underline font-medium flex items-center justify-center gap-2 text-sm">
                  <span>🌐</span>
                  Sign up as LazGlobal Seller
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* New Seller Benefits Section */}
      <section className="bg-gray-50 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            New Seller Benefits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 0% commission fee */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">💎</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                0% comission fee
              </h3>
              <p className="text-sm text-gray-600">
                0% Platform commission fee for<br />first 90 days
              </p>
            </div>

            {/* Free Campaign Voucher */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎫</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Free Campaign Voucher
              </h3>
              <p className="text-sm text-gray-600">
                0% Campaign Vouchers<br />Commission Rate for 1 Campaign
              </p>
            </div>

            {/* Seller Coins & Boost Traffic */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">🪙</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Seller Coins & Boost Traffic
              </h3>
              <p className="text-sm text-gray-600">
                Extra seller coins & 14 days free<br />trial for traffic exchange
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ads Credit for you */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ads Credit for you
              </h3>
              <p className="text-sm text-gray-600">
                Get PHP 1,200 Ads Credit
              </p>
            </div>

            {/* Incubation support */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">👥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Incubation support
              </h3>
              <p className="text-sm text-gray-600">
                Personal consultant with Lazada<br />University
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps to Start Selling Section */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Steps to Start Selling
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Description */}
            <div>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                Selling on Lazada provides you with good opportunity to step into the SEA market and access to learning materials and support you to achieve your business goals. Seller can be easily benefited through Lazada's platform since product would be displayed to a wide rang of buyers.
              </p>
              <button 
                onClick={scrollToTop}
                className="bg-blue-600 text-white px-8 py-3 rounded font-medium hover:bg-blue-700 transition"
              >
                Sign up now
              </button>
            </div>

            {/* Right Side - Steps */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">1.</span>
                  <span className="text-gray-900 font-medium">Sign up with your local phone number.</span>
                </div>
                <span className="text-gray-400 text-xl">⌄</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">2.</span>
                  <span className="text-gray-900 font-medium">Fill in Email and Address</span>
                </div>
                <span className="text-gray-400 text-xl">⌄</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">3.</span>
                  <span className="text-gray-900 font-medium">Submit ID and Bank Account</span>
                </div>
                <span className="text-gray-400 text-xl">⌄</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">4.</span>
                  <span className="text-gray-900 font-medium">Upload Products and Start Selling</span>
                </div>
                <span className="text-gray-400 text-xl">⌄</span>
              </div>

              {/* Floating Sign Up Button */}
              <div className="flex justify-end mt-6">
                <button 
                  onClick={scrollToTop}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
                >
                  SIGN UP
                  <span className="text-lg">↑</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller's Program Section */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Seller's Program
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* MarketPlace Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">MarketPlace</h3>
              </div>

              <p className="text-gray-700 mb-6">
                Offer consumers the widest assortment of goods from local sellers
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">You are based locally</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Access to wide array of seller tools</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">0% comission for the first 90 days</span>
                </div>
              </div>

              <button 
                onClick={scrollToTop}
                className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition"
              >
                Sign up now
              </button>
            </div>

            {/* LazGlobal Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-bold text-purple-600">LazGlobal</h3>
              </div>

              <p className="text-gray-700 mb-6">
                You want to sell accross South East Asia
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">You want to sell accross South East Asia</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">New seller is eligible for 90 days commission free plan after approval</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Enterprise Alipay with a balance of not less than 3000RMB</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">for authentication and margin payment</span>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 transition">
                Find Out More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* Logo Column */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img src="/seller-img/lazada-seller-logo.png" alt="Lazada Seller Center" className="h-8" />
                <div className="flex flex-col leading-tight">
                  <span className="text-blue-900 font-bold text-xl">Lazada</span>
                  <span className="text-blue-600 text-sm font-semibold">Seller Center</span>
                </div>
              </Link>
            </div>

            {/* We are Lazada */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">We are Lazada</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                    Our Story
                  </a>
                </li>
              </ul>
            </div>

            {/* Seller Center */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Seller Center</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                    Service Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Social Media</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>

            {/* Download Seller App */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Download Seller App</h4>
              <div className="bg-white p-3 rounded border border-gray-300 inline-block">
                <img src="/seller-img/qr-code.png" alt="Download App QR Code" className="w-24 h-24" />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-300">
            <p className="text-gray-600 text-xs">
              © 2023 Lazada Seller Center. All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
