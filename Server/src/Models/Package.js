import mongoose from "mongoose";

/**
 * Package Mongoose Schema
 * Represents a custom package/parcel delivery request placed by a student.
 * Tracks client customer, delivering runner, parcel type, custom descriptions, 
 * pickup gate/store, university dropoff building, tip fees, status timeline, and timestamps.
 */
const PackageSchema = new mongoose.Schema({
    // Reference ID of the student customer requesting the parcel delivery
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Reference ID of the student runner handling the delivery (null until claimed)
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Category classification of the package being delivered
    type: {
        type: String,
        enum: ['Courier', 'Blinket', 'Food'],
        required: true
    },
    // Brief details/description of the items being transported
    description: {
        type: String,
        maxLength: 200,
        trim: true
    },
    // Quantity/count of items/bags
    quantity: {
        type: Number,
        default: 1
    },
    // Pickup location inside/outside university gates
    pickupLocation: {
        type: String,
        required: [true, 'Please specify where to pick this up (e.g., Main Gate)']
    },
    // Delivery dropoff point on campus
    dropLocation: {
        type: String,
        required: [true, 'Please specify where to deliver this']
    },
    // Delivery status state timeline progression
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'PickedUp', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    // Custom tip fee offered to the runner (validated as positive number)
    deliveryFee: {
        type: Number,
        default: 0
    },
    // Optional delivery details or special gates/directions instructions
    instructions: {
        type: String,
        trim: true
    },
    // Timestamp log of when delivery was successfully completed
    deliveredAt: {
        type: Date
    }
}, { 
    timestamps: true 
});

export default mongoose.model('Package', PackageSchema);
