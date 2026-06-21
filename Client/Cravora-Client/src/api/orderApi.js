import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

/**
 * Reusable Axios configuration for placing and tracking customer orders.
 * - withCredentials: true ensures active sessions are passed along.
 */
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

/**
 * Submits a new customer food order to the backend database.
 * @param {Object} data - Contains items (array), outletId, dropLocation, and deliveryFee.
 * @returns {Promise<AxiosResponse>}
 */
export const placeOrder = (data) => API.post(API_PATHS.ORDER.PLACE_ORDER, data);

/**
 * Fetches all orders placed by the current student customer.
 * @returns {Promise<AxiosResponse>}
 */
export const getMyOrders = () => API.get(API_PATHS.ORDER.MY_ORDERS);

/**
 * Fetches all orders destined for the merchant's owned outlet.
 * @returns {Promise<AxiosResponse>}
 */
export const getOutletOrders = () => API.get(API_PATHS.ORDER.OUTLET_ORDERS);

/**
 * Merchants accept an order from the queue, transition status to 'Accepted'.
 * @param {String} id - Order ID
 * @returns {Promise<AxiosResponse>}
 */
export const acceptOrder = (id) => API.put(API_PATHS.ORDER.ACCEPT_ORDER.replace(':id', id));

/**
 * Runners query all accepted/prepared orders that are available to be claimed for delivery.
 * @returns {Promise<AxiosResponse>}
 */
export const getAvailableOrders = () => API.get(API_PATHS.ORDER.AVAILABLE_ORDERS);

/**
 * Runners accept/assign themselves to deliver a specific order.
 * @param {String} id - Order ID
 * @returns {Promise<AxiosResponse>}
 */
export const acceptDelivery = (id) => API.put(API_PATHS.ORDER.ACCEPT_DELIVERY.replace(':id', id));

/**
 * Fetches full details for a specific order.
 * @param {String} id - Order ID
 * @returns {Promise<AxiosResponse>}
 */
export const getOrderById = (id) => API.get(API_PATHS.ORDER.GET_BY_ID.replace(':id', id));

/**
 * Updates the status progression of an active order (e.g. Preparing, OutForDelivery, Delivered).
 * @param {String} id - Order ID
 * @param {String} status - Target status string
 * @returns {Promise<AxiosResponse>}
 */
export const updateOrderStatus = (id, status) => API.put(API_PATHS.ORDER.UPDATE_STATUS.replace(':id', id), { status });

/**
 * Cancels a specific pending order.
 * @param {String} id - Order ID
 * @returns {Promise<AxiosResponse>}
 */
export const cancelOrder = (id) => API.put(API_PATHS.ORDER.CANCEL_ORDER.replace(':id', id));

/**
 * Fetches the active runner's delivery log history of claimed/completed orders.
 * @returns {Promise<AxiosResponse>}
 */
export const getMyOrderDeliveries = () => API.get(API_PATHS.ORDER.MY_ORDER_DELIVERIES);
