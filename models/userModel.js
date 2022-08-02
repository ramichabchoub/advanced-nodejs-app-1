import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
        name: {
                type: String,
                trim: true,
                required: [true, 'Name is required']
        },
        slug: {
                type: String,
                lowercase: true
        },
        email: {
                type: String,
                required: [true, 'Email is required'],
                unique: true,
                lowercase: true
        },
        phone: String,
        profileImg: String,
        password: {
                type: String,
                required: [true, 'Password is required'],
                minlength: [6, 'Password must be at least 6 characters']
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
                type: String,
                enum: ['user', 'manager', 'admin'],
                default: 'user'
        },
        active: {
                type: Boolean,
                default: true
        },
        // child reference (one to many) because user don't have many wishlist products
        wishlist: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
        }],
        // Embedded Document
        // address: [{ title: String, postalCode: String, street: String, city: String, country: String }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) {
                return next();
        }
        // Hashing user password
        this.password = await bcrypt.hash(this.password, 12);
        next();
}
);

export default mongoose.model('User', userSchema);