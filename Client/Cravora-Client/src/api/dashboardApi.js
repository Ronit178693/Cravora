import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

// Without withCredentials: true, the client side won't store cookies
// This creates a reusable copy of axios with default settings baked in
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const getProfile = () => API.get(API_PATHS.DASHBOARD.GET_PROFILE);
