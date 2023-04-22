const express = require("express");

const { isAuthUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route("/products").get(getProducts);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.route("/product/:id").get(getProduct);

// @desc    Create new review
// @route   POST /api/review
// @access  Private
router.route("/review").put(isAuthUser, createProductReview);

// @desc    Get product reviews
// @route   GET /api/reviews
// @access  Private
router.route("/reviews").get(isAuthUser, getProductReviews);

// @desc    Delete product review
// @route   DELETE /api/reviews
// @access  Private
router.route("/reviews").delete(isAuthUser, deleteReview);

// Admin Routes

// @desc    Fetch all products
// @route   GET /api/admin/products
// @access  Private
router
  .route("/admin/products")
  .get(isAuthUser, authorizeRoles("admin"), getAdminProducts);

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private
router
  .route("/admin/product/new")
  .post(isAuthUser, authorizeRoles("admin"), createProduct);

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private
router
  .route("/admin/product/:id")
  .put(isAuthUser, authorizeRoles("admin"), updateProduct);

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private
router
  .route("/admin/product/:id")
  .delete(isAuthUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
