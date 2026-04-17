/**
 * Migration Script: Unify 'Runner' and 'DeliveryPartner' roles into 'Student'
 * 
 * WHY: In Cravora's campus model, every runner IS a student. Having separate roles
 * created data fragmentation — students who signed up as "Runner" couldn't order food,
 * and the codebase already treated them identically (authorize("Student") everywhere).
 * 
 * WHAT THIS DOES:
 * 1. Finds all users with role 'Runner' or 'DeliveryPartner' 
 * 2. Converts them to role: 'Student' + isRunnerActive: true
 * 3. Preserves their delivery history and stats
 * 
 * RUN: node src/scripts/migrateRoles.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from Server root
dotenv.config({ path: resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
}

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        const db = mongoose.connection.db;
        const usersCollection = db.collection("users");

        // Step 1: Find all users with legacy roles
        const legacyUsers = await usersCollection.find({
            role: { $in: ["Runner", "DeliveryPartner"] }
        }).toArray();

        console.log(`📊 Found ${legacyUsers.length} user(s) with legacy roles:\n`);

        if (legacyUsers.length === 0) {
            console.log("✅ No migration needed — all users already have 'Student' or 'Outlet' roles.");
            await mongoose.disconnect();
            return;
        }

        // Log each user being migrated
        for (const user of legacyUsers) {
            console.log(`   👤 ${user.name} (${user.email}) — role: "${user.role}" → "Student" + isRunnerActive: true`);
        }

        // Step 2: Bulk update — convert Runner/DeliveryPartner → Student with runner flag
        const result = await usersCollection.updateMany(
            { role: { $in: ["Runner", "DeliveryPartner"] } },
            {
                $set: {
                    role: "Student",
                    isRunnerActive: true  // They were runners, so keep them active
                }
            }
        );

        console.log(`\n✅ Migration complete!`);
        console.log(`   Modified: ${result.modifiedCount} user(s)`);
        console.log(`   Matched:  ${result.matchedCount} user(s)\n`);

        // Step 3: Verify — print role distribution after migration
        const roleCounts = await usersCollection.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]).toArray();

        console.log("📊 Role distribution after migration:");
        for (const rc of roleCounts) {
            console.log(`   ${rc._id}: ${rc.count}`);
        }

        // Count runner-active students
        const activeRunners = await usersCollection.countDocuments({ isRunnerActive: true });
        console.log(`   Active Runners (isRunnerActive: true): ${activeRunners}\n`);

        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");

    } catch (error) {
        console.error("❌ Migration failed:", error.message);
        process.exit(1);
    }
}

migrate();
