import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
    }
});

export const RefreshToken = (token) => {
    axiosInstance.defaults.headers.Authorization = "Bearer " + token
};