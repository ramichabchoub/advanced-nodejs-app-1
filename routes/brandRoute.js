import express from 'express';

import {
        getBrandValidator,
        createBrandValidator,
        updateBrandValidator,
        deleteBrandValidator,
} from '../utils/validators/brandValidator.js';
import {
        protect,
        allowedTo
} from '../services/authService.js';

import {
        getBrands,
        getBrand,
        createBrand,
        updateBrand,
        deleteBrand,
        // applySlug,
        uploadBrandImage,
        resizeImage,
} from '../services/brandService.js';

const router = express.Router();

router
        .route('/')
        .get(getBrands)
        .post(protect, allowedTo('admin', 'manager'),uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router
        .route('/:id')
        .get(getBrandValidator, getBrand)
        .put(protect, allowedTo('admin', 'manager'),uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
        .delete(protect, allowedTo('admin'),deleteBrandValidator, deleteBrand);

export default router;