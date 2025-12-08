const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Database
let mongoServer;

async function connectDB() {
  try {
    // Use MongoDB Memory Server for development
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Memory Server connected');
    
    // Seed database
    await seedDB();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

async function seedDB() {
  const Product = require('./models/Product');
  
  // Check if products already exist
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) return;
  
  const sampleProducts = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 79.99,
      originalPrice: 129.99,
      discount: 38,
      image: 'https://via.placeholder.com/300x300?text=Wireless+Headphones',
      category: 'Electronics',
      stock: 50,
      reviews: []
    },
    {
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
      category: 'Electronics',
      stock: 30,
      reviews: []
    },
    {
      name: 'USB-C Cable',
      description: 'Durable USB-C charging and data cable',
      price: 9.99,
      originalPrice: 19.99,
      discount: 50,
      image: 'https://via.placeholder.com/300x300?text=USB-C+Cable',
      category: 'Accessories',
      stock: 200,
      reviews: []
    },
    {
      name: 'Phone Case',
      description: 'Protective phone case with premium design',
      price: 14.99,
      originalPrice: 24.99,
      discount: 40,
      image: 'https://via.placeholder.com/300x300?text=Phone+Case',
      category: 'Accessories',
      stock: 100,
      reviews: []
    },
    {
      name: 'Portable Speaker',
      description: 'Waterproof Bluetooth speaker with great sound',
      price: 49.99,
      originalPrice: 79.99,
      discount: 37,
      image: 'https://via.placeholder.com/300x300?text=Portable+Speaker',
      category: 'Electronics',
      stock: 25,
      reviews: []
    },
    {
      name: 'Phone Stand',
      description: 'Adjustable phone stand for desk and table',
      price: 12.99,
      originalPrice: 19.99,
      discount: 35,
      image: 'https://via.placeholder.com/300x300?text=Phone+Stand',
      category: 'Accessories',
      stock: 75,
      reviews: []
    },
    {
      name: 'Screen Protector Pack',
      description: 'Pack of 3 tempered glass screen protectors',
      price: 8.99,
      originalPrice: 14.99,
      discount: 40,
      image: 'https://via.placeholder.com/300x300?text=Screen+Protector',
      category: 'Accessories',
      stock: 150,
      reviews: []
    },
    {
      name: 'Wireless Charger',
      description: 'Fast wireless charging pad for compatible devices',
      price: 24.99,
      originalPrice: 39.99,
      discount: 37,
      image: 'https://via.placeholder.com/300x300?text=Wireless+Charger',
      category: 'Electronics',
      stock: 40,
      reviews: []
    }
  ];
  
  await Product.insertMany(sampleProducts);
  console.log('Database seeded with sample products');
}

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle shutdown
process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  process.exit(0);
});
