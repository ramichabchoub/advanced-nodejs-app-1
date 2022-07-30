import express from 'express';

import {
        getCategoryValidator,
        createCategoryValidator,
        updateCategoryValidator,
        deleteCategoryValidator,
} from '../utils/validators/categoryValidator.js';

import {
        getCategories,
        createCategory,
        getCategory,
        updateCategory,
        deleteCategory,
        uploadCategoryImage,
        resizeImage,
} from '../services/categoryService.js';
import subcategoriesRoute from './subCategoryRoute.js';
import {
        protect,
        allowedTo
} from '../services/authService.js';

const router = express.Router();

router.use('/:categoryId/subcategories', subcategoriesRoute);

router
        .route('/')
        .get(getCategories)
        .post(protect, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);
router
        .route('/:id')
        .get(getCategoryValidator, getCategory)
        .put(protect, allowedTo('admin', 'manager'),uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
        .delete(protect, allowedTo('admin'),deleteCategoryValidator, deleteCategory);

export default router;