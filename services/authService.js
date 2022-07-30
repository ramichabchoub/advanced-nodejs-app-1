import crypto from 'crypto';

import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

const createToken = (payload) => Jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME })

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
        // 3) if user exists, check if password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new ApiError('Incorrect email or password', 401);
        }
        // 4) generate a token
        const token = createToken(user._id);
        // 5) send the token to the user
        res.status(200).json({ data: user, token });
});

// @desc   make sure user is logged in
export const protect = asyncHandler(async (req, res, next) => {
        // 1) check if token exists, if exists get
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
                throw new ApiError('You are not logged in! Please login to continue.', 401);
        }
        // 2) Verify token (no change happens, expired token)
        const decoded = await Jwt.verify(token, process.env.JWT_SECRET_KEY);
        // 3) Check if user exists
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
                throw new ApiError('User does not exist', 401);
        }
        // 4) check if user changed password after the token was created
        if (currentUser.passwordChangedAt) {
                const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
                const tokenCreatedTimestamp = parseInt(decoded.iat, 10);
                if (tokenCreatedTimestamp < passChangedTimestamp) {
                        throw new ApiError('User recently changed password! Please login again.', 401);
                }
        }
        // 5) set user to req.user
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