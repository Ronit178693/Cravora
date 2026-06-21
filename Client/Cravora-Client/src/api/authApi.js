import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

/**
 * Custom Axios client configuration for authentication actions.
 * - withCredentials: true ensures cookies (JWT token) are sent and saved automatically by the browser.
 * - timeout: 15s prevents requests from hanging indefinitely.
 */
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15000,
});

/**
 * Registers a new user account.
 * @param {Object} data - Registration form payload (name, email, password, role, phone)
 * @returns {Promise<AxiosResponse>}
 */
export const registerUser = (data) => API.post(API_PATHS.AUTH.REGISTER, data);

/**
 * Logs in an existing user and obtains session cookies.
 * @param {Object} data - Login credentials payload (email, password)
 * @returns {Promise<AxiosResponse>}
 */
export const loginUser = (data) => API.post(API_PATHS.AUTH.LOGIN, data);

/**
 * Logs out the current user session by clearing auth cookies.
 * @returns {Promise<AxiosResponse>}
 */
export const logoutUser = () => API.post(API_PATHS.AUTH.LOGOUT);

/**
 * Requests an OTP (One-Time Password) link for resetting a forgotten password.
 * @param {Object} data - Payload containing user email
 * @returns {Promise<AxiosResponse>}
 */
export const requestPasswordResetOTP = (data) => API.post(API_PATHS.AUTH.PASSWORD_RESET_OTP, data);

/**
 * Resets user password by submitting the OTP code and new password.
 * @param {Object} data - Payload containing email, OTP code, and new password
 * @returns {Promise<AxiosResponse>}
 */
export const resetPassword = (data) => API.post(API_PATHS.AUTH.RESET_PASSWORD, data);
