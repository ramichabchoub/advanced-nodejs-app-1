import bcrypt from 'bcrypt';
import { body, check } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';
import User from '../../models/userModel.js';

export const createUserValidator = [
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
        check('phone').optional().isMobilePhone(['ar-TN', 'ar-SA']).withMessage('Phone is invalid'),
        check('profileImg').optional().custom(async (value, { req }) => {
                if (value) {
                        const file = req.files.profileImg;
                        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
                                throw new Error('Profile image must be a png or jpeg');
                        }
                }
        }
        ),
        check('role').optional().isIn(['user', 'manager', 'admin']).withMessage('Role is invalid'),
        body('name').custom((value, { req }) => {
                req.body.name = value.toLowerCase();
                req.body.slug = slugify(value);
                return true;
        }
        ),
        validatorMiddleware,
];
export const getUserValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

export const updateUserValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        check('name').optional().notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
        check('email').notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Email is invalid')
                .custom(async (value, { req }) => {
                        const user = await User.findOne({ email: value });
                        if (user) {
                                throw new Error('Email already used');
                        }
                }
                ),
        check('phone').optional().isMobilePhone(['ar-TN', 'ar-SA']).withMessage('Phone is invalid'),
        check('profileImg').optional().custom(async (value, { req }) => {
                if (value) {
                        const file = req.files.profileImg;
                        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
                                throw new Error('Profile image must be a png or jpeg');
                        }
                }
        }
        ),
        check('role').optional().isIn(['user', 'manager', 'admin']).withMessage('Role is invalid'),
        body('name').custom((value, { req }) => {
                if (value) {
                        req.body.name = value.toLowerCase();
                        req.body.slug = slugify(value);
                }
                return true;
        }
        ),
        validatorMiddleware,
];

export const changeUserPasswordValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        body('currentPassword').notEmpty().withMessage('You must enter your current password'),
        body('passwordConfirm').notEmpty().withMessage('You must confirm your new password'),
        body('password').notEmpty().withMessage('You must enter your new password')
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
                .custom(async (password, { req }) => {
                        // 1) Verify current password
                        const user = await User.findById(req.params.id);
                        if (!user) {
                                throw new Error('User not found');
                        }
                        const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
                        if (!isCorrectPassword) {
                                throw new Error('Current password is incorrect');
                        }
                        // 2) Verify new password confirmation
                        if (password !== req.body.passwordConfirm) {
                                throw new Error('Password Confirmation incorrect');
                        }
                        // 3) verify new password is not the same as current password
                        if (password === req.body.currentPassword) {
                                throw new Error('You have already used this password before, please choose a new one');
                        }
                        // // 4) verify new password is not the same as previous passwords
                        // if (user.previousPasswords.includes(password)) {
                        //         throw new Error('You have already used this password before');
                        // }
                        return true;
                }
                ),
        validatorMiddleware,
];

export const deleteUserValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];