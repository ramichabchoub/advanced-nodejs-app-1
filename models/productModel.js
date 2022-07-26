import mongoose from "mongoose";

const prductSchema = new mongoose.Schema({
        title: {
                type: String,
                required: true,
                trim: true,
                minlength: [3, "Title must be at least 3 characters long"],
                maxlength: [100, "Title must be at most 100 characters long"]
        },
        slug: {
                type: String,
                required: true,
                lowercase: true
        },
        description: {
                type: String,
                required: [true, "Description is required"],
                minlength: [20, "Description must be at least 20 characters long"]
        },
        quantity: {
                type: Number,
                required: [true, "Quantity is required"]
        },
        sold: {
                type: Number,
                default: 0
        },
        price: {
                type: Number,
                required: [true, "Price is required"],
                trim: true,
                max: [999999, "Price must be at most $999999"]
        },
        priceAfterDiscount: {
                type: Number
        },
        colors: {
                type: [String]
        },
        images: {
                type: [String]
        },
        imageCover: {
                type: String,
                required: [true, "Image cover is required"]
        },
        category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                required: [true, "Category is required"]
        },
        subCategories: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubCategory"
        }],
        brand: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Brand",
        },
        ratingsAverage: {
                type: Number,
                min: [1, "Rating must be at least 1"],
                max: [5, "Rating must be at most 5"]
        },
        ratingsQuantity: {
                type: Number,
                default: 0
        }
}, {
        timestamps: true
});

export default mongoose.model("Product", prductSchema);