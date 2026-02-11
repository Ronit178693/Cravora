import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema({

    // User Details
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    role: {
        type: String,
        enum: ['Student', 'Outlet', 'DeliveryPartner', 'Admin'],
        default: 'Student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Enhanced tracking fields
    deliveryStats: {
        deliveriesCompleted: { type: Number, default: 0 },
        // ratings: [{
        //   order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        //   rating: { type: Number, min: 1, max: 5 },
        //   feedback: String
        // }]
    },
    orderHistory: [
        {
            order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            orderedAt: { type: Date, default: Date.now }
        }
    ],
    lastDeliveryAt: { type: Date }
}, { timestamps: true })


// Hashing Password

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

