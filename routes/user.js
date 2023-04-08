const express = require("express");

const { isAuthUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  adminUpdateUser,
  deleteUser,
} = require("../controllers/userController");

// @desc    Register a user
// @route   POST /api/register
// @access  Public
router.route("/register").post(registerUser);

// @desc    Login user
// @route   POST /api/login
// @access  Public
router.route("/login").post(loginUser);

// @desc    Logout user
// @route   GET /api/logout
// @access  Private
router.route("/logout").get(logout);

// @desc    Forgot password
// @route   POST /api/password/forgot
// @access  Public
router.route("/password/forgot").post(forgotPassword);

// @desc    Reset password
// @route   PUT /api/password/reset/:token
// @access  Public
router.route("/password/reset/:token").put(resetPassword);

// @desc    Get currently logged in user details
// @route   GET /api/me
// @access  Private
router.route("/me").get(isAuthUser, getUserProfile);

// @desc    Update / Change password
// @route   PUT /api/password/update
// @access  Private
router.route("/password/update").put(isAuthUser, updatePassword);

// @desc    Update user profile
// @route   PUT /api/me/update
// @access  Private
router.route("/me/update").put(isAuthUser, updateProfile);

// ADMIN ROUTES

// @desc    Get all users - ADMIN
// @route   GET /api/admin/users
// @access  Private
router
  .route("/admin/users")
  .get(isAuthUser, authorizeRoles("admin"), getAllUsers);

// @desc    Get user details - ADMIN
// @route   GET /api/admin/user/:id
// @access  Private
router
  .route("/admin/user/:id")
  .get(isAuthUser, authorizeRoles("admin"), getUserDetails);

// @desc    Update user profile - ADMIN
// @route   PUT /api/admin/user/:id
// @access  Private
router
  .route("/admin/user/:id")
  .put(isAuthUser, authorizeRoles("admin"), adminUpdateUser);

// @desc    Delete user - ADMIN
// @route   DELETE /api/admin/user/:id
// @access  Private
router
  .route("/admin/user/:id")
  .delete(isAuthUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
