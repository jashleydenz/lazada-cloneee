'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  IoStorefrontOutline, 
  IoReceiptOutline, 
  IoMegaphoneOutline, 
  IoStatsChartOutline, 
  IoTrophyOutline, 
  IoSchoolOutline, 
  IoChatbubblesOutline, 
  IoBusinessOutline, 
  IoWalletOutline, 
  IoHelpCircleOutline,
  IoPersonOutline 
} from 'react-icons/io5';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasNotification?: boolean;
  subItems?: string[];
}

const menuItems: MenuItem[] = [
  { id: 'products', label: 'Products', icon: IoStorefrontOutline, subItems: [] },
  { id: 'orders', label: 'Orders', icon: IoReceiptOutline, subItems: [] },
  { id: 'marketing', label: 'Marketing Center', icon: IoMegaphoneOutline, subItems: [] },
  { id: 'data', label: 'Data Insight', icon: IoStatsChartOutline, subItems: [] },
  { id: 'privilege', label: 'Shop Privilege', icon: IoTrophyOutline, subItems: [] },
  { id: 'learn', label: 'Learn and Grow', icon: IoSchoolOutline, subItems: [] },
  { id: 'engagement', label: 'Engagement Center', icon: IoChatbubblesOutline, subItems: [] },
  { id: 'store', label: 'Store', icon: IoBusinessOutline, subItems: [] },
  { id: 'finance', label: 'Finance', icon: IoWalletOutline, subItems: [] },
  { id: 'support', label: 'Support', icon: IoHelpCircleOutline, subItems: [] },
];

export default function SellerDashboardNavbar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <Link href="/seller-dashboard" className="flex items-center gap-2">
          <img
            src="/seller-img/lazada-seller-logo.png"
            alt="Lazada Seller Center"
            className="h-8"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-blue-900 font-bold text-xl">Lazada</span>
            <span className="text-blue-600 text-sm font-semibold">Seller Center</span>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 pb-20 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (activeItem === item.id) {
                  setActiveItem('');
                } else {
                  setActiveItem(item.id);
                  setShowSettings(false);
                }
                if (item.subItems && item.subItems.length > 0) {
                  toggleExpand(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-6 py-2.5 text-left transition-colors ${
                activeItem === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="text-lg opacity-60" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${activeItem === item.id ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Submenu items would go here if needed */}
            {item.subItems && expandedItems.includes(item.id) && (
              <div className="bg-gray-50">
                {item.subItems.map((subItem, index) => (
                  <Link
                    key={index}
                    href={`/seller-dashboard/${item.id}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-6 py-2 pl-16 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  >
                    {subItem}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* My Account & Settings */}
        <div>
          <button
            onClick={() => {
              if (activeItem === 'account') {
                setActiveItem('');
              } else {
                setActiveItem('account');
              }
              setShowSettings(!showSettings);
            }}
            className={`w-full flex items-center justify-between px-6 py-2.5 text-left transition-colors ${
              activeItem === 'account'
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <IoPersonOutline className="text-lg opacity-60" />
              <span className="text-sm font-medium">My Account</span>
            </div>
            <svg 
              className={`w-4 h-4 transition-transform ${activeItem === 'account' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSettings && (
            <>
              <button
                onClick={() => {
                  if (activeItem === 'settings') {
                    setActiveItem('');
                  } else {
                    setActiveItem('settings');
                  }
                }}
                className={`w-full flex items-center justify-between px-6 py-2.5 pl-14 text-left transition-colors ${
                  activeItem === 'settings'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-black hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">Settings</span>
              </button>
              
              <Link
                href="/seller-login"
                className="w-full flex items-center justify-between px-6 py-2.5 pl-14 text-left transition-colors text-black hover:bg-gray-50"
              >
                <span className="text-sm font-medium">Logout</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}
