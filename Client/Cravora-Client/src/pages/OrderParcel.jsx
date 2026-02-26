import React, { useState, useEffect } from 'react';
import { createPackage, getMyPackages, cancelPackage } from '../api/packageApi';
import { Package, MapPin, Send, X, Clock, CheckCircle, Truck, AlertCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import './StudentDashboard.css';

const OrderParcel = () => {
    // Form state
    const [form, setForm] = useState({
        type: 'Courier',
        description: '',
        quantity: 1,
        pickupLocation: '',
        dropLocation: '',
        deliveryFee: '',
        instructions: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // My packages
    const [myPackages, setMyPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [expandedPkg, setExpandedPkg] = useState(null);

    useEffect(() => {
        fetchMyPackages();
    }, []);

    const fetchMyPackages = async () => {
        setLoadingPackages(true);
        try {
            const res = await getMyPackages();
            setMyPackages(res.data.packages || []);
        } catch (err) {
            console.error('Failed to fetch packages:', err);
        } finally {
            setLoadingPackages(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.type || !form.pickupLocation.trim() || !form.dropLocation.trim()) {
            toast.error('Please fill type, pickup and drop locations');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                deliveryFee: Number(form.deliveryFee) || 0,
                quantity: Number(form.quantity) || 1,
            };
            await createPackage(payload);
            toast.success('Package request created!');
            setForm({
                type: 'Courier', description: '', quantity: 1,
                pickupLocation: '', dropLocation: '', deliveryFee: '', instructions: ''
            });
            fetchMyPackages();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (pkgId) => {
        setCancellingId(pkgId);
        try {
            await cancelPackage(pkgId);
            toast.success('Package cancelled');
            fetchMyPackages();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: '#f59e0b', Accepted: '#3b82f6',
            PickedUp: '#06b6d4', Delivered: '#22c55e', Cancelled: '#ef4444',
        };
        return colors[status] || '#6b7280';
    };

    const getStatusIcon = (status) => {
        const icons = {
            Pending: <Clock size={14} />, Accepted: <CheckCircle size={14} />,
            PickedUp: <Truck size={14} />, Delivered: <CheckCircle size={14} />,
            Cancelled: <X size={14} />,
        };
        return icons[status] || <AlertCircle size={14} />;
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // Status timeline steps
    const statusSteps = ['Pending', 'Accepted', 'PickedUp', 'Delivered'];

    const getStepIndex = (status) => {
        if (status === 'Cancelled') return -1;
        return statusSteps.indexOf(status);
    };

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                <h1 className="sd-page-title">
                    Order <span>Parcel</span>
                </h1>
                <p className="sd-page-subtitle">
                    Request a package delivery from the gate or anywhere on campus.
                </p>

                <div className="op-layout">
                    {/* ── CREATE REQUEST FORM ── */}
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

                    {/* ── MY PACKAGES LIST ── */}
                    <div className="op-packages-section">
                        <h3 className="op-packages-title">
                            <Package size={18} /> My Packages
                        </h3>

                        {loadingPackages ? (
                            <div className="sd-loading">Loading your packages...</div>
                        ) : myPackages.length === 0 ? (
                            <div className="sd-empty">
                                <h3>No packages yet</h3>
                                <p>Create your first delivery request!</p>
                            </div>
                        ) : (
                            <div className="op-packages-list">
                                {myPackages.map(pkg => {
                                    const stepIdx = getStepIndex(pkg.status);
                                    const isExpanded = expandedPkg === pkg._id;
                                    return (
                                        <div
                                            key={pkg._id}
                                            className={`op-pkg-card ${pkg.status === 'Cancelled' ? 'cancelled' : ''}`}
                                        >
                                            <div
                                                className="op-pkg-header"
                                                onClick={() => setExpandedPkg(isExpanded ? null : pkg._id)}
                                            >
                                                <div className="op-pkg-info">
                                                    <span className="op-pkg-type">{pkg.type}</span>
                                                    <span
                                                        className="op-pkg-status"
                                                        style={{ color: getStatusColor(pkg.status) }}
                                                    >
                                                        {getStatusIcon(pkg.status)} {pkg.status}
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    size={16}
                                                    className={`op-pkg-chevron ${isExpanded ? 'expanded' : ''}`}
                                                />
                                            </div>

                                            {/* Route preview */}
                                            <div className="op-pkg-route">
                                                <span><MapPin size={12} /> {pkg.pickupLocation}</span>
                                                <span className="op-pkg-arrow">→</span>
                                                <span><MapPin size={12} /> {pkg.dropLocation}</span>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="op-pkg-details">
                                                    {/* Timeline */}
                                                    {pkg.status !== 'Cancelled' && (
                                                        <div className="op-timeline">
                                                            {statusSteps.map((step, i) => (
                                                                <div
                                                                    key={step}
                                                                    className={`op-timeline-step ${i <= stepIdx ? 'completed' : ''} ${i === stepIdx ? 'current' : ''}`}
                                                                >
                                                                    <div className="op-timeline-dot" />
                                                                    <span>{step}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {pkg.description && (
                                                        <p className="op-pkg-desc"><strong>Description:</strong> {pkg.description}</p>
                                                    )}
                                                    {pkg.instructions && (
                                                        <p className="op-pkg-desc"><strong>Instructions:</strong> {pkg.instructions}</p>
                                                    )}
                                                    {pkg.runner && (
                                                        <p className="op-pkg-desc">
                                                            <strong>Runner:</strong> {pkg.runner.name}
                                                            {pkg.runner.phoneNumber && ` • ${pkg.runner.phoneNumber}`}
                                                        </p>
                                                    )}
                                                    <p className="op-pkg-meta">
                                                        Created: {formatDate(pkg.createdAt)}
                                                        {pkg.deliveryFee > 0 && ` • Fee: ₹${pkg.deliveryFee}`}
                                                        {pkg.quantity > 1 && ` • Qty: ${pkg.quantity}`}
                                                    </p>

                                                    {pkg.status === 'Pending' && (
                                                        <button
                                                            className="op-cancel-btn"
                                                            onClick={() => handleCancel(pkg._id)}
                                                            disabled={cancellingId === pkg._id}
                                                        >
                                                            {cancellingId === pkg._id ? 'Cancelling...' : 'Cancel Request'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                /* -------- Order Parcel Page -------- */
                .op-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                    align-items: start;
                }

                /* Form Section */
                .op-form-section {
                    position: sticky;
                    top: 100px;
                }

                .op-form-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 28px;
                }

                .op-form-title {
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    padding-bottom: 14px;
                    border-bottom: 1px solid var(--border);
                }

                .op-form-title svg {
                    color: var(--accent);
                }

                .op-form {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .op-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .op-field label {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    letter-spacing: 0.2px;
                }

                .op-field input,
                .op-field textarea {
                    padding: 12px 14px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-primary);
                    font-family: var(--font-main);
                    font-size: 0.9rem;
                    transition: border-color 0.2s;
                    outline: none;
                }

                .op-field input:focus,
                .op-field textarea:focus {
                    border-color: var(--accent);
                }

                .op-field textarea {
                    resize: vertical;
                    min-height: 70px;
                }

                .op-row {
                    display: flex;
                    gap: 14px;
                }

                /* Type Selector */
                .op-type-selector {
                    display: flex;
                    gap: 8px;
                }

                .op-type-btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-secondary);
                    font-family: var(--font-main);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .op-type-btn:hover {
                    border-color: rgba(255, 107, 53, 0.2);
                    color: var(--text-primary);
                }

                .op-type-btn.active {
                    background: var(--gradient-1);
                    color: white;
                    border-color: transparent;
                }

                /* Submit */
                .op-submit-btn {
                    padding: 14px;
                    border-radius: var(--radius-sm);
                    background: var(--gradient-1);
                    color: white;
                    font-family: var(--font-display);
                    font-size: 0.95rem;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.25s;
                    margin-top: 6px;
                }

                .op-submit-btn:hover:not(:disabled) {
                    box-shadow: 0 4px 24px var(--accent-glow);
                    transform: translateY(-2px);
                }

                .op-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Packages Section */
                .op-packages-title {
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 18px;
                }

                .op-packages-title svg {
                    color: var(--accent);
                }

                .op-packages-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                /* Package Card */
                .op-pkg-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    transition: var(--transition-smooth);
                    animation: sdFadeUp 0.35s ease-out both;
                }

                .op-pkg-card:hover {
                    border-color: rgba(255, 107, 53, 0.12);
                }

                .op-pkg-card.cancelled {
                    opacity: 0.5;
                }

                .op-pkg-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 18px;
                    cursor: pointer;
                }

                .op-pkg-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .op-pkg-type {
                    padding: 3px 10px;
                    border-radius: 16px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    background: rgba(59, 130, 246, 0.15);
                    color: #3b82f6;
                }

                .op-pkg-status {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.82rem;
                    font-weight: 700;
                }

                .op-pkg-chevron {
                    color: var(--text-muted);
                    transition: transform 0.2s;
                }

                .op-pkg-chevron.expanded {
                    transform: rotate(180deg);
                }

                /* Route Preview */
                .op-pkg-route {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0 18px 14px;
                    font-size: 0.82rem;
                    color: var(--text-secondary);
                }

                .op-pkg-route span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .op-pkg-route svg {
                    color: var(--accent);
                }

                .op-pkg-arrow {
                    color: var(--text-muted);
                }

                /* Expanded Details */
                .op-pkg-details {
                    padding: 0 18px 18px;
                    border-top: 1px solid var(--border);
                    padding-top: 14px;
                }

                /* Timeline */
                .op-timeline {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    position: relative;
                }

                .op-timeline::before {
                    content: '';
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    right: 6px;
                    height: 2px;
                    background: var(--border);
                    z-index: 0;
                }

                .op-timeline-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    z-index: 1;
                }

                .op-timeline-dot {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: var(--bg-secondary);
                    border: 2px solid var(--border);
                    transition: all 0.3s;
                }

                .op-timeline-step.completed .op-timeline-dot {
                    background: var(--accent);
                    border-color: var(--accent);
                    box-shadow: 0 0 8px var(--accent-glow);
                }

                .op-timeline-step.current .op-timeline-dot {
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 8px var(--accent-glow); }
                    50% { box-shadow: 0 0 16px var(--accent-glow); }
                }

                .op-timeline-step span {
                    font-size: 0.68rem;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .op-timeline-step.completed span {
                    color: var(--text-primary);
                }

                .op-timeline-step.current span {
                    color: var(--accent);
                }

                /* Details text */
                .op-pkg-desc {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.45;
                    margin-bottom: 6px;
                }

                .op-pkg-meta {
                    font-size: 0.78rem;
                    color: var(--text-muted);
                    margin-top: 8px;
                }

                .op-cancel-btn {
                    width: 100%;
                    margin-top: 12px;
                    padding: 10px;
                    border-radius: var(--radius-sm);
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    font-family: var(--font-display);
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s;
                }

                .op-cancel-btn:hover:not(:disabled) {
                    background: rgba(239, 68, 68, 0.2);
                }

                .op-cancel-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .op-layout {
                        grid-template-columns: 1fr;
                    }

                    .op-form-section {
                        position: static;
                    }
                }

                @media (max-width: 500px) {
                    .op-row {
                        flex-direction: column;
                    }

                    .op-type-selector {
                        flex-direction: column;
                    }

                    .op-timeline-step span {
                        font-size: 0.6rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderParcel;
