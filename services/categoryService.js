import CategoryModel from '../models/categoryModel.js';

const getCategories = (req, res) => {
        const name = req.body.name;
        console.log(req.body);
        const newCategory = new CategoryModel({ name });
        newCategory.save().then((category) => {
                res.status(201).json({
                        message: 'Category created successfully',
                        category
                });
        }
        ).catch((err) => {
                res.status(500).json({
                        message: 'Error creating category',
                        error: err
                });
        }
        );
}

export default getCategories;