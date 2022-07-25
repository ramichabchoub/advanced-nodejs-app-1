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

// mergeParams: allows to access the params of the parent route
const router = Express.Router({ mergeParams: true });

router
        .route('/')
        .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
        .get(createFilterObject, getSubCategories);
router
        .route('/:id')
        .get(getSubCategoryValidator, getSubCategory)
        .put(updateSubCategoryValidator, updateSubCategory)
        .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;