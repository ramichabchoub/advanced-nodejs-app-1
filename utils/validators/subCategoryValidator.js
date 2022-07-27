import { body, check } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const getSubCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

export const createSubCategoryValidator = [
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long')
                .custom((value, { req }) => {
                        req.body.name = value.toLowerCase();
                        req.body.slug = slugify(value);
                        return true;
                }
                ),
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
        body('name').custom((value, { req }) => {
                req.body.name = value.toLowerCase();
                return true;
        }
        ),
        validatorMiddleware,
];

export const deleteSubCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];