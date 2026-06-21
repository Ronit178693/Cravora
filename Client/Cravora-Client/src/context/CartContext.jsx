/**
 * Cart Context & Provider
 * Manages the shopping cart state using a reducer pattern and syncs data to localStorage.
 * Restricts orders to a single food outlet at a time (clears cart if ordering from a new outlet).
 */
import { createContext, useContext, useReducer, useEffect } from "react";

// Create context object to store cart data and dispatch handlers
const CartContext = createContext(null);

/**
 * Cart Reducer Function
 * Performs state transitions based on cart action payloads.
 * @param {Object} state - Current cart state { items: [], outletId: String, outletName: String }
 * @param {Object} action - Action descriptor { type: String, payload: Any }
 * @returns {Object} Updated cart state
 */
const cartReducer = (state, action) => {
    switch (action.type) {
        // Adds an item to the cart or increments its count
        case "ADD_ITEM": {
            const { item, outletId, outletName } = action.payload;

            // Restrict order: If item is from a different outlet than the existing one in the cart,
            // overwrite the cart state with the new outlet's first item.
            if (state.outletId && state.outletId !== outletId) {
                return {
                    outletId,
                    outletName,
                    items: [{ ...item, quantity: 1 }],
                };
            }

            // If item already exists in the cart, increment its quantity
            const existing = state.items.find(i => i.menuItemId === item.menuItemId);
            if (existing) {
                return {
                    ...state,
                    outletId,
                    outletName,
                    items: state.items.map(i =>
                        i.menuItemId === item.menuItemId
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            }

            // Otherwise, append the new item with a default quantity of 1
            return {
                ...state,
                outletId,
                outletName,
                items: [...state.items, { ...item, quantity: 1 }],
            };
        }

        // Removes a specific item from the cart
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(i => i.menuItemId !== action.payload),
                // Clean up outlet metadata if removing this item makes the cart empty
                ...(state.items.length === 1 ? { outletId: null, outletName: null } : {}),
            };

        // Adjusts the quantity of a specific cart item
        case "UPDATE_QUANTITY": {
            const { menuItemId, quantity } = action.payload;
            // If new quantity falls below 1, remove the item entirely
            if (quantity <= 0) {
                const newItems = state.items.filter(i => i.menuItemId !== menuItemId);
                
                return {
                    ...state,
                    items: newItems,
                    ...(newItems.length === 0 ? { outletId: null, outletName: null } : {}),
                };
            }
            // Map items and modify matching item's quantity
            return {
                ...state,
                items: state.items.map(i =>
                    i.menuItemId === menuItemId ? { ...i, quantity } : i
                ),
            };
        }

        // Empties the cart structure completely
        case "CLEAR_CART":
            return { items: [], outletId: null, outletName: null };

        default:
            return state;
    }
};

/**
 * CartProvider component wraps the app layout to provide state contexts.
 * Syncs the state tree to localStorage for persistence across reloads.
 */
export function CartProvider({ children }) {
    // Initializer function loads saved cart JSON configuration from localStorage
    const initialState = (() => {
        const saved = localStorage.getItem("cravora_cart");
        return saved ? JSON.parse(saved) : {
            items: [],
            outletId: null,
            outletName: null,
        };
    })();

    // Initialize reducer state machine
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    // Save cart state payload to localStorage on updates
    useEffect(() => {
        localStorage.setItem("cravora_cart", JSON.stringify(cart));
    }, [cart]);

    /**
     * Adds an item to the shopping cart.
     * @param {Object} item - Menu item detail snapshot
     * @param {String} outletId - Reference outlet ID
     * @param {String} outletName - Readable outlet name
     */
    const addItem = (item, outletId, outletName) =>
        dispatch({ type: "ADD_ITEM", payload: { item, outletId, outletName } });

    /**
     * Removes an item from the cart.
     * @param {String} menuItemId - Target item ID
     */
    const removeItem = (menuItemId) =>
        dispatch({ type: "REMOVE_ITEM", payload: menuItemId });

    /**
     * Updates target quantity of a menu item in the cart.
     * @param {String} menuItemId - Target item ID
     * @param {Number} quantity - Target quantity count
     */
    const updateQuantity = (menuItemId, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { menuItemId, quantity } });

    /**
     * Empties all cart contents.
     */
    const clearCart = () => dispatch({ type: "CLEAR_CART" });

    // Derive pricing and item counters dynamically on each state change
    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom hook to safely consume the Cart Context.
 * @returns {Object} Cart state variables and event dispatchers
 */
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
