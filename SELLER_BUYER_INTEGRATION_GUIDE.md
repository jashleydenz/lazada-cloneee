# Seller-Buyer Integration Guide

This document outlines the complete data flow and integration between the seller dashboard and buyer interface in the Lazada clone application. Currently implemented using localStorage, this guide serves as a blueprint for backend API implementation.

## Table of Contents
1. [Data Models](#data-models)
2. [Product Management Flow](#product-management-flow)
3. [Order Management Flow](#order-management-flow)
4. [Finance Integration](#finance-integration)
5. [Storage Keys](#storage-keys)
6. [API Endpoints Needed](#api-endpoints-needed)
7. [Real-time Updates](#real-time-updates)

## Data Models

### Product Model
```javascript
{
  id: string,                    // Unique identifier
  name: string,                  // Product name
  description: string,           // Product description
  price: number,                 // Current price
  originalPrice?: number,        // Original price (for discounts)
  discount?: number,             // Discount percentage
  category: string,              // Product category
  brand: string,                 // Product brand
  stock: number,                 // Available quantity
  sku: string,                   // Stock keeping unit
  weight: number,                // Product weight
  image: string,                 // Main product image (base64)
  images: string[],              // Additional images (base64)
  promotionImage?: string,       // Promotion banner image
  variations?: {                 // Product variations
    type: string,                // Size, Color, Volume, etc.
    options: string[]            // Available options
  }[],
  status: 'active' | 'draft',    // Product status
  sellerId: string,              // Seller identifier
  createdAt: string,             // Creation timestamp
  updatedAt: string              // Last update timestamp
}
```

### Order Model
```javascript
{
  id: string,                    // Unique order identifier
  customerId: string,            // Buyer identifier
  sellerId: string,              // Seller identifier
  items: [{
    productId: string,           // Product reference
    productName: string,         // Product name snapshot
    productImage: string,        // Product image snapshot
    price: number,               // Price at time of order
    quantity: number,            // Ordered quantity
    variations?: {               // Selected variations
      type: string,
      value: string
    }[]
  }],
  totalAmount: number,           // Total order value
  status: 'to-pay' | 'to-ship' | 'to-receive' | 'completed' | 'cancelled' | 'refund',
  paymentMethod: 'online' | 'cod', // Payment method
  shippingAddress: {
    name: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string
  },
  createdAt: string,             // Order creation time
  updatedAt: string,             // Last status update
  completedAt?: string           // Completion timestamp
}
```

### Cart Model
```javascript
{
  items: [{
    productId: string,
    quantity: number,
    variations?: {
      type: string,
      value: string
    }[]
  }],
  totalItems: number,
  totalAmount: number
}
```

## Product Management Flow

### 1. Product Creation (Seller Side)
**File**: `src/app/(seller)/seller-dashboard/add-product/page.tsx`

**Process**:
1. Seller fills product form with details, images, and variations
2. Images are converted to base64 for storage
3. Product is saved with status 'active' or 'draft'
4. Success page is shown with product preview

**Storage**: 
- Key: `products` (array of all products)
- Only 'active' products are visible to buyers

**Backend Equivalent**:
```
POST /api/products
- Validate seller authentication
- Process image uploads to cloud storage
- Save product to database
- Return product ID and success status
```

### 2. Product Display (Buyer Side)
**Files**: 
- `src/app/(buyer)/page.tsx` (homepage)
- `src/app/(buyer)/products/page.tsx` (products listing)
- `src/components/ProductCard.tsx` (product cards)

**Process**:
1. Load products from localStorage
2. Filter only 'active' status products
3. Display in product cards with pricing, images, badges
4. Show LazMall, TOP, Voucher badges based on category/discount

**Backend Equivalent**:
```
GET /api/products?status=active&page=1&limit=20
- Return paginated active products
- Include seller information
- Calculate badges server-side
```

### 3. Product Details (Buyer Side)
**File**: `src/app/(buyer)/products/[productId]/page.tsx`

**Process**:
1. Load specific product by ID from localStorage
2. Display full product information with variations
3. Handle variation selection
4. Show delivery options and return policy

**Backend Equivalent**:
```
GET /api/products/:productId
- Return full product details
- Include seller information
- Return related products
```

## Order Management Flow

### 1. Add to Cart (Buyer Side)
**Files**: 
- `src/store/index.ts` (cart store)
- `src/app/(buyer)/products/[productId]/page.tsx`

**Process**:
1. Add product with selected variations to cart
2. Update cart count in header
3. Persist cart to localStorage
4. Calculate totals automatically

**Backend Equivalent**:
```
POST /api/cart/items
- Validate product availability
- Check stock levels
- Update user's cart in database
```

### 2. Checkout Process (Buyer Side)
**File**: `src/app/(buyer)/cart/page.tsx`

**Process**:
1. Display cart items with quantities
2. Collect shipping address
3. Select payment method (Online Payment/COD)
4. Create order with appropriate initial status:
   - COD orders: start with 'to-ship'
   - Online Payment: start with 'to-pay'
5. Clear cart after successful order
6. Trigger real-time update to seller dashboard

**Backend Equivalent**:
```
POST /api/orders
- Validate cart items and stock
- Process payment if online
- Create order record
- Send notifications to seller
- Clear user's cart
```

### 3. Order Status Management (Seller Side)
**File**: `src/app/(seller)/seller-dashboard/orders/page.tsx`

**Process**:
1. Display orders filtered by status tabs
2. Provide action buttons for status updates:
   - "Mark as Paid" (to-pay → to-ship)
   - "Ship Order" (to-ship → to-receive)
   - "Mark Delivered" (to-receive → completed)
   - "Cancel Order" (any → cancelled)
   - "Issue Refund" (any → refund)
3. Update order status and timestamp
4. Trigger real-time update to buyer side

**Backend Equivalent**:
```
PATCH /api/orders/:orderId/status
- Validate seller owns the order
- Update order status
- Send notifications to buyer
- Update inventory if cancelled
```

### 4. Order Tracking (Buyer Side)
**File**: `src/app/(buyer)/orders/page.tsx`

**Process**:
1. Display user's orders with current status
2. Show color-coded status badges
3. Real-time updates when seller changes status
4. Display order details and tracking information

**Backend Equivalent**:
```
GET /api/orders?customerId=:id
- Return user's orders with current status
- Include product snapshots
- Show tracking information
```

## Finance Integration

### Income Tracking (Seller Side)
**File**: `src/app/(seller)/seller-dashboard/finance/my-income/page.tsx`

**Process**:
1. Monitor orders with 'completed' status
2. Calculate total earnings from completed orders
3. Display income overview and detailed breakdown
4. Show to-release vs released amounts
5. Generate income reports and charts

**Backend Equivalent**:
```
GET /api/finance/income?sellerId=:id
- Calculate completed order totals
- Return income breakdown
- Include pending vs released amounts
- Generate financial reports
```

## Storage Keys

Current localStorage implementation uses these keys:

- `products`: Array of all products (seller-created)
- `orders`: Array of all orders (buyer-created)
- `cart`: Current user's cart object
- `completedOrders`: Array of completed orders for finance tracking

## API Endpoints Needed

### Authentication
- `POST /api/auth/seller/login`
- `POST /api/auth/seller/register`
- `POST /api/auth/buyer/login`
- `POST /api/auth/buyer/register`

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller)
- `PUT /api/products/:id` - Update product (seller)
- `DELETE /api/products/:id` - Delete product (seller)

### Orders
- `GET /api/orders` - List orders (filtered by user role)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order (buyer)
- `PATCH /api/orders/:id/status` - Update order status (seller)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Finance
- `GET /api/finance/income` - Get seller income data
- `GET /api/finance/transactions` - Get transaction history

### File Upload
- `POST /api/upload/images` - Upload product images

## Real-time Updates

Currently implemented using localStorage events and custom events:

### Events Triggered:
1. **Product Creation**: Updates buyer product listings
2. **Order Placement**: Updates seller order dashboard
3. **Status Changes**: Updates buyer order tracking
4. **Order Completion**: Updates seller finance section

### Backend Implementation:
- Use WebSocket connections or Server-Sent Events
- Implement event-driven architecture
- Send real-time notifications for:
  - New orders to sellers
  - Status updates to buyers
  - Stock level changes
  - Payment confirmations

## Data Flow Summary

1. **Seller** creates products → stored in database → visible to **Buyers**
2. **Buyer** adds to cart → cart persisted → checkout creates order
3. **Order** appears in seller dashboard → seller manages status
4. **Status updates** reflect in buyer order tracking
5. **Completed orders** generate income for seller finance section

This architecture ensures seamless integration between seller and buyer experiences while maintaining data consistency and real-time updates.