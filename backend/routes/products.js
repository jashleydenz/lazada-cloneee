const express = require('express');
const { getAllProducts, getProduct, getFeaturedProducts } = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

module.exports = router;
