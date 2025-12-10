# Product Management System Guide

## Overview
This system allows sellers to add products and buyers to view them, all without requiring a backend. Products are stored in the browser's localStorage.

## How It Works

### For Sellers

#### Adding Products
1. Navigate to **Seller Dashboard** → **Add Product**
2. Fill in the product details:
   - Product Name (required)
   - Category (required)
   - Brand
   - Price
   - Special Price (optional)
   - Stock
   - Seller SKU
   - Description
   - Package Weight

3. Click **Submit** to publish the product (status: active)
   - Product will be visible to buyers immediately
   - Redirects to Manage Products page

4. Click **Save Draft** to save without publishing (status: draft)
   - Product will NOT be visible to buyers
   - Can be edited later

#### Managing Products
1. Navigate to **Seller Dashboard** → **Manage Products**
2. View all your products in a table
3. Filter by status:
   - **All**: Shows all products
   - **Active**: Shows published products
   - **Draft**: Shows unpublished products
4. Each product shows:
   - Product image placeholder
   - Name and category
   - SKU
   - Price (and special price if set)
   - Stock quantity
   - Status badge
   - Edit/Delete actions

### For Buyers

#### Viewing Products
1. Navigate to the **Home Page** (buyer landing page)
2. Products are displayed in:
   - Featured Products section (first 10 products)
   - More Products section (next 10 products)

3. Navigate to **Products Page** for full catalog
4. Use filters:
   - Search by name or category
   - Filter by category
   - Sort by:
     - Newest
     - Price: Low to High
     - Price: High to Low

#### Product Display
- Only **active** products are visible to buyers
- Draft products remain hidden
- Products show:
  - Product image
  - Name
  - Price
  - Special price (if set)
  - Add to Cart button
  - View Details button

#### Product Details Page
- Click "View" on any product to see full details
- Shows:
  - Product name and category
  - Brand
  - Price (with special price if set)
  - Stock availability
  - SKU
  - Package weight
  - Full description
  - Delivery options
  - Quantity selector
  - Buy Now and Add to Cart buttons

## Data Storage

All data is stored in browser `localStorage` - no backend required!

### localStorage Keys

1. **products** - All seller products
2. **cart** - Current shopping cart items
3. **orders** - Completed orders

### localStorage Structure

#### Products
Products are stored in `localStorage` under the key `products`:

```json
[
  {
    "id": "1234567890",
    "name": "Product Name",
    "category": "Category Path",
    "brand": "Brand Name",
    "price": "999",
    "specialPrice": "799",
    "stock": "50",
    "sellerSKU": "SKU123",
    "description": "Product description",
    "packageWeight": "1.5",
    "status": "active",
    "createdAt": "2025-12-10T...",
    "image": "/images/product-placeholder.png"
  }
]
```

#### Cart
Cart items are stored under the key `cart`:

```json
[
  {
    "id": "1234567890",
    "name": "Product Name",
    "price": "999",
    "specialPrice": "799",
    "quantity": 2,
    "category": "Category Path",
    "brand": "Brand Name"
  }
]
```

#### Orders
Completed orders are stored under the key `orders`:

```json
[
  {
    "id": "1234567890",
    "items": [...cart items...],
    "total": 1798,
    "status": "pending",
    "createdAt": "2025-12-10T...",
    "shippingAddress": {...},
    "paymentMethod": "credit-card"
  }
]
```

### Status Values
- `active`: Product is published and visible to buyers
- `draft`: Product is saved but not published

## Features

### Seller Features
✅ Add new products with full details
✅ Save products as drafts
✅ View all products in a table
✅ Filter products by status
✅ See product count per status
✅ Auto-redirect after submission

### Buyer Features
✅ View active products on home page
✅ Browse all products on products page
✅ Search products by name/category
✅ Filter by category
✅ Sort by price or date
✅ Add products to cart (with quantity)
✅ View product details
✅ Cart badge shows item count
✅ Manage cart (update quantity, remove items)
✅ Checkout and place orders
✅ Orders saved to localStorage

## Navigation Flow

### Seller Flow
```
Seller Dashboard
  └─ Add Product
      ├─ Submit → Manage Products (shows new product)
      └─ Save Draft → Manage Products (shows as draft)
```

### Buyer Flow
```
Home Page (shows active products)
  ├─ View All → Products Page
  └─ Product Card → Product Details
```

## Notes

- Products persist in browser localStorage
- Clearing browser data will remove all products
- Each browser/device has its own product storage
- No backend required - perfect for demos and testing
- Products are automatically filtered by status for buyers
- Real-time updates when products are added

## Testing the System

1. **Add a Product**:
   - Go to Seller Dashboard → Add Product
   - Fill in product name and select category
   - Add price and other details
   - Click Submit

2. **View in Manage Products**:
   - You'll be redirected automatically
   - See your product in the table
   - Check the Active tab

3. **View as Buyer**:
   - Navigate to Home Page (/)
   - Your product appears in Featured Products
   - Click "View All" to see Products Page
   - Use search and filters

4. **Test Product Details**:
   - Click "View" on any product card
   - See full product details page
   - All information from localStorage is displayed

5. **Test Cart Functionality**:
   - Click "Add to Cart" on product details page
   - See cart badge in header update with count
   - Click cart icon to view cart
   - Update quantities, remove items
   - Click "Proceed to Checkout" to place order

6. **Test Orders**:
   - After checkout, navigate to "My Orders" (from header)
   - See your completed orders with all details
   - Orders show items, quantities, prices, and dates

7. **Test Draft Feature**:
   - Add another product
   - Click "Save Draft" instead
   - Check Manage Products → Draft tab
   - Verify it doesn't appear on buyer pages

## Future Enhancements

Possible additions:
- Edit product functionality
- Delete product functionality
- Image upload support
- Product variations
- Bulk operations
- Export/Import products
- Product analytics
- Inventory management
