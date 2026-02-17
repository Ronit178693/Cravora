import axios from "axios";
import { baseURL, API_PATHS } from "../utils/API_paths";

const API = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export const getUser = () => API.get(API_PATHS.USER.GET_ME);
