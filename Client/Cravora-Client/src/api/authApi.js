import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

// With out withCredentials: true, client side wont store cookies
// This creates a resuable copy of axioswith default setting baked in 
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15000,
});

export const registerUser = (data) => API.post(API_PATHS.AUTH.REGISTER, data);
export const loginUser = (data) => API.post(API_PATHS.AUTH.LOGIN, data);
export const logoutUser = () => API.post(API_PATHS.AUTH.LOGOUT);
export const requestPasswordResetOTP = (data) => API.post(API_PATHS.AUTH.PASSWORD_RESET_OTP, data);
export const resetPassword = (data) => API.post(API_PATHS.AUTH.RESET_PASSWORD, data);
