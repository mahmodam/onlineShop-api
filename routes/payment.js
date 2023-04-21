const express = require("express");

const { isAuthUser } = require("../middlewares/auth");

const router = express.Router();

const {
  processPayment,
  sendStripeApi,
} = require("../controllers/paymentController");

// @desc    Process stripe payments
// @route   POST /api/payment/process
// @access  Private
router.route("/payment/process").post(isAuthUser, processPayment);

// @desc    Send stripe API key
// @route   GET /api/stripeapi
// @access  Public
router.route("/stripeapi").get(isAuthUser, sendStripeApi);

module.exports = router;
