import mongoose from 'mongoose';
import product from './productModel.js';

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
        // parent reference (one to many) beceause product have many reviews
        product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Review must belong to a product'],
        },
}, { timestamps: true });

reviewSchema.pre(/^find/, function (next) {
        this.populate({ path: 'user', select: 'name' });
        next();
});

reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
        const aggregate = this.aggregate([
                // Stage 1 : get all reviews in specified product
                { $match: { product: productId } },
                // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
                { $group: { _id: '$product', averageRating: { $avg: '$rating' }, quantity: { $sum: 1 } } }
        ]);
        const [result] = await aggregate.exec();
        result.averageRating = Math.round(result.averageRating * 10) / 10;
        // console.log(result);
        // update product with avgRatings and ratingsQuantity if there is review for this product
        if (result.quantity) {
                await product.findByIdAndUpdate(productId, {
                        ratingsAverage: result.averageRating,
                        ratingsQuantity: result.quantity
                });
        } else {
                await product.findByIdAndUpdate(productId, {
                        ratingsAverage: 0,
                        ratingsQuantity: 0
                });
        }
        return result;
}

reviewSchema.post('save', async function () {
        await this.constructor.calcAverageRatingAndQuantity(this.product);
});
reviewSchema.post('remove', async function () {
        await this.constructor.calcAverageRatingAndQuantity(this.product);
});


export default mongoose.model('Review', reviewSchema);