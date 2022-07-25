import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const getSubCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

export const createSubCategoryValidator = [
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
        check('category').notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category format'),
        validatorMiddleware,
];

export const updateSubCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
        .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
        check('category').notEmpty().withMessage('Category is required'),
        validatorMiddleware,
];

export const deleteSubCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];