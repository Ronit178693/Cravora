import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

// With out withCredentials: true, client side wont store cookies
// This creates a resuable copy of axioswith default setting baked in 
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const getDashboard = () => API.get(API_PATHS.DASHBOARD.GET_DASHBOARD);
export const getProfile = () => API.get(API_PATHS.DASHBOARD.GET_PROFILE);
export const getRunnerDashboard = () => API.get(API_PATHS.DASHBOARD.GET_RUNNER_DASHBOARD);
export const getRunnerStats = () => API.get(API_PATHS.DASHBOARD.GET_RUNNER_STATS);
