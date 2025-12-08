const express = require('express');
const { createOrder, getOrders, getOrder, cancelOrder } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/cancel', auth, cancelOrder);

module.exports = router;
