import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const getCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

export const createCategoryValidator = [
        check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .isLength({ max: 20 }).withMessage('Name must be at most 20 characters long'),
        validatorMiddleware,
];

export const updateCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .isLength({ max: 20 }).withMessage('Name must be at most 20 characters long'),
        validatorMiddleware,
];

export const deleteCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];