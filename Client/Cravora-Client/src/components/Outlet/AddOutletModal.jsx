import React, { useState } from 'react';
import { addOutlet } from '../../api/outletApi.js';
import toast from 'react-hot-toast';
import { X, Store, MapPin, Phone, Clock, FileText, Upload, Image as ImageIcon, Check, XCircle } from 'lucide-react';
import './AddOutletModal.css';

const AddOutletModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        contactNumber: '',
        openTime: '',
        closeTime: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being changed
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
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Outlet name is required";
        }

        if (!formData.location.trim()) {
            errors.location = "Location is required";
        }

        if (!formData.contactNumber.trim()) {
            errors.contactNumber = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            errors.contactNumber = "Contact number must be 10 digits";
        }

        if (!formData.openTime) {
            errors.openTime = "Open time is required";
        }

        if (!formData.closeTime) {
            errors.closeTime = "Close time is required";
        }

        if (!formData.description.trim()) {
            errors.description = "Description is required";
        }

        if (!formData.image) {
            errors.image = "Image is required";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({}); // Clear previous errors

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('location', formData.location);
            data.append('contactNumber', formData.contactNumber);

            // Construct WorkingHours object and stringify it
            const workingHours = {
                open: formData.openTime,
                close: formData.closeTime
            };
            // Converting object to string to store 
            data.append('WorkingHours', JSON.stringify(workingHours));

            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await addOutlet(data);
            console.log("Outlet added:", response.data);
            toast.success("Outlet added successfully");
            if (onSuccess) onSuccess(); // Refresh list on success
            onClose();
        } catch (error) {
            console.error("Error adding outlet:", error);
            toast.error("Failed to add outlet. Please try again.");
            setErrors({ api: "Failed to add outlet. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-outlet-modal-overlay">
            <div className="add-outlet-modal-container reveal visible">
                <div className="add-outlet-modal-content">
                    <button
                        onClick={onClose}
                        className="add-outlet-close-btn"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="add-outlet-title">Add Outlet Details</h2>

                    {errors.api && (
                        <div style={{ color: '#ef4444', marginBottom: '20px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            {errors.api}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="add-outlet-form" noValidate>
                        <div className="add-outlet-form-row">
                            <div className="input-group-wrapper">
                                <div className="input-group">
                                    <Store className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Outlet Name"
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
                                    <Phone className="input-icon" size={20} />
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        placeholder="Contact Phone (10 digits)"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className={`add-outlet-input with-icon ${errors.contactNumber ? 'input-error' : ''}`}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                            </div>
                        </div>
                        <div className="input-group-wrapper">
                            <div className="input-group">
                                <MapPin className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Full Address / Location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`add-outlet-input with-icon ${errors.location ? 'input-error' : ''}`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.location && <span className="error-text">{errors.location}</span>}
                        </div>
                        <div className="add-outlet-form-row">
                            <div className="input-group-wrapper">
                                <label className="add-outlet-label">Open Time</label>
                                <div className="input-group">
                                    <Clock className="input-icon" size={20} />
                                    <input
                                        type="time"
                                        name="openTime"
                                        value={formData.openTime}
                                        onChange={handleChange}
                                        className={`add-outlet-input with-icon ${errors.openTime ? 'input-error' : ''}`}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.openTime && <span className="error-text">{errors.openTime}</span>}
                            </div>
                            <div className="input-group-wrapper">
                                <label className="add-outlet-label">Close Time</label>
                                <div className="input-group">
                                    <Clock className="input-icon" size={20} />
                                    <input
                                        type="time"
                                        name="closeTime"
                                        value={formData.closeTime}
                                        onChange={handleChange}
                                        className={`add-outlet-input with-icon ${errors.closeTime ? 'input-error' : ''}`}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.closeTime && <span className="error-text">{errors.closeTime}</span>}
                            </div>
                        </div>
                        <div className="input-group-wrapper">
                            <div className="input-group textarea-group">
                                <FileText className="input-icon textarea-icon" size={20} />
                                <textarea
                                    name="description"
                                    placeholder="Description (e.g., Best burgers in town)"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`add-outlet-input add-outlet-textarea with-icon ${errors.description ? 'input-error' : ''}`}
                                    disabled={loading}
                                />
                            </div>
                            {errors.description && <span className="error-text">{errors.description}</span>}
                        </div>
                        <div className="input-group-wrapper" style={{ position: 'relative' }}>
                            <label className="add-outlet-label">Outlet Image</label>
                            <div className={`file-upload-wrapper ${errors.image ? 'input-error' : ''}`}>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-upload-input"
                                    id="outlet-image-upload"
                                    disabled={loading}
                                />
                                <label htmlFor="outlet-image-upload" className="file-upload-label">
                                    <Upload size={20} />
                                    <span>{formData.image ? formData.image.name : "Click to upload image"}</span>
                                </label>
                            </div>
                            {errors.image && <span className="error-text">{errors.image}</span>}
                        </div>
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="add-outlet-image-preview" />
                                <div className="image-preview-overlay">
                                    <ImageIcon size={24} />
                                </div>
                            </div>
                        )}
                        <div className="add-outlet-buttons">
                            <button type="button" onClick={onClose} className="btn-secondary add-outlet-btn-cancel">
                                <XCircle size={20} style={{ marginRight: '8px' }} />
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary add-outlet-btn-submit" disabled={loading}>
                                <Check size={20} style={{ marginRight: '8px' }} />
                                {loading ? 'Creating...' : 'Create Outlet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddOutletModal;

