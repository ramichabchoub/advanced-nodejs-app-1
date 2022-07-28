import mongoose from 'mongoose';

// 1- create schema
const categorySchema = new mongoose.Schema({
        name: {
                type: String,
                required: [true, 'Category name is required'],
                unique: [true, 'Category name is already taken'],
                minlength: [2, 'Category name must be at least 3 characters long'],
                maxlength: [32, 'Category name must be at most 20 characters long']
        },
        slug: {
                type: String,
                lowercase: true,
        },
        image: String,
}, { timestamps: true });

// mongoose middleware
const setImageUrl = (doc, next) => {
        if (doc.image) {
                doc.image = `${process.env.BASE_URL}/uploads/categories/${doc.image}`;
        }
}
// init work with findOne findAll updateOne
// set image base url + image name
categorySchema.post('init', setImageUrl);
// save work with createOne
categorySchema.post('save', setImageUrl);

// 2- create model
const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;