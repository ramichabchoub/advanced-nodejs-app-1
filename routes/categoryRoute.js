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
} from '../services/categoryService.js';
import subcategoriesRoute from './subCategoryRoute.js';

const router = express.Router();

router.use('/:categoryId/subcategories', subcategoriesRoute);

router
        .route('/')
        .get(getCategories)
        .post(createCategoryValidator, createCategory);
router
        .route('/:id')
        .get(getCategoryValidator, getCategory)
        .put(updateCategoryValidator, updateCategory)
        .delete(deleteCategoryValidator, deleteCategory);

export default router;