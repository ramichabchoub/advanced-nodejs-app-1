import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const getBrandValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

export const createBrandValidator = [
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
        validatorMiddleware,
];

export const updateBrandValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
        validatorMiddleware,
];

export const deleteBrandValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];