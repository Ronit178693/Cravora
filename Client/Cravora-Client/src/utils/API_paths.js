export const baseURL = "http://localhost:5000"

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        PASSWORD_RESET_OTP: "/api/auth/password-reset-otp",
        RESET_PASSWORD: "/api/auth/reset-password",
    },
    OUTLET: {
        // For Owner
        MY_OUTLET: "/api/outlets/me/outlet",
        ADD: "/api/outlets/addOutlet",
        UPDATE: "/api/outlets/updateOutlet/:id",
        DELETE: "/api/outlets/deleteOutlet/:id",
        // For Customer
        GET_ALL: "/api/outlets/allOutlet",
        GET_BY_ID: "/api/outlets/getOutlet/:id",
    },
    USER: {
        GET_ME: "/api/users/me",
    },
    DASHBOARD: {
        GET_DASHBOARD: "/api/dashboard/",
        GET_PROFILE: "/api/dashboard/profile",
        GET_RUNNER_DASHBOARD: "/api/dashboard/runner",
        GET_RUNNER_STATS: "/api/dashboard/runner/stats",
    },
    MENU: {
        ADD: "/api/menu/addMenu-item/:id",
        UPDATE: "/api/menu/:id/item/:itemId",
        DELETE: "/api/menu/:id/item/:itemId",
    },
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
    },
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
