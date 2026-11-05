import Axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://6648f7ef4032b1331becf0f2.mockapi.io";

const api = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: false,
});

export default api;
