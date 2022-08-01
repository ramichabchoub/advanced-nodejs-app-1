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
import createToken from '../utils/createToken.js';

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

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
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

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
        req.params.id = req.user._id;
        next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
        // 1) Update user password based user payload (req.user._id)
        const user = await User.findByIdAndUpdate(
                req.user._id,
                {
                        password: await bcrypt.hash(req.body.password, 12),
                        passwordChangedAt: Date.now(),
                },
                {
                        new: true,
                }
        );

        // 2) Generate token
        const token = createToken(user._id);

        res.status(200).json({ data: user, token }); // if user change password, we generate a new token, but if admin change password, we don't generate a new token
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
        const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                },
                { new: true }
        );

        res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
export const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
        await User.findByIdAndUpdate(req.user._id, { active: false });

        res.status(204).json({ status: 'Success' });
});