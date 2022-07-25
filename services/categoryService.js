import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import ApiError from '../utils/apiError.js';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1; // req.query.page * 1 || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = page * limit - limit; //(page - 1) * limit;

        const categories = await Category.find().skip(skip).limit(limit);
        res.status(200).json({
                page,
                success: true,
                count: categories.length,
                data: categories
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