const express = require("express");

const { isAuthUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

const {
  newOrder,
  getOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

// @desc    Create new order
// @route   POST /api/order/new
// @access  Private
router.route("/order/new").post(isAuthUser, newOrder);

// @desc    Get single order
// @route   GET /api/order/:id
// @access  Private
router.route("/order/:id").get(isAuthUser, getOrder);

// @desc    Get logged in user orders
// @route   GET /api/orders/me
// @access  Private
router.route("/orders/me").get(isAuthUser, myOrders);

// Admin Routes

// @desc    Get all orders - ADMIN
// @route   GET /api/admin/orders
// @access  Private
router
  .route("/admin/orders")
  .get(isAuthUser, authorizeRoles("admin"), allOrders);

// @desc    Update / Process order - ADMIN
// @route   PUT /api/admin/order/:id
// @access  Private
router
  .route("/admin/order/:id")
  .put(isAuthUser, authorizeRoles("admin"), updateOrder);

// @desc    Delete order - ADMIN
// @route   DELETE /api/admin/order/:id
// @access  Private
router
  .route("/admin/order/:id")
  .delete(isAuthUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
