import axios from "axios";
import { baseURL } from "../utils/API_paths";

/**
 * In-Memory Token Storage
 * Kept strictly in RAM to protect against XSS token theft from localStorage.
 */
let inMemoryToken = null;

/**
 * Sets or clears the active in-memory JWT authentication token.
 * @param {String|null} token - JWT token string or null on logout
 */
export const setAuthToken = (token) => {
    inMemoryToken = token;
};

/**
 * Centralized Axios client instance for Cravora.
 * - withCredentials: true transmits HTTP-only session cookies.
 * - Request interceptor automatically attaches the Authorization Bearer header from RAM.
 * - timeout: 15000ms prevents requests from hanging indefinitely.
 */
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15000,
});

API.interceptors.request.use(
    (config) => {
        if (inMemoryToken) {
            config.headers.Authorization = `Bearer ${inMemoryToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
