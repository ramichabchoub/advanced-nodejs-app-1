import { body, check } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';
import User from '../../models/userModel.js';

export const signupValidator = [
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        check('email').notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid')
                .custom(async (value, { req }) => {
                        const user = await User.findOne({ email: value });
                        if (user) {
                                throw new Error('Email already used');
                        }
                }
                ),
        check('password')
                .notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters')
                .custom((password, { req }) => {
                        if (password !== req.body.passwordConfirm) {
                                throw new Error('Password Confirmation incorrect');
                        }
                        return true;
                }),
        check('passwordConfirm')
                .notEmpty()
                .withMessage('Password confirmation required'),
        body('name').custom((value, { req }) => {
                req.body.name = value.toLowerCase();
                req.body.slug = slugify(value);
                return true;
        }
        ),
        validatorMiddleware,
];

export const loginValidator = [
        check('email').notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid'),
        check('password')
                .notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
        validatorMiddleware,
];

export const forgotPasswordValidator = [
        check('email').notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid'),
        validatorMiddleware,
];

export const verifyResetCodeValidator = [
        check('code').notEmpty().withMessage('Code is required'),
        validatorMiddleware,
];

export const resetPasswordValidator = [
        check('password')
                .notEmpty()
                .withMessage('Password required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
        validatorMiddleware,
];