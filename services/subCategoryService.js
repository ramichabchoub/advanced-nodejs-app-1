import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import SubCategory from '../models/subCategoryModel.js';
import ApiFeatures from '../utils/apiFeatures.js';


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
export const createSubCategory = asyncHandler(async (req, res) => {
        const name = req.body.name.toLowerCase();
        const slug = slugify(name, { lower: true });
        const {category} = req.body;
        const subCategory = await SubCategory.create({
                name,
                slug,
                category,
        });
        res.status(201).json({
                success: true,
                data: subCategory,
        });
}
);

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
export const getSubCategories = asyncHandler(async (req, res) => {
        const countDocuments = await SubCategory.countDocuments();
        const features = new ApiFeatures(SubCategory.find(), req.query);
        features.filter().sort().search().paginate(countDocuments).select();
        const { mongooseQuery, paginationResult } = features;
        const subCategories = await mongooseQuery;
        res.status(200).json({
                success: true,
                count: subCategories.length,
                paginationResult,
                data: subCategories,
        });
}
);

// @desc   - Get a single subCategory
// @route  - GET /api/v1/subcategories/:id
// @access - Private
export const getSubCategory = asyncHandler(async (req, res) => {
        const subCategory = await SubCategory.findById(req.params.id)
                .populate({
                        path: 'category',
                        select: 'name'
                }
                );
        if (!subCategory) {
                throw new ApiError(`SubCategory not found with id ${req.params.id}`, 404);
        }
        res.status(200).json({ data: subCategory });
}
);

// @desc   - Update a subCategory
// @route  - PUT /api/v1/subcategories/:id
// @access - Private
export const updateSubCategory = asyncHandler(async (req, res) => {
        const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, {
                name: req.body.name.toLowerCase(),
                slug: slugify(req.body.name.toLowerCase()),
                category: req.body.category
        }
                , { new: true });
        if (!subCategory) {
                throw new ApiError(`SubCategory not found with id ${req.params.id}`, 404);
        }
        res.status(200).json({ data: subCategory });
}
);

// @desc   - Delete a subCategory
// @route  - DELETE /api/v1/subcategories/:id
// @access - Private
export const deleteSubCategory = asyncHandler(async (req, res) => {
        const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!subCategory) {
                throw new ApiError(`SubCategory not found with id ${req.params.id}`, 404);
        }
        res.status(200).json({ data: subCategory });
}
);