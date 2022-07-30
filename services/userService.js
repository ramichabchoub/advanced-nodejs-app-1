import bcrypt from 'bcrypt';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import {
        deleteOne,
        createOne,
        getOne,
        getAll,
} from './handlersFactory.js';
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware.js';
import ApiError from '../utils/apiError.js';

export const resizeImage = asyncHandler(async (req, res, next) => {
        const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
        if (req.file) {
                await sharp(req.file.buffer).resize(400, 400).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/users/${filename}`);
                req.body.profileImg = filename;
        }
        next();
}
);
export const uploadUserImage = uploadSingleImage('profileImg');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  private/admin
export const getUsers = getAll(User);

// @desc    Get a single user
// @route   GET /api/v1/users/:id
// @access  private/admin
export const getUser = getOne(User);

// @desc   - Create a new user
// @route  - POST /api/v1/users
// @access - Private/Admin
export const createUser = createOne(User);

// @desc   - Update a user
// @route  - PUT /api/v1/users/:id
// @access - Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
        const doc = await User.findByIdAndUpdate(req.params.id,
                {
                        name: req.body.name,
                        slug: req.body.slug,
                        email: req.body.email,
                        profileImg: req.body.profileImg,
                        phone: req.body.phone,
                        role: req.body.role,
                },
                { new: true });
        if (!doc) {
                return next(new ApiError('Not found', 404));
        }
        res.status(200).json({ success: true, data: doc });
});

// update user password (hash)
export const changeUserPassword = asyncHandler(async (req, res, next) => {
        const doc = await User.findByIdAndUpdate(req.params.id,
                {
                        password: await bcrypt.hash(req.body.password, 12),
                        passwordChangedAt: Date.now(),
                },
                { new: true });
        if (!doc) {
                return next(new ApiError('Not found', 404));
        }
        res.status(200).json({ success: true, data: doc });
}
);


// @desc   - Delete a user
// @route  - DELETE /api/v1/users/:id
// @access - Private/Admin
export const deleteUser = deleteOne(User);