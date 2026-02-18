import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

// With out withCredentials: true, client side wont store cookies
// This creates a resuable copy of axioswith default setting baked in 
const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const getUser = () => API.get(API_PATHS.USER.GET_ME);
