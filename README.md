# Lazada Clone - Full Stack E-Commerce Application

A complete full-stack e-commerce platform built with Next.js, Express, MongoDB, and Tailwind CSS. This project implements a feature-rich shopping experience similar to Lazada with user authentication, product catalog, shopping cart, and order management.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Image Handling**: Next.js Image component

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **File Upload**: Multer

## Project Structure

```
lazada-clone/
├── src/                           # Frontend (Next.js)
│   ├── app/                       # App Router pages
│   │   ├── page.tsx              # Home page with featured products
│   │   ├── login/                # User login page
│   │   ├── register/             # User registration page
│   │   ├── products/             # Product listing with filters
│   │   ├── cart/                 # Shopping cart
│   │   ├── orders/               # Order history
│   │   └── profile/              # User profile management
│   ├── components/               # Reusable React components
│   │   ├── Header.tsx            # Navigation header
│   │   └── ProductCard.tsx       # Product display card
│   ├── store/                    # Zustand state management
│   │   └── index.ts              # Auth and cart stores
│   ├── lib/                      # Utilities and API functions
│   │   └── api.ts                # Axios instance with interceptors
│   └── globals.css               # Global styles
├── backend/                       # Backend (Express.js)
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js               # User model with auth
│   │   ├── Product.js            # Product catalog model
│   │   ├── Order.js              # Order management model
│   │   └── Cart.js               # Shopping cart model
│   ├── controllers/              # Route handlers
│   │   ├── authController.js     # Auth endpoints
│   │   ├── productController.js  # Product endpoints
│   │   ├── cartController.js     # Cart endpoints
│   │   ├── orderController.js    # Order endpoints
│   │   └── adminController.js    # Admin endpoints
│   ├── routes/                   # API route definitions
│   │   ├── auth.js               # /api/auth/*
│   │   ├── products.js           # /api/products/*
│   │   ├── cart.js               # /api/cart/*
│   │   ├── orders.js             # /api/orders/*
│   │   └── admin.js              # /api/admin/*
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # JWT auth and role validation
│   ├── server.js                 # Express app setup
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables
├── package.json                  # Frontend dependencies
└── README.md                     # This file
```

## Features

### User Features
- ✅ User Registration & Login with JWT
- ✅ Product Browsing with Filters (search, category, sort)
- ✅ Product Details View
- ✅ Shopping Cart Management (add, remove, update quantity)
- ✅ Checkout & Order Creation
- ✅ Order History & Tracking
- ✅ User Profile Management
- ✅ Persistent Cart (local storage)

### Admin Features
- ✅ Product Management (CRUD)
- ✅ Order Management (status updates)
- ✅ Dashboard Statistics
- ✅ Role-Based Access Control

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Navigate to project directory**
```bash
cd lazada-clone
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Environment Setup**

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/lazada-clone
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

Create `.env.local` in root (optional, for custom API URL):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Backend API**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend**
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Build

**Frontend**
```bash
npm run build
npm start
```

**Backend**
```bash
cd backend
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (requires auth)
- `PUT /profile` - Update user profile (requires auth)

### Products (`/api/products`)
- `GET /` - Get all products (supports filters: search, category, sort, page, limit)
- `GET /:id` - Get product details
- `GET /featured` - Get featured products

### Cart (`/api/cart`)
- `GET /` - Get user's cart (requires auth)
- `POST /add` - Add item to cart (requires auth)
- `POST /remove` - Remove item from cart (requires auth)
- `PUT /update` - Update cart item quantity (requires auth)
- `DELETE /clear` - Clear entire cart (requires auth)

### Orders (`/api/orders`)
- `POST /` - Create new order (requires auth)
- `GET /` - Get user's orders (requires auth)
- `GET /:id` - Get order details (requires auth)
- `PUT /:id/cancel` - Cancel order (requires auth)

### Admin (`/api/admin`)
- `POST /products` - Add product (requires admin)
- `PUT /products/:id` - Update product (requires admin)
- `DELETE /products/:id` - Delete product (requires admin)
- `GET /orders` - Get all orders (requires admin)
- `PUT /orders/:id/status` - Update order status (requires admin)
- `GET /dashboard/stats` - Get dashboard statistics (requires admin)

## Database Schema

### User
- `_id`: ObjectId (auto)
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `phone`: String
- `address`: String
- `city`: String
- `zipCode`: String
- `isAdmin`: Boolean (default: false)
- `createdAt`: Date (auto)

### Product
- `_id`: ObjectId (auto)
- `name`: String
- `description`: String
- `price`: Number
- `originalPrice`: Number
- `discount`: Number (%)
- `category`: String
- `image`: String (URL)
- `images`: [String]
- `stock`: Number
- `rating`: Number
- `reviews`: [{ user, rating, comment, date }]
- `seller`: String
- `sold`: Number
- `featured`: Boolean
- `createdAt`: Date

### Order
- `_id`: ObjectId (auto)
- `user`: ObjectId (ref: User)
- `items`: [{ product, quantity, price }]
- `totalPrice`: Number
- `status`: String (pending, confirmed, shipped, delivered, cancelled)
- `shippingAddress`: { name, phone, address, city, zipCode }
- `paymentMethod`: String
- `trackingNumber`: String
- `estimatedDelivery`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Cart
- `_id`: ObjectId (auto)
- `user`: ObjectId (ref: User)
- `items`: [{ product, quantity, addedAt }]
- `updatedAt`: Date

## Authentication Flow

1. User registers with email/password
2. Password is hashed with bcryptjs
3. Server returns JWT token
4. Token is stored in localStorage
5. All subsequent requests include token in `Authorization: Bearer <token>` header
6. Token is verified on server using middleware
7. User ID extracted from token for authorization

## State Management (Zustand)

### Auth Store
```typescript
- user: Current logged-in user object
- token: JWT token
- isLoggedIn: Boolean flag
- setUser(user, token): Set user and token
- logout(): Clear user and token
```

### Cart Store
```typescript
- items: Array of cart items
- total: Total cart value
- addItem(item): Add product to cart
- removeItem(id): Remove product from cart
- updateQuantity(id, qty): Update item quantity
- clearCart(): Empty the cart
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`

### CORS Issues
- Backend has CORS enabled
- Verify `NEXT_PUBLIC_API_URL` matches backend address
- Check backend server is running

### Authentication Errors
- Clear localStorage and login again
- Check JWT_SECRET in .env
- Verify token is being sent in API headers

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Run `npm run build` to compile CSS
- Check browser DevTools for CSS loading

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications (order confirmation, shipping updates)
- Product reviews and ratings system
- Wishlist functionality
- Real-time order tracking
- Admin analytics dashboard
- Product recommendations
- Multiple payment methods
- Coupon/discount codes
- Search autocomplete
- Image optimization and CDN

## Development Guidelines

### Frontend
- Use TypeScript for type safety
- Keep components small and reusable
- Use Zustand for client state
- Use next/image for optimized images
- Implement proper error handling

### Backend
- Separate concerns (controllers, models, routes)
- Use middleware for authentication/authorization
- Validate all inputs
- Implement proper error handling
- Use environment variables for configuration

## Contributing

1. Create a feature branch
2. Make changes and test thoroughly
3. Submit pull request with description
4. Code review required before merge

## License

MIT License

## Contact & Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Deployment Ready**: ✅ Backend, ✅ Frontend (with env config)
