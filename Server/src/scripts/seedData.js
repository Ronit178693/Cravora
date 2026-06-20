import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Import Schemas/Models
import User from "../Models/User.js";
import Outlet from "../Models/Outlet.js";
import Order from "../Models/Order.js";
import Package from "../Models/Package.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from Server root
dotenv.config({ path: resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
}

// Helpers
async function getHashedPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Main Database Seeding Process
 * Drops existing tables and refills them with dummy student, runner, outlet, and order records.
 */
async function seed() {
    try {
        // Step 1: Connect to the Mongo Database instance using URI in .env
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Step 2: Clean slate - remove all existing records to avoid duplicates and conflicts
        console.log("🧹 Clearing existing data (Users, Outlets, Orders, Packages)...");
        await User.deleteMany({});
        await Outlet.deleteMany({});
        await Order.deleteMany({});
        await Package.deleteMany({});
        console.log("✅ Cleared all collections");

        // Step 3: Seed dummy student, runner, and outlet owner accounts
        console.log("👤 Seeding users...");
        const hashedPassword = await getHashedPassword("password123");

        const usersData = [
            // Students
            {
                name: "Aarav Sharma",
                email: "aarav@cravora.com",
                phoneNumber: "9876543210",
                password: hashedPassword,
                role: "Student",
                isRunnerActive: false
            },
            {
                name: "Sneha Patel",
                email: "sneha@cravora.com",
                phoneNumber: "8765432109",
                password: hashedPassword,
                role: "Student",
                isRunnerActive: false
            },
            // Runners (Students with runner mode active)
            {
                name: "Karan Johar",
                email: "karan@cravora.com",
                phoneNumber: "7654321098",
                password: hashedPassword,
                role: "Student",
                isRunnerActive: true,
                deliveryStats: { deliveriesCompleted: 5 }
            },
            {
                name: "Rohan Mehra",
                email: "rohan@cravora.com",
                phoneNumber: "6543210987",
                password: hashedPassword,
                role: "Student",
                isRunnerActive: true,
                deliveryStats: { deliveriesCompleted: 2 }
            },
            // Outlet Owners
            {
                name: "Chef Rajan",
                email: "rajan@cravora.com",
                phoneNumber: "9123456780",
                password: hashedPassword,
                role: "Outlet"
            },
            {
                name: "Meera Sen",
                email: "meera@cravora.com",
                phoneNumber: "9234567891",
                password: hashedPassword,
                role: "Outlet"
            }
        ];

        const users = await User.create(usersData);
        console.log(`✅ Created ${users.length} users`);

        const aarav = users.find(u => u.email === "aarav@cravora.com");
        const sneha = users.find(u => u.email === "sneha@cravora.com");
        const karan = users.find(u => u.email === "karan@cravora.com");
        const rohan = users.find(u => u.email === "rohan@cravora.com");
        const rajan = users.find(u => u.email === "rajan@cravora.com");
        const meera = users.find(u => u.email === "meera@cravora.com");

        // Step 4: Seed campus outlets along with their initial menu items
        console.log("🍔 Seeding outlets and menus...");
        const outletsData = [
            {
                owner: rajan._id,
                name: "Bite Me Burger",
                description: "Delicious gourmet burgers, loaded wraps, and crispy french fries.",
                location: "Hostel 3 Mess Annex",
                contactNumber: "9876543211",
                images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"],
                WorkingHours: { open: "09:00", close: "23:00" },
                isOpen: true,
                menu: [
                    {
                        name: "Classic Cheeseburger",
                        description: "Juicy beef patty, melted cheddar cheese, lettuce, tomato, and secret sauce.",
                        price: 120,
                        category: "Snacks",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        name: "Crispy Chicken Wrap",
                        description: "Spicy chicken tenders, shredded lettuce, onions, and mayonnaise in a warm tortilla.",
                        price: 110,
                        category: "Main Course",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        name: "Spiced French Fries",
                        description: "Golden crispy fries sprinkled with peri-peri seasoning.",
                        price: 80,
                        category: "Snacks",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        name: "Vanilla Milkshake",
                        description: "Creamy vanilla ice cream blended with cold milk and whipped cream.",
                        price: 90,
                        category: "Beverages",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80"
                    }
                ]
            },
            {
                owner: meera._id,
                name: "Wok & Roll",
                description: "Quick-serve Asian street food, hot noodles, and steamed dumplings.",
                location: "Campus Central Food Court",
                contactNumber: "9876543212",
                images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"],
                WorkingHours: { open: "11:00", close: "22:00" },
                isOpen: true,
                menu: [
                    {
                        name: "Schezwan Hakka Noodles",
                        description: "Stir-fried noodles with crisp veggies and hot Schezwan sauce.",
                        price: 140,
                        category: "Main Course",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        name: "Steamed Chicken Momos",
                        description: "Handcrafted dumplings filled with seasoned minced chicken, served with spicy red chutney.",
                        price: 100,
                        category: "Snacks",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1625220194771-7ebedd0b4a1b?auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        name: "Sweet Corn Soup",
                        description: "Warm, comforting soup loaded with sweet corn kernels and subtle spices.",
                        price: 70,
                        category: "Other",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&w=500&q=80"
                    },
                    {
                        name: "Lemon Iced Tea",
                        description: "Refreshing brewed black tea chilled with fresh lemon juice and mint.",
                        price: 50,
                        category: "Beverages",
                        isAvailable: true,
                        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80"
                    }
                ]
            }
        ];

        const outlets = await Outlet.create(outletsData);
        console.log(`✅ Created ${outlets.length} outlets`);

        const burgerOutlet = outlets.find(o => o.name === "Bite Me Burger");
        const wokOutlet = outlets.find(o => o.name === "Wok & Roll");

        // Step 5: Seed test food orders under various statuses
        console.log("📦 Seeding food orders...");
        const burger1 = burgerOutlet.menu.find(i => i.name === "Classic Cheeseburger");
        const fries1 = burgerOutlet.menu.find(i => i.name === "Spiced French Fries");
        const shake1 = burgerOutlet.menu.find(i => i.name === "Vanilla Milkshake");
        const noodles1 = wokOutlet.menu.find(i => i.name === "Schezwan Hakka Noodles");
        const momos1 = wokOutlet.menu.find(i => i.name === "Steamed Chicken Momos");

        const ordersData = [
            // Order 1: Pending
            {
                customer: aarav._id,
                runner: null,
                outlet: burgerOutlet._id,
                items: [
                    { menuItemId: burger1._id, name: burger1.name, price: burger1.price, quantity: 2, image: burger1.image },
                    { menuItemId: shake1._id, name: shake1.name, price: shake1.price, quantity: 1, image: shake1.image }
                ],
                pickupLocation: burgerOutlet.location,
                dropLocation: "Hostel 4 Room 302",
                status: "Pending",
                totalAmount: (burger1.price * 2) + shake1.price,
                deliveryFee: 15
            },
            // Order 2: Preparing (Available for runner)
            {
                customer: sneha._id,
                runner: null,
                outlet: wokOutlet._id,
                items: [
                    { menuItemId: noodles1._id, name: noodles1.name, price: noodles1.price, quantity: 1, image: noodles1.image },
                    { menuItemId: momos1._id, name: momos1.name, price: momos1.price, quantity: 1, image: momos1.image }
                ],
                pickupLocation: wokOutlet.location,
                dropLocation: "Girls Hostel 2 Lobby",
                status: "Preparing",
                totalAmount: noodles1.price + momos1.price,
                deliveryFee: 20
            },
            // Order 3: OutForDelivery (Active runner task)
            {
                customer: aarav._id,
                runner: karan._id,
                outlet: burgerOutlet._id,
                items: [
                    { menuItemId: fries1._id, name: fries1.name, price: fries1.price, quantity: 3, image: fries1.image }
                ],
                pickupLocation: burgerOutlet.location,
                dropLocation: "Central Library Room 10",
                status: "OutForDelivery",
                totalAmount: fries1.price * 3,
                deliveryFee: 25
            },
            // Order 4: Delivered (Historical)
            {
                customer: sneha._id,
                runner: rohan._id,
                outlet: burgerOutlet._id,
                items: [
                    { menuItemId: burger1._id, name: burger1.name, price: burger1.price, quantity: 1, image: burger1.image }
                ],
                pickupLocation: burgerOutlet.location,
                dropLocation: "Hostel 1 Room 105",
                status: "Delivered",
                totalAmount: burger1.price,
                deliveryFee: 15,
                deliveredAt: new Date(Date.now() - 3600000) // 1 hour ago
            }
        ];

        const orders = await Order.create(ordersData);
        console.log(`✅ Created ${orders.length} food orders`);

        // Step 6: Post-process orders to update customer histories and outlet order counts/references
        for (const order of orders) {
            await User.findByIdAndUpdate(order.customer, {
                $push: { orderHistory: { order: order._id, orderedAt: order.createdAt } }
            });
            await Outlet.findByIdAndUpdate(order.outlet, {
                $inc: { orderCount: 1 },
                $push: { orders: { order: order._id, orderedAt: order.createdAt } }
            });
        }
        console.log("✅ Updated user history and outlet counts");

        // Step 7: Seed campus package/parcel delivery requests
        console.log("📦 Seeding packages...");
        const packagesData = [
            // Package 1: Pending (Available for runner)
            {
                customer: aarav._id,
                runner: null,
                type: "Courier",
                description: "Courier document envelope from main gate.",
                quantity: 1,
                pickupLocation: "University Main Gate",
                dropLocation: "Hostel 4 Room 302",
                status: "Pending",
                deliveryFee: 30,
                instructions: "Please collect from the guard cabin at the gate."
            },
            // Package 2: Accepted (Active runner task)
            {
                customer: sneha._id,
                runner: rohan._id,
                type: "Blinket",
                description: "Groceries and snacks from the store.",
                quantity: 2,
                pickupLocation: "Campus Grocery Shop No. 4",
                dropLocation: "Girls Hostel 2 Lobby",
                status: "Accepted",
                deliveryFee: 40,
                instructions: "Please call when you reach."
            },
            // Package 3: Delivered (Historical)
            {
                customer: aarav._id,
                runner: karan._id,
                type: "Food",
                description: "Home cooked tiffin box.",
                quantity: 1,
                pickupLocation: "Main Gate Gatekeeper",
                dropLocation: "Hostel 4 Room 302",
                status: "Delivered",
                deliveryFee: 25,
                instructions: "Deliver to Room 302 directly.",
                deliveredAt: new Date(Date.now() - 7200000) // 2 hours ago
            }
        ];

        const packages = await Package.create(packagesData);
        console.log(`✅ Created ${packages.length} packages`);

        // Step 8: Log generated login details and clean up database connections
        console.log("🎉 Seeding complete!");
        console.log("\n🔑 Login Credentials:");
        console.log("   ------------------------------------------------");
        console.log("   STUDENT 1:  aarav@cravora.com  / password123");
        console.log("   STUDENT 2:  sneha@cravora.com  / password123");
        console.log("   RUNNER 1:   karan@cravora.com  / password123");
        console.log("   RUNNER 2:   rohan@cravora.com  / password123");
        console.log("   OUTLET 1:   rajan@cravora.com  / password123");
        console.log("   OUTLET 2:   meera@cravora.com  / password123");
        console.log("   ------------------------------------------------\n");

        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
