import { body, check } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';

export const getBrandValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

export const createBrandValidator = [
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
        body('name').custom((value, { req }) => {
                req.body.name = value.toLowerCase();
                req.body.slug = slugify(value);
                return true;
        }
        ),
        validatorMiddleware,
];

export const updateBrandValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        check('name').optional().notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long'),
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

export const deleteBrandValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];