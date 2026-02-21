import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import EditableField from './EditableField';

const MenuItemList = ({ menuItems, onDelete, onUpdate, onImageUpload }) => {

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400x200?text=No+Image";
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
    };

    const getCategoryClass = (category) => {
        if (!category) return 'other';
        return category.toLowerCase().replace(/\s+/g, '-');
    };

    const handleImageChange = (e, itemId) => {
        const file = e.target.files[0];
        if (file && onImageUpload) {
            const formData = new FormData();
            formData.append('image', file);
            onImageUpload(itemId, formData);
        }
    };

    if (!menuItems || menuItems.length === 0) {
        return (
            <div className="empty-state">
                <h3>No menu items yet</h3>
                <p>Add your first menu item using the button above!</p>
            </div>
        );
    }

    return (
        <div className="menu-items-grid">
            {menuItems.map((item, index) => (
                <div
                    key={item._id}
                    className="menu-item-card"
                    style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both` }}
                >
                    {/* Image Section */}
                    <div className="menu-item-image-section">
                        <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                        />
                        {/* Category Badge */}
                        <span className={`category-badge ${getCategoryClass(item.category)}`}>
                            {item.category || 'Other'}
                        </span>
                        {/* Availability Badge */}
                        <span className={`availability-badge ${item.isAvailable !== false ? 'available' : 'unavailable'}`}>
                            {item.isAvailable !== false ? 'Available' : 'Unavailable'}
                        </span>
                        {/* Image Overlay */}
                        <div className="menu-item-image-overlay">
                            <label style={{ cursor: 'pointer', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Upload size={28} />
                                <span style={{ fontSize: '0.85rem', marginTop: '6px' }}>Change Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageChange(e, item._id)}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="menu-item-content">
                        <div className="menu-item-header">
                            <div className="menu-item-name">
                                <EditableField
                                    value={item.name}
                                    label="Item Name"
                                    onSave={(val) => onUpdate(item._id, { name: val })}
                                />
                            </div>
                            <div className="menu-item-price">
                                ₹{item.price}
                            </div>
                        </div>

                        {/* Editable Price (hidden behind EditableField) */}
                        <EditableField
                            value={String(item.price)}
                            label="Price (₹)"
                            type="number"
                            onSave={(val) => onUpdate(item._id, { price: Number(val) })}
                        />

                        <EditableField
                            value={item.description}
                            label="Description"
                            type="textarea"
                            onSave={(val) => onUpdate(item._id, { description: val })}
                        />

                        {/* Actions */}
                        <div className="menu-item-actions">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={item.isAvailable !== false}
                                    onChange={(e) => onUpdate(item._id, { isAvailable: e.target.checked })}
                                />
                                <span className="toggle-slider"></span>
                                {item.isAvailable !== false ? 'Available' : 'Unavailable'}
                            </label>

                            <button
                                className="btn-icon-danger"
                                onClick={() => onDelete(item._id)}
                                title="Delete Item"
                                style={{ marginLeft: 'auto' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuItemList;
