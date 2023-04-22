const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");

const APIFeatures = require("../utils/apiFeatures");

const cloudinary = require("cloudinary");

// desc: Create new product
// route: POST /api/admin/products
// access: Private
const createProduct = async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === "string") {
      // if there is only one image
      images.push(req.body.images);
    } else {
      // if there are multiple images
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Get all products
// route: GET /api/products
// access: Public
const getProducts = async (req, res, next) => {
  try {
    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      resPerPage,
      productsCount,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Get all products (Admin)
// route: GET /api/admin/products
// access: Private
const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Get single product
// route: GET /api/products/:id
// access: Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Update product
// route: PUT /api/admin/products/:id
// access: Private
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Delete product
// route: DELETE /api/admin/products/:id
// access: Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Delete images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product is deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Create new review
// route: POST /api/review
// access: Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Get Product Reviews
// route: GET /api/reviews
// access: Private
const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// desc: Delete Product Review
// route: DELETE /api/reviews
// access: Private
const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
};
