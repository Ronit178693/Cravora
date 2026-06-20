import mongoose from "mongoose";

/**
 * Outlet Mongoose Schema
 * Represents a campus food outlet registered in the platform.
 * Stores owner reference, outlet location, operational state, working hours,
 * and a subdocument menu array representing the outlet's offered food items.
 */
const OutletSchema = new mongoose.Schema({
    // Reference ID of the owner account (User document)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Food outlet display name
    name: {
        type: String,
        required: [true, 'Please provide outlet name'],
        trim: true
    },
    // Brief marketing/operational description of the outlet
    description: {
        type: String,
        trim: true
    },
    // Physical university location (e.g. "Hostel 3 Mess Annex")
    location: {
        type: String,
        required: [true, 'Please provide outlet location inside university']
    },
    // Outlet contact details
    contactNumber: {
        type: String
    },
    // Array of Cloudinary image asset URLs representing the outlet
    images: [{
        type: String
    }],
    // Working hours (opening and closing timestamps)
    WorkingHours: {
        open: String, // format e.g. "09:00"
        close: String // format e.g. "22:00"
    },
    // Availability toggle indicating whether the outlet is open for business
    isOpen: {
        type: Boolean,
        default: true
    },
    // Menu items offered by the outlet (Subdocument Array)
    menu: [{
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            min: 0
        },
        category: {
            type: String,
            enum: ['Snacks', 'Main Course', 'Beverages', 'Dessert', 'Other'],
            default: 'Other'
        },
        image: {
            type: String // Cloudinary asset URL
        },
        isAvailable: {
            type: Boolean,
            default: true // False if out of stock
        }
    }],
    // Aggregation stats: Total number of orders placed at this outlet
    orderCount: { type: Number, default: 0 },
    // Array containing references of placed order IDs and timestamps
    orders: [
        {
            order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            orderedAt: { type: Date, default: Date.now }
        }
    ]
}, { 
    timestamps: true 
});

export default mongoose.model('Outlet', OutletSchema);
