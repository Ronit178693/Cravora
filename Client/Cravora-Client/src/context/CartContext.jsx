// useReducer is used to manage complex state logics, alternative for useState hook
import { createContext, useContext, useReducer } from "react";

// Creating CartContext
const CartContext = createContext(null);

// cartReducer is a function that takes state and action and returns new state
const cartReducer = (state, action) => {
    // Getting the type of action performed 
    switch (action.type) {
        case "ADD_ITEM": {
            const { item, outletId, outletName } = action.payload;

            // If cart has items from a different outlet, clear and start fresh
            if (state.outletId && state.outletId !== outletId) {
                return {
                    outletId,
                    outletName,
                    items: [{ ...item, quantity: 1 }],
                };
            }

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

            return {
                ...state,
                outletId,
                outletName,
                items: [...state.items, { ...item, quantity: 1 }],
            };
        }

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(i => i.menuItemId !== action.payload),
                ...(state.items.length === 1 ? { outletId: null, outletName: null } : {}),
            };

        case "UPDATE_QUANTITY": {
            const { menuItemId, quantity } = action.payload;
            if (quantity <= 0) {
                const newItems = state.items.filter(i => i.menuItemId !== menuItemId);
                return {
                    ...state,
                    items: newItems,
                    ...(newItems.length === 0 ? { outletId: null, outletName: null } : {}),
                };
            }
            return {
                ...state,
                items: state.items.map(i =>
                    i.menuItemId === menuItemId ? { ...i, quantity } : i
                ),
            };
        }

        case "CLEAR_CART":
            return { items: [], outletId: null, outletName: null };

        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, {
        items: [],
        outletId: null,
        outletName: null,
    });

    const addItem = (item, outletId, outletName) =>
        dispatch({ type: "ADD_ITEM", payload: { item, outletId, outletName } });

    const removeItem = (menuItemId) =>
        dispatch({ type: "REMOVE_ITEM", payload: menuItemId });

    const updateQuantity = (menuItemId, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { menuItemId, quantity } });

    const clearCart = () => dispatch({ type: "CLEAR_CART" });

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

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
