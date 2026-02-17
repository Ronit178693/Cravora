import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});
// .replace(':id', id) used to replace the placeholders with real ids 
export const addMenuItem = (id, data) => API.post(API_PATHS.MENU.ADD.replace(':id', id), data);
export const updateMenuItem = (id, itemId, data) => API.put(API_PATHS.MENU.UPDATE.replace(':id', id).replace(':itemId', itemId), data);
export const deleteMenuItem = (id, itemId) => API.delete(API_PATHS.MENU.DELETE.replace(':id', id).replace(':itemId', itemId));
