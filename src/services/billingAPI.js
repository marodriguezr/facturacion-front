import axios from "axios";

export const billingAPI = axios.create({
    baseURL: "http://localhost:8020/proxy", 
});

