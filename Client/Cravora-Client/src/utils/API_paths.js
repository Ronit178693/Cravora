/**
 * API Paths & URL Configurations
 * Configures the backend base URL dynamically depending on the execution environment
 * and exports a clean dictionary of all relative API route patterns used in Axios calls.
 */

// Dynamically sets backend server URL based on the environment (development vs. production rendering host)
export const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://cravora.onrender.com";

/**
 * API Routing Directory Dictionary
 * Groups all endpoint strings systematically by resource type/domain
 */
export const API_PATHS = {
    // User Authentication & OTP Session Management endpoints
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        PASSWORD_RESET_OTP: "/api/auth/password-reset-otp",
        RESET_PASSWORD: "/api/auth/reset-password",
    },
    // Food Outlet Metadata & Query routes
    OUTLET: {
        // Merchant Management APIs
        MY_OUTLET: "/api/outlets/me/outlet",
        ADD: "/api/outlets/addOutlet",
        UPDATE: "/api/outlets/updateOutlet/:id",
        DELETE: "/api/outlets/deleteOutlet/:id",
        // Student Discovery APIs
        GET_ALL: "/api/outlets/allOutlet",
        GET_BY_ID: "/api/outlets/getOutlet/:id",
    },
    // User Account Profile details
    USER: {
        GET_ME: "/api/users/me",
    },
    // General Dashboard data
    DASHBOARD: {
        GET_PROFILE: "/api/dashboard/profile",
    },
    // Merchant Menu Item CRUD updates
    MENU: {
        ADD: "/api/menu/addMenu-item/:id",
        UPDATE: "/api/menu/:id/item/:itemId",
        DELETE: "/api/menu/:id/item/:itemId",
    },
    // Food Order Placement & Tracking State lifecycle APIs
    ORDER: {
        PLACE_ORDER: "/api/orders/",
        MY_ORDERS: "/api/orders/my-orders",
        OUTLET_ORDERS: "/api/orders/outlet-orders",
        ACCEPT_ORDER: "/api/orders/:id/accept",
        AVAILABLE_ORDERS: "/api/orders/available",
        ACCEPT_DELIVERY: "/api/orders/:id/accept-delivery",
        GET_BY_ID: "/api/orders/:id",
        UPDATE_STATUS: "/api/orders/:id/status",
        CANCEL_ORDER: "/api/orders/:id/cancel",
        MY_ORDER_DELIVERIES: "/api/orders/my-deliveries",
    },
    // Peer-to-Peer Campus Parcel Delivery lifecycle APIs
    PACKAGE: {
        CREATE: "/api/packages/",
        MY_PACKAGES: "/api/packages/my-packages",
        AVAILABLE_PACKAGES: "/api/packages/available",
        MY_DELIVERIES: "/api/packages/my-deliveries",
        ACCEPT_PACKAGE: "/api/packages/:id/accept",
        UPDATE_STATUS: "/api/packages/:id/status",
        GET_BY_ID: "/api/packages/:id",
        CANCEL_PACKAGE: "/api/packages/:id/cancel",
    }
}
