import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { baseURL } from '../utils/API_paths';
import { placeOrder } from '../api/orderApi';
import Navbar from '../components/Navbar';
import OrderTracker from '../components/OrderTracker';
import toast, { Toaster } from 'react-hot-toast';
import './StudentDashboard.css';

const Checkout = () => {
    const { cart, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
    const [dropLocation, setDropLocation] = useState('');
    const [placing, setPlacing] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);

    const deliveryFee = 15;

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

    const handlePlaceOrder = async () => {
        if (!dropLocation.trim()) {
            toast.error('Please enter a delivery location');
            return;
        }

        setPlacing(true);
        try {
            const res = await placeOrder({
                outletId: cart.outletId,
                items: cart.items.map(i => ({
                    menuItemId: i.menuItemId,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    image: i.image,
                })),
                dropLocation,
                deliveryFee,
            });

            toast.success('Order placed successfully!');
            setPlacedOrderId(res.data.order._id);
            clearCart();
        } catch (err) {
            console.error('Error placing order:', err);
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    // --- After order placed: show inline tracking ---
    if (placedOrderId) {
        return (
            <div className="sd-page">
                <Navbar />
                <div className="sd-container">
                    <h1 className="sd-page-title">
                        Order <span>Placed!</span>
                    </h1>
                    <p className="sd-page-subtitle">
                        Your order is being processed. Track it below in real-time.
                    </p>

                    <OrderTracker orderId={placedOrderId} />

                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <Link
                            to="/student-dashboard"
                            className="sd-btn-add"
                            style={{ display: 'inline-flex', width: 'auto', padding: '12px 32px' }}
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- Empty cart state ---
    if (cart.items.length === 0) {
        return (
            <div className="sd-page">
                <Navbar />
                <div className="sd-container">
                    <div className="sd-empty">
                        <h3>Your cart is empty</h3>
                        <p>Browse outlets and add items to get started!</p>
                        <Link to="/student-dashboard" className="sd-btn-add" style={{ display: 'inline-flex', marginTop: '20px', width: 'auto', padding: '12px 28px' }}>
                            Browse Outlets
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- Active cart: checkout form ---
    return (
        <div className="sd-page">
            <Navbar />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                    },
                }}
            />
            <div className="sd-container">
                <Link to="/student-dashboard" className="sd-back-link">
                    <ArrowLeft size={16} /> Continue shopping
                </Link>

                <h1 className="sd-page-title">
                    <span>Checkout</span>
                </h1>
                <p className="sd-page-subtitle">
                    Ordering from <strong>{cart.outletName}</strong>
                </p>

                <div className="sd-checkout-layout">
                    {/* Items */}
                    <div className="sd-checkout-items">
                        {cart.items.map((item) => (
                            <div key={item.menuItemId} className="sd-checkout-item">
                                <div className="sd-checkout-item-img">
                                    {getImageUrl(item.image) ? (
                                        <img src={getImageUrl(item.image)} alt={item.name} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🍽️</div>
                                    )}
                                </div>
                                <div className="sd-checkout-item-info">
                                    <h4>{item.name}</h4>
                                    <p>{item.description}</p>
                                </div>
                                <div className="sd-checkout-item-right">
                                    <span className="sd-checkout-item-price">
                                        ₹{(item.price * item.quantity).toFixed(0)}
                                    </span>
                                    <div className="sd-qty-controls">
                                        <button
                                            className="sd-qty-btn"
                                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="sd-qty-value">{item.quantity}</span>
                                        <button
                                            className="sd-qty-btn"
                                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        className="sd-qty-btn"
                                        style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                                        onClick={() => removeItem(item.menuItemId)}
                                        title="Remove"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="sd-summary-card">
                        <h3>Order Summary</h3>

                        <div className="sd-summary-row">
                            <span>Subtotal</span>
                            <span>₹{totalPrice.toFixed(0)}</span>
                        </div>
                        <div className="sd-summary-row">
                            <span>Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="sd-summary-row total">
                            <span>Total</span>
                            <span>₹{(totalPrice + deliveryFee).toFixed(0)}</span>
                        </div>

                        <div className="sd-input-group">
                            <label>Delivery Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Hostel Block A, Room 204"
                                value={dropLocation}
                                onChange={(e) => setDropLocation(e.target.value)}
                            />
                        </div>

                        <button
                            className="sd-btn-place-order"
                            onClick={handlePlaceOrder}
                            disabled={placing}
                        >
                            {placing ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
