import express from 'express';

import {
        protect,
        allowedTo
} from '../services/authService.js';

import  {
        addProductToWishlist,
        removeProductFromWishlist,
        getLoggedUserWishlist,
} from '../services/wishlistService.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

export default router;
