import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Mongoose Schema
 * Represents a registered user on the Cravora platform.
 * Supports credentials, role classification ('Student', 'Outlet'),
 * runner toggles, delivery history, order history, and security/OTP fields.
 */
const UserSchema = new mongoose.Schema({
    // User's Full Name (with basic length validation)
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    // User's Email Address (unique, lowercase, validated using Regex format check)
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    // User's Contact Phone Number (10-digit numeric validator)
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    // User's Encrypted Password (minlength 6, excluded from API queries by default)
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Prevents the password hash from being retrieved in standard find/populate queries
    },
    // User Role classification
    role: {
        type: String,
        enum: ['Student', 'Outlet'],
        default: 'Student'
    },
    // Runner Availability Toggle
    // True if a Student has active Runner Mode enabled to accept delivery requests
    isRunnerActive: {
        type: Boolean,
        default: false
    },
    // Runner delivery statistics
    deliveryStats: {
        deliveriesCompleted: { type: Number, default: 0 }
    },
    // Order history record array linking to Order documents
    orderHistory: [
        {
            order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            orderedAt: { type: Date, default: Date.now }
        }
    ],
    // Timestamp log of the runner's last completed delivery
    lastDeliveryAt: { type: Date },
    // Temporary 6-digit numeric OTP code for Password Reset
    otp: { type: Number, default: null },
    // Password Reset OTP expiration timestamp (usually set to 5 minutes)
    otpExpires: { type: Date, default: null }

}, { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' database fields
});

/**
 * Utility helper: Hash password
 * Generates a random salt with 10 cost factor rounds and hashes the plaintext password.
 */
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Utility helper: Compare password
 * Safely compares user entered password with the database hash using bcrypt.
 */
export const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

export default mongoose.model('User', UserSchema);