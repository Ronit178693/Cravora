import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

/**
 * ViewCheckoutButton Component
 * Renders a floating action button (FAB) in the lower section of pages (e.g. Outlet details)
 * to let students quickly proceed to checkout. It automatically displays the total item count 
 * and total cost currently in the cart, hiding itself if the cart is empty.
 */
const ViewCheckoutButton = () => {
    // Access global cart values from CartContext
    const { totalItems, totalPrice } = useCart();
    // Navigation hook to transition to checkout page
    const navigate = useNavigate();

    // Do not render the button if there are no items in the active cart
    if (totalItems === 0) return null;

    return (
        <button
            className="sd-checkout-fab"
            onClick={() => navigate('/checkout')}
        >
            <ShoppingCart size={20} />
            <span className="sd-fab-text">
                {/* Format and display price, rounding off to whole numbers */}
                View Cart · ₹{totalPrice.toFixed(0)}
            </span>
            {/* Display total items badge */}
            <span className="sd-fab-badge">{totalItems}</span>
        </button>
    );
};

export default ViewCheckoutButton;
