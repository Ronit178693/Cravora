import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

/**
 * Custom Axios client configuration for food outlet actions.
 * - withCredentials: true ensures user auth cookies are transmitted.
 */
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

/**
 * Creates a new merchant food outlet entry.
 * @param {FormData|Object} data - Contains outlet configuration parameters (name, hours, images, etc.)
 * @returns {Promise<AxiosResponse>}
 */
export const addOutlet = (data) => API.post(API_PATHS.OUTLET.ADD, data);

/**
 * Updates metadata parameters of an existing outlet.
 * @param {String} id - Outlet ID
 * @param {FormData|Object} data - Changeset parameters
 * @returns {Promise<AxiosResponse>}
 */
export const updateOutlet = (id, data) => API.put(API_PATHS.OUTLET.UPDATE.replace(':id', id), data);

/**
 * Deletes/Removes an outlet from the active listing.
 * @param {String} id - Outlet ID
 * @returns {Promise<AxiosResponse>}
 */
export const deleteOutlet = (id) => API.delete(API_PATHS.OUTLET.DELETE.replace(':id', id));

/**
 * Retrieves all registered outlets on campus.
 * @returns {Promise<AxiosResponse>}
 */
export const getAllOutlets = () => API.get(API_PATHS.OUTLET.GET_ALL);

/**
 * Retrieves full database details and menu entries for a specific outlet.
 * @param {String} id - Outlet ID
 * @returns {Promise<AxiosResponse>}
 */
export const getOutletById = (id) => API.get(API_PATHS.OUTLET.GET_BY_ID.replace(':id', id));

/**
 * Gets details of the outlet owned by the currently authenticated merchant user.
 * @returns {Promise<AxiosResponse>}
 */
export const getMyOutlet = () => API.get(API_PATHS.OUTLET.MY_OUTLET);
