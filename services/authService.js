import crypto from 'crypto';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';
import createToken from '../utils/createToken.js';

// @desc    Signup a new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {
        // 1) Create a new user
        const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
        });
        // 2) generate a token
        const token = createToken(user._id);
        // 3) send the token to the user
        res.status(201).json({ data: user, token });
});

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
        // 1) check if password and email are in the request body (validation)
        const { email, password } = req.body;
        // 2) check if user exists
        const user = await User.findOne({ email }).select('+password');
        // 3) if user exists, check if password is correct and if user changed his password display when he last changed it
        if (!user || !(await bcrypt.compare(password, user.password)) && user.passwordChangedAt) {
                user.passwordChangedAt = user.passwordChangedAt.toISOString();
                throw new ApiError(`Invalid credentials and password has been changed at ${user.passwordChangedAt}`, 401);
        }
        // 4) generate a token
        const token = createToken(user._id);
        // 5) send the token to the user
        res.status(200).json({ data: user, token });
});

// @desc   make sure user is logged in
export const protect = asyncHandler(async (req, res, next) => {
        // 1) Check if token exist, if exist get
        let token;
        if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
        ) {
                token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
                return next(
                        new ApiError(
                                'You are not login, Please login to get access this route',
                                401
                        )
                );
        }
        // 2) Verify token (no change happens, expired token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // 3) Check if user exists
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
                return next(
                        new ApiError(
                                'The user that belong to this token does no longer exist',
                                401
                        )
                );
        }
        // 4) Check if user change his password after token created
        if (currentUser.passwordChangedAt) {
                const passChangedTimestamp = parseInt(
                        currentUser.passwordChangedAt.getTime() / 1000,
                        10
                );
                // Password changed after token created (Error)
                if (passChangedTimestamp > decoded.iat) {
                        return next(
                                new ApiError(
                                        'User recently changed his password. please login again..',
                                        401
                                )
                        );
                }
        }
        req.user = currentUser;
        next();
});

// @desc   Authorization (user permissions)
export const allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes(req.user.role)) {
                throw new ApiError(`This action is not allowed for ${req.user.role}`, 403);
        }
        next();
});

// @desc   Reset password
// @route  POST /api/v1/auth/reset-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
        // 1) get user based on email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
                throw new ApiError(`No user found with this email ${req.body.email}`, 404);
        }
        // 2) if user exist, generate 6 random digits and save it in db hash
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
        user.passwordResetCode = hashedResetCode;
        // add expiration to the code (10 minutes)
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        user.passwordResetVerified = false;
        await user.save();
        // 3) send the reset code via email
        try {
                const message = ` Hi ${user.name}, \n
        You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Your reset code is ${resetCode}.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/api/v1/auth/reset-password/${resetCode}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;
                await sendEmail({
                        email: user.email,
                        subject: 'Password reset',
                        message,
                });
        } catch (err) {
                user.passwordResetCode = undefined;
                user.passwordResetExpires = undefined;
                user.passwordResetVerified = undefined;
                await user.save();
                throw new ApiError('Error sending email', 500);
        }
        res.status(200).json({ message: 'Email sent' });
});


// @desc   Verify reset code
// @route  GET /api/v1/auth/verify-reset-code
// @access Public
export const verifyResetCode = asyncHandler(async (req, res, next) => {
        // 1) Get user based on reset code
        const hashedResetCode = crypto
                .createHash('sha256')
                .update(req.body.resetCode)
                .digest('hex');

        const user = await User.findOne({
                passwordResetCode: hashedResetCode,
        });
        if (user) {
                const resetCodeExpiry = user.passwordResetExpires;
                if (resetCodeExpiry < Date.now()) {
                        throw new ApiError('Reset code expired', 400);
                }
                if (user.passwordResetVerified) {
                        throw new ApiError('This code has already been used', 400);
                }
        }
        if (!user) {
                throw new ApiError('Invalid reset code', 400);
        }
        // 2) Reset code valid
        user.passwordResetVerified = true;
        await user.save();

        res.status(200).json({
                status: 'Success',
        });
}
);

// @desc   Reset password
// @route  PUT /api/v1/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
        // 1) Get user based on email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
                throw new ApiError(`No user found with this email ${req.body.email}`, 404);
        }
        // 2) check if reset code is valid
        if (!user.passwordResetVerified) {
                throw new ApiError('Reset code not verified', 400);
        }

        user.password = req.body.password;
        user.passwordChangedAt = Date.now();
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();

        // 3) if everything is ok, generate a new token
        const token = await createToken(user._id);
        res.status(200).json({
                status: 'Success',
                token,
        });
});