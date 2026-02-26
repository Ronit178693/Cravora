import Outlet from "../Models/Outlet.js";


// Add a menu item to an outlet
export const addMenuItem = async (req, res) => {
    const userID = req.user.id;
    try {
        const outletID = req.params.id;
        const outlet = await Outlet.findById(outletID);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        if (outlet.owner.toString() !== userID) {
            return res.status(403).json({ success: false, message: "You are not authorized to modify this menu" });
        }
        const { name, description, price, category } = req.body;
        if (!name || !price) {
            return res.status(400).json({ success: false, message: "Name and price are required" });
        }
        outlet.menu.push({ name, description, price, category, image: req.file ? req.file.path : undefined });
        await outlet.save();
        return res.status(201).json({ success: true, message: "Menu item added successfully", menu: outlet.menu });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Update a menu item
export const updateMenuItem = async (req, res) => {
    const userID = req.user.id;
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        if (outlet.owner.toString() !== userID) {
            return res.status(403).json({ success: false, message: "You are not authorized to modify this menu" });
        }
        // Find the menu item by its subdocument ID
        const menuItem = outlet.menu.id(req.params.itemId);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }
        const { name, description, price, category, isAvailable } = req.body;
        if (name !== undefined) menuItem.name = name;
        if (description !== undefined) menuItem.description = description;
        if (price !== undefined) menuItem.price = price;
        if (category !== undefined) menuItem.category = category;
        if (req.file) menuItem.image = req.file.path;
        if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

        await outlet.save();
        return res.status(200).json({ success: true, message: "Menu item updated successfully", menu: outlet.menu });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
    const userID = req.user.id;
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) {
            return res.status(404).json({ success: false, message: "Outlet not found" });
        }
        if (outlet.owner.toString() !== userID) {
            return res.status(403).json({ success: false, message: "You are not authorized to modify this menu" });
        }
        const menuItem = outlet.menu.id(req.params.itemId);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }
        menuItem.deleteOne();
        await outlet.save();
        return res.status(200).json({ success: true, message: "Menu item deleted successfully", menu: outlet.menu });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}