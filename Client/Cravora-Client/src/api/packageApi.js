import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

/**
 * Custom Axios client configuration for peer-to-peer parcel delivery requests.
 * - withCredentials: true ensures user authentication session is passed correctly.
 */
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

/**
 * Submits a new peer-to-peer package delivery request to the queue.
 * @param {Object} data - Contains parcel description, quantity, pickup/drop locations, instructions, and deliveryFee tip.
 * @returns {Promise<AxiosResponse>}
 */
export const createPackage = (data) => API.post(API_PATHS.PACKAGE.CREATE, data);

/**
 * Retrieves all packages requested by the current customer.
 * @returns {Promise<AxiosResponse>}
 */
export const getMyPackages = () => API.get(API_PATHS.PACKAGE.MY_PACKAGES);

/**
 * Retrieves unclaimed packages that are available for runners to deliver.
 * @returns {Promise<AxiosResponse>}
 */
export const getAvailablePackages = () => API.get(API_PATHS.PACKAGE.AVAILABLE_PACKAGES);

/**
 * Retrieves active and past packages handled by the current runner.
 * @returns {Promise<AxiosResponse>}
 */
export const getMyDeliveries = () => API.get(API_PATHS.PACKAGE.MY_DELIVERIES);

/**
 * Allows a runner to accept/claim a package delivery request.
 * @param {String} id - Package ID
 * @returns {Promise<AxiosResponse>}
 */
export const acceptPackage = (id) => API.put(API_PATHS.PACKAGE.ACCEPT_PACKAGE.replace(':id', id));

/**
 * Updates status progression of a claimed package delivery (e.g. PickedUp, Delivered).
 * @param {String} id - Package ID
 * @param {String} status - Target status
 * @returns {Promise<AxiosResponse>}
 */
export const updatePackageStatus = (id, status) => API.put(API_PATHS.PACKAGE.UPDATE_STATUS.replace(':id', id), { status });

/**
 * Fetches full details for a specific package.
 * @param {String} id - Package ID
 * @returns {Promise<AxiosResponse>}
 */
export const getPackageById = (id) => API.get(API_PATHS.PACKAGE.GET_BY_ID.replace(':id', id));

/**
 * Cancels a pending package request (if not yet picked up/accepted).
 * @param {String} id - Package ID
 * @returns {Promise<AxiosResponse>}
 */
export const cancelPackage = (id) => API.put(API_PATHS.PACKAGE.CANCEL_PACKAGE.replace(':id', id));
