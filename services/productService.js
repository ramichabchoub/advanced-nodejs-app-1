import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import {
        deleteOne,
        updateOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';
import { uploadMixOfImages } from '../middlewares/uploadImageMiddleware.js';

export const uploadProductImages = uploadMixOfImages([
        {
                name: 'imageCover',
                maxCount: 1,
        },
        {
                name: 'images',
                maxCount: 5,
        },
]);
export const resizeProductImages = asyncHandler(async (req, res, next) => {
        // console.log(req.files);
        //1- Image processing for imageCover
        if (req.files.imageCover) {
                const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

                await sharp(req.files.imageCover[0].buffer)
                        .resize(2000, 1333)
                        .toFormat('jpeg')
                        .jpeg({ quality: 95 })
                        .toFile(`uploads/products/${imageCoverFileName}`);
                // Save image into our db
                req.body.imageCover = imageCoverFileName;
        }
        //2- Image processing for images
        if (req.files.images) {
                req.body.images = [];
                await Promise.all(
                        req.files.images.map(async (img, index) => {
                                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                                await sharp(img.buffer)
                                        .resize(2000, 1333)
                                        .toFormat('jpeg')
                                        .jpeg({ quality: 95 })
                                        .toFile(`uploads/products/${imageName}`);
                                // Save image into our db
                                req.body.images.push(imageName);
                        })
                );
                next();
        }
});

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = getAll(Product, 'product');
// export const getProducts = asyncHandler(async (req, res) => {
//         // Build query
//         const countDocuments = await Product.countDocuments();
//         const features = new ApiFeatures(Product.find(), req.query);
//         features.filter().sort().search('product').paginate(countDocuments).select();
//         // Execute query
//         const { mongooseQuery, paginationResult } = features;
//         const products = await mongooseQuery;
//         res.status(200).json({
//                 success: true,
//                 count: products.length,
//                 paginationResult,
//                 data: products,
//         });

// // 1) filter products based on query params
// const queryStringObject = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(field => delete queryStringObject[field]);

// // Apply filters using [gte, lte, gt, lt] operators
// let queryStr = JSON.stringify(queryStringObject);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

// // 2) paginate products
// const page = parseInt(req.query.page) || 1; // req.query.page * 1 || 1;
// const limit = parseInt(req.query.limit) || 50;
// const skip = page * limit - limit; //(page - 1) * limit;

// // Build query
// let mongooseQuery = Product.find(JSON.parse(queryStr))
//         // .where('price').equals(req.query.price)
//         // .where('ratingsAverage').equals(req.query.ratingsAverage)
//         .skip(skip).limit(limit).populate({
//                 path: 'category',
//                 select: 'name -_id',
//         });

// // 3) sort products
// if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         mongooseQuery = mongooseQuery.sort(sortBy);
// } else {
//         mongooseQuery = mongooseQuery.sort('-createdAt');
// }

// // 4) select fields
// if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         mongooseQuery = mongooseQuery.select(fields);
// } else {
//         mongooseQuery = mongooseQuery.select('-__v');
// }

// // 5) search products
// if (req.query.keyword) {
//         const keyword = req.query.keyword.toLowerCase();
//         mongooseQuery = mongooseQuery.find({
//                 $or: [
//                         { title: { $regex: keyword, $options: 'i' } },
//                         { description: { $regex: keyword, $options: 'i' } },
//                 ],
//         });
// }

// // Execute query
// const products = await mongooseQuery;

// res.status(200).json({
//         page,
//         success: true,
//         count: products.length,
//         data: products
// });
// });

// @desc   - Get a single product
// @route  - GET /api/v1/products/:id
// @access - Public
export const getProduct = getOne(Product, 'reviews');

// @desc   - Create a new product
// @route  - POST /api/v1/products
// @access - Private
export const createProduct = createOne(Product);

// @desc   - Update a product
// @route  - PUT /api/v1/products/:id
// @access - Private
export const updateProduct = updateOne(Product);

// @desc   - Delete a product
// @route  - DELETE /api/v1/products/:id
// @access - Private
export const deleteProduct = deleteOne(Product);