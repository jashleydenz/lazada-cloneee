const express = require('express');
const { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getAllOrders, 
  updateOrderStatus,
  getDashboardStats 
} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Product management
router.post('/products', adminAuth, addProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// Order management
router.get('/orders', adminAuth, getAllOrders);
router.put('/orders/:id/status', adminAuth, updateOrderStatus);

// Dashboard
router.get('/dashboard/stats', adminAuth, getDashboardStats);

module.exports = router;
