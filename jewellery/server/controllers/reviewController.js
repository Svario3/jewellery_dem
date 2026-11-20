import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews/product/:productId
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating, review title and review comment are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existing) {
      existing.rating = Number(rating);
      existing.title = title;
      existing.comment = comment;
      await existing.save();
    } else {
      await Review.create({
        product: productId,
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        title,
        comment,
        verifiedPurchase: true,
        isApproved: true,
      });
    }

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId, isApproved: true });
    const avgRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    product.rating = Number(avgRating.toFixed(1));
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable review!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name sku images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle review approval (Admin)
// @route   PUT /api/reviews/admin/:id/toggle
// @access  Private/Admin
export const toggleReviewApproval = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.json({
      success: true,
      message: `Review ${review.isApproved ? 'approved' : 'hidden'}`,
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
