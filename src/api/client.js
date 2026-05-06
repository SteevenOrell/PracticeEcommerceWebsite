import Axios from "axios";

const api = Axios.create({
    baseURL: "https://6648f7ef4032b1331becf0f2.mockapi.io",
});

export default api;
