import Review from '../models/reviewModel.js';
import {
        deleteOne,
        updateOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';

// Nested route
// GET /api/v1/products/:productId/reviews
export const createFilterObj = (req, res, next) => {
        let filterObject = {};
        if (req.params.productId) filterObject = { product: req.params.productId };
        req.filterObj = filterObject;
        next();
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = getAll(Review);

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = getOne(Review);

// Nested route (Create)
export const setProductIdAndUserIdToBody = (req, res, next) => {
        if (!req.body.product) req.body.product = req.params.productId;
        if (!req.body.user) req.body.user = req.user._id;
        next();
};
// @desc   - Create a new review
// @route  - POST /api/v1/reviews
// @access - Private/Protected/User
export const createReview = createOne(Review);

// @desc   - Update a review
// @route  - PUT /api/v1/reviews/:id
// @access - Private/Protected/User
export const updateReview = updateOne(Review);

// @desc   - Delete a review
// @route  - DELETE /api/v1/reviews/:id
// @access - Private/Protected/User-Admin-Manager
export const deleteReview = deleteOne(Review);