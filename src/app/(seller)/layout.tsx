'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Header Bar for Seller Site */}
      <header className="bg-white border-b border-gray-200 py-3 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="#" className="flex items-center text-blue-700 font-bold text-lg">
            <img src="/lazada-seller-logo.png" alt="Lazada Seller Center" className="h-8 mr-2" />
            Lazada Seller Center
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700 text-sm">
            <img src="/marketplace-icon.png" alt="MarketPlace" className="h-4 inline-block mr-1" />
            MarketPlace
          </Link>
          <Link href="#" className="text-gray-600 hover:text-blue-700 text-sm">
            <img src="/lazglobal-icon.png" alt="LazGlobal" className="h-4 inline-block mr-1" />
            LazGlobal
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-600 text-sm">
            <img src="/philippines-flag.png" alt="Philippines" className="h-4 mr-1" />
            Pilipinas
            <svg className="ml-1 h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            English
            <svg className="ml-1 h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9H15.772M11.25 18H12.75M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"></path></svg>
            Need Help
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
