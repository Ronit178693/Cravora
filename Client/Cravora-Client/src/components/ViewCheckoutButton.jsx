import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ViewCheckoutButton = () => {
    const { totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    if (totalItems === 0) return null;

    return (
        <button
            className="sd-checkout-fab"
            onClick={() => navigate('/checkout')}
        >
            <ShoppingCart size={20} />
            <span className="sd-fab-text">
                {/* toFixed removes the decimal digits upto 0 places */}
                View Cart · ₹{totalPrice.toFixed(0)}
            </span>
            <span className="sd-fab-badge">{totalItems}</span>
        </button>
    );
};

export default ViewCheckoutButton;
