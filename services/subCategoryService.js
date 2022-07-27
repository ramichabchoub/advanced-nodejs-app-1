import SubCategory from '../models/subCategoryModel.js';
import {
        deleteOne,
        updateOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';


export const setCategoryIdToBody = (req, res, next) => {
        // nested route: /api/v1/categories/:categoryId/subcategories
        if(!req.body.categoryId) {
                req.body.category = req.params.categoryId;
        }
        next();
}
// @desc   - Create a new subCategory
// @route  - POST /api/v1/subcategories
// @access - Private
export const createSubCategory = createOne(SubCategory);

// nested route
// GET /api/v1/categories/:categoryId/subcategories
export const createFilterObject = (req, res, next) => {
        let filterObject = {};
        if (req.params.categoryId) {
                filterObject = { category: req.params.categoryId };
        }
        req.filterObject = filterObject;
        next();
}

// @desc   - Get all subCategories
// @route  - GET /api/v1/subcategories
// @access - Private
export const getSubCategories = getAll(SubCategory);

// @desc   - Get a single subCategory
// @route  - GET /api/v1/subcategories/:id
// @access - Private
export const getSubCategory = getOne(SubCategory);

// @desc   - Update a subCategory
// @route  - PUT /api/v1/subcategories/:id
// @access - Private
export const updateSubCategory = updateOne(SubCategory);

// @desc   - Delete a subCategory
// @route  - DELETE /api/v1/subcategories/:id
// @access - Private
export const deleteSubCategory = deleteOne(SubCategory);