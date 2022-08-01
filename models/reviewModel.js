import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
        title: {
                type: String,
        },
        rating: {
                type: Number,
                min: [1, 'Rating must be at least 1'],
                max: [5, 'Rating must be at most 5'],
                required: [true, 'Rating is required']
        },
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: [true, 'Review must belong to a user'],
        },
        product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Review must belong to a product'],
        },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);