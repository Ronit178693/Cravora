import React from 'react';

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
