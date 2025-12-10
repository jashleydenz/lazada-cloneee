'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IoMailOutline, IoLocationOutline, IoCardOutline, IoStorefrontOutline } from 'react-icons/io5';

export default function SellerDashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, label: 'Email', icon: IoMailOutline },
    { number: 2, label: 'Address', icon: IoLocationOutline },
    { number: 3, label: 'ID Bank', icon: IoCardOutline },
    { number: 4, label: 'Product', icon: IoStorefrontOutline },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-gray-800">
            Good afternoon, <span className="text-blue-600 font-semibold">UXJdvCib</span>
          </h1>
        </div>

        {/* User Info and Notification in one row */}
        <div className="flex gap-6 mb-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 w-64">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                U
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">UXJdvCib</h3>
                <p className="text-sm text-gray-500">Seller Full Access</p>
              </div>
            </div>
          </div>

          {/* Notification Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Notification</h2>
                <p className="text-gray-600">
                  <span className="font-semibold">You are updated!</span> There's no new important notification for you.
                </p>
              </div>
              <button className="text-blue-600 text-sm hover:underline whitespace-nowrap ml-4">More &gt;</button>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-8">Welcome to Lazada!</h2>

        {/* Steps */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center max-w-4xl w-full px-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 font-semibold ${
                      currentStep === step.number
                        ? 'bg-white text-blue-600'
                        : currentStep > step.number
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-400 text-white'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                
                {/* Line between steps (not on last step) */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-white/40 mx-6"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 bg-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-lg shadow-md mx-auto mb-4 flex items-center justify-center">
                  <IoMailOutline className="text-6xl text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Input an email to receive crucial updates and notifications
          </h3>

          <p className="text-gray-500 text-sm mb-6">no video</p>

          <button className="bg-blue-600 text-white px-32 py-3 rounded-lg font-medium hover:bg-blue-700 transition mb-4">
            Add
          </button>

          <p className="text-gray-600 text-sm">Add Email to protect your account!</p>

          <div className="mt-6 text-left inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
            Click here to complete your information and start selling!
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
