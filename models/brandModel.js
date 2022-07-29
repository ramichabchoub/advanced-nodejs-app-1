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


const setImageURL = (doc) => {
        if (doc.image) {
                const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
                doc.image = imageUrl;
        }
};
// findOne, findAll and update
brandSchema.post('init', (doc) => {
        setImageURL(doc);
});

// create
brandSchema.post('save', (doc) => {
        setImageURL(doc);
});

export default mongoose.model('Brand', brandSchema);