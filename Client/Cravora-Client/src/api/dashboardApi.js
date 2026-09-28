import API from "./axiosClient";
import { API_PATHS } from "../utils/API_paths";

export const getProfile = () => API.get(API_PATHS.DASHBOARD.GET_PROFILE);
