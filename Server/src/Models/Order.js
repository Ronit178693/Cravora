import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Assigned when a student accepts the delivery request
    },
    outlet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: String
    }],
    pickupLocation: {
        type: String,
        required: true // This will now always be the Outlet's location
    },
    dropLocation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    // paymentStatus: {
    //     type: String,
    //     enum: ['Pending', 'Paid', 'Failed'],
    //     default: 'Pending'
    // },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);