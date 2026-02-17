import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const getDashboard = () => API.get(API_PATHS.DASHBOARD.GET_DASHBOARD);
export const getProfile = () => API.get(API_PATHS.DASHBOARD.GET_PROFILE);
export const getRunnerDashboard = () => API.get(API_PATHS.DASHBOARD.GET_RUNNER_DASHBOARD);
export const getRunnerStats = () => API.get(API_PATHS.DASHBOARD.GET_RUNNER_STATS);
