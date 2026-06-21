import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { baseURL } from '../../utils/API_paths';

/**
 * MenuItemCard Component
 * Displays a single menu item with its name, image, description, price, and availability.
 * Provides controls to add items to the cart or adjust quantities.
 *
 * @param {Object} item - Menu item details (id, name, price, availability, image)
 * @param {String} outletId - ID of the outlet offering this item
 * @param {String} outletName - Name of the outlet
 * @param {Number} index - Render order index used to stagger CSS entry animation delays
 */
const MenuItemCard = ({ item, outletId, outletName, index = 0 }) => {
    // Access cart operations from context
    const { cart, addItem, updateQuantity } = useCart();
    
    // Find if the current menu item is already in the cart to fetch its current quantity
    const cartItem = cart.items.find(i => i.menuItemId === item._id);
    const quantity = cartItem?.quantity || 0;

    /**
     * getImageUrl
     * Normalizes image path from backend to construct absolute URL.
     * @param {String} img - Image name or path
     * @returns {String|null} Absolute URL string or null if empty
     */
    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

    /**
     * handleAdd
     * Adds the selected menu item to the cart with default quantity of 1.
     */
    const handleAdd = () => {
        addItem(
            { menuItemId: item._id, name: item.name, price: item.price, image: item.image },
            outletId,
            outletName
        );
    };

    // Determine availability status flag
    const isUnavailable = item.isAvailable === false;

    return (
        <div
            className="sd-menu-item"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Image with add button overlay */}
            <div className="sd-menu-item-img-wrapper">
                {getImageUrl(item.image) ? (
                    <img src={getImageUrl(item.image)} alt={item.name} className="sd-menu-item-img" />
                ) : (
                    <div className="sd-menu-item-placeholder">🍽️</div>
                )}

                {isUnavailable && (
                    <div className="sd-menu-item-unavailable">Unavailable</div>
                )}

                {/* Add / Qty button — bottom right corner of image */}
                {!isUnavailable && (
                    <div className="sd-menu-item-add-corner">
                        {quantity === 0 ? (
                            <button className="sd-add-btn" onClick={handleAdd}>
                                <Plus size={16} /> ADD
                            </button>
                        ) : (
                            <div className="sd-add-qty">
                                <button onClick={() => updateQuantity(item._id, quantity - 1)}>
                                    <Minus size={14} />
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => updateQuantity(item._id, quantity + 1)}>
                                    <Plus size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="sd-menu-item-info">
                <h4 className="sd-menu-item-name">{item.name}</h4>
                <span className="sd-menu-item-price">₹{item.price}</span>
                {item.description && (
                    <p className="sd-menu-item-desc">{item.description}</p>
                )}
            </div>
        </div>
    );
};

export default MenuItemCard;
