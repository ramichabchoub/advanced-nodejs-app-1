import Review from '../models/reviewModel.js';
import {
        deleteOne,
        updateOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = getAll(Review);

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = getOne(Review);

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