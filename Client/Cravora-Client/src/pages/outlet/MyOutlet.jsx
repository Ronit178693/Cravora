import React, { useState, useEffect } from 'react';
import { addOutlet, getOutletById, deleteOutlet } from '../../api/outletApi.js';
import { useNavigate } from 'react-router-dom';
import '../Home.css'; // Reusing Home styles for consistency
import Navbar from '../../components/Navbar'; // Assuming Navbar exists

const MyOutlet = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        openingHours: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        try {
            const response = await getMyOutlet(); // Or getAllOutlets if specific user context
            setOutlets(response.data.outlets || []);
        } catch (error) {
            console.error("Error fetching outlets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key]);
            }
            await addOutlet(data);
            fetchOutlets();
            setShowForm(false);
            setFormData({
                name: '',
                description: '',
                address: '',
                phone: '',
                openingHours: '',
                image: null
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Error adding outlet:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this outlet?")) {
            try {
                await deleteOutlet(id);
                fetchOutlets();
            } catch (error) {
                console.error("Error deleting outlet:", error);
            }
        }
    };

    return (
        <div className="landing-container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            {/* Background Effects */}
            <div className="hero-bg" style={{ zIndex: -1 }}>
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="hero-grid"></div>
            </div>

            <Navbar />

            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="section-title">
                    My <span style={{
                        background: 'var(--gradient-1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Outlets</span>
                </h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '12px 24px' }}
                >
                    {showForm ? 'Cancel' : '+ Add New Outlet'}
                </button>
            </div>

            {/* Add Outlet Form */}
            {showForm && (
                <div className="reveal visible" style={{ marginBottom: '60px' }}>
                    <div style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border)',
                        borderRadius: '24px',
                        padding: '40px',
                        backdropFilter: 'blur(20px)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px', fontSize: '1.8rem' }}>Add Outlet Details</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Outlet Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Contact Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="address"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description (e.g., Best burgers in town)"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <input
                                    type="text"
                                    name="openingHours"
                                    placeholder="Opening Hours (e.g., 9AM - 10PM)"
                                    value={formData.openingHours}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ ...inputStyle, padding: '10px' }}
                                        required
                                    />
                                </div>
                            </div>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginTop: '10px' }} />
                            )}
                            <button type="submit" className="btn-primary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
                                Create Outlet
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Outlets List */}
            {loading ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '50px' }}>Loading your outlets...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '30px',
                    paddingBottom: '80px'
                }}>
                    {outlets.length > 0 ? (
                        outlets.map((outlet, index) => (
                            <div
                                key={outlet._id}
                                className="problem-card"
                                style={{
                                    padding: '0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={outlet.image?.url || "https://via.placeholder.com/400x300?text=No+Image"}
                                        alt={outlet.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    />
                                </div>
                                <div style={{ padding: '24px', flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{outlet.name}</h3>
                                    <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '600' }}>
                                        {outlet.address}
                                    </p>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                                        {outlet.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                        <button
                                            className="btn-secondary"
                                            style={{ flex: 1, padding: '10px', fontSize: '0.9rem', justifyContent: 'center' }}
                                            onClick={() => navigate(`/outlet/${outlet._id}`)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn-secondary"
                                            style={{ padding: '10px 16px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                            onClick={() => handleDelete(outlet._id)}
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '60px',
                            background: 'var(--bg-card)',
                            borderRadius: '24px',
                            border: '1px solid var(--border)'
                        }}>
                            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No outlets found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Get started by adding your first outlet above!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
};

export default MyOutlet;
