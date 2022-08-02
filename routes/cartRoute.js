import express from "express";

import {
        addProductToCart,
        getLoggedUserCart,
        removeSpecificCartItem,
        clearCart,
        updateCartItemQuantity,
        applyCoupon,
} from '../services/cartService.js';
import {
        protect,
        allowedTo
} from '../services/authService.js';

const router = express.Router();

router.use(protect, allowedTo('user'));
router
        .route('/')
        .post(addProductToCart)
        .get(getLoggedUserCart)
        .delete(clearCart);

router.put('/applyCoupon', applyCoupon);

router
        .route('/:itemId')
        .put(updateCartItemQuantity)
        .delete(removeSpecificCartItem);

export default router;