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

const setImageURL = (doc) => {
        if (doc.image) {
                const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
                doc.image = imageUrl;
        }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
        setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
        setImageURL(doc);
});

// 2- create model
const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;