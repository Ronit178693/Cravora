import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const createPackage = (data) => API.post(API_PATHS.PACKAGE.CREATE, data);
export const getMyPackages = () => API.get(API_PATHS.PACKAGE.MY_PACKAGES);
export const getAvailablePackages = () => API.get(API_PATHS.PACKAGE.AVAILABLE_PACKAGES);
export const getMyDeliveries = () => API.get(API_PATHS.PACKAGE.MY_DELIVERIES);
export const acceptPackage = (id) => API.put(API_PATHS.PACKAGE.ACCEPT_PACKAGE.replace(':id', id));
export const updatePackageStatus = (id, status) => API.put(API_PATHS.PACKAGE.UPDATE_STATUS.replace(':id', id), { status });
export const getPackageById = (id) => API.get(API_PATHS.PACKAGE.GET_BY_ID.replace(':id', id));
export const cancelPackage = (id) => API.put(API_PATHS.PACKAGE.CANCEL_PACKAGE.replace(':id', id));
