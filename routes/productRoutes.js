const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Hiển thị danh sách sản phẩm
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.render('products', { products });
});

// Hiển thị chi tiết sản phẩm
router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('productDetail', { product });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/cart', (req, res) => {
  const productId = req.body.productId;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(productId);
  res.redirect('/cart');
});

// Hiển thị giỏ hàng
router.get('/cart', async (req, res) => {
  const cart = req.session.cart || [];
  const products = await Product.find({ _id: { $in: cart } });
  res.render('cart', { products });
});

// API - Lấy danh sách sản phẩm (cho Postman)
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API - Tạo sản phẩm (cho Postman)
router.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// API - Sửa sản phẩm (cho Postman)
router.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, description, price, imageUrl }, { new: true });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// API - Xóa sản phẩm (cho Postman)
router.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;