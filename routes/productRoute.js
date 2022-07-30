import express from 'express';

import {
        getProductValidator,
        createProductValidator,
        updateProductValidator,
        deleteProductValidator
} from '../utils/validators/productValidator.js';

import {
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        uploadProductImages,
        resizeProductImages
} from '../services/productService.js';
import {
        protect,
        allowedTo
} from '../services/authService.js';

const router = express.Router();

router
        .route('/')
        .get(getProducts)
        .post(protect, allowedTo('admin', 'manager'),uploadProductImages, resizeProductImages, createProductValidator, createProduct);
router
        .route('/:id')
        .get(getProductValidator, getProduct)
        .put(protect, allowedTo('admin', 'manager'),updateProductValidator, updateProduct)
        .delete(protect, allowedTo('admin'),deleteProductValidator, deleteProduct);

export default router;