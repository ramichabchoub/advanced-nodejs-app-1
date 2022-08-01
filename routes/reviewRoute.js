import express from 'express';

import {
        createReviewValidator,
        getReviewValidator,
        updateReviewValidator,
        deleteReviewValidator,
} from '../utils/validators/reviewValidator.js';

import {
        getReview,
        getReviews,
        createReview,
        updateReview,
        deleteReview,
} from '../services/reviewService.js';

import {
        protect,
        allowedTo
} from '../services/authService.js';

const router = express.Router();

router
        .route('/')
        .get(getReviews)
        .post(protect, allowedTo('user'), createReviewValidator, createReview);
router
        .route('/:id')
        .get(getReviewValidator, getReview)
        .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
        .delete(protect, allowedTo('admin', 'manager', 'user'), deleteReviewValidator, deleteReview);

export default router;