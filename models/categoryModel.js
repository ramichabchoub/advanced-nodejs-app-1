import mongoose from 'mongoose';

// 1- create schema
const categorySchema = new mongoose.Schema({
        name: {
                type: String,
                required: [true, 'Category name is required'],
                unique: [true, 'Category name is already taken'],
                minlength: [3, 'Category name must be at least 3 characters long'],
                maxlength: [20, 'Category name must be at most 20 characters long']
        },
        slug: {
                type: String,
                lowercase: true,
        },
        image: String,
}, { timestamps: true });

// 2- create model
const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;