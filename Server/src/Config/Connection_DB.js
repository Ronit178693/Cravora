import mongoose from "mongoose";

/**
 * Utility: MongoDB Connection Manager
 * Establishes connection to the MongoDB database using Mongoose.
 * Implements a connection timeout of 5 seconds to prevent hanging requests,
 * and terminates the Node process if connection fails at startup.
 */
const Connection = async () => {
    try {
        // Step 1: Connect to the database using URI from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Terminate connection attempt if server doesn't respond in 5s
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process immediately on failure to prevent server running in unhealthy state
        process.exit(1); 
    }
};

export default Connection;
