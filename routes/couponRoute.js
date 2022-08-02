import express from 'express';

import {
        getCoupon,
        getCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
} from '../services/couponService.js';

import {
        protect,
        allowedTo
} from '../services/authService.js';

const router = express.Router();

router.use(protect, allowedTo('admin', 'manager'));

router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon);

export default router;