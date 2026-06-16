import axios from 'axios';
import config from "../config/config"
const API = axios.create({
    baseURL: config.apiUrl, // Your backend URL
    withCredentials: true, // Crucial for receiving and sending cookies
});

export default API;