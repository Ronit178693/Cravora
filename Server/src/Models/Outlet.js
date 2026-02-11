import mongoose from "mongoose";

const OutletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide outlet name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please provide outlet location inside university']
    },
    contactNumber: {
        type: String
    },
    images: [{
        type: String // URL to image
    }],
    WorkingHours: {
        open: String, // e.g., "09:00"
        close: String // e.g., "22:00"
    },
    isOpen: {
        type: Boolean,
        default: true
    },
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
            type: String
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    orderCount: { type: Number, default: 0 },
    orders: [
        {
            order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            orderedAt: { type: Date, default: Date.now }
        }
    ],
    // rating: {
    //     type: Number,
    //     default: 0,
    //     min: 0,
    //     max: 5
    // }
}, { timestamps: true });

export default mongoose.model('Outlet', OutletSchema);
