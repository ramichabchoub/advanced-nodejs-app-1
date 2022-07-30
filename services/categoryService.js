import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import {
        deleteOne,
        updateOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware.js';

// 1) Disk storage engine
// const multerStorage = multer.diskStorage({
//         destination: (req, file, cb) => {
//                 cb(null, 'uploads/categories');
//         },
//         filename: (req, file, cb) => {
//                 // const extention = file.originalname.split('.').pop();
//                 const ectension = file.mimetype.split('/')[1];
//                 const filename = `category-${uuidv4()}-${Date.now()}.${ectension}`;
//                 cb(null, filename);
//         }
// });

// const multerFilter = (req, file, cb) => { // check if file is an image or not
//         if (file.mimetype.startsWith('image')) {
//                 cb(null, true);
//         } else {
//                 cb(new ApiError('Not an image!', 400), false);
//         }
// }

// 2) Memory storage engine
// const multerStorage = multer.memoryStorage();
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
        const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
        if (req.file) {
                await sharp(req.file.buffer).resize(400, 400).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/categories/${filename}`);
        }
        req.body.image = filename;
        next();
}
);

// export const uploadCategoryImage = upload.single('image');
export const uploadCategoryImage = uploadSingleImage('image');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = getAll(Category);
// export const getCategories = asyncHandler(async (req, res) => {
//         const countDocuments = await Category.countDocuments();
//         const features = new ApiFeatures(Category.find(), req.query);
//         features.filter().sort().search().paginate(countDocuments).select();
//         const { mongooseQuery, paginationResult } = features;
//         const categories = await mongooseQuery;
//         res.status(200).json({
//                 success: true,
//                 count: categories.length,
//                 paginationResult,
//                 data: categories,
//         });
// });

// @desc   - Get a category by id
// @route  - GET /api/v1/categories/:id
// @access - Public
export const getCategory = getOne(Category);
// export const getCategory = asyncHandler(async (req, res, next) => {
//         const { id } = req.params;
//         const category = await Category.findById(id);
//         if (!category) {
//                 return next(new ApiError('Category not found', 404));
//         }
//         res.status(200).json({
//                 success: true,
//                 data: category
//         });
// }
// );

// @desc   - Create a new category
// @route  - POST /api/v1/categories
// @access - Private/Admin-Manager
export const createCategory = createOne(Category);
// export const createCategory = asyncHandler(async (req, res) => {
//         const name = req.body.name.toLowerCase();
//         const category = await Category.create({ name, slug: slugify(name) })
//         res.status(201).json({ data: category });
// }
// );

// @desc   - Update a category
// @route  - PUT /api/v1/categories/:id
// @access - Private/Admin-Manager
export const updateCategory = updateOne(Category);
// export const updateCategory = asyncHandler(async (req, res, next) => {
//         const { id } = req.params;
//         const name = req.body.name.toLowerCase();
//         const updatedCategory = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
//         if (!updatedCategory) {
//                 return next(new ApiError('Category not found', 404));
//         }
//         res.status(200).json({
//                 success: true,
//                 data: updatedCategory
//         });
// }
// );

// @desc   - Delete a category
// @route  - DELETE /api/v1/categories/:id
// @access - Private/Admin
export const deleteCategory = deleteOne(Category);
// export const deleteCategory = asyncHandler(async (req, res, next) => {
//         const { id } = req.params;
//         const deletedCategory = await Category.findByIdAndDelete(id);
//         if (!deletedCategory) {
//                 return next(new ApiError('Category not found', 404));
//         }
//         res.status(204).send();
// }
// );