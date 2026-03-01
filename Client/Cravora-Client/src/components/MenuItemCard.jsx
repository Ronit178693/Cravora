import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { baseURL } from '../utils/API_paths';

const MenuItemCard = ({ item, outletId, outletName, index = 0 }) => {
    const { cart, addItem, updateQuantity } = useCart();
    // Gets all the items in the cart, using this to find the quantity of a specific item
    const cartItem = cart.items.find(i => i.menuItemId === item._id);
    // Cart quantity 
    const quantity = cartItem?.quantity || 0;

    // Gets the img url to show it on the item card 
    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

    // Handles adding item to cart 
    const handleAdd = () => {
        addItem(
            { menuItemId: item._id, name: item.name, price: item.price, image: item.image },
            outletId,
            outletName
        );
    };

    // Initially the item is avaliable 
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
