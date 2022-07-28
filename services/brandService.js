import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
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
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware.js';

export const resizeImage = asyncHandler(async (req, res, next) => {
        const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer).resize(400, 400).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/brands/${filename}`);
        req.body.image = filename;
        next();
}
);
export const uploadBrandImage = uploadSingleImage('image');

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
// export const applySlug = asyncHandler(async (req, res, next) => {
//         const name = req.body.name.toLowerCase();
//         req.body.slug = slugify(name);
//         next();
// }
// );

// @desc   - Update a brand
// @route  - PUT /api/v1/brands/:id
// @access - Private
export const updateBrand = updateOne(Brand);

// @desc   - Delete a brand
// @route  - DELETE /api/v1/brands/:id
// @access - Private
export const deleteBrand = deleteOne(Brand);