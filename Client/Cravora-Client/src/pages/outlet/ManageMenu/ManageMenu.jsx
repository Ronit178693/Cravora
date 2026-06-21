/**
 * ManageMenu Dashboard Page Component
 * Allows merchants to manage the food menu items for their outlets.
 * - Auto-fetches list of owned outlets and auto-selects the first one.
 * - Loads and displays the specific outlet's menu items (MenuItemList).
 * - Opens a modal popup to create new menu items (AddMenuModal).
 * - Handles CRUD calls for updating names/availability, uploading item images, and deletion.
 */
import React, { useState, useEffect } from 'react';
import { getMyOutlet, getOutletById } from '../../../api/outletApi.js';
import { updateMenuItem, deleteMenuItem } from '../../../api/menuApi.js';
import '../../Home/Home.css';
import './ManageMenu.css';
import Sidebar from '../../../components/Outlet/Sidebar';
import AddMenuModal from '../../../components/Outlet/AddMenuModal';
import MenuItemList from '../../../components/Outlet/MenuItemList';
import toast, { Toaster } from "react-hot-toast";

const ManageMenu = () => {
    // List of owned outlets under the current merchant
    const [outlets, setOutlets] = useState([]);
    
    // ID of the currently selected outlet from the dropdown selector
    const [selectedOutletId, setSelectedOutletId] = useState('');
    
    // Array of menu items belonging to the selected outlet
    const [menuItems, setMenuItems] = useState([]);
    
    // Loader flag during initial owned-outlets loading
    const [loading, setLoading] = useState(true);
    
    // Loader flag when fetching menu list from specific outlet ID
    const [menuLoading, setMenuLoading] = useState(false);
    
    // Toggles the AddMenuModal popup visibility
    const [showAddModal, setShowAddModal] = useState(false);

    // Fetch merchant's outlets on page boot
    useEffect(() => {
        fetchOutlets();
    }, []);

    // Re-fetch menu items list whenever selected outlet dropdown changes
    useEffect(() => {
        if (selectedOutletId) {
            fetchMenuItems();
        } else {
            setMenuItems([]); // Reset items if no outlet is selected
        }
    }, [selectedOutletId]);

    /**
     * Retrieves the merchant's list of outlets.
     * Selects the first outlet from the response by default.
     */
    const fetchOutlets = async () => {
        try {
            const response = await getMyOutlet();
            const outletList = response.data.outlets || [];
            setOutlets(outletList);
            // Auto-select the first outlet to load its menu immediately
            if (outletList.length > 0) {
                setSelectedOutletId(outletList[0]._id);
            }
        } catch (error) {
            console.error("Error fetching outlets:", error);
            toast.error("Failed to fetch outlets");
            setOutlets([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Retrieves full menu list details of the selected outlet.
     */
    const fetchMenuItems = async () => {
        setMenuLoading(true);
        try {
            const response = await getOutletById(selectedOutletId);
            setMenuItems(response.data.outlet?.menu || []);
        } catch (error) {
            console.error("Error fetching menu:", error);
            toast.error("Failed to fetch menu");
            setMenuItems([]);
        } finally {
            setMenuLoading(false);
        }
    };

    /**
     * Callback handler fired upon successful creation of a menu item.
     */
    const handleAddSuccess = () => {
        fetchMenuItems(); // Reload menu list
        setShowAddModal(false); // Close overlay input form
    };

    /**
     * Updates an existing menu item's attributes (e.g. price, name, availability).
     * @param {String} itemId - Menu item ID
     * @param {Object} updatedData - Changeset parameters
     */
    const handleUpdateItem = async (itemId, updatedData) => {
        try {
            await updateMenuItem(selectedOutletId, itemId, updatedData);
            toast.success("Menu item updated");
            fetchMenuItems();
        } catch (error) {
            console.error("Error updating menu item:", error);
            toast.error("Failed to update menu item");
        }
    };

    /**
     * Requests deletion of a menu item.
     * Displays a browser confirmation prompt beforehand.
     * @param {String} itemId - Menu item ID
     */
    const handleDeleteItem = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            try {
                await deleteMenuItem(selectedOutletId, itemId);
                toast.success("Menu item deleted");
                fetchMenuItems();
            } catch (error) {
                console.error("Error deleting menu item:", error);
                toast.error("Failed to delete menu item");
            }
        }
    };

    /**
     * Handles image upload submissions (packaged in FormData) for menu items.
     * @param {String} itemId - Target menu item ID
     * @param {FormData} formData - Multipart image payload
     */
    const handleImageUpload = async (itemId, formData) => {
        try {
            await updateMenuItem(selectedOutletId, itemId, formData);
            toast.success("Image updated");
            fetchMenuItems();
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to update image");
        }
    };

    // Find full object configuration matching the current selected ID
    const selectedOutlet = outlets.find(o => o._id === selectedOutletId);

    return (
        <div className="dashboard-layout">
            {/* Background design graphics */}
            <div className="hero-bg" style={{ zIndex: -1, position: 'fixed' }}>
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="hero-grid"></div>
            </div>

            {/* Left sidebar dashboard navigation */}
            <Sidebar />

            <main className="dashboard-main dark-theme">
                {/* Hot toast popup alert banner */}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                        },
                    }}
                />

                <div style={{ padding: '40px' }}>
                    {/* Header */}
                    <div className="dashboard-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
                        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
                            Manage <span style={{
                                background: 'var(--gradient-1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Menu</span>
                        </h1>

                        {/* Outlet Selector + Add Button Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
                            {outlets.length > 0 && (
                                <div className="outlet-selector-wrapper" style={{ marginBottom: 0 }}>
                                    <label>Outlet:</label>
                                    <select
                                        className="outlet-selector"
                                        value={selectedOutletId}
                                        onChange={(e) => setSelectedOutletId(e.target.value)}
                                    >
                                        <option value="" disabled>Select an outlet</option>
                                        {outlets.map(outlet => (
                                            <option key={outlet._id} value={outlet._id}>
                                                {outlet.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Enable "Add" button only if a valid outlet ID is selected */}
                            {selectedOutletId && (
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowAddModal(true)}
                                    style={{ padding: '12px 24px' }}
                                >
                                    + Add Menu Item
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Add Menu Modal overlay input form */}
                    {showAddModal && (
                        <AddMenuModal
                            onClose={() => setShowAddModal(false)}
                            onSuccess={handleAddSuccess}
                            outletId={selectedOutletId}
                        />
                    )}

                    {/* Conditional rendering for empty, selector, loading, or list layout */}
                    {loading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '50px' }}>
                            Loading your outlets...
                        </div>
                    ) : outlets.length === 0 ? (
                        <div className="empty-state">
                            <h3>No outlets found</h3>
                            <p>Create an outlet first from the My Outlets page to manage your menu.</p>
                        </div>
                    ) : !selectedOutletId ? (
                        <div className="empty-state">
                            <h3>Select an outlet</h3>
                            <p>Choose an outlet from the dropdown above to manage its menu.</p>
                        </div>
                    ) : menuLoading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '50px' }}>
                            Loading menu items...
                        </div>
                    ) : (
                        /* Menu list renderer with action callbacks */
                        <MenuItemList
                            menuItems={menuItems}
                            onDelete={handleDeleteItem}
                            onUpdate={handleUpdateItem}
                            onImageUpload={handleImageUpload}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageMenu;
