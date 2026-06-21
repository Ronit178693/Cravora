import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

/**
 * Reusable Axios configuration for user profile fetching.
 * - withCredentials: true transmits the active HTTP-only JWT cookies to identify the request.
 */
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

/**
 * Fetches the currently authenticated user's profile database details.
 * Used during session restore on initial page boot.
 * @returns {Promise<AxiosResponse>}
 */
export const getUser = () => API.get(API_PATHS.USER.GET_ME);
