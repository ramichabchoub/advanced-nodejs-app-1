import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
        name: {
                type: String,
                required: [true, 'Brand name is required'],
                unique: [true, 'Brand name is already taken'],
                minlength: [2, 'Brand name must be at least 3 characters long'],
                maxlength: [32, 'Brand name must be at most 20 characters long']
        },
        slug: {
                type: String,
                lowercase: true,
        },
        image: String,
}, { timestamps: true });


const setImageUrl = (doc, next) => {
        if (doc.image) {
                doc.image = `${process.env.BASE_URL}/uploads/brands/${doc.image}`;
        }
}
brandSchema.post('init', setImageUrl);
// save work with createOne
brandSchema.post('save', setImageUrl);

export default mongoose.model('Brand', brandSchema);