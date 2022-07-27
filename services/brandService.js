import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import {
        deleteOne,
        updateOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = getAll(Brand);

// @desc    Get a single brand
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrand = getOne(Brand);

// @desc   - Create a new brand
// @route  - POST /api/v1/brands
// @access - Private
export const createBrand = createOne(Brand);

// methode 1 with middleware // methode 2 with validator
export const applySlug = asyncHandler(async (req, res, next) => {
        const name = req.body.name.toLowerCase();
        req.body.slug = slugify(name);
        next();
}
);

// @desc   - Update a brand
// @route  - PUT /api/v1/brands/:id
// @access - Private
export const updateBrand = updateOne(Brand);

// @desc   - Delete a brand
// @route  - DELETE /api/v1/brands/:id
// @access - Private
export const deleteBrand = deleteOne(Brand);