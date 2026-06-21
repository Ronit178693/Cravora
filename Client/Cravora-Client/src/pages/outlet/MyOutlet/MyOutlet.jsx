/**
 * MyOutlet Dashboard Page Component
 * Serves as the primary control center for merchants/outlet owners.
 * - Displays a grid listing of outlets owned by the logged-in merchant (OutletList).
 * - Opens a modal popup to register/create new outlets (AddOutletModal).
 * - Triggers backend API calls to update or delete specific outlet records.
 */
import React, { useState, useEffect } from 'react';
import { getMyOutlet, deleteOutlet, updateOutlet } from '../../../api/outletApi.js';
import '../../Home/Home.css';
import Sidebar from '../../../components/Outlet/Sidebar';
import AddOutletModal from '../../../components/Outlet/AddOutletModal';
import OutletList from '../../../components/Outlet/OutletList';
import toast, { Toaster } from "react-hot-toast";

const MyOutlet = () => {
    // Array storing list of outlets owned by the logged-in merchant
    const [outlets, setOutlets] = useState([]);
    
    // UI data loader spinner state
    const [loading, setLoading] = useState(true);
    
    // Controls opening/closing the AddOutletModal form overlay
    const [showForm, setShowForm] = useState(false);

    // Fetch merchant outlets on component mount
    useEffect(() => {
        fetchOutlets();
    }, []);

    /**
     * Queries the database for outlets owned by the authenticated owner user.
     */
    const fetchOutlets = async () => {
        try {
            const response = await getMyOutlet();
            setOutlets(response.data.outlets || []);
        } catch (error) {
            console.error("Error fetching outlets:", error);
            toast.error("Failed to fetch outlets");
            setOutlets([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Callback handler fired upon successful creation of a new outlet.
     * Refreshes listing and closes modal input form.
     */
    const handleSuccess = () => {
        fetchOutlets();
        setShowForm(false);
    };

    /**
     * Requests deletion of an outlet.
     * Displays a browser confirmation alert before initiating the DELETE API request.
     * @param {String} id - Outlet ID
     */
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this outlet?")) {
            try {
                await deleteOutlet(id);
                toast.success("Outlet deleted successfully");
                fetchOutlets(); // Refresh collection listing
            } catch (error) {
                console.error("Error deleting outlet:", error);
                toast.error("Failed to delete outlet");
            }
        }
    };

    /**
     * Updates an existing outlet's profile metadata.
     * @param {String} id - Outlet ID
     * @param {Object} updatedData - Changeset mapping
     */
    const handleUpdate = async (id, updatedData) => {
        try {
            await updateOutlet(id, updatedData);
            toast.success("Outlet updated successfully");
            fetchOutlets(); // Refresh collection listing to render updates (e.g. status/hours)
        } catch (error) {
            console.error("Error updating outlet:", error);
            toast.error("Failed to update outlet");
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Ambient decorative glowing background elements */}
            <div className="hero-bg" style={{ zIndex: -1, position: 'fixed' }}>
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="hero-grid"></div>
            </div>

            {/* Left sidebar dashboard navigation links panel */}
            <Sidebar />

            <main className="dashboard-main dark-theme">
                {/* hot-toast notification alerts manager */}
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
                    <div className="dashboard-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
                        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
                            My <span style={{
                                background: 'var(--gradient-1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Outlets</span>
                        </h1>
                        <button
                            className="btn-primary"
                            onClick={() => setShowForm(true)}
                            style={{ padding: '12px 24px' }}
                        >
                            + Add New Outlet
                        </button>
                    </div>

                    {/* Add Outlet Modal Overlay Input Form */}
                    {showForm && (
                        <AddOutletModal
                            onClose={() => setShowForm(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                    
                    {/* Outlets Listing grid or loading feedback statement */}
                    {loading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '50px' }}>Loading your outlets...</div>
                    ) : (
                        <OutletList
                            outlets={outlets}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyOutlet;
