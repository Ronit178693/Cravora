import React, { useState, useEffect } from 'react';
import { getMyOutlet, deleteOutlet, updateOutlet } from '../../api/outletApi.js';
import '../Home.css';
import Sidebar from '../../components/Outlet/Sidebar';
import AddOutletModal from '../../components/Outlet/AddOutletModal';
import OutletList from '../../components/Outlet/OutletList';
import toast, { Toaster } from "react-hot-toast";

const MyOutlet = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchOutlets();
    }, []);

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

    // Sets form to close and again fetches the outlets
    const handleSuccess = () => {
        fetchOutlets();
        setShowForm(false);
    };


    const handleDelete = async (id) => {
        // The browser send a custom confirmation msg.
        if (window.confirm("Are you sure you want to delete this outlet?")) {
            try {
                await deleteOutlet(id);
                toast.success("Outlet deleted successfully");
                fetchOutlets();
            } catch (error) {
                console.error("Error deleting outlet:", error);
                toast.error("Failed to delete outlet");
            }
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await updateOutlet(id, updatedData);
            toast.success("Outlet updated successfully");
            fetchOutlets(); // Refresh list to see changes (e.g. image or text)
        } catch (error) {
            console.error("Error updating outlet:", error);
            toast.error("Failed to update outlet");
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Background Effects matching Landing/Login */}
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

                    {/* Add Outlet Modal Overlay */}
                    {/* conditional rendering in React */}
                    {/* If showForm is true, then AddOutletModal will be rendered */}
                    {showForm && (
                        <AddOutletModal
                            onClose={() => setShowForm(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                    {/* Outlets List */}
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
