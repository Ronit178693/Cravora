import mongoose from "mongoose";

const Connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        console.error("Retrying in 5 seconds...");
        // Retry once instead of crashing immediately
        setTimeout(async () => {
            try {
                const conn = await mongoose.connect(process.env.MONGODB_URI, {
                    serverSelectionTimeoutMS: 10000,
                });
                console.log(`MongoDB Connected on retry: ${conn.connection.host}`);
            } catch (retryError) {
                console.error(`MongoDB retry failed: ${retryError.message}`);
                // Don't call process.exit() — let the server keep running
                // Individual requests will fail with DB errors instead of the whole server dying
            }
        }, 5000);
    }
};

export default Connection;
