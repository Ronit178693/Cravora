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
    const [outlets, setOutlets] = useState([]);
    const [selectedOutletId, setSelectedOutletId] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuLoading, setMenuLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Fetch user's outlets on mount
    useEffect(() => {
        fetchOutlets();
    }, []);

    // Fetch menu when outlet changes
    useEffect(() => {
        if (selectedOutletId) {
            fetchMenuItems();
        } else {
            setMenuItems([]);
        }
    }, [selectedOutletId]);

    const fetchOutlets = async () => {
        try {
            const response = await getMyOutlet();
            const outletList = response.data.outlets || [];
            setOutlets(outletList);
            // Auto-select the first outlet
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

    const handleAddSuccess = () => {
        fetchMenuItems();
        setShowAddModal(false);
    };

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

    const selectedOutlet = outlets.find(o => o._id === selectedOutletId);

    return (
        <div className="dashboard-layout">
            {/* Background Effects */}
            <div className="hero-bg" style={{ zIndex: -1, position: 'fixed' }}>
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="hero-grid"></div>
            </div>

            <Sidebar />

            <main className="dashboard-main dark-theme">
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

                    {/* Add Menu Modal */}
                    {showAddModal && (
                        <AddMenuModal
                            onClose={() => setShowAddModal(false)}
                            onSuccess={handleAddSuccess}
                            outletId={selectedOutletId}
                        />
                    )}

                    {/* Content */}
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
