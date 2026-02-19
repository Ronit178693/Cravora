import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { addMenuItem } from '../../api/outletApi';
import { X, Type, FileText, Image as ImageIcon, Upload, Check, XCircle, DollarSign, Tag } from 'lucide-react';
import './AddOutletModal.css'; // Reusing the same CSS

const AddMenuModal = ({ onClose, onSuccess, outletId }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Main Course", // Default category
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Predefined categories - can be moved to constants later
    const categories = ["Starters", "Main Course", "Desserts", "Beverages", "Snacks"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: undefined }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Item name is required";
        if (!formData.price) newErrors.price = "Price is required";
        if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.image) newErrors.image = "Image is required";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('image', formData.image);

            await addMenuItem(outletId, data);
            toast.success("Menu item added successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Error adding menu item:", error);
            const msg = error.response?.data?.message || "Failed to add menu item";
            toast.error(msg);
            setErrors({ api: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-outlet-modal-overlay">
            <div className="add-outlet-modal-container reveal visible" style={{ maxWidth: '600px' }}>
                <div className="add-outlet-modal-content">
                    <button onClick={onClose} className="add-outlet-close-btn">
                        <X size={24} />
                    </button>

                    <h2 className="add-outlet-title">Add Menu Item</h2>

                    {errors.api && (
                        <div style={{ color: '#ef4444', marginBottom: '20px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            {errors.api}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="add-outlet-form" noValidate>
                        {/* Name and Price Row */}
                        <div className="add-outlet-form-row">
                            <div className="input-group-wrapper">
                                <div className="input-group">
                                    <Type className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Item Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`add-outlet-input with-icon ${errors.name ? 'input-error' : ''}`}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>
                            <div className="input-group-wrapper">
                                <div className="input-group">
                                    <DollarSign className="input-icon" size={20} />
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={`add-outlet-input with-icon ${errors.price ? 'input-error' : ''}`}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.price && <span className="error-text">{errors.price}</span>}
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="input-group-wrapper">
                            <div className="input-group">
                                <Tag className="input-icon" size={20} />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`add-outlet-input with-icon ${errors.category ? 'input-error' : ''}`}
                                    disabled={loading}
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} style={{ color: 'black' }}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.category && <span className="error-text">{errors.category}</span>}
                        </div>

                        {/* Description */}
                        <div className="input-group-wrapper">
                            <div className="input-group textarea-group">
                                <FileText className="input-icon textarea-icon" size={20} />
                                <textarea
                                    name="description"
                                    placeholder="Item Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`add-outlet-input add-outlet-textarea with-icon ${errors.description ? 'input-error' : ''}`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.description && <span className="error-text">{errors.description}</span>}
                        </div>

                        {/* Image Upload */}
                        <div className="input-group-wrapper" style={{ position: 'relative' }}>
                            <label className="add-outlet-label">Item Image</label>
                            <div className={`file-upload-wrapper ${errors.image ? 'input-error' : ''}`}>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-upload-input"
                                    id="menu-image-upload"
                                    disabled={loading}
                                />
                                <label htmlFor="menu-image-upload" className="file-upload-label">
                                    <Upload size={20} />
                                    <span>{formData.image ? formData.image.name : "Click to upload image"}</span>
                                </label>
                            </div>
                            {errors.image && <span className="error-text">{errors.image}</span>}
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="add-outlet-image-preview" style={{ height: '150px' }} />
                                <div className="image-preview-overlay">
                                    <ImageIcon size={24} />
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="add-outlet-buttons">
                            <button type="button" onClick={onClose} className="btn-secondary add-outlet-btn-cancel">
                                <XCircle size={20} style={{ marginRight: '8px' }} />
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary add-outlet-btn-submit" disabled={loading}>
                                <Check size={20} style={{ marginRight: '8px' }} />
                                {loading ? 'Adding...' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMenuModal;