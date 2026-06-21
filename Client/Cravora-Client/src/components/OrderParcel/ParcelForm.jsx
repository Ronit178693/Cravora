import React from 'react';
import { Send } from 'lucide-react';

const ParcelForm = ({ form, setForm, handleChange, handleSubmit, submitting }) => {
    return (
        <div className="op-form-section">
            <div className="op-form-card">
                <h3 className="op-form-title">
                    <Send size={18} /> New Delivery Request
                </h3>

                <form onSubmit={handleSubmit} className="op-form">
                    {/* Type */}
                    <div className="op-field">
                        <label>Package Type</label>
                        <div className="op-type-selector">
                            {['Courier', 'Blinket', 'Food'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`op-type-btn ${form.type === t ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                                >
                                    {t === 'Courier' && '📦'}
                                    {t === 'Blinket' && '🛒'}
                                    {t === 'Food' && '🍔'}
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="op-field">
                        <label>Pickup Location *</label>
                        <input
                            type="text"
                            name="pickupLocation"
                            value={form.pickupLocation}
                            onChange={handleChange}
                            placeholder="e.g. Main Gate, Amazon Locker"
                            required
                        />
                    </div>

                    <div className="op-field">
                        <label>Drop Location *</label>
                        <input
                            type="text"
                            name="dropLocation"
                            value={form.dropLocation}
                            onChange={handleChange}
                            placeholder="e.g. Hostel 4, Room 312"
                            required
                        />
                    </div>

                    {/* Description + Qty row */}
                    <div className="op-row">
                        <div className="op-field" style={{ flex: 2 }}>
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="What's in the package?"
                                maxLength={200}
                            />
                        </div>
                        <div className="op-field" style={{ flex: 1 }}>
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                min={1}
                            />
                        </div>
                    </div>

                    {/* Fee */}
                    <div className="op-field">
                        <label>Delivery Fee (₹)</label>
                        <input
                            type="number"
                            name="deliveryFee"
                            value={form.deliveryFee}
                            onChange={handleChange}
                            placeholder="0 (optional tip for the runner)"
                            min={0}
                        />
                    </div>

                    {/* Instructions */}
                    <div className="op-field">
                        <label>Special Instructions</label>
                        <textarea
                            name="instructions"
                            value={form.instructions}
                            onChange={handleChange}
                            placeholder="Any special handling instructions?"
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="op-submit-btn" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Request Delivery'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ParcelForm;
