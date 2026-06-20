import mongoose from "mongoose";

/**
 * Order Mongoose Schema
 * Represents a food order placed by a student from a university food outlet.
 * Tracks customer/runner user references, outlet reference, structured items, 
 * delivery path checkpoints, pricing amounts, status progression, and timestamps.
 */
const OrderSchema = new mongoose.Schema({
    // Reference ID of the student customer who placed the order
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Reference ID of the student runner delivering the order (null until accepted)
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Reference ID of the preparing outlet
    outlet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    // List of ordered food items (Snapshot copies of menu details at order time)
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: String
    }],
    // Pickup location (inherited automatically from the Outlet's location)
    pickupLocation: {
        type: String,
        required: true
    },
    // Dropoff location provided by the customer during checkout
    dropLocation: {
        type: String,
        required: true
    },
    // Delivery status state timeline progression
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    // Total sum cost of the ordered menu items (calculated securely on backend)
    totalAmount: {
        type: Number,
        required: true
    },
    // Server-enforced flat delivery fee (incentive tip for the runner)
    deliveryFee: {
        type: Number,
        default: 0
    },
    // Timestamp log of when delivery was successfully completed
    deliveredAt: {
        type: Date
    }
}, { 
    timestamps: true 
});

export default mongoose.model('Order', OrderSchema);