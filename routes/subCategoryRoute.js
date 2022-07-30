import Express from 'express';

import {
        createSubCategory,
        getSubCategories,
        getSubCategory,
        updateSubCategory,
        deleteSubCategory,
        setCategoryIdToBody,
        createFilterObject,
} from '../services/subCategoryService.js';

import {
        createSubCategoryValidator,
        getSubCategoryValidator,
        updateSubCategoryValidator,
        deleteSubCategoryValidator
} from '../utils/validators/subCategoryValidator.js';
import {
        protect,
        allowedTo
} from '../services/authService.js';

// mergeParams: allows to access the params of the parent route
const router = Express.Router({ mergeParams: true });

router
        .route('/')
        .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
        .get(protect, allowedTo('admin', 'manager'),createFilterObject, getSubCategories);
router
        .route('/:id')
        .get(getSubCategoryValidator, getSubCategory)
        .put(protect, allowedTo('admin', 'manager'),updateSubCategoryValidator, updateSubCategory)
        .delete(protect, allowedTo('admin'),deleteSubCategoryValidator, deleteSubCategory);

export default router;