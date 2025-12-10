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
            id: 'golf',
            name: 'Golf',
            children: [
              { id: 'golf-clubs', name: 'Golf Clubs' },
              { id: 'golf-balls', name: 'Golf Balls' },
              { id: 'golf-bags', name: 'Golf Bags' },
              { id: 'golf-accessories', name: 'Golf Accessories' },
              { id: 'golf-gloves', name: 'Golf Gloves' },
              { id: 'golf-tees', name: 'Golf Tees' },
            ],
          },
          {
            id: 'swimming',
            name: 'Swimming',
            children: [
              { id: 'swim-accessories', name: 'Accessories' },
              { id: 'training-equipment', name: 'Training Equipment' },
              { id: 'floaties', name: 'Floaties' },
              { id: 'goggles', name: 'Goggles' },
              { id: 'swim-caps', name: 'Swim Caps' },
              { id: 'swimwear', name: 'Swimwear' },
            ],
          },
          { id: 'boating', name: 'Boating' },
          { id: 'diving', name: 'Diving & Snorkeling' },
          { id: 'tubing', name: 'Tubing & Towables' },
          { id: 'surfing', name: 'Surfing' },
          { id: 'kayaking', name: 'Kayaking' },
        ],
      },
      {
        id: 'outdoor-sports',
        name: 'Outdoor Sports & Activities Equipment',
        children: [
          { id: 'camping', name: 'Camping & Hiking' },
          { id: 'cycling', name: 'Cycling' },
          { id: 'fishing', name: 'Fishing' },
          { id: 'climbing', name: 'Climbing' },
          { id: 'skateboarding', name: 'Skateboarding' },
          { id: 'hunting', name: 'Hunting' },
          { id: 'archery', name: 'Archery' },
        ],
      },
      {
        id: 'ball-racket',
        name: 'Ball and Racket Sports Equipment',
        children: [
          {
            id: 'golf-racket',
            name: 'Golf',
            children: [
              { id: 'tennis-rackets', name: 'Tennis Rackets' },
              { id: 'tennis-balls', name: 'Tennis Balls' },
              { id: 'tennis-shoes', name: 'Tennis Shoes' },
              { id: 'tennis-apparel', name: 'Tennis Apparel' },
            ],
          },
          {
            id: 'racket-sports',
            name: 'Racket Sports Equipment',
            children: [
              { id: 'tennis', name: 'Tennis' },
              { id: 'table-tennis', name: 'Table Tennis' },
              { id: 'badminton', name: 'Badminton' },
              { id: 'squash', name: 'Squash' },
            ],
          },
          {
            id: 'other-ball-racket',
            name: 'Other Ball & Racket Sports Equipment',
            children: [
              { id: 'football', name: 'Football' },
              { id: 'basketball', name: 'Basketball' },
              { id: 'volleyball', name: 'Volleyball' },
              { id: 'cricket', name: 'Cricket' },
              { id: 'baseball', name: 'Baseball' },
              { id: 'hockey', name: 'Hockey' },
            ],
          },
        ],
      },
      { id: 'sports-accessories', name: 'Sports Accessories' },
      { id: 'boxing', name: 'Boxing and Martial Arts Equipment' },
      { id: 'yoga', name: 'Yoga & Wellness Equipment' },
      { id: 'exercise', name: 'Exercise & Fitness Equipment' },
      { id: 'running', name: 'Running & Jogging' },
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
          {
            id: 'processors',
            name: 'Processors',
            children: [
              { id: 'intel-processors', name: 'Intel Processors' },
              { id: 'amd-processors', name: 'AMD Processors' },
              { id: 'server-processors', name: 'Server Processors' },
            ],
          },
          {
            id: 'motherboards',
            name: 'Motherboards',
            children: [
              { id: 'intel-motherboards', name: 'Intel Motherboards' },
              { id: 'amd-motherboards', name: 'AMD Motherboards' },
              { id: 'gaming-motherboards', name: 'Gaming Motherboards' },
            ],
          },
          {
            id: 'graphics-cards',
            name: 'Graphics Cards',
            children: [
              { id: 'nvidia-cards', name: 'NVIDIA Graphics Cards' },
              { id: 'amd-cards', name: 'AMD Graphics Cards' },
              { id: 'workstation-cards', name: 'Workstation Graphics Cards' },
            ],
          },
          {
            id: 'ram',
            name: 'RAM Memory',
            children: [
              { id: 'ddr4-ram', name: 'DDR4 RAM' },
              { id: 'ddr5-ram', name: 'DDR5 RAM' },
              { id: 'laptop-ram', name: 'Laptop RAM' },
            ],
          },
          {
            id: 'storage',
            name: 'Storage Devices',
            children: [
              { id: 'ssd', name: 'SSD Drives' },
              { id: 'hdd', name: 'HDD Drives' },
              { id: 'external-storage', name: 'External Storage' },
              { id: 'nas', name: 'NAS Storage' },
            ],
          },
          { id: 'power-supply', name: 'Power Supplies' },
          { id: 'cooling', name: 'Cooling Systems' },
          { id: 'cases', name: 'Computer Cases' },
        ],
      },
      {
        id: 'laptops',
        name: 'Laptops',
        children: [
          {
            id: 'gaming-laptops',
            name: 'Gaming Laptops',
            children: [
              { id: 'budget-gaming', name: 'Budget Gaming Laptops' },
              { id: 'mid-range-gaming', name: 'Mid-Range Gaming Laptops' },
              { id: 'high-end-gaming', name: 'High-End Gaming Laptops' },
            ],
          },
          {
            id: 'business-laptops',
            name: 'Business Laptops',
            children: [
              { id: 'thinkpad', name: 'ThinkPad Series' },
              { id: 'latitude', name: 'Latitude Series' },
              { id: 'probook', name: 'ProBook Series' },
            ],
          },
          { id: 'ultrabooks', name: 'Ultrabooks' },
          { id: 'chromebooks', name: 'Chromebooks' },
          { id: '2in1-laptops', name: '2-in-1 Laptops' },
        ],
      },
      {
        id: 'desktops',
        name: 'Desktop Computers',
        children: [
          { id: 'gaming-desktops', name: 'Gaming Desktops' },
          { id: 'workstation-desktops', name: 'Workstation Desktops' },
          { id: 'all-in-one', name: 'All-in-One PCs' },
          { id: 'mini-pcs', name: 'Mini PCs' },
        ],
      },
      {
        id: 'monitors',
        name: 'Monitors',
        children: [
          { id: 'gaming-monitors', name: 'Gaming Monitors' },
          { id: '4k-monitors', name: '4K Monitors' },
          { id: 'ultrawide-monitors', name: 'Ultrawide Monitors' },
          { id: 'portable-monitors', name: 'Portable Monitors' },
        ],
      },
      {
        id: 'keyboards',
        name: 'Keyboards & Mice',
        children: [
          { id: 'mechanical-keyboards', name: 'Mechanical Keyboards' },
          { id: 'gaming-keyboards', name: 'Gaming Keyboards' },
          { id: 'wireless-keyboards', name: 'Wireless Keyboards' },
          { id: 'gaming-mice', name: 'Gaming Mice' },
        ],
      },
      {
        id: 'networking',
        name: 'Networking Equipment',
        children: [
          { id: 'routers', name: 'Routers' },
          { id: 'switches', name: 'Network Switches' },
          { id: 'wifi-extenders', name: 'WiFi Extenders' },
          { id: 'modems', name: 'Modems' },
        ],
      },
      { id: 'cables', name: 'Cables & Adapters' },
    ],
  },
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    children: [
      {
        id: 'kitchen',
        name: 'Kitchen Appliances',
        children: [
          {
            id: 'refrigerators',
            name: 'Refrigerators',
            children: [
              { id: 'top-freezer', name: 'Top Freezer Refrigerators' },
              { id: 'bottom-freezer', name: 'Bottom Freezer Refrigerators' },
              { id: 'side-by-side', name: 'Side-by-Side Refrigerators' },
              { id: 'mini-fridges', name: 'Mini Refrigerators' },
            ],
          },
          {
            id: 'microwaves',
            name: 'Microwaves',
            children: [
              { id: 'countertop-microwaves', name: 'Countertop Microwaves' },
              { id: 'built-in-microwaves', name: 'Built-in Microwaves' },
              { id: 'over-range-microwaves', name: 'Over-the-Range Microwaves' },
            ],
          },
          { id: 'ovens', name: 'Ovens' },
          { id: 'blenders', name: 'Blenders' },
          { id: 'coffee-makers', name: 'Coffee Makers' },
          { id: 'toasters', name: 'Toasters' },
          { id: 'air-fryers', name: 'Air Fryers' },
          { id: 'rice-cookers', name: 'Rice Cookers' },
        ],
      },
      {
        id: 'cleaning',
        name: 'Cleaning Appliances',
        children: [
          { id: 'vacuum-cleaners', name: 'Vacuum Cleaners' },
          { id: 'robot-vacuums', name: 'Robot Vacuums' },
          { id: 'steam-cleaners', name: 'Steam Cleaners' },
          { id: 'carpet-cleaners', name: 'Carpet Cleaners' },
        ],
      },
      {
        id: 'laundry',
        name: 'Laundry Appliances',
        children: [
          { id: 'washing-machines', name: 'Washing Machines' },
          { id: 'dryers', name: 'Dryers' },
          { id: 'washer-dryer-combo', name: 'Washer-Dryer Combos' },
        ],
      },
      {
        id: 'air-treatment',
        name: 'Air Treatment',
        children: [
          { id: 'air-conditioners', name: 'Air Conditioners' },
          { id: 'air-purifiers', name: 'Air Purifiers' },
          { id: 'humidifiers', name: 'Humidifiers' },
          { id: 'dehumidifiers', name: 'Dehumidifiers' },
        ],
      },
      { id: 'water-heaters', name: 'Water Heaters' },
      { id: 'fans', name: 'Fans' },
      { id: 'irons', name: 'Irons & Steamers' },
    ],
  },
  {
    id: 'digital-utilities',
    name: 'Digital Utilities',
    children: [
      {
        id: 'software',
        name: 'Software',
        children: [
          { id: 'operating-systems', name: 'Operating Systems' },
          { id: 'office-software', name: 'Office Software' },
          { id: 'antivirus', name: 'Antivirus Software' },
          { id: 'design-software', name: 'Design Software' },
        ],
      },
      {
        id: 'digital-content',
        name: 'Digital Content',
        children: [
          { id: 'stock-photos', name: 'Stock Photos' },
          { id: 'templates', name: 'Templates' },
          { id: 'fonts', name: 'Fonts' },
        ],
      },
      { id: 'ebooks', name: 'E-books' },
      { id: 'music', name: 'Digital Music' },
      { id: 'games', name: 'Digital Games' },
      { id: 'subscriptions', name: 'Subscriptions' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    children: [
      {
        id: 'home-services',
        name: 'Home Services',
        children: [
          { id: 'cleaning-services', name: 'Cleaning Services' },
          { id: 'plumbing', name: 'Plumbing Services' },
          { id: 'electrical', name: 'Electrical Services' },
          { id: 'painting', name: 'Painting Services' },
        ],
      },
      {
        id: 'professional',
        name: 'Professional Services',
        children: [
          { id: 'accounting', name: 'Accounting Services' },
          { id: 'legal', name: 'Legal Services' },
          { id: 'consulting', name: 'Consulting Services' },
        ],
      },
      { id: 'education', name: 'Education Services' },
      { id: 'health', name: 'Health Services' },
      { id: 'beauty', name: 'Beauty Services' },
      { id: 'repair', name: 'Repair Services' },
    ],
  },
  {
    id: 'printers',
    name: 'Printers & Scanners',
    children: [
      {
        id: 'inkjet',
        name: 'Inkjet Printers',
        children: [
          { id: 'home-inkjet', name: 'Home Inkjet Printers' },
          { id: 'office-inkjet', name: 'Office Inkjet Printers' },
          { id: 'photo-inkjet', name: 'Photo Inkjet Printers' },
        ],
      },
      {
        id: 'laser',
        name: 'Laser Printers',
        children: [
          { id: 'mono-laser', name: 'Monochrome Laser Printers' },
          { id: 'color-laser', name: 'Color Laser Printers' },
          { id: 'multifunction-laser', name: 'Multifunction Laser Printers' },
        ],
      },
      { id: 'scanners', name: 'Scanners' },
      { id: 'printer-ink', name: 'Printer Ink & Toner' },
      { id: '3d-printers', name: '3D Printers' },
      { id: 'photo-printers', name: 'Photo Printers' },
    ],
  },
  {
    id: 'outdoor-garden',
    name: 'Outdoor & Garden',
    children: [
      {
        id: 'gardening',
        name: 'Gardening Tools',
        children: [
          { id: 'hand-tools', name: 'Hand Tools' },
          { id: 'power-tools', name: 'Power Tools' },
          { id: 'watering-equipment', name: 'Watering Equipment' },
          { id: 'seeds-plants', name: 'Seeds & Plants' },
        ],
      },
      {
        id: 'outdoor-furniture',
        name: 'Outdoor Furniture',
        children: [
          { id: 'patio-sets', name: 'Patio Sets' },
          { id: 'outdoor-chairs', name: 'Outdoor Chairs' },
          { id: 'outdoor-tables', name: 'Outdoor Tables' },
          { id: 'hammocks', name: 'Hammocks' },
        ],
      },
      { id: 'grills', name: 'Grills & Outdoor Cooking' },
      { id: 'lawn-care', name: 'Lawn Care' },
      { id: 'pools', name: 'Pools & Accessories' },
      { id: 'outdoor-lighting', name: 'Outdoor Lighting' },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming Devices & Software',
    children: [
      { id: 'consoles', name: 'Gaming Consoles' },
      { id: 'pc-gaming', name: 'PC Gaming' },
      { id: 'gaming-accessories', name: 'Gaming Accessories' },
      { id: 'gaming-chairs', name: 'Gaming Chairs' },
      { id: 'vr-headsets', name: 'VR Headsets' },
      { id: 'game-controllers', name: 'Game Controllers' },
      { id: 'gaming-headsets', name: 'Gaming Headsets' },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    children: [
      {
        id: 'car-parts',
        name: 'Car Parts',
        children: [
          { id: 'engine-parts', name: 'Engine Parts' },
          { id: 'brakes', name: 'Brakes' },
          { id: 'suspension', name: 'Suspension' },
          { id: 'exhaust', name: 'Exhaust Systems' },
        ],
      },
      { id: 'car-accessories', name: 'Car Accessories' },
      { id: 'car-electronics', name: 'Car Electronics' },
      { id: 'motorcycle', name: 'Motorcycle Parts' },
      { id: 'tires', name: 'Tires & Wheels' },
      { id: 'car-care', name: 'Car Care & Cleaning' },
    ],
  },
  {
    id: 'groceries',
    name: 'Groceries',
    children: [
      {
        id: 'food',
        name: 'Food & Beverages',
        children: [
          { id: 'snacks', name: 'Snacks' },
          { id: 'beverages', name: 'Beverages' },
          { id: 'canned-goods', name: 'Canned Goods' },
          { id: 'frozen-foods', name: 'Frozen Foods' },
        ],
      },
      { id: 'household', name: 'Household Supplies' },
      { id: 'pet-supplies', name: 'Pet Supplies' },
      { id: 'baby-products', name: 'Baby Products' },
      { id: 'health-wellness', name: 'Health & Wellness' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories',
    children: [
      {
        id: 'mens-fashion',
        name: "Men's Fashion",
        children: [
          { id: 'mens-shirts', name: 'Shirts' },
          { id: 'mens-pants', name: 'Pants' },
          { id: 'mens-jackets', name: 'Jackets' },
          { id: 'mens-underwear', name: 'Underwear' },
        ],
      },
      {
        id: 'womens-fashion',
        name: "Women's Fashion",
        children: [
          { id: 'womens-dresses', name: 'Dresses' },
          { id: 'womens-tops', name: 'Tops' },
          { id: 'womens-pants', name: 'Pants' },
          { id: 'womens-lingerie', name: 'Lingerie' },
        ],
      },
      { id: 'kids-fashion', name: "Kids' Fashion" },
      { id: 'shoes', name: 'Shoes' },
      { id: 'bags', name: 'Bags & Luggage' },
      { id: 'watches', name: 'Watches' },
      { id: 'jewelry', name: 'Jewelry' },
      { id: 'sunglasses', name: 'Sunglasses' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    children: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        children: [
          { id: 'android-phones', name: 'Android Phones' },
          { id: 'iphones', name: 'iPhones' },
          { id: 'phone-accessories', name: 'Phone Accessories' },
        ],
      },
      { id: 'tablets', name: 'Tablets' },
      {
        id: 'cameras',
        name: 'Cameras',
        children: [
          { id: 'dslr', name: 'DSLR Cameras' },
          { id: 'mirrorless', name: 'Mirrorless Cameras' },
          { id: 'action-cameras', name: 'Action Cameras' },
          { id: 'camera-lenses', name: 'Camera Lenses' },
        ],
      },
      { id: 'audio', name: 'Audio Equipment' },
      { id: 'tv', name: 'Televisions' },
      { id: 'wearables', name: 'Wearable Technology' },
      { id: 'smart-home', name: 'Smart Home Devices' },
      { id: 'drones', name: 'Drones' },
    ],
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    children: [
      {
        id: 'skincare',
        name: 'Skincare',
        children: [
          { id: 'face-cleansers', name: 'Face Cleansers' },
          { id: 'moisturizers', name: 'Moisturizers' },
          { id: 'serums', name: 'Serums' },
          { id: 'sunscreen', name: 'Sunscreen' },
          { id: 'face-masks', name: 'Face Masks' },
        ],
      },
      {
        id: 'makeup',
        name: 'Makeup',
        children: [
          { id: 'foundation', name: 'Foundation' },
          { id: 'lipstick', name: 'Lipstick' },
          { id: 'eyeshadow', name: 'Eyeshadow' },
          { id: 'mascara', name: 'Mascara' },
        ],
      },
      {
        id: 'haircare',
        name: 'Hair Care',
        children: [
          { id: 'shampoo', name: 'Shampoo' },
          { id: 'conditioner', name: 'Conditioner' },
          { id: 'hair-styling', name: 'Hair Styling Products' },
          { id: 'hair-tools', name: 'Hair Tools' },
        ],
      },
      { id: 'fragrances', name: 'Fragrances' },
      { id: 'personal-care', name: 'Personal Care' },
      { id: 'vitamins', name: 'Vitamins & Supplements' },
    ],
  },
  {
    id: 'toys-hobbies',
    name: 'Toys & Hobbies',
    children: [
      {
        id: 'action-figures',
        name: 'Action Figures',
        children: [
          { id: 'superhero-figures', name: 'Superhero Figures' },
          { id: 'anime-figures', name: 'Anime Figures' },
          { id: 'movie-figures', name: 'Movie Figures' },
        ],
      },
      {
        id: 'dolls',
        name: 'Dolls',
        children: [
          { id: 'fashion-dolls', name: 'Fashion Dolls' },
          { id: 'baby-dolls', name: 'Baby Dolls' },
          { id: 'collectible-dolls', name: 'Collectible Dolls' },
        ],
      },
      { id: 'board-games', name: 'Board Games' },
      { id: 'puzzles', name: 'Puzzles' },
      {
        id: 'rc-toys',
        name: 'RC Toys',
        children: [
          { id: 'rc-cars', name: 'RC Cars' },
          { id: 'rc-drones', name: 'RC Drones' },
          { id: 'rc-boats', name: 'RC Boats' },
          { id: 'rc-helicopters', name: 'RC Helicopters' },
        ],
      },
      { id: 'building-toys', name: 'Building Toys' },
      { id: 'arts-crafts', name: 'Arts & Crafts' },
    ],
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    children: [
      {
        id: 'fiction',
        name: 'Fiction Books',
        children: [
          { id: 'mystery', name: 'Mystery & Thriller' },
          { id: 'romance', name: 'Romance' },
          { id: 'sci-fi', name: 'Science Fiction' },
          { id: 'fantasy', name: 'Fantasy' },
        ],
      },
      {
        id: 'non-fiction',
        name: 'Non-Fiction Books',
        children: [
          { id: 'biography', name: 'Biography' },
          { id: 'self-help', name: 'Self-Help' },
          { id: 'history', name: 'History' },
          { id: 'business', name: 'Business' },
        ],
      },
      { id: 'magazines', name: 'Magazines' },
      { id: 'music-cds', name: 'Music CDs' },
      { id: 'movies-dvd', name: 'Movies & DVDs' },
      { id: 'textbooks', name: 'Textbooks' },
    ],
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    children: [
      {
        id: 'furniture',
        name: 'Furniture',
        children: [
          { id: 'living-room', name: 'Living Room Furniture' },
          { id: 'bedroom', name: 'Bedroom Furniture' },
          { id: 'dining-room', name: 'Dining Room Furniture' },
          { id: 'office-furniture', name: 'Office Furniture' },
        ],
      },
      {
        id: 'bedding',
        name: 'Bedding',
        children: [
          { id: 'bed-sheets', name: 'Bed Sheets' },
          { id: 'comforters', name: 'Comforters' },
          { id: 'pillows', name: 'Pillows' },
          { id: 'blankets', name: 'Blankets' },
        ],
      },
      { id: 'home-decor', name: 'Home Decor' },
      {
        id: 'lighting',
        name: 'Lighting',
        children: [
          { id: 'ceiling-lights', name: 'Ceiling Lights' },
          { id: 'table-lamps', name: 'Table Lamps' },
          { id: 'floor-lamps', name: 'Floor Lamps' },
          { id: 'led-lights', name: 'LED Lights' },
        ],
      },
      { id: 'storage', name: 'Storage & Organization' },
      { id: 'kitchenware', name: 'Kitchenware' },
      { id: 'bathroom', name: 'Bathroom Accessories' },
    ],
  },
];

interface CategorySelectorProps {
  onSelect: (path: string) => void;
  onClose: () => void;
  inline?: boolean;
}

export default function CategorySelector({ onSelect, onClose, inline = false }: CategorySelectorProps) {
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

  // Inline version
  if (inline) {
    return (
      <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white max-w-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Recently used:</span>
            <button className="text-sm text-blue-600 hover:underline">Gaming Chairs</button>
          </div>
        </div>

        {/* Miller Columns - Fixed width container for 4 columns */}
        <div className="border border-gray-200 rounded" style={{ height: '400px' }}>
          <div className="grid grid-cols-4 h-full">
            {[0, 1, 2, 3].map((columnIndex) => {
              const column = filteredColumns[columnIndex];
              const hasContent = column && column.length > 0;
              
              return (
                <div 
                  key={columnIndex} 
                  className="border-r border-gray-200 last:border-r-0 flex flex-col overflow-hidden"
                >
                  {hasContent ? (
                    <>
                      {/* Sticky Filter */}
                      <div className="bg-gray-50 p-2 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            value={filters[columnIndex] || ''}
                            onChange={(e) => handleFilterChange(e.target.value, columnIndex)}
                            placeholder="Filter..."
                            className="w-full px-3 py-1.5 pl-8 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          />
                          <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between group ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="truncate text-sm">{category.name}</span>
                              {category.children && (
                                <svg className={`w-3 h-3 flex-shrink-0 ml-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    // Empty column placeholder
                    <div className="bg-white h-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-1 min-w-0">
              <span className="flex-shrink-0">Current selection:</span>
              <span className="text-gray-700 truncate">
                {breadcrumb || '--'}
              </span>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedPath.length === 0}
              className={`px-5 py-2 rounded text-sm ${
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
    );
  }

  // Modal version
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
