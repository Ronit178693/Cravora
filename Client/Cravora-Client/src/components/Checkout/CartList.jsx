import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

/**
 * CartList Component
 * Renders the tabular list of menu items current inside the checkout cart,
 * exposing controls to increase, decrease, or completely delete items from the cart.
 *
 * @param {Object[]} items - Array of active cart items
 * @param {Function} getImageUrl - Helper function resolving menu item relative path to backend absolute URL
 * @param {Function} updateQuantity - Callback trigger to increment or decrement cart item quantity
 * @param {Function} removeItem - Callback trigger to delete the item from the cart
 */
const CartList = ({ items, getImageUrl, updateQuantity, removeItem }) => {
    return (
        <div className="sd-checkout-items">
            {items.map((item) => (
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
    );
};

export default CartList;
