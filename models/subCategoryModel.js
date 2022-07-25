import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
        name: {
                type: String,
                trim: true,
                unique: [true, 'Sub Category name is already taken'],
                minlength: [2, 'Sub Category name must be at least 3 characters long'],
                maxlength: [32, 'Sub Category name must be at most 20 characters long']
        },
        slug: {
                type: String,
                lowercase: true,
        },
        image: String,
        category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: [true, 'Category is required'],
        },
}, { timestamps: true });

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

export default SubCategoryModel;