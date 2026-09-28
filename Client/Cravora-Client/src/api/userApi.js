import API from "./axiosClient";
import { API_PATHS } from "../utils/API_paths";

/**
 * Fetches the currently authenticated user's profile database details.
 * Used during session restore on initial page boot.
 * @returns {Promise<AxiosResponse>}
 */
export const getUser = () => API.get(API_PATHS.USER.GET_ME);
