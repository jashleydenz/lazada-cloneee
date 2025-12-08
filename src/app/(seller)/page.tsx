'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState('voice_call');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex items-center justify-center bg-purple-900 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/seller-bg.jpeg"
        alt="Lazada Seller Background"
        fill
        className="object-cover opacity-50"
        priority
      />

      <div className="relative z-10 max-w-7xl mx-auto flex w-full h-full">
        {/* Left Hero Section */}
        <div className="w-1/2 flex flex-col justify-center p-12 text-white">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 text-purple-200" style={{ textShadow: '0 0 10px rgba(180, 0, 255, 0.7)' }}>
            GROW YOUR BUSINESS <br /> WITH US!
          </h1>
          <div className="flex items-end space-x-8 mb-8">
            <div>
              <span className="text-7xl font-bold text-white">80</span><span className="text-3xl text-purple-300">M</span>
              <p className="text-purple-200 text-sm">Monthly Active Users</p>
            </div>
            <div>
              <span className="text-7xl font-bold text-white">1</span><span className="text-3xl text-purple-300">M</span>
              <p className="text-purple-200 text-sm">Products across 100+ categories</p>
            </div>
            <div>
              <span className="text-7xl font-bold text-white">70</span><span className="text-3xl text-purple-300">%</span>
              <p className="text-purple-200 text-sm">New sellers make their first sale within 30 days</p>
            </div>
          </div>
          <div className="flex items-center mt-8">
            <span className="text-purple-200 text-lg font-semibold">Sell it better with</span>
            <img src="/lazada-logo-white.png" alt="Lazada Logo" className="h-8 ml-3" />
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Create your Lazada Store now</h2>
            <p className="text-gray-600 text-sm mb-6">
              Already have an account? <Link href="#" className="text-blue-600 hover:underline">Click to Log in</Link>
            </p>

            {/* Tabs for Voice Call / SMS */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('voice_call')}
                className={`flex-1 text-center py-3 font-semibold ${activeTab === 'voice_call' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Voice Call
              </button>
              <button
                onClick={() => setActiveTab('sms')}
                className={`flex-1 text-center py-3 font-semibold ${activeTab === 'sms' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
              >
                SMS
              </button>
            </div>

            {/* Phone Number Input */}
            <div className="mb-4 flex items-center border border-gray-300 rounded-lg p-2">
              <img src="/philippines-flag.png" alt="Philippines Flag" className="h-5 mr-2" />
              <span className="text-gray-700 mr-2">+63</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="flex-1 focus:outline-none text-gray-800"
              />
            </div>

            {/* New Password Input */}
            <div className="mb-6 flex items-center border border-gray-300 rounded-lg p-2">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="flex-1 focus:outline-none text-gray-800"
              />
              <svg className="h-5 w-5 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>

            {/* Send OTP Buttons */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3">
              Send OTP via Voice Call
            </button>
            <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 mb-6">
              Verify with SMS
            </button>

            {/* Legal Text */}
            <p className="text-gray-500 text-xs text-center mb-6">
              By clicking Next, you agree to these <Link href="#" className="text-blue-600 hover:underline">Terms & Conditions</Link>, <Link href="#" className="text-blue-600 hover:underline">Seller Instant Messaging AI Terms</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <hr className="flex-1 border-gray-300" />
              <span className="text-sm text-gray-500">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Sign In With Other Ways */}
            <div className="flex flex-col space-y-3 mb-6">
              <Link href="#" className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                <img src="/lazada-app-icon.png" alt="Lazada App" className="h-5" />
                <span>Lazada App</span>
              </Link>
              <Link href="#" className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                <img src="/google-icon.png" alt="Google" className="h-5" />
                <span>Google</span>
              </Link>
            </div>

            <Link href="#" className="flex items-center justify-center text-blue-600 font-semibold text-sm hover:underline">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              Sign up as LazGlobal Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

