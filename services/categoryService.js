import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
        const countDocuments = await Category.countDocuments();
        const features = new ApiFeatures(Category.find(), req.query);
        features.filter().sort().search().paginate(countDocuments).select();
        const { mongooseQuery, paginationResult } = features;
        const categories = await mongooseQuery;
        res.status(200).json({
                success: true,
                count: categories.length,
                paginationResult,
                data: categories,
        });
});

// @desc   - Get a category by id
// @route  - GET /api/v1/categories/:id
// @access - Public
export const getCategory = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
                return next(new ApiError('Category not found', 404));
        }
        res.status(200).json({
                success: true,
                data: category
        });
}
);

// @desc   - Create a new category
// @route  - POST /api/v1/categories
// @access - Private
export const createCategory = asyncHandler(async (req, res) => {
        const name = req.body.name.toLowerCase();
        const category = await Category.create({ name, slug: slugify(name) })
        res.status(201).json({ data: category });
}
);

// @desc   - Update a category
// @route  - PUT /api/v1/categories/:id
// @access - Private
export const updateCategory = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const name = req.body.name.toLowerCase();
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        if (!updatedCategory) {
                return next(new ApiError('Category not found', 404));
        }
        res.status(200).json({
                success: true,
                data: updatedCategory
        });
}
);

// @desc   - Delete a category
// @route  - DELETE /api/v1/categories/:id
// @access - Private
export const deleteCategory = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
                return next(new ApiError('Category not found', 404));
        }
        res.status(204).send();
}
);