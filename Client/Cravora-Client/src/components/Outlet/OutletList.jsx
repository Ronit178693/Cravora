import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Upload, Trash2 } from 'lucide-react';
import EditableField from './EditableField'; // Ensure this matches your file structure

const OutletList = ({ outlets, onDelete, onUpdate }) => {
    const navigate = useNavigate();

    // Helper to format path for display
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
        return imagePath;
    };

    const handleImageUpload = (e, outletId) => {
        const file = e.target.files[0];
        if (file && onUpdate) {
            const formData = new FormData();
            formData.append('image', file);
            onUpdate(outletId, formData);
        }
    };

    if (!outlets || outlets.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '60px',
                background: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid var(--border)'
            }}>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No outlets found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Get started by adding your first outlet above!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
            {outlets.map((outlet, index) => (
                <div
                    key={outlet._id}
                    className="outlet-card-horizontal"
                    style={{
                        display: 'flex',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                        alignItems: 'stretch'
                    }}
                >
                    {/* Image Section */}
                    <div style={{ width: '280px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                            src={getImageUrl(outlet.images && outlet.images[0])}
                            alt={outlet.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Image Overlay for Update */}
                        <div className="image-update-overlay" style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                            <label style={{ cursor: 'pointer', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Upload size={32} />
                                <span style={{ fontSize: '0.9rem', marginTop: '8px' }}>Change Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, outlet._id)}
                                />
                            </label>
                        </div>
                        {!outlet.isOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                backdropFilter: 'blur(4px)',
                                pointerEvents: 'none'
                            }}>
                                Closed
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Header: Name and Delete */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, marginRight: '20px' }}>
                                <EditableField
                                    value={outlet.name}
                                    label="Outlet Name"
                                    onSave={(val) => onUpdate(outlet._id, { name: val })}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <label className="toggle-switch" title="Toggle Outlet Open/Closed Status" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: outlet.isOpen !== false ? '#22c55e' : '#ef4444' }}>
                                    <input
                                        type="checkbox"
                                        checked={outlet.isOpen !== false}
                                        onChange={(e) => onUpdate(outlet._id, { isOpen: e.target.checked })}
                                        style={{ display: 'none' }}
                                    />
                                    {/* Simplified toggle visual since the class might rely on specific wrapper structures not present here natively without checking CSS */}
                                    <div style={{
                                        width: '40px', height: '22px', borderRadius: '20px',
                                        background: outlet.isOpen !== false ? '#22c55e' : '#ef4444',
                                        position: 'relative', transition: 'background 0.3s'
                                    }}>
                                        <div style={{
                                            width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                                            position: 'absolute', top: '2px', left: outlet.isOpen !== false ? '20px' : '2px',
                                            transition: 'left 0.3s'
                                        }}></div>
                                    </div>
                                    {outlet.isOpen !== false ? 'Open' : 'Closed'}
                                </label>
                                <button
                                    className="btn-icon-danger"
                                    style={{
                                        padding: '8px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => onDelete(outlet._id)}
                                    title="Delete Outlet"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <MapPin size={18} style={{ color: 'var(--accent)', marginTop: '4px' }} />
                                <div style={{ flex: 1 }}>
                                    <EditableField
                                        value={outlet.location}
                                        label="Location"
                                        onSave={(val) => onUpdate(outlet._id, { location: val })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Phone size={18} style={{ color: 'var(--text-secondary)', marginTop: '4px' }} />
                                <div style={{ flex: 1 }}>
                                    <EditableField
                                        value={outlet.contactNumber}
                                        label="Contact Number"
                                        type="tel"
                                        onSave={(val) => onUpdate(outlet._id, { contactNumber: val })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', gridColumn: 'span 2' }}>
                                <Clock size={18} style={{ color: 'var(--text-secondary)', marginTop: '4px' }} />
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '100%' }}>
                                    <div style={{ flex: 1 }}>
                                        <EditableField
                                            value={outlet.WorkingHours?.open}
                                            label="Opens At"
                                            type="time"
                                            onSave={(val) => onUpdate(outlet._id, { WorkingHours: { ...outlet.WorkingHours, open: val } })}
                                        />
                                    </div>
                                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    <div style={{ flex: 1 }}>
                                        <EditableField
                                            value={outlet.WorkingHours?.close}
                                            label="Closes At"
                                            type="time"
                                            onSave={(val) => onUpdate(outlet._id, { WorkingHours: { ...outlet.WorkingHours, close: val } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                            <EditableField
                                value={outlet.description}
                                label="Description"
                                type="textarea"
                                onSave={(val) => onUpdate(outlet._id, { description: val })}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OutletList;
