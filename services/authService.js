import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';

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

export const allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes(req.user.role)) {
                throw new ApiError(`This action is not allowed for ${req.user.role}`, 403);
        }
        next();
});