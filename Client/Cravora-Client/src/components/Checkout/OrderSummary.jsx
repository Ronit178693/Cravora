import React from 'react';

/**
 * OrderSummary Component
 * Displays subtotal, delivery cost, calculated grand total, and delivery drop input.
 * Provides the submit button to finalize and place the order.
 *
 * @param {Number} totalPrice - Accumulated price of items in the cart
 * @param {Number} deliveryFee - Surcharged flat delivery rate
 * @param {String} dropLocation - Active text value of user delivery location input
 * @param {Function} setDropLocation - SetState callback hook binding input changes to parent state
 * @param {Function} handlePlaceOrder - Handler callback dispatching checkout creation requests to the server
 * @param {Boolean} placing - Loading state active during network transmission
 */
const OrderSummary = ({ totalPrice, deliveryFee, dropLocation, setDropLocation, handlePlaceOrder, placing }) => {
    return (
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
    );
};

export default OrderSummary;
