import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

// With out withCredentials: true, client side wont store cookies
// This creates a resuable copy of axioswith default setting baked in 
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const addOutlet = (data) => API.post(API_PATHS.OUTLET.ADD, data);
export const updateOutlet = (id, data) => API.put(API_PATHS.OUTLET.UPDATE, id, data);
export const deleteOutlet = (id) => API.delete(API_PATHS.OUTLET.DELETE, id);
export const getAllOutlets = () => API.get(API_PATHS.OUTLET.GET_ALL);
export const getOutletById = (id) => API.get(API_PATHS.OUTLET.GET_BY_ID, id);
