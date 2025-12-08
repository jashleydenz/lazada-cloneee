const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lazada-clone');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Sample City',
      zipCode: '12345',
      isAdmin: false,
    });
    console.log('Created sample user');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Created admin user');

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        originalPrice: 149.99,
        discount: 33,
        category: 'Electronics',
        image: '/images/whp.jpg',
        images: [
          '/images/wireless-headphones.jpeg',
          '/images/wireless-headphones-2.jpeg',
          '/images/wireless-headphones-3.jpeg',
        ],
        stock: 50,
        rating: 4.5,
        seller: 'TechStore',
        sold: 120,
        featured: true,
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 199.99,
        originalPrice: 299.99,
        discount: 33,
        category: 'Electronics',
        image: '/images/smart-watch.jpeg',
        images: [
          '/images/smart-watch.jpeg',
          '/images/smart-watch-2.jpeg',
          '/images/smart-watch-3.jpeg',
        ],
        stock: 30,
        rating: 4.8,
        seller: 'TechStore',
        sold: 85,
        featured: true,
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for all terrains',
        price: 89.99,
        originalPrice: 129.99,
        discount: 30,
        category: 'Sports',
        image: '/images/running-shoes.jpeg',
        images: [
          '/images/running-shoes.jpeg',
          '/images/running-shoes-2.jpeg',
          '/images/running-shoes-3.jpeg',
        ],
        stock: 100,
        rating: 4.3,
        seller: 'SportGear',
        sold: 200,
        featured: true,
      },
      {
        name: 'Casual T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        originalPrice: 34.99,
        discount: 43,
        category: 'Fashion',
        image: '/images/casual-t-shirt.jpeg',
        images: [
          '/images/casual-t-shirt.jpeg',
          '/images/casual-t-shirt-2.jpeg',
          '/images/casual-t-shirt-3.jpeg',
        ],
        stock: 200,
        rating: 4.2,
        seller: 'FashionHub',
        sold: 500,
        featured: true,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 49.99,
        originalPrice: 79.99,
        discount: 37,
        category: 'Home',
        image: '/images/coffee-maker.jpeg',
        images: [
          '/images/coffee-maker.jpeg',
          '/images/coffee-maker-2.jpeg',
          '/images/coffee-maker-3.jpeg',
        ],
        stock: 40,
        rating: 4.6,
        seller: 'HomeGoods',
        sold: 150,
        featured: true,
      },
      {
        name: 'Laptop Stand',
        description: 'Ergonomic laptop stand for desk',
        price: 29.99,
        originalPrice: 49.99,
        discount: 40,
        category: 'Electronics',
        image: '/images/laptop-stand.jpeg',
        images: [
          '/images/laptop-stand.jpeg',
          '/images/laptop-stand-2.jpeg',
          '/images/laptop-stand-3.jpeg',
        ],
        stock: 80,
        rating: 4.7,
        seller: 'TechStore',
        sold: 300,
        featured: true,
      },
      {
        name: 'Yoga Mat',
        description: 'Premium yoga mat with carrying strap',
        price: 24.99,
        originalPrice: 44.99,
        discount: 44,
        category: 'Sports',
        image: '/images/yoga-mat.jpeg',
        images: [
          '/images/yoga-mat.jpeg',
          '/images/yoga-mat-2.jpeg',
          '/images/yoga-mat-3.jpeg',
        ],
        stock: 120,
        rating: 4.4,
        seller: 'SportGear',
        sold: 250,
        featured: true,
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        price: 34.99,
        originalPrice: 59.99,
        discount: 42,
        category: 'Home',
        image: '/images/desk-lamp.jpeg',
        images: [
          '/images/desk-lamp.jpeg',
          '/images/desk-lamp-2.jpeg',
          '/images/desk-lamp-3.jpeg',
        ],
        stock: 70,
        rating: 4.5,
        seller: 'HomeGoods',
        sold: 180,
        featured: true,
      },
    ]);
    console.log('Created sample products');

    mongoose.connection.close();
    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
