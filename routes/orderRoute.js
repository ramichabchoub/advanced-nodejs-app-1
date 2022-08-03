import express from 'express';

import {
        createCashOrder,
} from '../services/orderService.js';
import {
        protect,
        allowedTo,
} from '../services/authService.js';

const router = express.Router();
router.use(protect, allowedTo('user'));
router.route('/:cartId').post(createCashOrder);

export default router;