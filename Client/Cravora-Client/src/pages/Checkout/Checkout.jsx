import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { baseURL } from '../../utils/API_paths';
import { placeOrder } from '../../api/orderApi';
import Navbar from '../../components/Navbar/Navbar';
import OrderTracker from '../../components/OrderTracker/OrderTracker';
import toast, { Toaster } from 'react-hot-toast';
import CartList from '../../components/Checkout/CartList';
import OrderSummary from '../../components/Checkout/OrderSummary';
import '../Dashboard/StudentDashboard.css';

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
                    {/* Items List Sub-Component */}
                    <CartList
                        items={cart.items}
                        getImageUrl={getImageUrl}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                    />

                    {/* Order Summary Sub-Component */}
                    <OrderSummary
                        totalPrice={totalPrice}
                        deliveryFee={deliveryFee}
                        dropLocation={dropLocation}
                        setDropLocation={setDropLocation}
                        handlePlaceOrder={handlePlaceOrder}
                        placing={placing}
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
