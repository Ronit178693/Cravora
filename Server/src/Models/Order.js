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
        required: function () { return this.orderType === 'Food'; } // Only required if it's a food order
    },
    orderType: {
        type: String,
        enum: ['Food', 'Package'],
        default: 'Food'
    },
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId },
        name: {
            type: String,
            required: function () { return this.parent().orderType === 'Food'; }
        },
        price: {
            type: Number,
            required: function () { return this.parent().orderType === 'Food'; }
        },
        quantity: { type: Number, default: 1 },
        image: String
    }],
    packageDetails: {
        description: String,
        weight: String, // approx (e.g. "Light", "Heavy")
        instruction: String
    },
    pickupLocation: {
        type: String,
        required: true // For Food this is Outlet location (auto-filled), for Package it's user input
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