import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const placeOrder = (data) => API.post(API_PATHS.ORDER.PLACE_ORDER, data);
export const getMyOrders = () => API.get(API_PATHS.ORDER.MY_ORDERS);
export const getOutletOrders = () => API.get(API_PATHS.ORDER.OUTLET_ORDERS);
export const acceptOrder = (id) => API.put(API_PATHS.ORDER.ACCEPT_ORDER.replace(':id', id));
export const getAvailableOrders = () => API.get(API_PATHS.ORDER.AVAILABLE_ORDERS);
export const acceptDelivery = (id) => API.put(API_PATHS.ORDER.ACCEPT_DELIVERY.replace(':id', id));
export const getOrderById = (id) => API.get(API_PATHS.ORDER.GET_BY_ID.replace(':id', id));
export const updateOrderStatus = (id, status) => API.put(API_PATHS.ORDER.UPDATE_STATUS.replace(':id', id), { status });
export const cancelOrder = (id) => API.put(API_PATHS.ORDER.CANCEL_ORDER.replace(':id', id));
