'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CategorySelector from '@/components/seller/CategorySelector';

export default function AddProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showExpandedForm, setShowExpandedForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [showSpecialPriceModal, setShowSpecialPriceModal] = useState(false);
  const [specialPrice, setSpecialPrice] = useState('');
  const [showPromotionDate, setShowPromotionDate] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [showMoreWarranty, setShowMoreWarranty] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [submittedProduct, setSubmittedProduct] = useState<any>(null);
  const [storageUsage, setStorageUsage] = useState(0);

  // Monitor storage usage
  useEffect(() => {
    const updateStorageUsage = () => {
      try {
        const products = localStorage.getItem('products') || '[]';
        const orders = localStorage.getItem('orders') || '[]';
        const totalSize = products.length + orders.length;
        const maxSize = 5 * 1024 * 1024; // 5MB typical localStorage limit
        const usage = (totalSize / maxSize) * 100;
        setStorageUsage(Math.min(usage, 100));
      } catch (error) {
        console.error('Failed to calculate storage usage:', error);
      }
    };

    updateStorageUsage();
    
    // Update storage usage when products change
    const interval = setInterval(updateStorageUsage, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Form fields
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sellerSKU, setSellerSKU] = useState('');
  const [description, setDescription] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [promotionImage, setPromotionImage] = useState<string>('');
  
  // Variation system
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const [currentVariation, setCurrentVariation] = useState({ name: '', options: [''] });

  // Storage cleanup utility
  const cleanupStorage = () => {
    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Keep only last 50 products and 100 orders to prevent storage overflow
      const recentProducts = products.slice(-50);
      const recentOrders = orders.slice(-100);
      
      localStorage.setItem('products', JSON.stringify(recentProducts));
      localStorage.setItem('orders', JSON.stringify(recentOrders));
      
      console.log('Storage cleaned up successfully');
    } catch (error) {
      console.error('Storage cleanup failed:', error);
    }
  };

  // Compress image to reduce size
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Image upload handlers with compression
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'promotion') => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        // Check file size and compress if needed
        const maxSize = 500 * 1024; // 500KB limit per image
        let imageData: string;
        
        if (file.size > maxSize) {
          // Compress the image
          imageData = await compressImage(file, 600, 0.6);
        } else {
          // Use original if small enough
          imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }
        
        if (type === 'product') {
          // Limit to 3 product images to save space
          setProductImages(prev => {
            const newImages = [...prev, imageData];
            return newImages.slice(0, 3);
          });
        } else {
          setPromotionImage(imageData);
        }
        
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try a smaller image.');
      }
    }
  };

  const removeProductImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    try {
      // Create product object with optimized images
      const newProduct = {
        id: Date.now().toString(),
        name: productName,
        category: selectedCategory,
        brand: brand || 'No Brand',
        price: price || '0',
        specialPrice: specialPrice || '',
        stock: stock || '0',
        sellerSKU: sellerSKU || '',
        description: description || 'No description',
        packageWeight: packageWeight || '0',
        variations: variations,
        volume: variations.find(v => v.name.toLowerCase().includes('size') || v.name.toLowerCase().includes('volume'))?.options[0] || '50',
        status: 'active',
        createdAt: new Date().toISOString(),
        image: productImages[0] || '/images/product-placeholder.png',
        images: productImages.slice(0, 3), // Limit to 3 images to save space
        promotionImage: promotionImage || ''
      };

      // Get existing products from localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Check storage size and clean up if needed
      const currentSize = JSON.stringify(existingProducts).length;
      const newProductSize = JSON.stringify(newProduct).length;
      const maxSize = 4 * 1024 * 1024; // 4MB limit (leaving room for other data)
      
      // If adding this product would exceed storage, remove oldest products
      if (currentSize + newProductSize > maxSize) {
        // Sort by creation date and keep only the most recent products
        const sortedProducts = existingProducts.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Keep removing oldest products until we have enough space
        while (sortedProducts.length > 0 && 
               JSON.stringify(sortedProducts).length + newProductSize > maxSize) {
          sortedProducts.pop(); // Remove oldest product
        }
        
        // Update existing products array
        existingProducts.length = 0;
        existingProducts.push(...sortedProducts);
      }
      
      // Add new product
      existingProducts.push(newProduct);
      
      // Save to localStorage with error handling
      localStorage.setItem('products', JSON.stringify(existingProducts));

      // Set submitted product and show success page
      setSubmittedProduct(newProduct);
      setShowSuccessPage(true);
      
    } catch (error) {
      console.error('Failed to save product:', error);
      
      // If still failing, try with minimal data (no images)
      try {
        const minimalProduct = {
          id: Date.now().toString(),
          name: productName,
          category: selectedCategory,
          brand: brand || 'No Brand',
          price: price || '0',
          specialPrice: specialPrice || '',
          stock: stock || '0',
          sellerSKU: sellerSKU || '',
          description: description || 'No description',
          packageWeight: packageWeight || '0',
          variations: variations,
          volume: variations.find(v => v.name.toLowerCase().includes('size') || v.name.toLowerCase().includes('volume'))?.options[0] || '50',
          status: 'active',
          createdAt: new Date().toISOString(),
          image: '/images/product-placeholder.png', // Use placeholder instead of base64
          images: [], // No images to save space
          promotionImage: ''
        };
        
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        existingProducts.push(minimalProduct);
        localStorage.setItem('products', JSON.stringify(existingProducts));
        
        setSubmittedProduct(minimalProduct);
        setShowSuccessPage(true);
        
        alert('Product saved successfully, but images were not saved due to storage limitations. Consider using smaller images or fewer products.');
        
      } catch (finalError) {
        console.error('Final save attempt failed:', finalError);
        alert('Failed to save product due to storage limitations. Please try clearing some data or using smaller images.');
      }
    }
  };

  const handleSaveDraft = () => {
    try {
      // Create draft product object with optimized images
      const draftProduct = {
        id: Date.now().toString(),
        name: productName,
        category: selectedCategory,
        brand: brand || 'No Brand',
        price: price || '0',
        specialPrice: specialPrice || '',
        stock: stock || '0',
        sellerSKU: sellerSKU || '',
        description: description || 'No description',
        packageWeight: packageWeight || '0',
        variations: variations,
        volume: variations.find(v => v.name.toLowerCase().includes('size') || v.name.toLowerCase().includes('volume'))?.options[0] || '50',
        status: 'draft',
        createdAt: new Date().toISOString(),
        image: productImages[0] || '/images/product-placeholder.png',
        images: productImages.slice(0, 3), // Limit to 3 images
        promotionImage: promotionImage || ''
      };

      // Get existing products from localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Check storage size and clean up if needed
      const currentSize = JSON.stringify(existingProducts).length;
      const newProductSize = JSON.stringify(draftProduct).length;
      const maxSize = 4 * 1024 * 1024; // 4MB limit
      
      // If adding this product would exceed storage, remove oldest products
      if (currentSize + newProductSize > maxSize) {
        const sortedProducts = existingProducts.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        while (sortedProducts.length > 0 && 
               JSON.stringify(sortedProducts).length + newProductSize > maxSize) {
          sortedProducts.pop();
        }
        
        existingProducts.length = 0;
        existingProducts.push(...sortedProducts);
      }
      
      // Add draft product
      existingProducts.push(draftProduct);
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(existingProducts));

      // Redirect to manage products
      router.push('/seller-dashboard/manage-products');
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      
      // Try with minimal data
      try {
        const minimalDraft = {
          id: Date.now().toString(),
          name: productName,
          category: selectedCategory,
          brand: brand || 'No Brand',
          price: price || '0',
          specialPrice: specialPrice || '',
          stock: stock || '0',
          sellerSKU: sellerSKU || '',
          description: description || 'No description',
          packageWeight: packageWeight || '0',
          variations: variations,
          volume: variations.find(v => v.name.toLowerCase().includes('size') || v.name.toLowerCase().includes('volume'))?.options[0] || '50',
          status: 'draft',
          createdAt: new Date().toISOString(),
          image: '/images/product-placeholder.png',
          images: [],
          promotionImage: ''
        };
        
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        existingProducts.push(minimalDraft);
        localStorage.setItem('products', JSON.stringify(existingProducts));
        
        alert('Draft saved successfully, but images were not saved due to storage limitations.');
        router.push('/seller-dashboard/manage-products');
        
      } catch (finalError) {
        console.error('Final draft save failed:', finalError);
        alert('Failed to save draft due to storage limitations. Please try clearing some data.');
      }
    }
  };

  // Refs for each section
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const productSpecRef = useRef<HTMLDivElement>(null);
  const priceStockRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  // Scroll spy effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = [
      basicInfoRef.current,
      productSpecRef.current,
      priceStockRef.current,
      descriptionRef.current,
      shippingRef.current,
    ];

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [showExpandedForm]);

  // Success Page Component
  const SuccessPage = () => (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/seller-dashboard" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <Link href="/seller-dashboard/manage-products" className="text-gray-500 hover:text-blue-600">
              Products
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-700 font-medium">Product Uploaded</span>
          </div>
        </div>

        {/* Success Content */}
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your product has been uploaded but not yet visible on Lazada.
              </h2>
              <p className="text-gray-600">
                Please <Link href="#" className="text-blue-600 hover:underline">add address</Link> to make it visible to buyers
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border">
                  {submittedProduct?.images?.[0] ? (
                    <img 
                      src={submittedProduct.images[0]} 
                      alt={submittedProduct.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2GO</div>
                      <div className="text-xs text-gray-500">EXPRESS</div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    "{submittedProduct?.name || 'DIGITAL CAMERA AUTO BUY'}"
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Category: {submittedProduct?.category || 'Electronics'}</span>
                    <span>Price: ₱{submittedProduct?.price || '0'}</span>
                    <span>Stock: {submittedProduct?.stock || '0'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">To be Improved</span>
                  <div className="flex items-center gap-1">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">60</span>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                  Optimize Now
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Some content are under review and it may take up to 2 days to update the product listing.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowSuccessPage(false);
                    // Reset form
                    setProductName('');
                    setSelectedCategory('');
                    setBrand('');
                    setPrice('');
                    setStock('');
                    setSellerSKU('');
                    setDescription('');
                    setPackageWeight('');
                    setVariations([]);
                    setProductImages([]);
                    setPromotionImage('');
                    setSpecialPrice('');
                    setSubmittedProduct(null);
                  }}
                  className="px-6 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  Add New Product
                </button>
                <Link 
                  href="/seller-dashboard/manage-products"
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Manage Product
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Optimizer */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Product Optimizer</h3>
                  <p className="text-sm text-gray-600">Optimize 1 Products to Improve Store Listing Quality.</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Optimize
              </button>
            </div>

            {/* Boost Traffic */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Boost Traffic and Sales</h3>
                  <p className="text-sm text-gray-600">Sponsored Search & Sponsored Affiliate</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Boost your search ranking on Lazada by paying per product click.
                Promote product through Lazada's network of affiliate by paying per product sold.
              </div>
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

  // Variation Modal Component
  const VariationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Product Variation</h3>
            <button 
              onClick={() => {
                setShowVariationModal(false);
                setCurrentVariation({ name: '', options: [''] });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variation Name
            </label>
            <select 
              value={currentVariation.name}
              onChange={(e) => setCurrentVariation(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="" className="text-gray-500">Select variation type</option>
              <option value="Size" className="text-gray-900">Size</option>
              <option value="Color" className="text-gray-900">Color</option>
              <option value="Volume" className="text-gray-900">Volume</option>
              <option value="Material" className="text-gray-900">Material</option>
              <option value="Style" className="text-gray-900">Style</option>
              <option value="Capacity" className="text-gray-900">Capacity</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variation Options
            </label>
            {currentVariation.options.map((option, index) => (
              <div key={`option-${index}`} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentVariation.options];
                    newOptions[index] = e.target.value;
                    setCurrentVariation(prev => ({ ...prev, options: newOptions }));
                  }}
                  placeholder={`${currentVariation.name || 'Option'} ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  autoComplete="off"
                />
                {currentVariation.options.length > 1 && (
                  <button
                    onClick={() => {
                      const newOptions = currentVariation.options.filter((_, i) => i !== index);
                      setCurrentVariation(prev => ({ ...prev, options: newOptions }));
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            {currentVariation.options.length < 5 && (
              <button
                onClick={() => {
                  setCurrentVariation(prev => ({ 
                    ...prev, 
                    options: [...prev.options, ''] 
                  }));
                }}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowVariationModal(false);
                setCurrentVariation({ name: '', options: [''] });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (currentVariation.name && currentVariation.options.some(opt => opt.trim())) {
                  const validOptions = currentVariation.options.filter(opt => opt.trim());
                  setVariations([...variations, { ...currentVariation, options: validOptions }]);
                  setShowVariationModal(false);
                  setCurrentVariation({ name: '', options: [''] });
                }
              }}
              disabled={!currentVariation.name || !currentVariation.options.some(opt => opt.trim())}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Variation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Show success page if product was submitted
  if (showSuccessPage) {
    return <SuccessPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              {/* Animated Truck */}
              <div className="relative inline-block">
                <svg className="w-24 h-24 animate-bounce" viewBox="0 0 64 64" fill="none">
                  {/* Truck body */}
                  <rect x="8" y="24" width="32" height="16" fill="#4F46E5" rx="2"/>
                  <rect x="32" y="28" width="16" height="12" fill="#6366F1" rx="1"/>
                  {/* Wheels */}
                  <circle cx="16" cy="44" r="4" fill="#1F2937"/>
                  <circle cx="16" cy="44" r="2" fill="#9CA3AF"/>
                  <circle cx="40" cy="44" r="4" fill="#1F2937"/>
                  <circle cx="40" cy="44" r="2" fill="#9CA3AF"/>
                  {/* Speed lines */}
                  <line x1="2" y1="28" x2="6" y2="28" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="0" y1="32" x2="5" y2="32" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="2" y1="36" x2="6" y2="36" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-lg">Loading product form...</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/seller-dashboard" className="text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">&gt;</span>
            <Link href="/seller-dashboard/manage-products" className="text-gray-500 hover:text-blue-600">
              Manage Products
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-700 font-medium">Add Product</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="flex gap-8">
            {/* Left Side - Form */}
            <div className="flex-1 bg-white rounded-lg shadow p-6">
              <h2 ref={basicInfoRef} id="basic-info" className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

              {/* Product Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex. Nikon Coolpix A300 Digital Camera"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  maxLength={255}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {productName.length}/255
                </div>
              </div>

              {/* Category */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedCategory}
                    readOnly
                    placeholder="Sports & Outdoors Activities Equipment > Water Sports Equipment > Swimming > Accessories"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm cursor-pointer"
                    onClick={() => setShowCategoryModal(!showCategoryModal)}
                  />
                  <button
                    onClick={() => setShowCategoryModal(!showCategoryModal)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryModal ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {selectedCategory && (
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-gray-600">Recently used:</span>
                    <button className="text-xs text-blue-600 hover:underline">Accessories</button>
                    <button className="text-xs text-blue-600 hover:underline">PC Case</button>
                    <button className="text-xs text-blue-600 hover:underline">Gaming Chairs</button>
                  </div>
                )}

                {/* Inline Category Selector - Absolutely positioned overlay */}
                {showCategoryModal && (
                  <div className="absolute left-0 right-0 z-50" style={{ top: '100%' }}>
                    <CategorySelector
                      onSelect={(path) => {
                        setSelectedCategory(path);
                        setShowCategoryModal(false);
                        setIsLoading(true);
                        // Show loading animation, then show expanded form
                        setTimeout(() => {
                          setIsLoading(false);
                          setShowExpandedForm(true);
                        }, 2000); // 2 second loading animation
                      }}
                      onClose={() => setShowCategoryModal(false)}
                      inline={true}
                    />
                  </div>
                )}
              </div>

              {/* Show expanded fields only after category is selected */}
              {showExpandedForm && (
                <>
                  {/* Product Images */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                      <span className="ml-1 text-gray-400 cursor-help">ⓘ</span>
                    </label>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'product')}
                        className="hidden"
                        id="product-images"
                        multiple
                      />
                      <label htmlFor="product-images" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm text-gray-600">Click to upload images</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                    </div>

                    {/* Image Preview */}
                    {productImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({productImages.length})</p>
                        <div className="grid grid-cols-4 gap-3">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => removeProductImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                  Main
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buyer Promotion Image */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buyer Promotion Image
                      <span className="ml-1 text-gray-400 cursor-help">ⓘ</span>
                    </label>
                    
                    {!promotionImage ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'promotion')}
                          className="hidden"
                          id="promotion-image"
                        />
                        <label htmlFor="promotion-image" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-sm text-gray-600 mb-1">White Background Image</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={promotionImage}
                          alt="Promotion"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => setPromotionImage('')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video
                      <span className="ml-1 text-gray-400 cursor-help">ⓘ</span>
                    </label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center">
                        <input type="radio" name="videoType" value="upload" defaultChecked className="mr-2" />
                        <span className="text-sm text-gray-700">Upload Video</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="videoType" value="media" className="mr-2" />
                        <span className="text-sm text-gray-700">Media Center</span>
                      </label>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <ul className="text-xs text-gray-500 text-left mt-2">
                          <li>• Min size: 480x480 px, max video length: 60 seconds, max file size: 100MB.</li>
                          <li>• Supported Format: mp4</li>
                          <li>• New Video might take up to 36 hrs to be approved</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Product Specification */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 ref={productSpecRef} id="product-spec" className="text-lg font-semibold text-gray-900">Product Specification</h3>
                      <span className="text-sm text-gray-500">Fill Rate: <span className="font-medium">0%</span></span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Filling in attributes will increase product searchability, driving sales conversion.
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Spot a missing attribute or attribute value? <button className="text-blue-600 hover:underline">Click me</button>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Brand */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-red-500">*</span> Brand
                        </label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="Type to search brand..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Water Sports Equipment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Water Sports Equipment
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">KEY</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Please Input or select option"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      {/* Additional fields shown when expanded */}
                      {showMoreSpecs && (
                        <>
                          {/* Model */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Model
                            </label>
                            <input
                              type="text"
                              placeholder="Input here"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                          </div>

                          {/* Place of Origin */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Place of Origin
                            </label>
                            <input
                              type="text"
                              placeholder="Please Input or select option"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                          </div>

                          {/* Condition */}
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              condition
                            </label>
                            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option>Select</option>
                              <option>New</option>
                              <option>Used</option>
                              <option>Refurbished</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <button 
                      onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      {showMoreSpecs ? 'Show Less' : 'Show More'}
                      <svg 
                        className={`w-4 h-4 transition-transform ${showMoreSpecs ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Price, Stock & Variants */}
                  <div className="mb-6">
                    <h3 ref={priceStockRef} id="price-stock" className="text-lg font-semibold text-gray-900 mb-2">Price, Stock & Variants</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      You can add variants to a product that has more than one option, such as size or color
                    </p>

                    <button 
                      onClick={() => setShowVariationModal(true)}
                      className="mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Variation({variations.length}/2)
                    </button>

                    {/* Display existing variations */}
                    {variations.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {variations.map((variation, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{variation.name}</span>
                              <button 
                                onClick={() => {
                                  const newVariations = variations.filter((_, i) => i !== index);
                                  setVariations(newVariations);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {variation.options.map((option: string, optIndex: number) => (
                                <span key={optIndex} className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-900">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        <span className="text-red-500">*</span> Price & Stock
                      </h4>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-5 gap-4 mb-3">
                          <div className="text-center">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              <span className="text-red-500">*</span> Price
                            </label>
                          </div>
                          <div className="text-center">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Special Price
                            </label>
                          </div>
                          <div className="text-center">
                            <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center justify-center gap-1">
                              Stock
                              <span className="text-gray-400 cursor-help">ⓘ</span>
                            </label>
                          </div>
                          <div className="text-center">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              SellerSKU
                            </label>
                          </div>
                          <div className="text-center">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Availability
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-4 items-center relative">
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                              <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                              />
                            </div>
                          </div>
                          <div className="text-center relative">
                            {specialPrice ? (
                              <div className="text-sm text-gray-700">₱{specialPrice}</div>
                            ) : (
                              <button 
                                onClick={() => setShowSpecialPriceModal(!showSpecialPriceModal)}
                                className="text-blue-600 text-sm hover:underline"
                              >
                                Add
                              </button>
                            )}

                            {/* Inline Special Price Form */}
                            {showSpecialPriceModal && (
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 w-64">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Special Price</h4>
                                
                                <div className="mb-3">
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                    <input
                                      type="text"
                                      value={specialPrice}
                                      onChange={(e) => setSpecialPrice(e.target.value)}
                                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                    />
                                  </div>
                                </div>

                                <p className="text-xs text-gray-500 mb-3">Sales Price for a Product for Promotion</p>

                                {showPromotionDate && (
                                  <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Promotion Date
                                    </label>
                                    <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-400 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between text-sm">
                                      <span>Set Promotion Date</span>
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </div>
                                )}

                                <button 
                                  onClick={() => setShowPromotionDate(!showPromotionDate)}
                                  className="text-blue-600 text-xs hover:underline mb-3 flex items-center gap-1"
                                >
                                  {showPromotionDate ? 'Show Less' : 'Show More'}
                                  <svg 
                                    className={`w-3 h-3 transition-transform ${showPromotionDate ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setShowSpecialPriceModal(false)}
                                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  >
                                    OK
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowSpecialPriceModal(false);
                                      setSpecialPrice('');
                                    }}
                                    className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              value={stock}
                              onChange={(e) => setStock(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                          </div>
                          <div>
                            <div className="relative">
                              <input
                                type="text"
                                value={sellerSKU}
                                onChange={(e) => setSellerSKU(e.target.value)}
                                placeholder="Seller SKU"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{sellerSKU.length}/200</span>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="mb-6">
                    <h3 ref={descriptionRef} id="description" className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Description
                      </label>
                      
                      {/* Rich Text Editor Toolbar */}
                      <div className="border border-gray-300 rounded-t-lg bg-white">
                        <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                          {/* Font Size */}
                          <select className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900">
                            <option>11</option>
                            <option>12</option>
                            <option>14</option>
                            <option>16</option>
                            <option>18</option>
                          </select>

                          <div className="w-px h-6 bg-gray-300"></div>

                          {/* Text Alignment */}
                          <button className="p-1.5 hover:bg-gray-100 rounded" title="Align Left">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                            </svg>
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded" title="Align Center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded" title="Align Right">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                            </svg>
                          </button>

                          <div className="w-px h-6 bg-gray-300"></div>

                          {/* Lists */}
                          <button className="p-1.5 hover:bg-gray-100 rounded" title="Bullet List">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded" title="Numbered List">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>

                          <div className="w-px h-6 bg-gray-300"></div>

                          {/* Image */}
                          <button className="p-1.5 hover:bg-gray-100 rounded" title="Insert Image">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>

                          <div className="flex-1"></div>

                          {/* Advanced Mode & Preview */}
                          <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Try NEW Advanced Mode
                          </button>
                          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300">
                            Preview
                          </button>
                        </div>

                        {/* Text Area */}
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Please input"
                          className="w-full px-4 py-3 min-h-[300px] focus:outline-none text-gray-900 resize-none"
                        ></textarea>
                      </div>
                    </div>

                    {/* Additional Description Fields */}
                    {showMoreDescription && (
                      <>
                        {/* Product Highlights */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Highlights
                          </label>
                          
                          <div className="border border-gray-300 rounded-lg bg-white">
                            <div className="p-2 border-b border-gray-200">
                              <button className="p-1.5 hover:bg-gray-100 rounded" title="Bullet List">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                              </button>
                            </div>
                            <textarea
                              placeholder="Please input"
                              className="w-full px-4 py-3 min-h-[200px] focus:outline-none text-gray-900 resize-none"
                            ></textarea>
                          </div>
                        </div>

                        {/* What's in the box */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What's in the box
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          />
                        </div>
                      </>
                    )}

                    <button 
                      onClick={() => setShowMoreDescription(!showMoreDescription)}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      {showMoreDescription ? 'Show Less' : 'Show More'}
                      <svg 
                        className={`w-4 h-4 transition-transform ${showMoreDescription ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Shipping & Warranty */}
                  <div className="mb-6">
                    <h3 ref={shippingRef} id="shipping" className="text-lg font-semibold text-gray-900 mb-2">Shipping & Warranty</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Switch to enter different package dimensions & weight for variations
                    </p>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-3 mb-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm text-gray-600">
                        Switch on if you need different dimension & weight for different product variants
                      </span>
                    </div>

                    {/* Package Weight */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Package Weight
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={packageWeight}
                          onChange={(e) => setPackageWeight(e.target.value)}
                          placeholder="0.001~300"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>kg</option>
                          <option>g</option>
                          <option>lb</option>
                        </select>
                      </div>
                    </div>



                    {/* Package Dimensions */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Package Length(cm) * Width(cm) * Height(cm)
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        How to measure my package dimensions? <button className="text-blue-600 hover:underline">View Example</button>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="0.01~300"
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="0.01~300"
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="0.01~300"
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Dangerous Goods */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Dangerous Goods
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="dangerousGoods" value="none" defaultChecked className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">None</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="dangerousGoods" value="contains" className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Contains battery / flammables / liquid</span>
                        </label>
                      </div>
                    </div>

                    {/* Additional Warranty Fields */}
                    {showMoreWarranty && (
                      <>
                        {/* Warranty Type */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty Type
                          </label>
                          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Select</option>
                            <option>Local Supplier Warranty</option>
                            <option>International Manufacturer Warranty</option>
                            <option>International Seller Warranty</option>
                            <option>No Warranty</option>
                          </select>
                        </div>

                        {/* Warranty */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty
                          </label>
                          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Select</option>
                            <option>1 Month</option>
                            <option>3 Months</option>
                            <option>6 Months</option>
                            <option>1 Year</option>
                            <option>2 Years</option>
                          </select>
                        </div>

                        {/* Warranty Policy */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Warranty Policy
                          </label>
                          <input
                            type="text"
                            placeholder="Enter warranty policy details"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          />
                        </div>

                        {/* Return Policy */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Policy
                          </label>
                          <input
                            type="text"
                            placeholder="Enter return policy details"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          />
                        </div>
                      </>
                    )}

                    {/* More Warranty Settings */}
                    <button 
                      onClick={() => setShowMoreWarranty(!showMoreWarranty)}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      {showMoreWarranty ? 'Show Less' : 'More Warranty Settings'}
                      <svg 
                        className={`w-4 h-4 transition-transform ${showMoreWarranty ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Side - Content Score & Tips */}
            <div className="w-80 space-y-6 sticky top-8 self-start">
              {showExpandedForm ? (
                /* Content Score - Show after category is selected */
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">Content Score</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-red-500">0</div>
                    <div className="text-xs text-red-500">Poor</div>
                  </div>

                  {/* Progress Items */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => basicInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                          activeSection === 'basic-info' 
                            ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
                            : 'border-gray-300'
                        }`}>
                          {activeSection === 'basic-info' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${
                          activeSection === 'basic-info' ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}>Basic Information</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${
                        activeSection === 'basic-info' ? 'rotate-180' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeSection === 'basic-info' && (
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span>Add min 3 main images</span>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => productSpecRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                          activeSection === 'product-spec' 
                            ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
                            : 'border-gray-300'
                        }`}>
                          {activeSection === 'product-spec' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${
                          activeSection === 'product-spec' ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}>Product Specification</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${
                        activeSection === 'product-spec' ? 'rotate-180' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeSection === 'product-spec' && (
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span>Fill mandatory attributes</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span>Fill attributes in key product information</span>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => priceStockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                          activeSection === 'price-stock' 
                            ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
                            : 'border-gray-300'
                        }`}>
                          {activeSection === 'price-stock' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${
                          activeSection === 'price-stock' ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}>Price, Stock & Variants</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <button 
                      onClick={() => descriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                          activeSection === 'description' 
                            ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
                            : 'border-gray-300'
                        }`}>
                          {activeSection === 'description' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${
                          activeSection === 'description' ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}>Product Description</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${
                        activeSection === 'description' ? 'rotate-180' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeSection === 'description' && (
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span>Add min 1 image in description</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span>Add min 30 words in description</span>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => shippingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                          activeSection === 'shipping' 
                            ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
                            : 'border-gray-300'
                        }`}>
                          {activeSection === 'shipping' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${
                          activeSection === 'shipping' ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}>Shipping & Warranty</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* Tips - Show only before category is selected */
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-blue-600 mb-3">Tips</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Please make sure to upload product image(s), fill product name, and select the correct category to publish a product.
                  </p>
                </div>
              )}

              {/* Product Description Tips - Show after category is selected */}
              {showExpandedForm && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-4">Product Description</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Please make sure to upload product images(s), fill product name, and select the correct category to publish a product.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button Section - Sticky */}
          {showExpandedForm && (
            <div className="sticky bottom-0 px-0 pb-8 bg-gray-50 z-10">
              <div className="flex gap-8">
                <div className="flex-1 mt-4 bg-white rounded-lg shadow p-6">
                  <div className="flex justify-end gap-3">
                    {productName && (
                      <button 
                        onClick={handleSaveDraft}
                        className="px-4 py-2 text-sm bg-white text-blue-600 border border-blue-600 rounded font-medium hover:bg-blue-50 transition-colors"
                      >
                        Save Draft
                      </button>
                    )}
                    <button 
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="w-80"></div>
              </div>
            </div>
          )}
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

      {/* Variation Modal */}
      {showVariationModal && <VariationModal />}
    </div>
  );
}
