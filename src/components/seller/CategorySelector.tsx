'use client';

import { useState, useMemo } from 'react';

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

const categoryData: Category[] = [
  {
    id: 'sports',
    name: 'Sports & Outdoors Activities',
    children: [
      {
        id: 'water-sports',
        name: 'Water Sports Equipment',
        children: [
          {
            id: 'swimming',
            name: 'Swimming',
            children: [
              { id: 'accessories', name: 'Accessories' },
              { id: 'training-equipment', name: 'Training Equipment' },
              { id: 'floaties', name: 'Floaties' },
              { id: 'goggles', name: 'Goggles' },
              { id: 'swim-caps', name: 'Swim Caps' },
            ],
          },
          { id: 'boating', name: 'Boating' },
          { id: 'diving', name: 'Diving & Snorkeling' },
          { id: 'tubing', name: 'Tubing & Towables' },
        ],
      },
      {
        id: 'outdoor-sports',
        name: 'Outdoor Sports & Activities Equipment',
        children: [
          { id: 'camping', name: 'Camping & Hiking' },
          { id: 'cycling', name: 'Cycling' },
          { id: 'fishing', name: 'Fishing' },
        ],
      },
      {
        id: 'ball-racket',
        name: 'Ball and Racket Sports Equipment',
        children: [
          { id: 'basketball', name: 'Basketball' },
          { id: 'tennis', name: 'Tennis' },
          { id: 'badminton', name: 'Badminton' },
        ],
      },
      { id: 'sports-accessories', name: 'Sports Accessories' },
      { id: 'boxing', name: 'Boxing and Martial Arts Equipment' },
      { id: 'yoga', name: 'Yoga & Wellness Equipment' },
      { id: 'exercise', name: 'Exercise & Fitness Equipment' },
    ],
  },
  {
    id: 'computers',
    name: 'Computers & Components',
    children: [
      {
        id: 'computer-components',
        name: 'Computer Components',
        children: [
          { id: 'processors', name: 'Processors' },
          { id: 'motherboards', name: 'Motherboards' },
          { id: 'graphics-cards', name: 'Graphics Cards' },
        ],
      },
      { id: 'laptops', name: 'Laptops' },
      { id: 'desktops', name: 'Desktop Computers' },
    ],
  },
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    children: [
      { id: 'kitchen', name: 'Kitchen Appliances' },
      { id: 'cleaning', name: 'Cleaning Appliances' },
      { id: 'laundry', name: 'Laundry Appliances' },
    ],
  },
  {
    id: 'digital-utilities',
    name: 'Digital Utilities',
    children: [
      { id: 'software', name: 'Software' },
      { id: 'digital-content', name: 'Digital Content' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    children: [
      { id: 'home-services', name: 'Home Services' },
      { id: 'professional', name: 'Professional Services' },
    ],
  },
  {
    id: 'printers',
    name: 'Printers & Scanners',
    children: [
      { id: 'inkjet', name: 'Inkjet Printers' },
      { id: 'laser', name: 'Laser Printers' },
      { id: 'scanners', name: 'Scanners' },
    ],
  },
  {
    id: 'outdoor-garden',
    name: 'Outdoor & Garden',
    children: [
      { id: 'gardening', name: 'Gardening Tools' },
      { id: 'outdoor-furniture', name: 'Outdoor Furniture' },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming Devices & Software',
    children: [
      { id: 'consoles', name: 'Gaming Consoles' },
      { id: 'pc-gaming', name: 'PC Gaming' },
      { id: 'accessories', name: 'Gaming Accessories' },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    children: [
      { id: 'car-parts', name: 'Car Parts' },
      { id: 'car-accessories', name: 'Car Accessories' },
    ],
  },
  {
    id: 'groceries',
    name: 'Groceries',
    children: [
      { id: 'food', name: 'Food & Beverages' },
      { id: 'household', name: 'Household Supplies' },
    ],
  },
];

interface CategorySelectorProps {
  onSelect: (path: string) => void;
  onClose: () => void;
}

export default function CategorySelector({ onSelect, onClose }: CategorySelectorProps) {
  const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  const [filters, setFilters] = useState<string[]>(['', '', '', '']);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(() => {
    const cols: Category[][] = [categoryData];
    
    selectedPath.forEach((selected) => {
      if (selected.children) {
        cols.push(selected.children);
      }
    });
    
    return cols;
  }, [selectedPath]);

  const filteredColumns = useMemo(() => {
    return columns.map((col, index) => {
      const filter = filters[index]?.toLowerCase() || '';
      if (!filter) return col;
      return col.filter(item => item.name.toLowerCase().includes(filter));
    });
  }, [columns, filters]);

  const handleCategoryClick = (category: Category, columnIndex: number) => {
    const newPath = selectedPath.slice(0, columnIndex);
    newPath.push(category);
    setSelectedPath(newPath);
    
    // Clear filters for columns after the current one
    const newFilters = [...filters];
    for (let i = columnIndex + 1; i < newFilters.length; i++) {
      newFilters[i] = '';
    }
    setFilters(newFilters);
  };

  const handleFilterChange = (value: string, columnIndex: number) => {
    const newFilters = [...filters];
    newFilters[columnIndex] = value;
    setFilters(newFilters);
  };

  const handleConfirm = () => {
    const path = selectedPath.map(cat => cat.name).join(' > ');
    onSelect(path);
    onClose();
  };

  const breadcrumb = selectedPath.map(cat => cat.name).join(' > ');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category"
              className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
              Recently used
            </button>
            <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-full text-sm">
              Gaming Chairs
            </button>
          </div>
        </div>

        {/* Miller Columns */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {filteredColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-1 border-r border-gray-200 last:border-r-0 flex flex-col min-w-0">
                {/* Sticky Filter */}
                <div className="sticky top-0 bg-white p-3 border-b border-gray-100 z-10">
                  <div className="relative">
                    <input
                      type="text"
                      value={filters[columnIndex] || ''}
                      onChange={(e) => handleFilterChange(e.target.value, columnIndex)}
                      placeholder="Filter..."
                      className="w-full px-3 py-1.5 pl-8 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                    <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Category List */}
                <div className="flex-1 overflow-y-auto">
                  {column.map((category) => {
                    const isSelected = selectedPath[columnIndex]?.id === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category, columnIndex)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate">{category.name}</span>
                        {category.children && (
                          <svg className={`w-4 h-4 flex-shrink-0 ml-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-1 min-w-0">
              <span className="flex-shrink-0">Current selection:</span>
              <span className="text-blue-600 font-medium truncate">
                {breadcrumb || 'None'}
              </span>
              {breadcrumb && (
                <button
                  onClick={() => setSelectedPath([])}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedPath.length === 0}
              className={`px-6 py-2.5 rounded-lg font-medium ${
                selectedPath.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
