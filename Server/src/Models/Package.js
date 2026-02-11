import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    type: {
        type: String,
        enum: ['Courier', 'Blinket', 'Food'],
        required: true
    },
    description: {
        type: String,
        maxLength: 200,
        trim: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please specify where to pick this up (e.g., Main Gate)']
    },
    dropLocation: {
        type: String,
        required: [true, 'Please specify where to deliver this']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'PickedUp', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    instructions: {
        type: String,
        trim: true
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Package', PackageSchema);
