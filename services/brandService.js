import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import ApiError from '../utils/apiError.js';

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1; // req.query.page * 1 || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = page * limit - limit; //(page - 1) * limit;

        const brands = await Brand.find().skip(skip).limit(limit);
        res.status(200).json({
                page,
                success: true,
                count: brands.length,
                data: brands
        });
});

// @desc    Get a single brand
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrand = asyncHandler(async (req, res, next) => {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
                return next(new ApiError('Brand not found', 404));
        }
        res.status(200).json({ data: brand });
}
);

// @desc   - Create a new brand
// @route  - POST /api/v1/brands
// @access - Private
export const createBrand = asyncHandler(async (req, res) => {
        const name = req.body.name.toLowerCase();
        const brand = await Brand.create({ name, slug: slugify(name) })
        res.status(201).json({ data: brand });
}
);

// @desc   - Update a brand
// @route  - PUT /api/v1/brands/:id
// @access - Private
export const updateBrand = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const name = req.body.name.toLowerCase();
        const updatedBrand = await Brand.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        if (!updatedBrand) {
                return next(new ApiError('Brand not found', 404));
        }
        res.status(200).json({
                success: true,
                data: updatedBrand
        });
}
);

// @desc   - Delete a brand
// @route  - DELETE /api/v1/brands/:id
// @access - Private
export const deleteBrand = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
                return next(new ApiError('Brand not found', 404));
        }
        res.status(204).send();
}
);