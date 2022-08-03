import express from 'express';

import {
        createCashOrder,
        filterOrderForLoggedUser,
        findAllOrders,
        findSpecificOrder,
        updateOrderToPaid,
        updateOrderToDelivered,
} from '../services/orderService.js';
import {
        protect,
        allowedTo,
} from '../services/authService.js';

const router = express.Router();
router.use(protect,);

router.route('/:cartId').post(allowedTo('user'), createCashOrder);
router.get(
        '/',
        allowedTo('user', 'admin', 'manager'),
        filterOrderForLoggedUser,
        findAllOrders
);
router.get('/:id', findSpecificOrder);
router.put(
        '/:id/pay',
        allowedTo('admin', 'manager'),
        updateOrderToPaid
);
router.put(
        '/:id/deliver',
        allowedTo('admin', 'manager'),
        updateOrderToDelivered
);

export default router;