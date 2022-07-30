import { body, check } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../../middlewares/validatorMiddleware.js';
import Category from '../../models/categoryModel.js';

export const getCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];

// category required min 3 characters, max 32 characters and must be unique
export const createCategoryValidator = [
        check('name').notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name must be at least 3 characters long')
                .isLength({ max: 32 }).withMessage('Name must be at most 20 characters long')
                .custom(async (value) => {
                        const category = await Category.findOne({ name: value });
                        if (category) {
                                throw new Error('Category already exists');
                        }
                }
                ).withMessage('Category already exists'),
        validatorMiddleware,
];

export const updateCategoryValidator = [
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

export const deleteCategoryValidator = [
        check('id').isMongoId().withMessage('Invalid id format'),
        validatorMiddleware,
];